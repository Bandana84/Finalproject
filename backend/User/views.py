from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
#Create password reset views in Django
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str

class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) 
        
        
        user = serializer.save(is_active=False)
        
        # 🔐 Generate OTP
        otp = OtpToken.objects.create(
            user=user,
            otp_expires_at=timezone.now() + timezone.timedelta(minutes=5)
        )
# 📧 Send email with OTP
        subject = "Verify your Farm2Basket Account"
        message = f"""
        Hello {user.username},

        Your OTP code is: {otp.otp_code}

        It will expire in 5 minutes.

        Please verify your email using this link:
        http://localhost:5173/verify-email/{user.username}
        """
        send_mail(subject, message, "bandanabasnet855@gmail.com", [user.email], fail_silently=False)


        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh":str(token),
                          "access": str(token.access_token)}
        return Response(data, status= status.HTTP_201_CREATED)


class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh":str(token),  
                          "access": str(token.access_token)}
        return Response(data, status=status.HTTP_200_OK)
    
class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status= status.HTTP_400_BAD_REQUEST)

class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer
    
    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
        })


User = get_user_model()

class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:5173/reset-password/{uidb64}/{token}/"

            send_mail(
                subject="Password Reset Request",
                message=f"Click the link to reset your password: {reset_link}",
                from_email="bandanabasnet855@gmail.com",
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({'message': 'Password reset email sent!'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            # Decode UID
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            # Validate token
            if not default_token_generator.check_token(user, token):
                return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)

            # Get new password from request
            password = request.data.get('password')
            if not password:
                return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Set new password
            user.set_password(password)
            user.save()

            return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid user'}, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import OtpToken

User = get_user_model()

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import OtpToken

class VerifyEmailAPIView(APIView):
    def post(self, request, username):
        try:
            user = get_user_model().objects.get(username=username)
            otp_code = request.data.get("otp_code")

            if not otp_code:
                return Response({"error": "OTP code required"}, status=status.HTTP_400_BAD_REQUEST)

            latest_otp = OtpToken.objects.filter(user=user).last()
            if not latest_otp:
                return Response({"error": "OTP not found"}, status=status.HTTP_400_BAD_REQUEST)

            if latest_otp.otp_code != otp_code:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

            if latest_otp.otp_expires_at < timezone.now():
                return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

            user.is_active = True
            user.save()

            return Response({"message": "Account activated successfully"}, status=status.HTTP_200_OK)

        except get_user_model().DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.views import APIView
from django.core.mail import send_mail

class ResendOtpView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email not registered"}, status=status.HTTP_404_NOT_FOUND)

        otp = OtpToken.objects.create(
            user=user,
            otp_expires_at=timezone.now() + timezone.timedelta(minutes=5)
        )

        subject = "Email Verification"
        message = f"""
        Hi {user.username}, here is your OTP: {otp.otp_code}
        It expires in 5 minutes. Use this link to verify your email:
        http://127.0.0.1:5173/verify-email/{user.username}
        """
        send_mail(subject, message, "your@email.com", [email], fail_silently=False)

        return Response({"message": "A new OTP has been sent to your email"}, status=status.HTTP_200_OK)
    
    
    # views.py
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.admin.sites import site
from django.shortcuts import render
from django.contrib.auth import get_user_model
from products.models import Product
from carts.models import Order
from products.models import Banner
@staff_member_required
def custom_admin_dashboard(request):
    app_list = [app for app in site.get_app_list(request) if app['app_label'] != 'token_blacklist']

    context = {
        "app_list": app_list,
        "product_count": Product.objects.count(),
        "active_orders_count": Order.objects.filter(status="active").count(),
        "user_count": get_user_model().objects.count(),
        "active_banners_count": Banner.objects.filter(is_active=True).count(),
        "recent_orders": Order.objects.order_by('-created_at')[:5],
    }
    return render(request, "custom_admin/dashboard.html", context)
