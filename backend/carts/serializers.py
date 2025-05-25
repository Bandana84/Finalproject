from rest_framework import serializers
from .models import Cart, CartItem, Address, Order, OrderItem
from products.serializers import ProductSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()
    cart_item_id = serializers.IntegerField(source='id', read_only=True)
    class Meta:
        model = CartItem
        fields = ['cart_item_id', 'product', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return obj.get_subtotal()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    tax = serializers.SerializerMethodField()
    grand_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'subtotal', 'tax', 'grand_total', 'created_at']

    def get_total_items(self, obj):
        return obj.total_items

    def get_subtotal(self, obj):
        return obj.subtotal

    def get_tax(self, obj):
        return obj.tax

    def get_grand_total(self, obj):
        return obj.grand_total

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'street', 'city', 'province', 'country', 'phone']

class CreateOrderSerializer(serializers.Serializer):
    street = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    province = serializers.CharField(required=True)
    country = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES)
    payment_details = serializers.JSONField(required=False, allow_null=True)

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price', 'subtotal']

    def get_subtotal(self, obj):
        return obj.get_subtotal()

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'payment_method', 'total_amount', 'status', 'created_at', 'items', 'items_count']

    def get_items_count(self, obj):
        return obj.items_count

class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)