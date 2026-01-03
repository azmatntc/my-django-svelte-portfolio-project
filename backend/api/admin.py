# Import Django admin utilities
from django.contrib import admin
from .models import Project, Customer, Communication, ContactInquiry
# api/admin.py
from .models import ProjectStage, Task, ChangeRequest, ClientProfile
# api/admin.py
from django.contrib import admin
from .models import ClientProfile



@admin.register(ProjectStage)
class ProjectStageAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    list_editable = ('order',)
    ordering = ('order',)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('project', 'title', 'assignee', 'due_date', 'completed')
    list_filter = ('completed', 'due_date')
    search_fields = ('title', 'description')

@admin.register(ChangeRequest)
class ChangeRequestAdmin(admin.ModelAdmin):
    list_display = ('project', 'requester', 'priority', 'status', 'created_at')
    list_filter = ('priority', 'status', 'created_at')
    search_fields = ('description',)

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    # Use the exact field name defined in the model
    list_display = ('related_customer', 'company_size', 'industry', 'created_at')
    search_fields = ('related_customer__name', 'company_size', 'industry')    

# Register Project model with basic admin configuration
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Admin configuration for Project model:
    - Displays key fields in the admin list view.
    - Allows filtering and searching for projects.
    """
    list_display = ('title', 'created_at')  # Columns shown in admin list
    search_fields = ('title', 'description')  # Fields searchable in admin
    list_filter = ('created_at',)  # Filter by creation date
    ordering = ('-created_at',)  # Sort by newest first

# Register Customer model with basic admin configuration
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    """
    Admin configuration for Customer model:
    - Displays key fields in the admin list view.
    - Allows filtering and searching for customers.
    """
    list_display = ('name', 'email', 'phone', 'created_at')  # Columns shown
    search_fields = ('name', 'email')  # Searchable fields
    list_filter = ('created_at',)  # Filter by creation date
    ordering = ('-created_at',)  # Sort by newest first

# Register Communication model with basic admin configuration
@admin.register(Communication)
class CommunicationAdmin(admin.ModelAdmin):
    """
    Admin configuration for Communication model:
    - Displays key fields, including related customer.
    - Allows filtering and searching for communications.
    """
    list_display = ('customer', 'type', 'date')  # Columns shown
    search_fields = ('customer__name', 'notes')  # Search by customer name or notes
    list_filter = ('type', 'date')  # Filter by type and date
    ordering = ('-date',)  # Sort by newest first

# Register ContactInquiry model with detailed admin configuration
@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    """
    Admin configuration for ContactInquiry model:
    - Displays key fields for contact form submissions.
    - Allows filtering by project type, budget range, and creation date.
    - Provides search across multiple fields.
    - Displays preferred_technologies as a comma-separated string.
    """
    list_display = ('inquiry_id', 'full_name', 'email', 'company', 'project_type', 'budget_range', 'created_at')  # Columns shown
    search_fields = ('full_name', 'email', 'company', 'project_description')  # Searchable fields
    list_filter = ('project_type', 'budget_range', 'created_at', 'communication_method', 'meeting_platform')  # Filters
    ordering = ('-created_at',)  # Sort by newest first

    def get_preferred_technologies(self, obj):
        """
        Custom method to display preferred_technologies as a string in admin.
        """
        return ', '.join(obj.preferred_technologies) if obj.preferred_technologies else 'None'
    get_preferred_technologies.short_description = 'Preferred Technologies'  # Column header