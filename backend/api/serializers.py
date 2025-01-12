from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'role_name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    role = RoleSerializer()
    class Meta:
        model = Profile
        fields = ['user', 'role']



class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = ["diagnosis"]

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ["medication_name"]

class PatientSerializer(serializers.ModelSerializer):
    diagnosis = DiagnosisSerializer(many=True, required=False)
    medication = MedicationSerializer(many=True, required=False)

    class Meta:
        model = Patient
        fields = "__all__"
        read_only_fields = ['user']

    def create(self, validated_data):
        diagnosis_data = validated_data.pop('diagnosis', [])
        medication_data = validated_data.pop('medication', [])
        request = self.context.get('request')
        user = request.user if request else None
        patient = Patient.objects.create(user=user, **validated_data)

        for diag in diagnosis_data:
            Diagnosis.objects.create(patient=patient, **diag)

        for med in medication_data:
            Medication.objects.create(patient=patient, **med)

        return patient

class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ['id', 'user', 'first_name', 'last_name', 'dob']

class HealthCareProfessionalSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = HealthCareProfessional
        fields = ['id', 'user','first_name', 'last_name', 'specialty', 'dob']

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    healthpro_details = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ["appointment_id","healthcare_professional", "patient", "appointment_datetime", "healthpro_details", "patient_name"]

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_healthpro_details(self, obj):
        return {
            "healthcare_professional_name": f"{obj.healthcare_professional.first_name} {obj.healthcare_professional.last_name}",
            "healthcare_professional_specialty": f"{obj.healthcare_professional.specialty}"
        }

    def create(self, validated_data):
        appointment = Appointment.objects.create(**validated_data)
        return appointment
            
            
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
        
        
class NoteSerializer(serializers.ModelSerializer):
    added_by = serializers.ReadOnlyField(source='added_by.username')
    patient_name = serializers.SerializerMethodField()
    appointment_details = serializers.SerializerMethodField()

    class Meta:
        model = Note
        fields = ["note_id", "patient_name", "appointment_details", "note_date", "added_by", "note_content", "patient", "appointment"]
        extra_kwargs = {"added_by": {"read_only": True}}

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_appointment_details(self, obj):
        return {
            "appointment_datetime": obj.appointment.appointment_datetime,
            "healthcare_professional_name": f"{obj.appointment.healthcare_professional.first_name} {obj.appointment.healthcare_professional.last_name}"
        }

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None
        note = Note.objects.create(added_by=user, **validated_data)
        return note