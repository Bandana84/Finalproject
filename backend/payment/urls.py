# urls.py
from django.urls import path
from .views import verify_khalti_payment

urlpatterns = [
    path('khalti/verify/', verify_khalti_payment),
]
