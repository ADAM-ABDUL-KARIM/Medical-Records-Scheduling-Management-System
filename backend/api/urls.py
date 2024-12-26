from django.urls import path
from . import views

urlpatterns = [
    path("notes/",views.NoteListCreate.as_view(),name ="note-list"),
    path("notes/delete/<int:pk>/",views.NoteDelete.as_view(),name="delete-note"),
     path("patient/",views.PatientRetrieve.as_view(),),
     path("appointment/",views.AppointmentCreate.as_view(),),
     path("appointment/delete/<int:pk>/",views.AppointmentDelete.as_view(),),

]
