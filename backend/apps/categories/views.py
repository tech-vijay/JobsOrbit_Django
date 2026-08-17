from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Category
from .serializers import CategorySerializer

DEFAULT_CATEGORIES = [
    {"name": "Software Development", "slug": "software-development", "description": "Software engineering, coding, and programming roles."},
    {"name": "Web Development", "slug": "web-development", "description": "Frontend, backend, and full-stack web development."},
    {"name": "AI & Machine Learning", "slug": "ai-ml", "description": "Artificial intelligence, machine learning, and deep learning roles."},
    {"name": "Data Analytics", "slug": "data-analytics", "description": "Data analysis, BI, and reporting roles."},
    {"name": "Data Science", "slug": "data-science", "description": "Data science, statistics, and advanced analytics."},
    {"name": "Digital Marketing", "slug": "digital-marketing", "description": "SEO, social media, content, and performance marketing."},
    {"name": "UI/UX Design", "slug": "ui-ux-design", "description": "User interface design, user experience, and product design."},
    {"name": "Quality Assurance", "slug": "quality-assurance", "description": "Testing, QA, and quality engineering roles."},
    {"name": "DevOps & Cloud", "slug": "devops-cloud", "description": "Cloud computing, DevOps, and infrastructure roles."},
    {"name": "Other", "slug": "other", "description": "Roles that don't fit other categories."},
]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'with_counts', 'seed']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_object(self):
        lookup_value = self.kwargs[self.lookup_field]
        if lookup_value.isdigit():
            return Category.objects.get(id=int(lookup_value))
        return Category.objects.get(slug=lookup_value)

    def list(self, request, *args, **kwargs):
        # Auto seed if empty
        if not Category.objects.exists():
            self._seed_default_categories()
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def with_counts(self, request):
        if not Category.objects.exists():
            self._seed_default_categories()

        categories = Category.objects.annotate(
            count=Count('opportunities', filter=Q(opportunities__status='published'))
        ).order_by('name')

        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def seed(self, request):
        count = self._seed_default_categories()
        return Response({
            'success': True,
            'message': f'{count} default categories initialized.'
        }, status=status.HTTP_200_OK)

    def _seed_default_categories(self):
        created_count = 0
        for cat in DEFAULT_CATEGORIES:
            _, created = Category.objects.get_or_create(
                slug=cat['slug'],
                defaults={
                    'name': cat['name'],
                    'description': cat['description'],
                    'seo_title': f"{cat['name']} Jobs & Internships | CareerHub",
                    'seo_description': f"Find latest {cat['name']} jobs and internships for freshers and students."
                }
            )
            if created:
                created_count += 1
        return created_count
