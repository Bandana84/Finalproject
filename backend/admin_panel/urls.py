from django.urls import path
from . import views

urlpatterns = [
    path('', views.admin_login, name='admin_login'),
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('logout/', views.admin_logout, name='admin_logout'),
    
    # Product URLs
    path('products/', views.product_list, name='admin_products'),
    path('products/add/', views.product_add, name='admin_product_add'),
    path('products/<int:product_id>/edit/', views.product_edit, name='admin_product_edit'),
    path('products/<int:product_id>/delete/', views.product_delete, name='admin_product_delete'),
    
    # Order URLs
    path('orders/', views.order_list, name='admin_orders'),
    path('orders/<int:order_id>/', views.order_detail, name='admin_order_detail'),
    path('orders/<int:order_id>/update-status/', views.order_update_status, name='admin_order_update_status'),
    path('orders/<int:order_id>/delete/', views.order_delete, name='admin_order_delete'),
    
    # User URLs
    path('users/', views.user_list, name='admin_users'),
    path('users/add/', views.user_add, name='admin_user_add'),
    path('users/<int:user_id>/edit/', views.user_edit, name='admin_user_edit'),
    path('users/<int:user_id>/delete/', views.user_delete, name='admin_user_delete'),
    
    # Banner URLs
    path('banners/', views.banner_list, name='admin_banners'),
    path('banners/add/', views.banner_add, name='admin_banner_add'),
    path('banners/<int:banner_id>/edit/', views.banner_edit, name='admin_banner_edit'),
    path('banners/<int:banner_id>/delete/', views.banner_delete, name='admin_banner_delete'),
    
    # Cart URLs
    path('carts/', views.cart_list, name='admin_carts'),
    path('carts/<int:cart_id>/', views.cart_detail, name='admin_cart_detail'),
    
    # Contact Information URL
    path('contact/', views.contact_list, name='admin_contact'),
    
    # Review URLs
    path('reviews/', views.reviews_list, name='admin_reviews'),
    path('reviews/<int:review_id>/delete/', views.delete_review, name='admin_review_delete'),
    path('reviews/export/', views.export_reviews, name='admin_reviews_export')
] 