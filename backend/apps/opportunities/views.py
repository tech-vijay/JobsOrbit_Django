from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.utils.text import slugify
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Opportunity
from .serializers import OpportunitySerializer
from .filters import OpportunityFilter

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.select_related('company', 'category').all()
    serializer_class = OpportunitySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = OpportunityFilter
    search_fields = ['title', 'location', 'description']
    ordering_fields = ['published_at', 'created_at', 'salary_max', 'title']
    ordering = ['-published_at', '-created_at']
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_object(self):
        lookup_value = self.kwargs[self.lookup_field]
        if lookup_value.isdigit():
            obj = Opportunity.objects.select_related('company', 'category').get(id=int(lookup_value))
        else:
            obj = Opportunity.objects.select_related('company', 'category').get(slug=lookup_value)

        # Check and update expired status
        if obj.deadline and obj.deadline < timezone.now() and obj.status == 'published':
            obj.status = 'expired'
            obj.save(update_fields=['status'])

        return obj

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response

    @action(detail=True, methods=['patch', 'post'])
    def toggle_status(self, request, id=None):
        opportunity = self.get_object()
        new_status = request.data.get('status') or request.data.get('newStatus')
        
        if new_status in ['draft', 'published', 'expired']:
            opportunity.status = new_status
            if new_status == 'published' and not opportunity.published_at:
                opportunity.published_at = timezone.now()
            opportunity.save()
            return Response({'success': True, 'opportunity': self.get_serializer(opportunity).data})
        
        return Response(
            {'success': False, 'error': 'Invalid status provided.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['patch', 'post'])
    def toggle_featured(self, request, id=None):
        opportunity = self.get_object()
        opportunity.featured = not opportunity.featured
        opportunity.save(update_fields=['featured'])
        return Response({
            'success': True,
            'featured': opportunity.featured,
            'opportunity': self.get_serializer(opportunity).data
        })

    @action(detail=True, methods=['post'])
    def duplicate(self, request, id=None):
        source = self.get_object()
        new_title = f"{source.title} (Copy)"
        base_slug = slugify(new_title)
        new_slug = base_slug
        counter = 1
        while Opportunity.objects.filter(slug=new_slug).exists():
            new_slug = f"{base_slug}-{counter}"
            counter += 1

        copy_obj = Opportunity.objects.create(
            title=new_title,
            slug=new_slug,
            type=source.type,
            company=source.company,
            category=source.category,
            description=source.description,
            responsibilities=source.responsibilities,
            requirements=source.requirements,
            skills=source.skills,
            job_type=source.job_type,
            work_mode=source.work_mode,
            location=source.location,
            salary_min=source.salary_min,
            salary_max=source.salary_max,
            salary_type=source.salary_type,
            salary_currency=source.salary_currency,
            is_paid=source.is_paid,
            education=source.education,
            experience=source.experience,
            application_url=source.application_url,
            status='draft',
            featured=False,
            seo_title=source.seo_title,
            seo_description=source.seo_description,
            seo_keywords=source.seo_keywords,
        )

        return Response({
            'success': True,
            'opportunity': self.get_serializer(copy_obj).data
        }, status=status.HTTP_201_CREATED)
