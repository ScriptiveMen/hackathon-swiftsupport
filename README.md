# SwiftSupport

AI-powered customer support platform built for modern businesses to manage customer interactions, support tickets, and real-time communication efficiently.

## 📌 Overview

SwiftSupport is a full-stack customer support platform designed to streamline customer service operations with real-time communication, AI-assisted workflows, and role-based management systems.

The platform provides dedicated portals for administrators, support agents, and customers, enabling organizations to manage support operations in a scalable and organized way.

---

## ✨ Features

### 👑 Admin Portal

- Centralized analytics dashboard
- Manage support agents and teams
- Customer management system
- Complete ticket monitoring
- Knowledge base management
- Role-based access control

### 🎧 Agent Portal

- Personal performance dashboard
- Real-time customer chat
- Ticket assignment & management
- AI-assisted response generation
- Internal knowledge access
- Live support workflow tracking

### 👤 Customer Portal

- Instant support access
- Real-time messaging with agents
- Ticket creation & tracking
- Faster issue resolution experience

### 🌟 Core Features

- Secure JWT Authentication
- Responsive modern UI
- AI-powered support assistance
- Smooth animations and interactions
- Scalable MERN architecture
- Role-based authorization system

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Redux Toolkit
- Tailwind CSS v4
- React Router DOM v7
- GSAP
- Lenis
- Socket.IO Client
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- bcryptjs
- Express Validator
- Helmet
- HPP
- CORS
- Rate Limiting
- AI Integration APIs

---

## 📂 Project Structure

```bash
swiftsupport/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── service/
│   │   ├── tests/
│   │   └── validators/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── assets/
    │   ├── components/
    │   ├── layout/
    │   ├── pages/
    │   ├── store/
    │   ├── style/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 📸 Screenshots

<img width="1280" height="645" alt="6330089312891899576" src="https://github.com/user-attachments/assets/4c13beb4-66c3-4770-8d52-c9d70011ba16" />


### Home Page

<img width="1280" height="647" alt="6330089312891899578" src="https://github.com/user-attachments/assets/29ca96c1-f35c-4bfd-be3b-25b508038ef3" />


### Admin Dashboard

<img width="1280" height="647" alt="6330089312891899577" src="https://github.com/user-attachments/assets/76e3bae3-e0f0-40ea-bf2e-3f33feae1932" />


### Agent Dashboard

<img width="1280" height="646" alt="6330089312891899579" src="https://github.com/user-attachments/assets/03d3fba5-d85b-4d96-a4a8-671e3812d100" />


### Customer Chat UI

---

## ⚙️ Environment Variables

### Backend `.env`

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
NODE_ENV=development
PORT=5000
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/ScriptiveMen/hackathon-swiftsupport.git
cd hackathon-swiftsupport
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Start development server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend server:

```bash
npm run dev
```

---

## 📜 Available Scripts

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend

```bash
npm run dev      # Start backend server
npm test         # Run test cases
```

---

## 🔐 Authentication & Security

- JWT-based authentication
- Password hashing using bcryptjs
- Secure API middleware
- Role-based authorization
- Rate limiting protection
- HTTP security headers with Helmet

---

## 🌐 Repository

GitHub Repository:

[https://github.com/ScriptiveMen/hackathon-swiftsupport](https://github.com/ScriptiveMen/hackathon-swiftsupport)

---

## 🚧 Future Improvements

- Subscription & pricing management system
- Advanced analytics dashboard
- Enhanced real-time chat scalability
- Real-time communication with Socket.IO
- Email notification system
- Customer feedback & rating system
- File and media sharing in chat
- Docker & CI/CD deployment support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.
