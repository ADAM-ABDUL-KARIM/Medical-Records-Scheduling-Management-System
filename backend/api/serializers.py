# setting credentials  - create nwe user
# for JWT

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note,Role,Profile


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
    class Meta:
        model = Note
        fields = ["id","title","content","created_at","author"] 
        extra_kwargs = {"author":{"read_only":True}}