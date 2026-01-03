# api/models.py
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
from django.conf import settings   # for AUTH_USER_MODEL
import uuid


# ---------- 1.  Core look-up tables (defined first) -----------------

class ProjectStage(models.Model):
    """
    Tracks project lifecycle stages.
    """
    STAGE_CHOICES = [
        ('proposal',  'Proposal'),
        ('active',    'Active'),
        ('review',    'Review'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    name        = models.CharField(max_length=50, choices=STAGE_CHOICES, default='proposal')
    description = models.TextField(blank=True)
    order       = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.get_name_display()


# ---------- 2.  Helper callable (placed *after* ProjectStage) -------

def get_default_stage_id():
    """Return PK of the 'proposal' stage; fallback = 1."""
    try:
        return ProjectStage.objects.get(name='proposal').id
    except ProjectStage.DoesNotExist:
        return 1


# ---------- 3.  All other models ------------------------------------

class Customer(models.Model):
    name    = models.CharField(max_length=200)
    email   = models.EmailField(unique=True)
    phone   = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ClientProfile(models.Model):
    """
    Extended profile for customers.
    """
    related_customer = models.OneToOneField(
        Customer,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    company_size = models.CharField(max_length=50, choices=[
        ('1-10', '1-10 employees'),
        ('11-50', '11-50 employees'),
        ('51-200', '51-200 employees'),
        ('201-500', '201-500 employees'),
        ('500+', '500+ employees'),
    ])
    industry     = models.CharField(max_length=100)
    preferred_communication = models.CharField(max_length=100, blank=True)
    billing_address = models.TextField(blank=True)
    tax_id       = models.CharField(max_length=50, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.related_customer.name}"


class Project(models.Model):
    """
    Portfolio / CRM project.
    """
    title       = models.CharField(max_length=200)
    description = models.TextField()
    image       = models.ImageField(upload_to='images/', blank=True, null=True)
    link        = models.URLField(blank=True)
    technologies = ArrayField(models.CharField(max_length=100), blank=True, default=list)
    capabilities = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    # CRM additions
    current_stage        = models.ForeignKey(
        ProjectStage,
        on_delete=models.SET_DEFAULT,
        default=get_default_stage_id,
        null=True,           # allow NULL for now
        blank=True,
    )
    budget_used          = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    estimated_completion = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title


class Task(models.Model):
    """
    Individual tasks within a project.
    """
    project     = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assignee    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    due_date    = models.DateField(null=True, blank=True)
    completed   = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({'Completed' if self.completed else 'Pending'})"


class ChangeRequest(models.Model):
    """
    Client-requested changes to a project.
    """
    project   = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='change_requests')
    requester = models.ForeignKey(Customer, on_delete=models.CASCADE)
    description = models.TextField()

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('implemented', 'Implemented'),
    ]

    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status   = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Change Request #{self.id} for {self.project.title}"


class Communication(models.Model):
    """
    Communication log with a customer.
    """
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='communications')
    type     = models.CharField(max_length=50, choices=[
        ('email', 'Email'),
        ('call', 'Call'),
        ('meeting', 'Meeting'),
    ])
    notes    = models.TextField(blank=True)
    date     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} with {self.customer.name} on {self.date}"


class ContactInquiry(models.Model):
    """
    Frontend inquiry form submission.
    """
    inquiry_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name  = models.CharField(max_length=255)
    company    = models.CharField(max_length=255)
    email      = models.EmailField()
    phone      = models.CharField(max_length=20)

    PROJECT_TYPE_CHOICES = [
        ('web', 'Web Application'),
        ('mobile', 'Mobile Application'),
        ('enterprise', 'Enterprise Application'),
        ('other', 'Other'),
    ]
    BUDGET_CHOICES = [
        ('<10k', '< $10k'),
        ('10k-25k', '$10k–$25k'),
        ('25k-50k', '$25k–$50k'),
        ('50k-100k', '$50k–$100k'),
        ('>100k', '> $100k'),
    ]
    COMM_CHOICES = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('video', 'Video Call'),
    ]
    PLATFORM_CHOICES = [
        ('zoom', 'Zoom'),
        ('google_meet', 'Google Meet'),
        ('microsoft_teams', 'Microsoft Teams'),
        ('other', 'Other'),
    ]

    project_type           = models.CharField(max_length=50, choices=PROJECT_TYPE_CHOICES)
    project_description    = models.TextField()
    preferred_technologies = ArrayField(models.CharField(max_length=100), blank=True, default=list)
    budget_range           = models.CharField(max_length=50, choices=BUDGET_CHOICES)
    timeline               = models.CharField(max_length=255)
    communication_method   = models.CharField(max_length=50, choices=COMM_CHOICES)
    meeting_platform       = models.CharField(max_length=50, choices=PLATFORM_CHOICES)

    requirements_doc = models.FileField(upload_to='inquiries/requirements/', blank=True, null=True)
    nda_doc          = models.FileField(upload_to='inquiries/nda/', blank=True, null=True)
    confidentiality  = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Inquiry {self.inquiry_id} by {self.full_name}"