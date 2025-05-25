# payments/utils.py
import requests
from django.conf import settings

def verify_khalti_payment(token, amount):
    """
    Verify Khalti payment with their API
    Returns: (success: bool, data: dict)
    """
    url = "https://a.khalti.com/api/v2/payment/verify/"  # Sandbox URL
    
    try:
        response = requests.post(
            url,
            json={"token": token, "amount": int(amount)},
            headers={
                "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
                "Content-Type": "application/json"
            }
        )
        response.raise_for_status()
        return True, response.json()
    except requests.exceptions.RequestException as e:
        return False, {"error": str(e)}