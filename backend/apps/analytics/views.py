from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from drf_spectacular.utils import extend_schema
from apps.opportunities.models import Opportunity
from apps.companies.models import Company
from apps.categories.models import Category
from apps.blog.models import BlogPost
from apps.opportunities.serializers import OpportunitySerializer

class StatsView(APIView):
    permission_classes = [permissions.AllowAny]  # Can also be IsAuthenticated, but AllowAny for easy frontend dashboard render

    @extend_schema(
        description="Get dashboard statistics and recent opportunities."
    )
    def get(self, request):
        total_opportunities = Opportunity.objects.count()
        published_opportunities = Opportunity.objects.filter(status='published').count()
        draft_opportunities = Opportunity.objects.filter(status__in=['draft', 'expired']).count()
        total_companies = Company.objects.count()
        total_categories = Category.objects.count()
        total_blog_posts = BlogPost.objects.count()

        recent_ops = Opportunity.objects.select_related('company', 'category').order_by('-created_at')[:5]
        recent_serializer = OpportunitySerializer(recent_ops, many=True)

        return Response({
            'totalOpportunities': total_opportunities,
            'publishedOpportunities': published_opportunities,
            'draftOpportunities': draft_opportunities,
            'totalCompanies': total_companies,
            'totalCategories': total_categories,
            'totalBlogPosts': total_blog_posts,
            'recentOpportunities': recent_serializer.data,
        })
