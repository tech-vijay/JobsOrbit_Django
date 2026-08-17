from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter
from apps.opportunities.models import Opportunity
from apps.companies.models import Company
from apps.categories.models import Category
from apps.blog.models import BlogPost
from apps.opportunities.serializers import OpportunitySerializer
from apps.companies.serializers import CompanySerializer
from apps.categories.serializers import CategorySerializer
from apps.blog.serializers import BlogPostSerializer

class GlobalSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter(name='q', description='Search term', required=True, type=str),
        ],
        description="Unified multi-model search across opportunities, companies, categories, and articles."
    )
    def get(self, request):
        query = request.query_params.get('q', '').strip()

        if len(query) < 2:
            return Response({
                'opportunities': [],
                'companies': [],
                'categories': [],
                'blogPosts': [],
            })

        opportunities = Opportunity.objects.select_related('company', 'category').filter(
            status='published'
        ).filter(
            Q(title__icontains=query) |
            Q(skills__icontains=query) |
            Q(location__icontains=query) |
            Q(company__name__icontains=query)
        )[:6]

        companies = Company.objects.filter(name__icontains=query)[:4]
        categories = Category.objects.filter(name__icontains=query)[:4]
        blog_posts = BlogPost.objects.filter(
            status='published'
        ).filter(
            Q(title__icontains=query) |
            Q(category__icontains=query) |
            Q(tags__icontains=query)
        )[:4]

        return Response({
            'opportunities': OpportunitySerializer(opportunities, many=True).data,
            'companies': CompanySerializer(companies, many=True).data,
            'categories': CategorySerializer(categories, many=True).data,
            'blogPosts': BlogPostSerializer(blog_posts, many=True).data,
        })
