from django.apps import AppConfig
"""
apps.py: This file contains the configuration for your Django app,
including the AppConfig class. 
It's responsible for setting up app-specific configurations, such as
"""

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.signals