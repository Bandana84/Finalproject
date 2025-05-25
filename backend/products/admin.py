from django.contrib import admin
from .models import Product, ProductImage, Banner , Review
from backend.admin import admin_site

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'preview_image')
    readonly_fields = ('preview_image',)

    def preview_image(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" style="max-height: 50px;"/>'
        return "No image"
    preview_image.short_description = 'Preview'
    preview_image.allow_tags = True

@admin.register(Product, site=admin_site)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'offer_price', 'in_stock', 'created_at')
    list_filter = ('category', 'in_stock', 'created_at')
    search_fields = ('name', 'category', 'description')
    list_editable = ('price', 'offer_price', 'in_stock')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'offer_price')
        }),
        ('Status', {
            'fields': ('in_stock',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('images')

@admin.register(ProductImage, site=admin_site)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image', 'preview_image')
    list_filter = ('product',)
    search_fields = ('product__name',)

    def preview_image(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="50" height="50" />'
        return 'No image'
    preview_image.short_description = 'Preview'
    preview_image.allow_tags = True

@admin.register(Banner, site=admin_site)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle', 'is_active', 'order', 'preview_image', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'subtitle')
    list_editable = ('is_active', 'order')
    readonly_fields = ('created_at', 'updated_at', 'preview_image')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'subtitle', 'image')
        }),
        ('Settings', {
            'fields': ('is_active', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def preview_image(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="100" height="50" />'
        return 'No image'
    preview_image.short_description = 'Preview'
    preview_image.allow_tags = True






class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'product__name', 'text')


admin.site.register(Review, ReviewAdmin)
