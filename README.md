
# Role Management System

A secure and modular **Role-Based Access Control (RBAC)** system featuring:

- **Passwordless Authentication (Email + OTP)**
- **Super Admin creation via seed script**
- **Admin Dashboard for managing users**
- **Clean backend–frontend separation**
- **MongoDB integration**

This project is designed to be easy to set up, scalable, and understandable for any new developer joining the codebase.

---

## 📦 Tech Stack

### **Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer / OTP-based login

### **Frontend**
- React / Next.js
- TailwindCSS (if used)
- Axios
- Context API / Redux (optional)

---

# 🚀 Getting Started

Follow the steps below to set up the project from scratch.

---

## 🔧 1. Install Dependencies

### **Backend**
npm install

### **Frontend**
npm install

### **Admin Seeding**
🔑 Create the First Admin
To initialize the system, you must manually create the Super Admin.

📌 Step 1 — Update .env
Inside your backend .env, set:

Make sure MongoDB connection details are also correctly configured.

PORT=5000
NODE_ENV=development
MONGO_URI=mongodb_url_here
JWT_SECRET=jwt_secret_here
OTP_EXPIRY_MINUTES=minutes
ADMIN_NAME=YourName
ADMIN_EMAIL=your.email@example.com

📌 Step 2 — Run the Admin Seeder
In the backend root terminal:

npm run seed:admin

If the operation succeeds, you should see:

arduino
✅ MongoDB connected
✅ Super Admin created: your.email@example.com
This confirms the Super Admin account is successfully created.

🖥 Start the Frontend
Move to the frontend directory and run:

npm run dev
Your application will be available at the default dev URL (usually http://localhost:3000/).

🔐 Login Flow — Passwordless OTP
The system uses email-only login, no passwords required.

Steps:
Enter your email on the login screen

Click "Continue with Email"

Check the backend terminal — the OTP will be logged there

Enter the OTP into the frontend and submit

You will now be logged in as an Admin or Super Admin depending on your assigned role.

🛠 Admin Dashboard
Once logged in, admins have access to the Role Management Dashboard.

✔ View Users
All admins and users are listed in a clean table format.

✔ Add User
Click "Add User", fill out the form, and submit to create a new user.

✔ User Roles
Admin can manage the roles assigned to different users (if implemented).

✔ Secure Access
Pages are protected using an auth-based Protected Route system.


MONGO_URI=
JWT_SECRET=

ADMIN_NAME=
ADMIN_EMAIL=
Frontend .env.local:
ini

NEXT_PUBLIC_API_BASE=http://localhost:5000/api

📬 OTP Handling
OTP is generated on backend

OTP is logged to the server console (for dev purposes)

In production, integrate mail delivery (Nodemailer / SendGrid / SES)

🧪 Testing (optional)
To run backend tests:

npm test
Frontend tests:

npm run test
🛡 Security Practices
Passwordless login avoids password leaks

JWT-based authentication ensures secure session handling

Protected routes guarantee dashboard security

Role checks prevent unauthorized access to admin features

🚧 Future Improvements
Role-based page-level permissions

Audit logs for user actions

UI improvements for better user experience

Multi-step OTP verification

Password-based login (optional)
