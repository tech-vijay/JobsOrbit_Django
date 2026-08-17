import django_filters
from django.db.models import Q
from .models import Opportunity

class OpportunityFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')
    category = django_filters.CharFilter(method='filter_category')
    company = django_filters.CharFilter(method='filter_company')
    type = django_filters.CharFilter(method='filter_type')
    status = django_filters.CharFilter(method='filter_status')
    workMode = django_filters.CharFilter(field_name='work_mode')
    jobType = django_filters.CharFilter(field_name='job_type')
    featured = django_filters.BooleanFilter(field_name='featured')

    class Meta:
        model = Opportunity
        fields = [
            'type',
            'status',
            'work_mode',
            'job_type',
            'featured',
            'is_paid',
            'experience',
        ]

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        val = value.strip()
        return queryset.filter(
            Q(title__icontains=val) |
            Q(location__icontains=val) |
            Q(description__icontains=val) |
            Q(skills__icontains=val) |
            Q(company__name__icontains=val)
        )

    def filter_category(self, queryset, name, value):
        if not value or value == 'all':
            return queryset
        if value.isdigit():
            return queryset.filter(category_id=int(value))
        return queryset.filter(category__slug=value)

    def filter_company(self, queryset, name, value):
        if not value or value == 'all':
            return queryset
        if value.isdigit():
            return queryset.filter(company_id=int(value))
        return queryset.filter(company__slug=value)

    def filter_type(self, queryset, name, value):
        if not value or value == 'all':
            return queryset
        return queryset.filter(type=value)

    def filter_status(self, queryset, name, value):
        if not value or value == 'all':
            return queryset
        return queryset.filter(status=value)
