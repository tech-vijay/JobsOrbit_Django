from django.contrib import admin
from .models import Opportunity

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'category', 'type', 'job_type', 'work_mode', 'status', 'featured', 'published_at')
    list_filter = ('type', 'status', 'featured', 'job_type', 'work_mode', 'category', 'company')
    search_fields = ('title', 'skills', 'location', 'description', 'company__name')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-published_at', '-created_at')
    date_hierarchy = 'published_at'
