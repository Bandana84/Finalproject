from django.urls import path


from .views import (
    CartView,
    AddToCartView,
    UpdateCartItemByProductView,
    RemoveFromCartByProductView,
    AddressView,
    OrderView,
    MyOrdersView,
    CancelOrderView
)

urlpatterns = [
    path('', CartView.as_view(), name='get-cart'),
    path('add/', AddToCartView.as_view(), name='add-to-cart'),
    path('update-by-product/<int:product_id>/', UpdateCartItemByProductView.as_view(), name='update-cart-item-by-product'),
    path('remove-by-product/<int:product_id>/', RemoveFromCartByProductView.as_view(), name='remove-from-cart-by-product'),
    path('addresses/', AddressView.as_view(), name='addresses'),
    path('order/', OrderView.as_view(), name='order'),
    path('my-orders/', MyOrdersView.as_view(), name='my-orders'),
    path('cancel-order/<int:order_id>/', CancelOrderView.as_view(), name='cancel-order'),
]
