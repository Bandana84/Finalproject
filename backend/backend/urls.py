"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .admin import admin_site

# Customize admin site
admin.site.site_header = "Farm Market Admin"
admin.site.site_title = "Farm Market Admin Portal"
admin.site.index_title = "Welcome to Farm Market Admin Portal"

urlpatterns = [
    path("admin/", admin.site.urls),
    path('custom-admin/', include('admin_panel.urls')),
    path('api/products/', include('products.urls')),
    path('api/carts/', include('carts.urls')),
    path('api/users/', include('User.urls')),
     path('api/contact/', include('contacts.urls')),
  
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
