from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile, Role

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.is_superuser:
            admin_role = Role.objects.get_or_create(role_name='Admin')[0]
            Profile.objects.create(user=instance, role=admin_role)
        else:
            default_role = Role.objects.get_or_create(role_name='Default Role')[0]
            Profile.objects.create(user=instance, role=default_role)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()