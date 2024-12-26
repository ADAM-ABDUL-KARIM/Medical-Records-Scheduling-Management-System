# setting credentials  - create nwe user
# for JWT

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields =['id','role_name']
        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # the model we want to serialize
        model = User
        # field we will serialize when we are accepint and returning a new user
        fields = ["id","username","password"]
        # accept pass when we are creaeting a new user nut we do not want to return the password
        # when we are given an info about the user thus write only means no one will read the pass
        extra_kwargs = {"password":{"write_only": True}}
        
        
    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    role = RoleSerializer()
    class Meta:
        model = Profile
        fields =['user','role']
    
    


class NoteSerializer(serializers.ModelSerializer):
    added_by = serializers.ReadOnlyField(source='added_by.username')  # Displays username

    class Meta:
        model = Note
        fields = ["note_id", "patient", "appointment", "note_date", "added_by", "note_content"]
        extra_kwargs = {"added_by":{"read_only":True}}
        

        
class DiagnosisSerializer(serializers.ModelSerializer):
    
    class Meta:
        model= Diagnosis
        fields =["diagnosis"]
        
class MedicationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model= Medication
        fields =["medication_name"]

class PatientSerializer (serializers.ModelSerializer):
    diagnosis = DiagnosisSerializer(many=True,read_only= True)
    medication  = MedicationSerializer(many=True,read_only= True)
    notes = NoteSerializer(many=True,read_only= True)
    class Meta:
        model = Patient
        fields = "__all__"

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ['id', 'user', 'first_name', 'last_name', 'dob']

class HealthCareProfessionalSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = HealthCareProfessional
        fields = ['id', 'user', 'first_name', 'last_name', 'specialty', 'dob']
        

class AppointmentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Appointment
        fields = '__all__'

class AdminAppointmentSerializer(serializers.ModelSerializer):
    admin = AdminSerializer()
    appointment = AppointmentSerializer()

    class Meta:
        model = AdminAppointment
        fields = ['admin_appointment_id', 'admin', 'appointment']
        

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['availability_id', 'availability_date', 'end_time']

class HealthCareProfessionalAvailabilitySerializer(serializers.ModelSerializer):
    healthcare_professional = HealthCareProfessionalSerializer()
    availability = AvailabilitySerializer()

    class Meta:
        model = HealthCareProfessionalAvailability
        fields = ['healthcare_professional_availability_id', 'healthcare_professional', 'availability']
