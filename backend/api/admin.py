from django.contrib import admin
from .models import Profile, Role, Admin, HealthCareProfessional, Patient, Appointment, AdminAppointment, Availability, HealthCareProfessionalAvailability, Diagnosis, Note, Medication

admin.site.register(Profile)
admin.site.register(Role)
admin.site.register(Admin)
admin.site.register(HealthCareProfessional)
admin.site.register(Patient)
admin.site.register(Appointment)
admin.site.register(AdminAppointment)
admin.site.register(Availability)
admin.site.register(HealthCareProfessionalAvailability)
admin.site.register(Diagnosis)
admin.site.register(Note)
admin.site.register(Medication)