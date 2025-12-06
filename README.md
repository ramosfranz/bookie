# Bookie

**Bookie** is a web-based reading platform that allows users to manage, track, and explore books across leisure and research collections. It features an AI librarian for intelligent recommendations and interactions, user profiles with customizable avatars, and a clean, interactive library interface.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

- User authentication and profile management (Supabase Auth)
- Customizable avatar builder
- Leisure and research book collections
- Favorites and pinned books
- AI librarian integration for recommendations
- Library UI with toggles between leisure and study collections
- Responsive design for desktop and mobile
- Access control: only authenticated users can access dashboards
- Real-time chat system (front-end built; AI librarian integrated)

---

## Tech Stack

**Frontend:**
- React with TypeScript
- Next.js (app & API routes)
- Tailwind CSS for styling

**Backend & Database:**
- Supabase (PostgreSQL, Auth)
- Supabase Realtime for chat (front-end only in this version)

**Authentication:**
- Supabase Auth

**Deployment:**
- Vercel

**Other Libraries & Tools:**
- Lucide React for icons
- Next/Image for optimized images
- JSONB for storing structured data in Supabase
- Custom components: Sidebar, LeisureLibrary, ResearchLibrary, AvatarBuilder

