# 🌱 Agroo – Smart Agriculture & Farmer Community Platform

Agroo is a modern web-based agricultural platform designed to connect farmers, buyers, agricultural communities, and machinery owners in one place.

The platform provides features for agricultural product listings, machinery sharing, community posts, group messaging, weather information, AI-assisted support, and user account management.

## 🌐 Live Application

https://agroo-web-app-frontend.vercel.app/

## 📦 Repositories

### Frontend

https://github.com/sudeesharavisara2-sys/AgrooWebApp-frontend.git

### Backend

https://github.com/sudeesharavisara2-sys/AgrooWebApp-backend.git

---

## ✨ Main Features

- User registration and login
- JWT-based authentication
- Email OTP verification
- Forgot password and password reset
- User profile management
- Agricultural product marketplace
- Create, edit, view, and delete product listings
- Product image support
- Agricultural machinery listings
- Community posts
- Comments and likes
- Farmer groups
- Real-time messaging
- Weather information by Sri Lankan location
- Weather alerts
- AI-powered agricultural chatbot
- Admin dashboard
- User administration
- Agricultural price management
- Alert and system log management
- Responsive user interface

---

## 🛠️ Frontend Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| TypeScript | Type-safe JavaScript development |
| Vite | Development and production build tool |
| React Router | Client-side routing |
| Axios | HTTP requests to the backend API |
| Tailwind CSS | Application styling |
| Context API | Authentication state management |
| JWT | Authentication token handling |

---

## ⚙️ Backend Technology Stack

The backend is maintained in a separate repository.

| Technology | Purpose |
|---|---|
| Spring Boot | Backend application framework |
| Java 17 | Backend programming language |
| Spring Security | Authentication and authorization |
| JWT | Secure API authentication |
| Spring Data JPA | Database access |
| Hibernate | ORM |
| PostgreSQL | Relational database |
| Azure Database for PostgreSQL | Cloud database hosting |
| OpenAI API | AI chatbot integration |
| OpenWeatherMap API | Weather information |
| Gmail SMTP | OTP and email notifications |
| WebSocket | Real-time communication |

Backend repository:

https://github.com/sudeesharavisara2-sys/AgrooWebApp-backend.git

---

## ☁️ Deployment Architecture

```text
User Browser
     │
     ▼
Vercel
Agroo Frontend
     │
     │ HTTPS REST API
     ▼
Azure App Service
Spring Boot Backend
     │
     ├──────────────► Azure PostgreSQL
     │
     ├──────────────► OpenWeatherMap API
     │
     ├──────────────► OpenAI API
     │
     └──────────────► Gmail SMTP
```

---

## 📁 Project Structure

```text
src/
│
├── api/
│   ├── admin.ts
│   ├── aiChat.ts
│   ├── auth.ts
│   ├── client.ts
│   ├── comments.ts
│   ├── groups.ts
│   ├── likes.ts
│   ├── machines.ts
│   ├── messages.ts
│   ├── posts.ts
│   ├── products.ts
│   ├── user.ts
│   ├── weather.ts
│   └── websocket.ts
│
├── components/
│   ├── chat/
│   ├── common/
│   ├── layout/
│   ├── machines/
│   ├── posts/
│   ├── products/
│   └── weather/
│
├── context/
│   └── AuthContext.tsx
│
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── chat/
│   ├── machines/
│   ├── posts/
│   ├── products/
│   ├── weather/
│   ├── Home.tsx
│   └── NotFound.tsx
│
├── types/
│   └── index.ts
│
├── utils/
│   └── helpers.ts
│
├── App.tsx
├── index.css
└── main.tsx
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git

Check the installed versions:

```bash
node --version
npm --version
git --version
```

---

## 📥 Clone the Repository

```bash
git clone https://github.com/sudeesharavisara2-sys/AgrooWebApp-frontend.git
```

Move into the project directory:

```bash
cd AgrooWebApp-frontend
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the frontend project root.

```env
VITE_API_BASE_URL=http://localhost:8081
```

