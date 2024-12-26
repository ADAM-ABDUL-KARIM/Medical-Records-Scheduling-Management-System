from django.shortcuts import render
from  django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import *
import openpyxl

class PatientRetrieve (generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes=[AllowAny]
    
    def get_queryset(self):
        
        return Patient.objects.all()
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
            
        else:
            print(serializer.errors)
        return super

class AppointmentCreate(generics.ListCreateAPIView):
    
    serializer_class =AppointmentSerializer 
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        
        return Appointment.objects.all()
    
    def perform_create(self, serializer):
         if serializer.is_valid():
            serializer.save(added_by= self.request.user)
         else:
            print(serializer.errors)
         return super

class AppointmentDelete(generics.DestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Appointment.objects.all()
    
        
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # gives us the user that wrote it
        user = self.request.user
        # i can filter by other things too 
        # i cna only view the notes written by me 
        return Note.objects.filter(added_by = user)

    # we are overriding this because we need specific needs
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(added_by= self.request.user)
        else:
            print(serializer.errors)
        return super

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user=  self.request.user
        return  Note.objects.filter(added_by = user)
    
    
    
#write that creates a new user
# Create your views here.
# generic view automatically handles creating a new user / new object
class CreateUserView(generics.CreateAPIView):
    # list of all object when we are looking when creating a new one
    # to make sure we dont create a user that already exists
    queryset = User.objects.all()
    # tells this view what kind of data we need to accept to make a new user (username and password)
    serializer_class = UserSerializer
    # anyone not authenitcted can create a new user
    permission_classes = [AllowAny]

class ProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes=[IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile
    
    
    
def export_patients_excel(request):
    
    workbook = openpyxl.Workbook()
    worksheet = workbook.active
    worksheet.title  ='Patients Report Data'
    
    columns  =['First Name','Last Name', 'Date Of Birth']
    row_num =1 
    
    # assigning titles for each of the header
    for col_num,column_title in enumerate(columns,1):
        cell = worksheet.cell(row=row_num,column=col_num)
        cell.value = column_title
        
        # write data to worksheet
        patients = Patient.objects.all().values_list('first_name','last_name','dob')
        
        for patient in patients:
           row_num+=1
           for col_num,cell_value in enumerate(patient,1):
               cell = worksheet.cell(row=row_num,column=col_num)
               cell.value = cell_value
               
               
        # create an HttpResponse object with the appropriate Excel Header 