# SwiftSupport

SwiftSupport is a full-stack AI customer support platform built for teams that need fast customer assistance, organized ticket escalation, and a manageable knowledge base. Customers can chat with an AI assistant, unresolved issues can become tickets, agents can review conversations and tickets, and admins can manage agents, customers, FAQs, documents, and support operations.

This repository is organized as a two-app project:

- `frontend/` - React + Vite client application
- `backend/` - Express + MongoDB API server

## Table of Contents

- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Data Models](#data-models)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)

## Features

- AI-powered customer support chat
- JWT-based authentication
- Role-based dashboards for admin, agent, and customer users
- Organization-based multi-tenant data separation
- Customer chat history
- Automatic ticket creation when AI cannot answer from the knowledge base
- Ticket assignment to support agents
- Ticket status and priority management
- Admin customer and agent management views
- FAQ and knowledge base management
- AI-assisted agent response suggestions
- Responsive React UI with route-level code splitting
- Protected backend APIs with authentication middleware
- Express security middleware including Helmet, rate limiting, HPP protection, and CORS

## User Roles

### Admin

Admins manage organization-level support operations.

Typical admin capabilities:

- View dashboard metrics
- Manage support agents
- View customers
- View and manage tickets
- Manage FAQ and documentation content
- Access organization-wide support data

### Agent

Agents handle escalated customer conversations and tickets.

Typical agent capabilities:

- View assigned chats and escalations
- Join customer chat conversations
- Review ticket history
- Access knowledge base, FAQ, and docs
- Use AI suggestions to polish draft replies

### Customer

Customers interact with the SwiftSupport assistant and can escalate issues.

Typical customer capabilities:

- Start or resume a support chat
- Ask questions to the AI assistant
- Escalate to a human agent
- Generate a ticket when the issue needs manual support

## Tech Stack

### Frontend

- React 19
- Vite 8
- React Router DOM
- Tailwind CSS 4
- Axios
- Lucide React icons
- GSAP
- Lenis smooth scrolling
- Socket.IO Client dependency included

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- bcryptjs password hashing
- Cookie parser
- CORS
- Helmet
- express-rate-limit
- HPP
- Groq-compatible OpenAI client for AI responses
- Jest for tests

## Project Structure

```text
hackathon-swiftsupport/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── controllers/
│       │   ├── ai.controller.js
│       │   ├── auth.controller.js
│       │   ├── chat.controller.js
│       │   ├── knowledge.controller.js
│       │   └── ticket.controller.js
│       ├── db/
│       │   └── db.js
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── models/
│       │   ├── chats.model.js
│       │   ├── knowledge.model.js
│       │   ├── message.model.js
│       │   ├── organization.model.js
│       │   ├── ticket.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── ai.routes.js
│       │   ├── auth.routes.js
│       │   ├── chat.routes.js
│       │   ├── knowledge.routes.js
│       │   └── ticket.routes.js
│       ├── service/
│       │   └── ai.service.js
│       ├── tests/
│       └── validators/
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/
        │   └── axiosClient.js
        ├── assets/
        ├── components/
        │   ├── admin/
        │   ├── agent/
        │   ├── common/
        │   └── home/
        ├── pages/
        │   ├── admin/
        │   ├── agent/
        │   ├── common/
        │   └── customer/
        └── style/
```

## How It Works

1. A user registers or logs in.
2. The backend validates credentials, hashes passwords with `bcryptjs`, and issues a JWT.
3. The frontend stores the token and sends it on API requests using the `Authorization: Bearer <token>` header.
4. Protected backend routes use `auth.middleware.js` to verify the token and attach the authenticated user context.
5. Customers can start chats and ask questions.
6. The AI service checks organization-specific knowledge base content and generates an answer.
7. If the AI cannot answer reliably, it can return a ticket creation instruction.
8. The backend creates a ticket linked to the chat.
9. Agents and admins can review tickets, assign work, update statuses, and use knowledge content to support customers.

## Environment Variables

Create environment files locally. Do not commit real secrets.

### Backend `.env`

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
```

### Frontend `.env`

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For deployed frontend builds, set `VITE_API_BASE_URL` to the deployed backend URL, for example:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

The Axios client automatically appends `/api`, so do not include `/api` at the end of `VITE_API_BASE_URL`.

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

Open the frontend URL in your browser and register or log in.

## Available Scripts

### Frontend

Run from `frontend/`:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the production frontend into `frontend/dist`.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint across the frontend source.

### Backend

Run from `backend/`:

```bash
npm run dev
```

Starts the Express server with Nodemon.

```bash
npm test
```

Runs the Jest test suite.

## API Overview

All backend API routes are mounted under `/api`.

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Server health check |

### Auth

Base path: `/api/auth`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/register` | No | Register a user and create or join an organization |
| `POST` | `/login` | No | Authenticate a user and return token/user data |
| `GET` | `/getUser` | Yes | Get current authenticated user |
| `DELETE` | `/delete/:id` | Yes | Delete a user |
| `GET` | `/organizations` | No | List organizations |
| `GET` | `/getAllUsers` | Yes | List users in the organization |
| `GET` | `/users` | Yes | Alias for organization users |
| `GET` | `/getAllAgents` | Yes | List organization agents |
| `GET` | `/agents` | Yes | Alias for organization agents |

### Chat

Base path: `/api/chat`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/getAllChats` | Yes | Get chats for the authenticated user |
| `GET` | `/getChatById/:id` | Yes | Get messages for a chat |
| `POST` | `/startChat` | Yes | Start a new chat |

### Tickets

Base path: `/api/tickets`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/getAllTickets` | Yes | Get tickets for the organization or customer |
| `GET` | `/getTicketById/:id` | Yes | Get a ticket by ID |
| `POST` | `/createTicket` | Yes | Create a ticket |
| `PUT` | `/updateTicket/:id` | Yes | Update ticket title, description, status, or priority |
| `DELETE` | `/deleteTicket/:id` | Yes | Delete a ticket |
| `PUT` | `/ticketAssginedToAgent/:id` | Yes | Assign a ticket to an agent |
| `PUT` | `/ticketStatusUpdate/:id` | Yes | Update ticket status |

### Knowledge Base / FAQ

Base path: `/api/knowledge`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/getAllFAQ` | Yes | Get FAQ entries for the organization |
| `POST` | `/createFAQ` | Yes | Create an FAQ entry |
| `PUT` | `/updateFAQ/:id` | Yes | Update an FAQ entry |
| `DELETE` | `/deleteFAQ/:id` | Yes | Delete an FAQ entry |
| `GET` | `/searchFAQ?query=value` | Yes | Search FAQs by question, answer, or tags |

### AI

Base path: `/api/ai`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/respond` | Yes | Generate a customer-facing AI response |
| `POST` | `/suggest/ticket/:ticketId` | Yes | Generate or polish an agent reply suggestion |

## Data Models

### User

Users belong to an organization and have one of three roles:

- `admin`
- `agent`
- `customer`

Important fields:

- `name`
- `email`
- `password`
- `role`
- `organizationId`
- `isActive`

### Organization

Organizations group users, chats, tickets, and knowledge base entries.

Important fields:

- `name`
- `ownerId`

### Chat

Chats represent customer support conversations.

Important fields:

- `userId`
- `organizationId`
- `status`

### Message

Messages belong to chats and can be sent by a customer, AI, or agent.

Important fields:

- `chatId`
- `sender`
- `content`

### Ticket

Tickets represent support issues that require tracking or human follow-up.

Important fields:

- `userId`
- `organizationId`
- `chatId`
- `title`
- `description`
- `assignedTo`
- `status`
- `priority`

### Knowledge

Knowledge base entries power AI responses and FAQ views.

Important fields:

- `organizationId`
- `question`
- `answer`
- `tags`

## Frontend Routes

| Route | Description |
| --- | --- |
| `/` | Public landing page |
| `/login` | Login and customer signup |
| `/admin-register` | Admin registration |
| `/admin` | Admin dashboard |
| `/admin/agents` | Agent management |
| `/admin/customers` | Customer management |
| `/admin/tickets` | Ticket management |
| `/admin/faq` | FAQ management |
| `/admin/docs` | Docs management |
| `/agent` | Agent dashboard |
| `/agent/chat` | Agent chat view |
| `/agent/tickets` | Agent ticket history |
| `/agent/knowledge-base` | Agent knowledge base |
| `/agent/faq` | Agent FAQ |
| `/agent/docs` | Agent docs |
| `/agent/settings` | Agent settings |
| `/customer/chat` | Customer support chat |

## Deployment Notes

### Frontend

The frontend includes a `vercel.json` file and can be deployed as a Vite app.

Before deploying, configure:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

Then build:

```bash
cd frontend
npm run build
```

### Backend

The backend includes a `vercel.json` file and can be deployed as a Node/Express API.

Required production environment variables:

- `MONGO_URI`
- `JWT_SECRET_KEY`
- `NODE_ENV=production`
- `FRONTEND_URL`
- `GROQ_API_KEY`

When frontend and backend are on different domains, make sure:

- `FRONTEND_URL` exactly matches the deployed frontend origin.
- The frontend `VITE_API_BASE_URL` exactly matches the deployed backend origin.
- Cookies and CORS settings are compatible with the deployment domain.

## Troubleshooting

### `401 Unauthorized` on `/api/auth/getUser`

This route requires a valid JWT. If the request happens without a token or with an expired token, the backend correctly returns `401`.

Fixes:

- Log in again.
- Clear stale `localStorage` values for `token` and `user`.
- Confirm the frontend is sending the `Authorization: Bearer <token>` header.
- Confirm `JWT_SECRET_KEY` is the same value used when the token was issued.

### Login request times out

Check:

- Backend server is running.
- `VITE_API_BASE_URL` points to the correct backend origin.
- MongoDB connection string is valid.
- `GROQ_API_KEY` is set if the flow triggers AI features.
- Deployment platform is not sleeping or cold-starting too slowly.

### CORS errors

Check:

- `FRONTEND_URL` in `backend/.env` matches the frontend origin.
- The backend CORS config has `credentials: true`.
- The frontend Axios client uses `withCredentials: true`.

### Role registration fails

The backend stores roles as lowercase values:

- `admin`
- `agent`
- `customer`

The registration controller normalizes role casing, but new code should still prefer lowercase role values.

### Frontend build fails because of a missing dependency

Run:

```bash
cd frontend
npm install
npm run build
```

If the error mentions an unused or missing package, check whether the import is actually used before adding another dependency.

## Security Notes

- Never commit `.env` files with real credentials.
- Rotate any API keys or database credentials that were accidentally committed or shared.
- Use a strong `JWT_SECRET_KEY` in production.
- Keep `NODE_ENV=production` in deployed environments.
- Restrict MongoDB network access where possible.

## License

This project currently uses the `ISC` license declared in the backend package metadata.