For production, configure the environment variable in Vercel:

```env
VITE_API_BASE_URL=https://your-backend-domain.azurewebsites.net
```

Do not store passwords, private API keys, database credentials, or other sensitive backend secrets in frontend environment variables.

Variables beginning with `VITE_` are exposed to the browser.

---

## 💻 Run the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Create a production build with:

```bash
npm run build
```

The generated production files will be available inside:

```text
dist/
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔌 API Configuration

The frontend uses a centralized Axios client.

```text
src/api/client.ts
```

The API base URL is loaded from:

```ts
import.meta.env.VITE_API_BASE_URL
```

with localhost available as the local development fallback.

This allows the same frontend codebase to communicate with both local and production backend environments.

---

## 🔑 Authentication

Agroo uses JWT-based authentication.

After successful login, the frontend stores the authentication token and automatically includes it in protected API requests.

Protected routes are controlled through the authentication context and route guards.

Authentication features include:

- Login
- Registration
- OTP verification
- Forgot password
- Reset password
- Change password
- User profile
- Role-based access
- Admin access

---

## 🛒 Agricultural Marketplace

Users can browse agricultural products and manage their own listings.

Product features include:

- Product creation
- Product editing
- Product deletion
- Product images
- Product categories
- Product type filtering
- Sale type filtering
- Search
- Advanced search
- Availability management
- Farmer-specific listings

---

## 🚜 Machinery Marketplace

The platform also allows agricultural machinery to be listed and discovered.

Users can:

- Browse machinery
- View machinery details
- Create machinery listings
- Edit machinery listings
- Manage their own machinery listings

---

## 🌦️ Weather System

Agroo provides weather information for agricultural locations across Sri Lanka.

Weather information includes:

- Temperature
- Humidity
- Wind speed
- Rainfall
- Weather alerts
- Location-based weather checks
- Automatic refresh

Weather information is retrieved through the backend using the OpenWeatherMap API.

---

## 🤖 AI Agricultural Assistant

Agroo includes an AI-powered agricultural chatbot.

The frontend communicates with the Spring Boot backend, while the backend securely communicates with the OpenAI API.

API keys are never stored directly in the frontend source code.

---

## 💬 Community & Messaging

Agroo provides community-oriented functionality including:

- Community posts
- Comments
- Likes
- Farmer groups
- Group conversations
- Messaging
- WebSocket-based communication

---

## 👨‍💼 Admin Features

Authorized administrators can access administrative functionality such as:

- Admin dashboard
- User management
- Agricultural price management
- Weather alert management
- System log monitoring

---

## 🔒 Security

The application follows a frontend/backend separation model.

Sensitive values such as the following must remain on the backend or secure cloud environment:

```text
Database passwords
JWT secrets
OpenAI API keys
Weather API keys
Email application passwords
```

Only public frontend configuration values should use the `VITE_` prefix.

---

## 🌍 Deployment

### Frontend

The frontend is deployed using Vercel.

Live URL:

https://agroo-web-app-frontend.vercel.app/

Production deployments are generated from the GitHub repository.

### Backend

The Spring Boot backend is deployed separately using Microsoft Azure App Service.

### Database

The application uses Azure Database for PostgreSQL.

---

## 🧪 Verify the Frontend

Run a TypeScript and production build check:

```bash
npm run build
```

A successful build should finish with output similar to:

```text
✓ built in ...
```

---



## 👨‍💻 Developer

**Sudeesha Ravisara**

Software Engineering Project  
NSBM Green University

---

## 🔗 Project Links

**Live Application**

https://agroo-web-app-frontend.vercel.app/

**Frontend Repository**

https://github.com/sudeesharavisara2-sys/AgrooWebApp-frontend.git

**Backend Repository**

https://github.com/sudeesharavisara2-sys/AgrooWebApp-backend.git




---

<p align="center">
  🌱 <strong>Agroo</strong><br/>
  Smart Agriculture, Connected Community
</p>
