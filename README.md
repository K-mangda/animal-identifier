# Faunafy - AI-Powered Animal Identifier 🐾

Welcome to **Faunafy**, a modern, responsive web application built to identify animals from images using advanced AI. This project demonstrates proficiency in modern web development frameworks, AI integration, and user-centric UI/UX design. It is built as a showcase of front-end engineering skills and modern web development practices.

## 🌟 Key Features

- **AI-Powered Identification:** Leverages Google's Generative AI (Gemini) to accurately identify animals from uploaded images or camera captures.
- **Bilingual Support:** Seamlessly switch between English and Thai languages.
- **Local History & Favorites:** Automatically saves prediction history directly in the browser using `localforage` for a fast, database-free user experience. Users can also pin their favorite identifications.
- **Interactive & Animated UI:** Features a dynamic interface with smooth transitions, sliding panels, and a custom "Forest Decoration" background for a highly immersive experience.
- **Responsive Design:** Fully responsive layout with a Sidebar for desktop and a Bottom Navigation bar for mobile devices.
- **Error Handling & Rate Limiting:** Built-in safeguards for API rate limits and network errors with toast notifications.

## 🛠️ Technologies Used

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Version 16+)
- **Library:** [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** CSS Modules for scoped, modular styling.
- **AI Integration:** `@google/generative-ai`
- **Local Storage:** `localforage` (IndexedDB wrapper)
- **Icons:** `lucide-react`

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd animal-identifier
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## 📁 Project Structure

- `/app` - Next.js App Router containing the main pages and API routes (`/api/identify`).
- `/components` - Reusable UI components (Sidebar, BottomNav, UploadPanel, ResultPanel, HistoryPanel, SettingsPanel, ForestDecoration).
- `/lib` - Core logic and utilities, including the local history management (`history.ts`).
- `/types` - TypeScript type definitions (`animal.ts`).
- `/public` - Static assets.

## 🎯 Purpose

This project was developed to showcase my skills as a Front-end / Full-stack Developer, particularly in:
- Integrating external AI APIs into a web application.
- Managing complex component state and local storage in React.
- Building polished, accessible, and responsive user interfaces from scratch using CSS Modules.

---
*Created as a portfolio project for internship applications.*
