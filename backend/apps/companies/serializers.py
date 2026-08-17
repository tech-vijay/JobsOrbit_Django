from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    _id = serializers.CharField(source='id', read_only=True)

    class Meta:
        model = Company
        fields = [
            'id',
            '_id',
            'name',
            'slug',
            'logo',
            'logo_public_id',
            'website',
            'description',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', '_id', 'created_at', 'updated_at']
        extra_kwargs = {
            'slug': {'required': False}
        }
