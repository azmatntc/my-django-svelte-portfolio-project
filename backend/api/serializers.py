from rest_framework import serializers
from .models import Project, Customer, Communication, ContactInquiry

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for Project model:
    - Validates and serializes project data, including array fields like technologies.
    - Used by ProjectListView and ProjectDetailView.
    """
    class Meta:
        model = Project
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    """
    Serializer for Customer model:
    - Validates and serializes customer data.
    - Used by CustomerListView and CustomerDetailView.
    """
    class Meta:
        model = Customer
        fields = '__all__'

class CommunicationSerializer(serializers.ModelSerializer):
    """
    Serializer for Communication model:
    - Validates and serializes communication data, including foreign key to Customer.
    - Used by CommunicationListView and CommunicationDetailView.
    """
    class Meta:
        model = Communication
        fields = '__all__'

class ContactInquirySerializer(serializers.ModelSerializer):
    """
    Serializer for ContactInquiry model:
    - Validates form data from Contact.jsx, including preferred_technologies as a non-empty list.
    - Used by ContactSubmitView for inquiry submissions.
    """
    preferred_technologies = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False,
        error_messages={'empty': 'Select at least one technology'}
    )

    class Meta:
        model = ContactInquiry
        fields = '__all__'

    def validate_preferred_technologies(self, value):
        """
        Custom validation for preferred_technologies:
        - Ensures value is a list, not a string.
        - Requires at least one technology.
        - Validates against allowed technologies to prevent invalid input.
        """
        if isinstance(value, str):
            raise serializers.ValidationError("Preferred technologies must be an array, not a string")
        if not value:
            raise serializers.ValidationError("Select at least one technology")
        allowed_technologies = ['React', 'Django', 'Node.js', 'PostgreSQL', 'MongoDB', 'Tailwind CSS']
        for tech in value:
            if tech not in allowed_technologies:
                raise serializers.ValidationError(f"Invalid technology: {tech}")
        return value
    


    # api/serializers.py
from .models import ProjectStage, Task, ChangeRequest, ClientProfile

class ProjectStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStage
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    assignee_username = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = '__all__'
    
    def get_assignee_username(self, obj):
        return obj.assignee.username if obj.assignee else None

class ChangeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChangeRequest
        fields = '__all__'

# api/serializers.py
class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = '__all__'