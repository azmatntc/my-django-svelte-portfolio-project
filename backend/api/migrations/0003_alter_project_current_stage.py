# api/migrations/0003_update_project_stage_default.py
from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0002_clientprofile_projectstage_project_budget_used_and_more'),
    ]

    operations = [
        migrations.RunSQL("""
            -- First ensure the ProjectStage table exists
            CREATE TABLE IF NOT EXISTS api_projectstage (
                id serial primary key,
                name varchar(50) not null,
                description text,
                order integer not null
            );
            
            -- Now insert the proposal stage if it doesn't exist
            INSERT INTO api_projectstage (name, order) VALUES ('proposal', 0)
            ON CONFLICT (name) DO NOTHING;
            
            -- Finally update existing projects to use the proposal stage ID
            UPDATE api_project 
            SET current_stage_id = (SELECT id FROM api_projectstage WHERE name = 'proposal')
            WHERE current_stage_id IS NULL OR current_stage_id NOT IN (SELECT id FROM api_projectstage);
        """),
    ]