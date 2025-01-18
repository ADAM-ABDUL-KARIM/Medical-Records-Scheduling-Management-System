from django.db import models
from django.contrib.auth.models import User

class Role(models.Model):
    role_name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.role_name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    dob = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class HealthCareProfessional(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    specialty = models.CharField(max_length=100)
    dob = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Patient(models.Model):
    file_number = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    dob = models.DateField()
    nationality = models.CharField(max_length=50)
    address = models.CharField(max_length=100)
    marital_status = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    height = models.FloatField()
    educational_level = models.CharField(max_length=50)
    employment_status = models.CharField(max_length=50)
    dominant_hand = models.CharField(max_length=10)
    start_date = models.DateField()
    activity_level = models.CharField(max_length=50)
    is_recovered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Appointment(models.Model):
    appointment_id = models.AutoField(primary_key=True)
    healthcare_professional = models.ForeignKey(HealthCareProfessional, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment_datetime = models.DateTimeField()

    def __str__(self):
        return f"Appointment on {self.appointment_datetime} with {self.healthcare_professional} and {self.patient}"

class AdminAppointment(models.Model):
    admin_appointment_id = models.AutoField(primary_key=True)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)

    def __str__(self):
        return f"Admin Appointment {self.admin_appointment_id}"

class Availability(models.Model):
    healthcare_professional = models.ForeignKey(HealthCareProfessional, on_delete=models.CASCADE)
    availability_id = models.AutoField(primary_key=True)
    availability_date = models.DateTimeField()
    end_time = models.TimeField()
   

    def __str__(self):
        return f"Availability on {self.availability_date} until {self.end_time} with {self.healthcare_professional}"

class HealthCareProfessionalAvailability(models.Model):
    healthcare_professional_availability_id = models.AutoField(primary_key=True)
    healthcare_professional = models.ForeignKey(HealthCareProfessional, on_delete=models.CASCADE)
    availability = models.ForeignKey(Availability, on_delete=models.CASCADE)

    def __str__(self):
        return f"Availability for {self.healthcare_professional} on {self.availability}"

class Diagnosis(models.Model):
    diagnosis_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE,related_name="diagnosis")
    diagnosis = models.TextField()

    def __str__(self):
        return f"Diagnosis {self.diagnosis_id} for {self.patient}"

class Note(models.Model):
    note_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE,related_name="notes")
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    note_date = models.DateField()
    added_by = models.ForeignKey(User, on_delete=models.CASCADE,default='',null=True)
    note_content = models.TextField()

    def __str__(self):
        return f"Note {self.note_id} for {self.patient}"

class Medication(models.Model):
    medication_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE,related_name='medication')
    medication_name = models.CharField(max_length=100)

    def __str__(self):
        return self.medication_name