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

    def update(self, instance, validated_data):
        diagnosis_data = validated_data.pop('diagnosis', [])
        medication_data = validated_data.pop('medication', [])

        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.dob = validated_data.get('dob', instance.dob)
        instance.nationality = validated_data.get('nationality', instance.nationality)
        instance.address = validated_data.get('address', instance.address)
        instance.marital_status = validated_data.get('marital_status', instance.marital_status)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.height = validated_data.get('height', instance.height)
        instance.educational_level = validated_data.get('educational_level', instance.educational_level)
        instance.employment_status = validated_data.get('employment_status', instance.employment_status)
        instance.dominant_hand = validated_data.get('dominant_hand', instance.dominant_hand)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.activity_level = validated_data.get('activity_level', instance.activity_level)
        instance.is_recovered = validated_data.get('is_recovered', instance.is_recovered)
        instance.save()

        instance.diagnosis.all().delete()
        for diag in diagnosis_data:
            Diagnosis.objects.create(patient=instance, **diag)

        instance.medication.all().delete()
        for med in medication_data:
            Medication.objects.create(patient=instance, **med)

        return instance
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
    healthcare_professional_details = serializers.SerializerMethodField()    
    availability_details = serializers.SerializerMethodField()

    class Meta:
        model = HealthCareProfessionalAvailability
        fields = ["availability_details", "healthcare_professional_details", 'healthcare_professional_availability_id', 'healthcare_professional', 'availability']

    def get_healthcare_professional_details(self, obj):
        return {
            "healthcare_professional_specialty": f"{obj.healthcare_professional.specialty}",
            "healthcare_professional_name": f"{obj.healthcare_professional.first_name} {obj.healthcare_professional.last_name}"
        }

    def get_availability_details(self, obj):
        return {
            "availability_datetime": f"{obj.availability.availability_date}",
            "availability_endtime": f"{obj.availability.end_time}"
        }

    def create(self, validated_data):
        healthcareprofessionalavailability = HealthCareProfessionalAvailability.objects.create(**validated_data)
        return healthcareprofessionalavailability
        
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