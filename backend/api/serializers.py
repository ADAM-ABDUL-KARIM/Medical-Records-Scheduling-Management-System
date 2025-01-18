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

class UsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']
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
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = "__all__"

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        diagnosis_data = validated_data.pop('diagnosis', [])
        medication_data = validated_data.pop('medication', [])
        patient = Patient.objects.create(user=user, **validated_data)

        for diag in diagnosis_data:
            Diagnosis.objects.create(patient=patient, **diag)

        for med in medication_data:
            Medication.objects.create(patient=patient, **med)

        return patient

class PatientUpdateSerializer(serializers.ModelSerializer):
    diagnosis = DiagnosisSerializer(many=True, required=False)
    medication = MedicationSerializer(many=True, required=False)

    class Meta:
        model = Patient
        fields = [
            "first_name", "last_name", "dob", "nationality", "address",
            "marital_status", "phone_number", "gender", "height",
            "educational_level", "employment_status", "dominant_hand",
            "start_date", "activity_level", "is_recovered", "diagnosis", "medication"
        ]

    def update(self, instance, validated_data):
        diagnosis_data = validated_data.pop('diagnosis', [])
        medication_data = validated_data.pop('medication', [])

        # Update patient fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update related models
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
        fields = ["appointment_id", "healthcare_professional", "patient", "appointment_datetime", "healthpro_details", "patient_name"]

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_healthpro_details(self, obj):
        return {
            "healthcare_professional_name": f"{obj.healthcare_professional.first_name} {obj.healthcare_professional.last_name}",
            "healthcare_professional_specialty": f"{obj.healthcare_professional.specialty}"
        }

    def create(self, validated_data):
        healthcare_professional = validated_data['healthcare_professional']
        appointment_datetime = validated_data['appointment_datetime']

        # Check for conflicts
        if Appointment.objects.filter(healthcare_professional=healthcare_professional, appointment_datetime=appointment_datetime).exists():
            raise serializers.ValidationError("An appointment with the same healthcare professional at the same time already exists.")

        appointment = Appointment.objects.create(**validated_data)
        return appointment
            
            
class AdminAppointmentSerializer(serializers.ModelSerializer):
    admin = AdminSerializer()
    appointment = AppointmentSerializer()

    class Meta:
        model = AdminAppointment
        fields = ['admin_appointment_id', 'admin', 'appointment']

class AvailabilitySerializer(serializers.ModelSerializer):
    healthpro_name = serializers.SerializerMethodField()
    class Meta:
        model = Availability
        fields = ['availability_id', 'availability_date', 'end_time','healthcare_professional','healthpro_name']
    
    def get_healthpro_name(self, obj):
        return f"{obj.healthcare_professional.first_name} {obj.healthcare_professional.last_name}",
         

    def create(self, validated_data):
        availability = Availability.objects.create(**validated_data)
        return availability


        
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