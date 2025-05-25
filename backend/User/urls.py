from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
from .views import PasswordResetConfirmView
from .views import VerifyEmailAPIView, ResendOtpView
from .views import custom_admin_dashboard

urlpatterns = [
    path("register/", UserRegistrationAPIView.as_view(), name="register-user"),
    path("login/", UserLoginAPIView.as_view(), name="login-user"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout-user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("user/", UserInfoAPIView.as_view(), name="user-info"),
    

    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
  # urls.py
   path('verify-email/<str:username>/', VerifyEmailAPIView.as_view(), name='verify-email'),
   path('resend-otp/', ResendOtpView.as_view(), name='resend-otp'),
   path("admin-dashboard/", custom_admin_dashboard, name="custom_admin_dashboard"),
]

  
  

