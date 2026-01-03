from django.db import migrations

def add_proposal_stage(apps, schema_editor):
    ProjectStage = apps.get_model('api', 'ProjectStage')
    ProjectStage.objects.get_or_create(
        name='proposal',
        defaults={'description': 'Initial proposal stage', 'order': 0}
    )

class Migration(migrations.Migration):
    dependencies = [('api', '0002_clientprofile_projectstage_project_budget_used_and_more')]
    operations = [migrations.RunPython(add_proposal_stage)]