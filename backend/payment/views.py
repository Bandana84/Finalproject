# payments/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import verify_khalti_payment
from carts.models import Order

@api_view(['POST'])
def verify_payment(request):
    token = request.data.get('token')
    amount = request.data.get('amount')
    
    if not token or not amount:
        return Response({"error": "Token and amount required"}, status=400)

    success, data = verify_khalti_payment(token, amount)
    
    if success:
        # Create order
        Order.objects.create(
            user=request.user,
            total_amount=float(amount)/100,  # Convert back to NPR
            payment_method="Khalti",
            transaction_id=data.get('idx')
        )
        return Response({"status": "success"})
    else:
        return Response({"error": data.get('error')}, status=400)