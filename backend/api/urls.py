# Import Django URL utilities
from django.urls import path
from .views import (
    ContactSubmitView, ProjectListView, ProjectDetailView,
    CustomerListView, CustomerDetailView, CommunicationListView,
    CommunicationDetailView, LoginView, RegisterView, LogoutView,
    UserRoleView, CSRFView, ProjectStageListView,
    TaskListView,
    ChangeRequestListView,
    ClientProfileView

)
from .views import (
    ContactSubmitView, ProjectListView, ProjectDetailView,
    CustomerListView, CustomerDetailView, CommunicationListView, CommunicationDetailView,
    LoginView, RegisterView, LogoutView, UserRoleView, CSRFView,
    ProjectDashboard, TaskList, ChangeRequestList, CustomerList, CommunicationList
)

# Define URL patterns for the api app
urlpatterns = [
    # Contact form submission
    path('contact/submit/', ContactSubmitView.as_view(), name='contact-submit'),
    # Project endpoints
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    # Customer endpoints
    path('customers/', CustomerListView.as_view(), name='customer-list'),
    path('customers/<int:pk>/', CustomerDetailView.as_view(), name='customer-detail'),
    # Communication endpoints
    path('communications/', CommunicationListView.as_view(), name='communication-list'),
    path('communications/<int:pk>/', CommunicationDetailView.as_view(), name='communication-detail'),
    # Authentication endpoints
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/role/', UserRoleView.as_view(), name='user-role'),
    path('csrf/', CSRFView.as_view(), name='csrf'),
    path('stages/', ProjectStageListView.as_view(), name='project-stages'),
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('change-requests/', ChangeRequestListView.as_view(), name='change-request-list'),
    path('client-profile/<int:customer_id>/', ClientProfileView.as_view(), name='client-profile'),
    path('projects/<uuid:pk>/dashboard/', ProjectDashboard.as_view(), name='project-dashboard'),
    path('projects/<uuid:project_id>/tasks/',    TaskList.as_view(),        name='task-list'),
    path('projects/<uuid:project_id>/changes/',  ChangeRequestList.as_view(), name='change-request-list'),
    path('customers/',                            CustomerList.as_view(),      name='customer-list'),
    path('customers/<uuid:customer_id>/communications/', CommunicationList.as_view(), name='communication-list'),
]