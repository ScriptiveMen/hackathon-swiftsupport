# 📄 AI Customer Support Platform – Swift Support

> Intelligent, multi‑tenant support system with AI auto‑reply and human handoff.

---

## 📝 Overview

We built a customer support platform where **AI answers common questions** from a knowledge base. If AI can’t answer, it automatically creates a support ticket and assigns it to a human agent. Agents also get **AI‑suggested replies** to speed up their work. Built for multiple organizations (multi‑tenant) with role‑based access (admin, agent, customer).

**Our goal:** Reduce response times, cut support costs, and scale without hiring dozens of agents.

---

## ✨ Key Features

- 🔐 **Authentication & Roles** – JWT, signup/login, roles: Admin, Agent, Customer.
- 🏢 **Multi‑tenant Organizations** – Each organization has its own users, tickets, and knowledge base.
- 📚 **Knowledge Base (FAQ)** – CRUD + search; used by AI to answer customers.
- 🎫 **Ticket Management** – Create, assign, update status, priority. Linked to chats.
- 💬 **Chat with AI & Human Handoff** – Customers chat via API; AI replies if no agent assigned; agent can take over.
- 🤖 **AI Auto‑Respond** – Grok API + knowledge base → instant answers or auto‑ticket creation.
- ✍️ **AI Agent Co‑pilot** – Agents type rough draft → AI polishes it into professional reply.
- 📊 **Role‑based Access Control** – Customers see only their tickets; agents see all in org; admins manage users.
- 🧪 **Fully Tested API** – Postman collection with 23+ endpoints.

---

## 🛠 Tech Stack

| Layer          | Technology                               |
|----------------|------------------------------------------|
| Backend        | Node.js, Express.js                      |
| Database       | MongoDB, Mongoose                        |
| Authentication | JWT, bcrypt.js, cookies                  |
| AI             | Google Gemini API (or Grok)              |
| Frontend       | React, Redux Toolkit, Tailwind CSS       |
| Deployment     | Vercel (frontend), Render/Railway (backend) |
| Tools          | Postman, Git, GitHub                     |

---

## 👤 User
```json

{
  "name": "String, required",
  "email": "String, required, unique",
  "password": "String, required",
  "role": "String, enum: ['admin','agent','customer'], default: 'customer'",
  "organizationId": "ObjectId, ref: 'Organization'",
  "isActive": "Boolean, default: true"
}
```

## 🏢 Organization
```json
{
  "name": "String, required",
  "ownerId": "ObjectId, ref: 'User'"
}
```

## 💬 Chat
```json
{
  "userId": "ObjectId, ref: 'User'",
  "organizationId": "ObjectId, ref: 'Organization'",
  "status": "String, enum: ['active','closed'], default: 'active'"
}
```

## 🧾 Message
```json
{
  "chatId": "ObjectId, ref: 'Chat'",
  "sender": "String, enum: ['user','ai','agent']",
  "content": "String, required"
}
```

## 📚 KnowledgeBase (FAQ)
```json
{
  "organizationId": "ObjectId, ref: 'Organization'",
  "question": "String, required",
  "answer": "String, required",
  "tags": "[String]"
}
```

## 🎫 Ticket
```json
{
  "userId": "ObjectId, ref: 'User'",
  "organizationId": "ObjectId, ref: 'Organization'",
  "chatId": "ObjectId, ref: 'Chat'",
  "title": "String, required",
  "description": "String, required",
  "assignedTo": "ObjectId, ref: 'User', default: null",
  "status": "String, enum: ['open','in-progress','resolved'], default: 'open'",
  "priority": "String, enum: ['low','medium','high'], default: 'medium'"
}
```

---

## Setup Instructions (Local Development)
# Clone repo
```bash
git clone https://github.com/ScriptiveMen/hackathon-swiftsupport.git
```

# Backend
```bash
cd backend
npm install
cp .env.example .env   # add MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

# Frontend
```bash
cd frontend
npm install
npm run dev
```
---

## Environment Variables
```bash
*   PORT=5000
*   MONGO_URI=your_mongodb_connection_string
*   JWT_SECRET=your_secret_key
*   GROQ_API_KEY=your_Groq_key
*   CORS_ORIGIN=http://localhost:5173
```
---

## Deployment Links
*   **Frontend (Vercel):** [https://hackathon-swiftsupport-ifyz.vercel.app](https://hackathon-swiftsupport-ifyz.vercel.app)
*   **Backend (Render/Railway):** [https://hackathon-swiftsupport.vercel.app](https://hackathon-swiftsupport.vercel.app)
*   **GitHub:** [https://github.com/ScriptiveMen/hackathon-swiftsupport](https://github.com/ScriptiveMen/hackathon-swiftsupport)
*   **Postman Collection:** [Explore 23 endpoints](https://github.com/ScriptiveMen/hackathon-swiftsupport)
*   **Demo Video:** [Video Demo Url](https://github.com/ScriptiveMen/hackathon-swiftsupport)

---
  
## Team Members & Roles
*   **Kajal Golghate** – Frontend Development, UI/UX, Readme Docs
*   **Vansh Sharma** – Frontend Development, Redux, UI/UX, Video
*   **Satya Kumar Ram** – DevOps, Deployment, Testing, Redux, Security
*   **Prajwal Ghadigaonkar** – Backend Development, AI Integration, API Design, Documentation

---

## Challenges & Learnings
*   **Making AI not hallucinate** → used strict system instruction + “CREATE_TICKET” fallback
*   **Role‑based access control** → middleware + orgId checks to isolate tenants
*   **Avoiding duplicate code for chat vs AI respond** → unified /ai/respond with optional chatId.
*   **Merge conflicts** → resolved with manual editing and communication.

---

## Future Improvements (Optional)
*   Real‑time WebSocket for chat (instead of polling)
*   AI sentiment analysis on tickets
*   Dashboard analytics (ticket volume, CSAT)
*   Email notifications on ticket assignment

---

## License & Acknowledgments
Built for Hackathon 2026 – Sheryians Coding School
Thanks to mentors and open‑source libraries.

---

🙏 **Thank you for taking the time to review our project. We enjoyed building it and hope it shows what’s possible with AI + MERN in 50 hours.**

<div align="center">– <strong>Team Swift Support</strong></div>
