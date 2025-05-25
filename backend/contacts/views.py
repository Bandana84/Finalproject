from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer
from django.core.mail import send_mail
from django.conf import settings


class ContactSubmissionView(APIView):
    def post(self, request, format=None):
        serializer = ContactSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            submission = serializer.save()
            
            # Send email notification
            if settings.EMAIL_HOST_USER:
                send_mail(
                    f"New Contact Form Submission: {submission.subject or 'No Subject'}",
                    f"You have received a new contact form submission from {submission.name} ({submission.email}):\n\n"
                    f"{submission.message}\n\n"
                    f"Submitted at: {submission.created_at}",
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.CONTACT_FORM_RECIPIENT],
                    fail_silently=True,
                )
            
            return Response({
                'success': True,
                'message': 'Thank you for contacting us! We will get back to you soon.'
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors,
            'message': 'Please correct the errors below.'
        }, status=status.HTTP_400_BAD_REQUEST)