# 🌍 TravelBuddy 

![TravelBuddy](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200)

**TravelBuddy** is a modern, AI-powered travel itinerary builder and social trip discovery platform. The application allows users to collaboratively plan trips, track budgets, manage packing lists, discover local gems, and leverage the power of **Google Gemini AI** to generate smart, personalized itineraries.

Designed with a sleek, glassmorphic UI, TravelBuddy offers a premium user experience for wanderlust enthusiasts.

---

## ✨ Features

- **🗺️ Interactive Itinerary Builder**: Easily plan your day-by-day activities. Add cities and seamlessly drag & drop activities into your schedule.
- **🤖 Gemini AI Integration**: Get personalized, intelligent trip suggestions based on destination, duration, and preferences.
- **📍 Location Discovery**: Integrated with the **Google Maps API** to discover nearby tourist attractions and hidden gems for any stop in your itinerary.
- **🌍 Community Trips (Explore)**: Discover and join public itineraries created by the community. Features specialized search tailored to cities (e.g., Vadodara-centric local search).
- **👥 Collaboration**: Invite friends to view or join your trips using generated secure share links.
- **💰 Budget Analytics**: Track estimated and actual expenses by categories to keep your trip on budget.
- **🎒 Packing Checklist**: Smart tracking of what to bring on your adventures.
- **🎨 Glassmorphic Design**: Modern, highly responsive user interface with fluid animations built with Tailwind CSS & Motion.

---

## 🛠️ Tech Stack

### Frontend (`TravelBuddy-F`)
- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS & Vanilla CSS (for glassmorphism utility classes)
- **Routing**: React Router v7
- **Animations**: Motion (Framer Motion)
- **Maps**: Google Maps JS API (`@react-google-maps/api`)
- **Icons**: Lucide React
- **Drag & Drop**: React DnD

### Backend (`TravelBuddy-B`)
- **Server**: Node.js & Express.js
- **Database ORM**: Prisma
- **Database**: PostgreSQL (hosted on Supabase)
- **AI Integration**: Google Generative AI (`gemini-1.5-flash`)
- **Authentication**: JWT-based auth (Custom / Supabase integration)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A PostgreSQL Database (e.g., Supabase)
- Google Maps API Key
- Gemini API Key (Google AI Studio)

### 1. Clone & Structure
This repository contains two main directories:
- `/TravelBuddy-F` (Frontend)
- `/TravelBuddy-B` (Backend)

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd TravelBuddy-B
npm install
```

Create a `.env` file in the `TravelBuddy-B` folder:
```env
PORT=5000
DATABASE_URL="postgresql://your_db_url_here"
SUPABASE_JWT_SECRET="your_jwt_secret"
GEMINI_API_KEY="your_gemini_api_key"
GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

Initialize the database and start the server:
```bash
npx prisma db push
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../TravelBuddy-F
npm install
```

Create a `.env` file in the `TravelBuddy-F` folder:
```env
VITE_API_URL="http://localhost:5000/api/v1"
VITE_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

Start the frontend development server:
```bash
npm run dev
```

---

## 💡 How AI Suggestions Work
TravelBuddy utilizes the `gemini-1.5-flash` model. When a user requests an AI suggestion for their itinerary, the backend sends a structured prompt containing the destination, duration (days), and user preferences. The AI generates a comprehensive day-by-day JSON breakdown including sightseeing, food, adventure recommendations, and personalized travel tips which are instantly rendered in the UI.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
