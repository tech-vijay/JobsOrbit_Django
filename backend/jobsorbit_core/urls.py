from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # OpenAPI Schema & Interactive Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 Endpoints
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/companies/', include('apps.companies.urls')),
    path('api/v1/categories/', include('apps.categories.urls')),
    path('api/v1/opportunities/', include('apps.opportunities.urls')),
    path('api/v1/blog/', include('apps.blog.urls')),
    path('api/v1/stats/', include('apps.analytics.urls')),
    path('api/v1/search/', include('apps.search.urls')),
    path('api/v1/upload/', include('apps.media_service.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
