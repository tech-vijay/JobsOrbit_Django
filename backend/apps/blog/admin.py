from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'author', 'published_at', 'created_at')
    list_filter = ('status', 'category', 'published_at')
    search_fields = ('title', 'content', 'tags', 'category')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-published_at', '-created_at')
