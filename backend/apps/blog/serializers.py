from rest_framework import serializers
from .models import BlogPost
from apps.authentication.serializers import UserSerializer

class BlogPostSerializer(serializers.ModelSerializer):
    _id = serializers.CharField(source='id', read_only=True)
    author_detail = UserSerializer(source='author', read_only=True)
    
    # CamelCase aliases
    coverImage = serializers.CharField(source='cover_image', required=False, allow_blank=True)
    coverImageId = serializers.CharField(source='cover_image_id', required=False, allow_blank=True)
    seoTitle = serializers.CharField(source='seo_title', required=False, allow_blank=True)
    seoDescription = serializers.CharField(source='seo_description', required=False, allow_blank=True)
    publishedAt = serializers.DateTimeField(source='published_at', required=False, allow_null=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id',
            '_id',
            'title',
            'slug',
            'excerpt',
            'content',
            'cover_image',
            'coverImage',
            'cover_image_id',
            'coverImageId',
            'category',
            'tags',
            'author',
            'author_detail',
            'status',
            'seo_title',
            'seoTitle',
            'seo_description',
            'seoDescription',
            'published_at',
            'publishedAt',
            'created_at',
            'createdAt',
            'updated_at',
            'updatedAt',
        ]
        read_only_fields = ['id', '_id', 'created_at', 'createdAt', 'updated_at', 'updatedAt']
        extra_kwargs = {
            'slug': {'required': False},
            'excerpt': {'required': False, 'allow_blank': True},
            'cover_image': {'required': False, 'allow_blank': True},
            'cover_image_id': {'required': False, 'allow_blank': True},
            'seo_title': {'required': False, 'allow_blank': True},
            'seo_description': {'required': False, 'allow_blank': True},
            'author': {'required': False, 'allow_null': True},
        }
