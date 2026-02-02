# Medical Records Scheduling Management System



## Overview
This project is a full-stack web application built with Django (backend) and React (frontend) deployed on render and vercel.


## Prerequisites
- Python 3.x
- Node.js and npm
- Git

## Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/ADAM-ABDUL-KARIM/Medical-Records-Scheduling-Management-System.git 

### 2. Setup backend


python -m venv env
cd env
Scripts/activate  
cd ..
cd backend
### 2. install backend dependencies
pip install -r requirements.txt

### Apply migrations and run server
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
### Set up Front end
cd ../frontend
npm install
npm run dev
************
Login Credentails:

username:admin
Password:admin


## Features
- Role-based access control (patient vs admin different Views)
- Authentication (JWT) and Authorization
- Patient registration and management
- Appointment booking and scheduling
- Medical notes tracking
- Healthcare professional availability management
- Analytics dashboard
- PDF/Excel export functionality

## Tech Stack
- Backend: Django REST Framework
- Frontend: React with Vite
- Authentication: JWT
- Data Visualization: Chart.js
- Styling: CSS
```

The project architecture follows a client-server model with the React frontend making API calls to the Django backend. The system includes modules for user authentication, patient record management, appointment scheduling, and analytics.The project architecture follows a client-server model with the React frontend making API calls to the Django backend. The system includes modules for user authentication, patient record management, appointment scheduling, and analytics.
