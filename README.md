# Advanced Job Portal

A full-stack job portal application built using **React.js** for the frontend and **Django REST Framework** for the backend. The platform connects job seekers and recruiters with role-based features, job management, applications, and interview scheduling.

## Features

### Job Seeker

* User registration and JWT authentication
* Profile creation and update
* Browse available jobs
* View job details
* Apply for jobs
* Save jobs
* Track application status
* Upload resume
* Receive notifications

### Recruiter

* Recruiter registration and login
* Create and manage job postings
* View posted jobs
* View applicants
* Review candidate profiles and resumes
* Update application status
* Schedule interviews

### Admin

* Manage users
* Monitor platform activities
* Dashboard analytics

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios
* React Router

### Backend

* Python
* Django
* Django REST Framework
* JWT Authentication
* MySQL

### Tools

* Git & GitHub
* VS Code
* MySQL Workbench

## Project Structure

```
Advanced-Job-Portal
│
├── Backend
│   └── Django REST API
│
├── frontend
│   └── smartjob
│       └── React Application
│
└── README.md
```

## Installation and Setup

### Backend Setup

Navigate to backend:

```
cd Backend/jobportal
```

Install dependencies:

```
pip install -r requirements.txt
```

Run migrations:

```
python manage.py migrate
```

Start Django server:

```
python manage.py runserver
```

### Frontend Setup

Navigate to frontend:

```
cd frontend/smartjob
```

Install packages:

```
npm install
```

Start React application:

```
npm start
```

## API Authentication

The project uses JWT authentication for secure user login and role-based access.

## Project Goal

The goal of this project is to provide a complete recruitment platform where job seekers can find opportunities and recruiters can efficiently manage hiring processes.

## Developer

**Teja Sri Jujuri**

GitHub:
https://github.com/tejasrijujuri
