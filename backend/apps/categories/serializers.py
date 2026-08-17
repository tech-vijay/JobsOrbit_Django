from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    _id = serializers.CharField(source='id', read_only=True)
    seoTitle = serializers.CharField(source='seo_title', required=False, allow_blank=True)
    seoDescription = serializers.CharField(source='seo_description', required=False, allow_blank=True)
    count = serializers.IntegerField(read_only=True, required=False, default=0)

    class Meta:
        model = Category
        fields = [
            'id',
            '_id',
            'name',
            'slug',
            'description',
            'seo_title',
            'seo_description',
            'seoTitle',
            'seoDescription',
            'count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', '_id', 'created_at', 'updated_at']
        extra_kwargs = {
            'slug': {'required': False},
            'seo_title': {'required': False, 'allow_blank': True},
            'seo_description': {'required': False, 'allow_blank': True},
        }
