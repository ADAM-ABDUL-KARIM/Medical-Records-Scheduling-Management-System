from django.urls import path
from . import views

urlpatterns = [
    path("notes/",views.NoteListCreate.as_view(),name ="note-list"),
    path("notes/delete/<int:pk>/",views.NoteDelete.as_view(),name="delete-note"),
     path("patient/",views.PatientRetrieve.as_view(),),
     path("healthpro/",views.HealthcareProfessionalRetrieve.as_view(),),
     
     path("appointment/",views.AppointmentCreate.as_view(),),
     path("appointment/delete/<int:pk>/",views.AppointmentDelete.as_view(),),
     path('export/patient/excel/<int:pk>/',views.export_patients_excel,name='export-patient-excel'),
     path('export/patient/pdf/<int:pk>/',views.export_patient_pdf,name='export-patient-pdf'),
     

]
