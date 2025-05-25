from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, Address
from backend.admin import admin_site

@admin.register(Cart, site=admin_site)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items', 'subtotal', 'tax', 'grand_total', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def total_items(self, obj):
        return obj.total_items
    total_items.short_description = 'Total Items'

    def subtotal(self, obj):
        return f'${obj.subtotal:.2f}'
    subtotal.short_description = 'Subtotal'

    def tax(self, obj):
        return f'${obj.tax:.2f}'
    tax.short_description = 'Tax'

    def grand_total(self, obj):
        return f'${obj.grand_total:.2f}'
    grand_total.short_description = 'Grand Total'

@admin.register(CartItem, site=admin_site)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity', 'get_subtotal', 'preview_image')
    list_filter = ('cart', 'product')
    search_fields = ('cart__user__username', 'product__name')
    readonly_fields = ('preview_image',)

    def get_subtotal(self, obj):
        return f'${obj.get_subtotal():.2f}'
    get_subtotal.short_description = 'Subtotal'

    def preview_image(self, obj):
        if obj.product.images.first():
            return f'<img src="{obj.product.images.first().image.url}" width="50" height="50" />'
        return 'No image'
    preview_image.short_description = 'Preview'
    preview_image.allow_tags = True

@admin.register(Order, site=admin_site)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'id')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'status', 'shipping_address', 'billing_address')
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'payment_status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['mark_as_processing', 'mark_as_shipped', 'mark_as_delivered', 'mark_as_cancelled']

    def mark_as_processing(self, request, queryset):
        queryset.update(status='processing')
    mark_as_processing.short_description = "Mark selected orders as processing"

    def mark_as_shipped(self, request, queryset):
        queryset.update(status='shipped')
    mark_as_shipped.short_description = "Mark selected orders as shipped"

    def mark_as_delivered(self, request, queryset):
        queryset.update(status='delivered')
    mark_as_delivered.short_description = "Mark selected orders as delivered"

    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
    mark_as_cancelled.short_description = "Mark selected orders as cancelled"

@admin.register(OrderItem, site=admin_site)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'get_subtotal', 'preview_image')
    list_filter = ('order', 'product')
    search_fields = ('order__user__username', 'product__name')
    readonly_fields = ('preview_image',)

    def get_subtotal(self, obj):
        return f'${obj.get_subtotal():.2f}'
    get_subtotal.short_description = 'Subtotal'

    def preview_image(self, obj):
        if obj.product.images.first():
            return f'<img src="{obj.product.images.first().image.url}" width="50" height="50" />'
        return 'No image'
    preview_image.short_description = 'Preview'
    preview_image.allow_tags = True

@admin.register(Address, site=admin_site)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'street', 'city', 'province', 'country', 'phone')
    list_filter = ('country', 'province', 'city')
    search_fields = ('user__username', 'street', 'city', 'province', 'country', 'phone')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user',)
        }),
        ('Address Details', {
            'fields': ('street', 'city', 'province', 'country', 'phone')
        }),
    )
