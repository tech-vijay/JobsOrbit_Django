from rest_framework import serializers
from .models import Opportunity
from apps.companies.models import Company
from apps.categories.models import Category
from apps.companies.serializers import CompanySerializer
from apps.categories.serializers import CategorySerializer

class OpportunitySerializer(serializers.ModelSerializer):
    _id = serializers.CharField(source='id', read_only=True)
    
    # Read representation (nested objects)
    company_detail = CompanySerializer(source='company', read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)

    # Write representation (ID or Object ID)
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        required=False,
        write_only=False
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        write_only=False
    )

    # Frontend camelCase aliases
    jobType = serializers.CharField(source='job_type', required=False)
    workMode = serializers.CharField(source='work_mode', required=False)
    salaryMin = serializers.FloatField(source='salary_min', required=False)
    salaryMax = serializers.FloatField(source='salary_max', required=False)
    salaryType = serializers.CharField(source='salary_type', required=False)
    salaryCurrency = serializers.CharField(source='salary_currency', required=False)
    isPaid = serializers.BooleanField(source='is_paid', required=False)
    applicationUrl = serializers.CharField(source='application_url', required=False)
    seoTitle = serializers.CharField(source='seo_title', required=False, allow_blank=True)
    seoDescription = serializers.CharField(source='seo_description', required=False, allow_blank=True)
    seoKeywords = serializers.ListField(source='seo_keywords', required=False, child=serializers.CharField())
    publishedAt = serializers.DateTimeField(source='published_at', required=False, allow_null=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Opportunity
        fields = [
            'id',
            '_id',
            'title',
            'slug',
            'type',
            'company',
            'category',
            'company_detail',
            'category_detail',
            'description',
            'responsibilities',
            'requirements',
            'skills',
            'job_type',
            'jobType',
            'work_mode',
            'workMode',
            'location',
            'salary_min',
            'salaryMin',
            'salary_max',
            'salaryMax',
            'salary_type',
            'salaryType',
            'salary_currency',
            'salaryCurrency',
            'is_paid',
            'isPaid',
            'education',
            'experience',
            'application_url',
            'applicationUrl',
            'deadline',
            'status',
            'featured',
            'seo_title',
            'seoTitle',
            'seo_description',
            'seoDescription',
            'seo_keywords',
            'seoKeywords',
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
            'seo_title': {'required': False, 'allow_blank': True},
            'seo_description': {'required': False, 'allow_blank': True},
            'location': {'required': False, 'allow_blank': True},
            'education': {'required': False, 'allow_blank': True},
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Populate company and category objects in the output to match Next.js IOpportunity format
        if instance.company:
            ret['company'] = CompanySerializer(instance.company).data
        if instance.category:
            ret['category'] = CategorySerializer(instance.category).data
        return ret
