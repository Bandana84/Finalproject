from django.contrib import admin
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

class CustomAdminSite(admin.AdminSite):
    def index(self, request, extra_context=None):
        # Get statistics
        from products.models import Product, Banner
        from User.models import CustomUser
        from carts.models import Order

        context = {
            'product_count': Product.objects.count(),
            'active_orders_count': Order.objects.filter(status__in=['pending', 'processing']).count(),
            'user_count': CustomUser.objects.count(),
            'active_banners_count': Banner.objects.filter(is_active=True).count(),
            'recent_orders': Order.objects.select_related('user').order_by('-created_at')[:5],
        }

        if extra_context:
            context.update(extra_context)

        return super().index(request, context)

# Create custom admin site instance
admin_site = CustomAdminSite(name='admin')

# Register your models with the custom admin site
from django.contrib.auth.models import Group, User
from django.contrib.auth.admin import GroupAdmin, UserAdmin

admin_site.register(Group, GroupAdmin)
admin_site.register(User, UserAdmin) 
