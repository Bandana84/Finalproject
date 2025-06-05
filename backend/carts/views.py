from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Address, Order, OrderItem
from products.models import Product
from .serializers import CartSerializer, AddressSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated
import json
import requests
from django.http import JsonResponse


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            product_id = request.data.get('product_id')
            quantity = int(request.data.get('quantity', 1))

            if not product_id:
                return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product_id = int(product_id)
            except (TypeError, ValueError):
                return Response({'error': 'Invalid product ID format'}, status=status.HTTP_400_BAD_REQUEST)

            cart, _ = Cart.objects.get_or_create(user=request.user)
            
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response(
                    {'error': f'Product with ID {product_id} not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )

            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            cart_item.quantity += quantity if not created else 0
            cart_item.save()

            # Return the updated cart data
            cart.refresh_from_db()
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, item_id):
        quantity = int(request.data.get('quantity', 1))
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart_item.quantity = quantity
        cart_item.save()
        return Response({'message': 'Quantity updated'}, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)


class AddressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        addresses = Address.objects.filter(user=request.user)
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message": "Address added"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # Get address details and payment method from request
            address_data = {
                'street': request.data.get('street'),
                'city': request.data.get('city'),
                'province': request.data.get('province'),
                'country': request.data.get('country'),
                'phone': request.data.get('phone')
            }
            payment_method = request.data.get('payment_method')
            payment_details = request.data.get('payment_details')

            # # Log the incoming data
            # print("Received data:", request.data)
            # print("Address data:", address_data)
            # print("Payment method:", payment_method)
            # print("Payment details:", payment_details)

            # Validate required fields
            required_fields = ['street', 'city', 'province', 'country', 'phone', 'payment_method']
            missing_fields = [field for field in required_fields if not request.data.get(field)]
            
            if missing_fields:
                return Response(
                    {'error': f'Missing required fields: {", ".join(missing_fields)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the cart and validate it's not empty
            cart = get_object_or_404(Cart, user=request.user)
            if not cart.items.exists():
                return Response(
                    {'error': 'Cart is empty'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create the address
            address_serializer = AddressSerializer(data=address_data)
            if not address_serializer.is_valid():
                print("Address validation errors:", address_serializer.errors)
                return Response(address_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                address = address_serializer.save(user=request.user)
                print("Address created:", address.id)
            except Exception as e:
                print("Error creating address:", str(e))
                return Response(
                    {'error': f'Failed to create address: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                # Create the order
                order = Order.objects.create(
                    user=request.user,
                    address=address,
                    payment_method=payment_method,
                    payment_details=payment_details,
                    total_amount=cart.grand_total
                )
                # print("Order created:", order.id)

                # Create order items from cart items
                for cart_item in cart.items.all():
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        quantity=cart_item.quantity,
                        price=cart_item.product.offer_price
                    )
                # print("Order items created")

                # Clear the cart after successful order creation
                cart.items.all().delete()
                # print("Cart cleared")

                return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print("Error creating order:", str(e))
                # If order creation fails, delete the address to maintain consistency
                if 'address' in locals():
                    address.delete()
                return Response(
                    {'error': f'Failed to create order: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            print("Unexpected error:", str(e))
            return Response(
                {'error': f'Unexpected error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateCartItemByProductView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, product_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, product__id=product_id)
        quantity = int(request.data.get('quantity', 1))
        cart_item.quantity = quantity
        cart_item.save()
        return Response({'message': 'Quantity updated'}, status=status.HTTP_200_OK)


class RemoveFromCartByProductView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, product__id=product_id)
        cart_item.delete()
        return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = get_object_or_404(Order, id=order_id, user=request.user)
            
            # Only allow cancellation if order is still pending
            if order.status != "Pending":
                return Response(
                    {'error': 'Can only cancel pending orders'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            order.status = "Cancelled"
            order.save()
            
            return Response(
                {'message': 'Order cancelled successfully'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import requests
import json
from django.conf import settings
from .models import Order  # Ensure this import is correct

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def init_khalti_payment(request):
    """
    Initialize Khalti payment and return payment URL
    """
    try:
        # Get data from request
        return_url = request.data.get('return_url')
        amount = request.data.get('amount')  # In paisa (1 NPR = 100 paisa)
        purchase_order_id = request.data.get('purchase_order_id')
        customer_info = request.data.get('customer_info', {})
        
        # Validate required fields
        if not all([return_url, amount, purchase_order_id]):
            return Response({"error": "Missing required fields: return_url, amount, purchase_order_id"}, status=400)
        
        # Prepare payload for Khalti
        payload = {
            "return_url": return_url,
            "website_url": settings.FRONTEND_URL,
            "amount": amount,
            "purchase_order_id": purchase_order_id,
            "purchase_order_name": "E-commerce Order",
            "customer_info": {
                "name": customer_info.get('name', request.user.get_full_name()),
                "email": customer_info.get('email', request.user.email),
                "phone": customer_info.get('phone', '')
            }
        }
        
        # Khalti API headers
        headers = {
            'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        
        # Make request to Khalti
        response = requests.post(
            'https://a.khalti.com/api/v2/epayment/initiate/',
            headers=headers,
            data=json.dumps(payload)
        )
        
        response.raise_for_status()
        res_data = response.json()
        
        if 'payment_url' in res_data:
            return Response({
                "payment_url": res_data['payment_url'],
                "pidx": res_data.get('pidx')
            }, status=200)
        else:
            return Response({"error": "Failed to initiate payment", "details": res_data}, status=400)
            
    except requests.exceptions.RequestException as e:
        return Response({
            "error": "Payment initiation failed",
            "details": str(e)
        }, status=500)
    except Exception as e:
        return Response({
            "error": "An unexpected error occurred",
            "details": str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_khalti_payment(request):
    """
    Verify Khalti payment using pidx
    """
    try:
        pidx = request.data.get('pidx') or request.query_params.get('pidx')
        if not pidx:
            return Response({"error": "Missing pidx parameter"}, status=400)
        
        # Khalti API headers
        headers = {
            'Authorization': f'Key {settings.KHALTI_SECRET_KEY}',
            'Content-Type': 'application/json',
        }
        
        # Verify payment with Khalti
        response = requests.post(
            'https://a.khalti.com/api/v2/epayment/lookup/',
            headers=headers,
            data=json.dumps({'pidx': pidx})
        )
        
        response.raise_for_status()
        res_data = response.json()
        
        if res_data.get('status') == 'Completed':
            # Find and update the order
            try:
                order = Order.objects.get(
                    payment_data__pidx=pidx,
                    user=request.user,
                    status='pending'
                )
                order.status = 'completed'
                order.payment_data = res_data
                order.save()
                
                return Response({
                    "success": True,
                    "message": "Payment verified successfully",
                    "order_id": order.order_id,
                    "amount": order.amount,
                    "status": order.status
                }, status=200)
            except Order.DoesNotExist:
                return Response({
                    "error": "Order not found for this payment",
                    "details": res_data
                }, status=404)
        else:
            return Response({
                "error": "Payment not completed",
                "details": res_data
            }, status=400)
            
    except requests.exceptions.RequestException as e:
        return Response({
            "error": "Payment verification failed",
            "details": str(e)
        }, status=500)
    except Exception as e:
        return Response({
            "error": "An unexpected error occurred",
            "details": str(e)
        }, status=500)