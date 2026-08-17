import os
import uuid
import cloudinary
import cloudinary.uploader
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from drf_spectacular.utils import extend_schema

# Initialize Cloudinary config if available
if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )

class UploadMediaView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @extend_schema(
        description="Upload an image to Cloudinary (or local media storage fallback)."
    )
    def post(self, request):
        file_obj = request.FILES.get('file')
        
        if not file_obj:
            return Response(
                {'success': False, 'error': 'No file provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if Cloudinary is configured
        if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
            try:
                upload_res = cloudinary.uploader.upload(
                    file_obj,
                    folder='careerhub',
                    resource_type='auto'
                )
                return Response({
                    'success': True,
                    'url': upload_res.get('secure_url'),
                    'publicId': upload_res.get('public_id'),
                    'public_id': upload_res.get('public_id'),
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'success': False, 'error': f"Cloudinary upload error: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        # Local storage fallback
        try:
            filename = f"{uuid.uuid4().hex}_{file_obj.name}"
            saved_path = default_storage.save(f"uploads/{filename}", file_obj)
            file_url = request.build_absolute_uri(settings.MEDIA_URL + saved_path)
            return Response({
                'success': True,
                'url': file_url,
                'publicId': saved_path,
                'public_id': saved_path,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'success': False, 'error': f"Local file upload error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request):
        public_id = request.data.get('publicId') or request.data.get('public_id')
        if not public_id:
            return Response(
                {'success': False, 'error': 'publicId is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
            try:
                res = cloudinary.uploader.destroy(public_id)
                return Response({'success': res.get('result') == 'ok'})
            except Exception as e:
                return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Local storage deletion
        if default_storage.exists(public_id):
            default_storage.delete(public_id)
            return Response({'success': True})

        return Response({'success': True})
