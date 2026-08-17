from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related('author').all()
    serializer_class = BlogPostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title', 'content', 'excerpt', 'tags', 'category']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-published_at', '-created_at']
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_object(self):
        lookup_value = self.kwargs[self.lookup_field]
        if lookup_value.isdigit():
            return BlogPost.objects.select_related('author').get(id=int(lookup_value))
        return BlogPost.objects.select_related('author').get(slug=lookup_value)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['patch', 'post'])
    def toggle_status(self, request, id=None):
        post = self.get_object()
        new_status = request.data.get('status') or request.data.get('newStatus')

        if new_status in ['draft', 'published']:
            post.status = new_status
            if new_status == 'published' and not post.published_at:
                post.published_at = timezone.now()
            post.save()
            return Response({'success': True, 'post': self.get_serializer(post).data})

        return Response(
            {'success': False, 'error': 'Invalid status provided.'},
            status=status.HTTP_400_BAD_REQUEST
        )
