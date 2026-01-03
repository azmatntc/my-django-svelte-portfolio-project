# Import required Django and REST Framework modules
import logging
import requests
import os
from django.core.mail import send_mail
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Project, Customer, Communication, ContactInquiry
from .serializers import ProjectSerializer, CustomerSerializer, CommunicationSerializer, ContactInquirySerializer,ProjectStageSerializer,ClientProfileSerializer

#CRM views import
from django.db import models
import uuid
from django.contrib.postgres.fields import ArrayField
from rest_framework import generics, permissions



# Configure logging for debugging
logger = logging.getLogger(__name__)

class ContactSubmitView(APIView):
    """
    Handles contact form submissions from Contact.jsx:
    - Validates CAPTCHA using Google reCAPTCHA API.
    - Processes FormData, including preferred_technologies as a list.
    - Validates and saves files (PDF, <5MB).
    - Saves inquiry to ContactInquiry model.
    - Sends confirmation email with inquiry details and Calendly link.
    """
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        try:
            logger.info(f"Incoming request data: {request.data}")

            # Step 1: Verify CAPTCHA
            captcha_token = request.data.get('captcha')
            if not captcha_token:
                logger.error("Missing CAPTCHA token in request")
                return Response({'error': 'Please complete the CAPTCHA'}, status=status.HTTP_400_BAD_REQUEST)

            captcha_response = requests.post(
                'https://www.google.com/recaptcha/api/siteverify',
                data={
                    'secret': settings.RECAPTCHA_SECRET_KEY,
                    'response': captcha_token,
                },
                timeout=5
            ).json()

            if not captcha_response.get('success'):
                logger.error(f"CAPTCHA verification failed: {captcha_response.get('error-codes', 'Unknown error')}")
                return Response({'error': 'Invalid CAPTCHA verification'}, status=status.HTTP_400_BAD_REQUEST)

            # Step 2: Handle file uploads and form data
            requirements_doc = request.FILES.get('requirementsDoc')
            nda_doc = request.FILES.get('ndaDoc')
            data = request.data.dict()

            # Extract preferred_technologies as a list to avoid string input
            preferred_technologies = request.data.getlist('preferredTechnologies[]')
            data['preferred_technologies'] = preferred_technologies if preferred_technologies else []

            # Step 3: Validate file types (PDF only) and size (<5MB)
            allowed_types = ['application/pdf']
            max_size = 5 * 1024 * 1024  # 5MB
            if requirements_doc:
                if requirements_doc.content_type not in allowed_types:
                    logger.error(f"Invalid requirements document type: {requirements_doc.content_type}")
                    return Response({'error': 'Requirements document must be a PDF'}, status=status.HTTP_400_BAD_REQUEST)
                if requirements_doc.size > max_size:
                    logger.error(f"Requirements document too large: {requirements_doc.size} bytes")
                    return Response({'error': 'Requirements document must be under 5MB'}, status=status.HTTP_400_BAD_REQUEST)
                data['requirementsDoc'] = requirements_doc
            if nda_doc:
                if nda_doc.content_type not in allowed_types:
                    logger.error(f"Invalid NDA document type: {nda_doc.content_type}")
                    return Response({'error': 'NDA document must be a PDF'}, status=status.HTTP_400_BAD_REQUEST)
                if nda_doc.size > max_size:
                    logger.error(f"NDA document too large: {nda_doc.size} bytes")
                    return Response({'error': 'NDA document must be under 5MB'}, status=status.HTTP_400_BAD_REQUEST)
                data['ndaDoc'] = nda_doc

            # Step 4: Validate and save inquiry using ContactInquirySerializer
            serializer = ContactInquirySerializer(data=data)
            if not serializer.is_valid():
                logger.error(f"Serializer validation errors: {serializer.errors}")
                return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            inquiry = serializer.save()

            # Step 5: Save uploaded files with unique filenames
            try:
                if requirements_doc:
                    path = f'inquiries/requirements/{inquiry.inquiry_id}_{requirements_doc.name}'
                    default_storage.save(path, ContentFile(requirements_doc.read()))
                    inquiry.requirements_doc = path
                if nda_doc:
                    path = f'inquiries/nda/{inquiry.inquiry_id}_{nda_doc.name}'
                    default_storage.save(path, ContentFile(nda_doc.read()))
                    inquiry.nda_doc = path
                inquiry.save()
            except Exception as e:
                logger.error(f"Error saving files for inquiry {inquiry.inquiry_id}: {str(e)}")
                inquiry.delete()  # Rollback if file saving fails
                return Response({'error': 'Failed to save uploaded files'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Step 6: Send confirmation email with detailed inquiry info
            try:
                scheduling_link = 'https://calendly.com/your-name/consultation'  # Replace with your Calendly link
                email_body = (
                    f"Dear {inquiry.full_name},\n\n"
                    f"Thank you for your inquiry (ID: {inquiry.inquiry_id}). We have received your request and will follow up within 24-48 hours to discuss your project.\n\n"
                    f"Inquiry Details:\n"
                    f"- Company/Organization: {inquiry.company}\n"
                    f"- Email: {inquiry.email}\n"
                    f"- Phone: {inquiry.phone}\n"
                    f"- Project Type: {inquiry.get_project_type_display()}\n"
                    f"- Project Description: {inquiry.project_description}\n"
                    f"- Preferred Technologies: {', '.join(inquiry.preferred_technologies) if inquiry.preferred_technologies else 'None'}\n"
                    f"- Budget Range: {inquiry.get_budget_range_display()}\n"
                    f"- Timeline: {inquiry.timeline}\n"
                    f"- Preferred Communication: {inquiry.get_communication_method_display()}\n"
                    f"- Meeting Platform: {inquiry.get_meeting_platform_display()}\n"
                    f"- Requirements Document: {'Uploaded' if inquiry.requirements_doc else 'Not provided'}\n"
                    f"- NDA Document: {'Uploaded' if inquiry.nda_doc else 'Not provided'}\n"
                    f"- Confidentiality Agreement: {'Accepted' if inquiry.confidentiality else 'Not accepted'}\n\n"
                    f"To schedule an initial consultation, please book a time slot here: {scheduling_link}\n\n"
                    f"We respect your privacy and comply with GDPR regulations. For details, see our privacy policy: https://yourdomain.com/privacy-policy\n\n"
                    f"Best regards,\nYour Name\ncontact@yourdomain.com"
                )

                send_mail(
                    subject='Your Project Inquiry - Confirmation',
                    message=email_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[inquiry.email],
                    fail_silently=False,
                )
                logger.info(f"Confirmation email sent for inquiry {inquiry.inquiry_id} to {inquiry.email}")
            except Exception as e:
                logger.error(f"Failed to send confirmation email for inquiry {inquiry.inquiry_id}: {str(e)}")
                return Response({
                    'inquiryId': str(inquiry.inquiry_id),
                    'warning': 'Inquiry saved, but failed to send confirmation email'
                }, status=status.HTTP_201_CREATED)

            # Step 7: Log success and return inquiry ID
            logger.info(f"Inquiry {inquiry.inquiry_id} submitted successfully by {inquiry.full_name}")
            return Response({'inquiryId': str(inquiry.inquiry_id)}, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            logger.error(f"Validation error in ContactSubmitView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in ContactSubmitView: {str(e)}")
            return Response({'error': 'An unexpected error occurred. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProjectListView(APIView):
    """
    Returns a list of all projects for display in the frontend (e.g., portfolio section).
    """
    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        logger.info("Retrieved project list")
        return Response(serializer.data, status=status.HTTP_200_OK)

class ProjectDetailView(APIView):
    """
    Returns details of a single project by ID for detailed portfolio views.
    """
    def get(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            serializer = ProjectSerializer(project)
            logger.info(f"Retrieved project {pk}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            logger.error(f"Project {pk} not found")
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

class CustomerListView(APIView):
    """
    Returns a list of all customers for admin use (e.g., in Sidebar.jsx admin view).
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        logger.info("Retrieved customer list")
        return Response(serializer.data, status=status.HTTP_200_OK)

class CustomerDetailView(APIView):
    """
    Returns details of a single customer by ID for admin use.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            customer = Customer.objects.get(pk=pk)
            serializer = CustomerSerializer(customer)
            logger.info(f"Retrieved customer {pk}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            logger.error(f"Customer {pk} not found")
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

class CommunicationListView(APIView):
    """
    Returns a list of all communications for admin use (e.g., in Sidebar.jsx admin view).
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        communications = Communication.objects.all()
        serializer = CommunicationSerializer(communications, many=True)
        logger.info("Retrieved communication list")
        return Response(serializer.data, status=status.HTTP_200_OK)

class CommunicationDetailView(APIView):
    """
    Returns details of a single communication by ID for admin use.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            communication = Communication.objects.get(pk=pk)
            serializer = CommunicationSerializer(communication)
            logger.info(f"Retrieved communication {pk}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Communication.DoesNotExist:
            logger.error(f"Communication {pk} not found")
            return Response({'error': 'Communication not found'}, status=status.HTTP_404_NOT_FOUND)

class LoginView(APIView):
    """
    Handles user login:
    - Authenticates username/password.
    - Sets session for UserContext.jsx and role-based Sidebar.jsx rendering.
    """
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role', 'standard')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            logger.info(f"User {username} logged in with role {role}")
            return Response({'message': 'Login successful', 'role': role}, status=status.HTTP_200_OK)
        logger.error(f"Failed login attempt for username {username}")
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    """
    Placeholder for user registration:
    - Returns success response (implement actual registration logic as needed).
    """
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        logger.info("User registration attempted")
        return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)

class LogoutView(APIView):
    """
    Handles user logout:
    - Clears session for UserContext.jsx.
    """
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        logout(request)
        logger.info("User logged out")
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class UserRoleView(APIView):
    """
    Returns user role for Sidebar.jsx:
    - 'admin' if authenticated and username is 'admin', else 'standard'.
    """
    def get(self, request):
        role = 'admin' if request.user.is_authenticated and request.user.username == 'admin' else 'standard'
        logger.info(f"User role checked: {role}")
        return Response({'role': role}, status=status.HTTP_200_OK)

class CSRFView(APIView):
    """
    Provides CSRF token for Contact.jsx and other frontend POST requests.
    """
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        csrf_token = request.META.get('CSRF_COOKIE') or ''
        logger.info("CSRF token requested")
        return Response({'csrfToken': csrf_token}, status=status.HTTP_200_OK)
    

# api/views.py
from .models import ProjectStage, Task, ChangeRequest, ClientProfile
from rest_framework import permissions

class ProjectStageListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        stages = ProjectStage.objects.all().order_by('order')
        serializer = ProjectStageSerializer(stages, many=True)
        return Response(serializer.data)

class TaskListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        tasks = Task.objects.filter(project=request.query_params.get('project'))
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

class ChangeRequestListView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        requests = ChangeRequest.objects.filter(project=request.query_params.get('project'))
        serializer = ChangeRequestSerializer(requests, many=True)
        return Response(serializer.data)

# api/views.py
class ClientProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, customer_id):
        profile = ClientProfile.objects.get(related_customer_id=customer_id)
        serializer = ClientProfileSerializer(profile)
        return Response(serializer.data)
    


# Add new views for CRM
# api/views.py
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Project, Task, ChangeRequest, Customer, Communication
from .serializers import (
    ProjectSerializer,
    TaskSerializer,
    ChangeRequestSerializer,
    CustomerSerializer,
    CommunicationSerializer,
)


class ProjectDashboard(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]


class TaskList(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return Task.objects.filter(project_id=project_id)


class ChangeRequestList(generics.ListAPIView):
    serializer_class = ChangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ChangeRequest.objects.filter(project_id=project_id)


class CustomerList(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommunicationList(generics.ListCreateAPIView):
    serializer_class = CommunicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        customer_id = self.kwargs.get('customer_id')
        return Communication.objects.filter(customer_id=customer_id)