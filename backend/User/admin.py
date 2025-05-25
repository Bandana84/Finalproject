from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, OtpToken
from backend.admin import admin_site

@admin.register(CustomUser, site=admin_site)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('username', 'password', 'email', 'first_name', 'last_name')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_active')
        }),
    )

@admin.register(OtpToken)
class OtpTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp_code', 'tp_created_at', 'otp_expires_at')
    search_fields = ('user__email', 'otp_code')
    list_filter = ('tp_created_at', 'otp_expires_at')