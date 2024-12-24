from django.shortcuts import render
from  django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,NoteSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Note


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]


    
    def get_queryset(self):
        # gives us the user that wrote it
        user = self.request.user
        # i can filter by other things too 
        # i cna only view the notes written by me 
        return Note.objects.filter(author = user)

    # we are overriding this because we need specific needs
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author= self.request.user)
        else:
            print(serializer.errors)
        return super
    
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user=  self.request.user
        return  Note.objects.filter(author = user)
    
    
    
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
    
    
