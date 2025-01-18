from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import *
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
import openpyxl
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework.views import *

class HealthcareProfessionalRetrieve (generics.ListCreateAPIView):
    serializer_class = HealthCareProfessionalSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return HealthCareProfessional.objects.all()
    def perform_create(self, serializer):
        return serializer.save()
    
class PatientRetrieve(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Return all patients
        return Patient.objects.all()

    def perform_create(self, serializer):
        serializer.save()
    
class PatientUpdate(generics.UpdateAPIView):  
    serializer_class = PatientUpdateSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Patient.objects.all()
class PatientDelete (generics.DestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Patient.objects.all()
    

class AppointmentCreate(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Appointment.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
        return super()

class AppointmentDelete(generics.DestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Appointment.objects.all()

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Note.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
        return super()

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Note.objects.all()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return self.request.user.profile
class UsernameView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({"username": request.user.username})
        return Response({"username": "Guest"})
class AvailabilityView(generics.ListCreateAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
        return super()
    def get_queryset(self):
        return Availability.objects.all()

class AvailabilityDelete(generics.DestroyAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes  = [AllowAny]
    
    def get_queryset(self):
        return Availability.objects.all() 
def export_patients_excel(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    worksheet.title = 'Patients'
    columns = ['First Name', 'Last Name', 'Date Of Birth']
    row_num = 1

    for col_num, column_title in enumerate(columns, 1):
        cell = worksheet.cell(row=row_num, column=col_num)
        cell.value = column_title

    patient_data = [patient.first_name, patient.last_name, patient.dob]
    row_num += 1
    for col_num, cell_value in enumerate(patient_data, 1):
        cell = worksheet.cell(row=row_num, column=col_num)
        cell.value = cell_value

    filename = f'patient_{patient.first_name}_{patient.last_name}_{pk}.xlsx'
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    workbook.save(response)
    return response

def export_patient_pdf(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    response = HttpResponse(content_type='application/pdf')
    filename = f'patient_{patient.first_name}_{patient.last_name}_{pk}.pdf'
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    p.drawString(100, height - 100, f"Patient Report for {patient.first_name} {patient.last_name}")
    p.drawString(100, height - 150, f"First Name: {patient.first_name}")
    p.drawString(100, height - 200, f"Last Name: {patient.last_name}")
    p.drawString(100, height - 250, f"Date of Birth: {patient.dob}")

    p.showPage()
    p.save()
    return response



