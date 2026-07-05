# Faunafy - AI-Powered Animal Identifier 🐾

*([🇹🇭 คลิกที่นี่เพื่ออ่านฉบับภาษาไทย (Thai Version)](#-faunafy---แอปพลิเคชันระบุสายพันธุ์สัตว์ด้วย-ai-🐾))*

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

<br/><br/>

---

# 🇹🇭 Faunafy - แอปพลิเคชันระบุสายพันธุ์สัตว์ด้วย AI 🐾

ยินดีต้อนรับสู่ **Faunafy** เว็บแอปพลิเคชันสมัยใหม่ที่สร้างขึ้นเพื่อระบุสายพันธุ์สัตว์จากรูปภาพโดยใช้ AI ขั้นสูง โปรเจกต์นี้แสดงให้เห็นถึงความเชี่ยวชาญในเฟรมเวิร์กการพัฒนาเว็บสมัยใหม่ การเชื่อมต่อ API ของ AI และการออกแบบ UI/UX ที่เน้นผู้ใช้เป็นศูนย์กลาง สร้างขึ้นเพื่อเป็นผลงานแสดงทักษะทางด้าน Front-end Engineering และแนวทางการพัฒนาเว็บสมัยใหม่

## 🌟 ฟีเจอร์เด่น (Key Features)

- **AI-Powered Identification:** ใช้ Generative AI ของ Google (Gemini) เพื่อระบุสายพันธุ์สัตว์จากรูปภาพที่อัปโหลดหรือถ่ายจากกล้องได้อย่างแม่นยำ
- **Bilingual Support:** รองรับการสลับภาษาใช้งานระหว่างภาษาอังกฤษและภาษาไทยได้อย่างราบรื่น
- **Local History & Favorites:** บันทึกประวัติการทำนายผลโดยอัตโนมัติลงในเบราว์เซอร์ด้วย `localforage` เพื่อประสบการณ์การใช้งานที่รวดเร็วโดยไม่ต้องพึ่งพาฐานข้อมูล (Database-free) ผู้ใช้ยังสามารถปักหมุดรายการโปรดได้อีกด้วย
- **Interactive & Animated UI:** อินเทอร์เฟซแบบไดนามิกพร้อมการเปลี่ยนผ่าน (Transitions) ที่นุ่มนวล แผงควบคุมแบบเลื่อน (Sliding panels) และพื้นหลัง "ป่าไม้" แบบกำหนดเองเพื่อประสบการณ์ที่สมจริงยิ่งขึ้น
- **Responsive Design:** รูปแบบที่รองรับทุกขนาดหน้าจอ พร้อม Sidebar สำหรับหน้าจอคอมพิวเตอร์ และ Bottom Navigation สำหรับอุปกรณ์มือถือ
- **Error Handling & Rate Limiting:** มีระบบป้องกันและจัดการข้อผิดพลาดจาก API rate limits และปัญหาขัดข้องทางเครือข่าย พร้อมการแจ้งเตือนแบบ Toast (ป๊อปอัปแจ้งเตือน)

## 🛠️ เทคโนโลยีที่ใช้ (Technologies Used)

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Version 16+)
- **Library:** [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** CSS Modules สำหรับจัดการสไตล์แบบโมดูล
- **AI Integration:** `@google/generative-ai`
- **Local Storage:** `localforage` (ครอบ IndexedDB)
- **Icons:** `lucide-react`

## 🚀 เริ่มต้นการใช้งาน (Getting Started)

ทำตามขั้นตอนเหล่านี้เพื่อรันโปรเจกต์ในเครื่องของคุณ

### สิ่งที่ต้องมีเบื้องต้น (Prerequisites)
- Node.js (แนะนำเวอร์ชัน 18 ขึ้นไป)
- npm, yarn, pnpm, หรือ bun

### การติดตั้ง (Installation)

1. **โคลน Repository (Clone the repository):**
   ```bash
   git clone <repository-url>
   cd animal-identifier
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   # หรือ
   yarn install
   # หรือ
   pnpm install
   ```

3. **ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables):**
   สร้างไฟล์ `.env.local` ในโฟลเดอร์ root ของโปรเจกต์ และใส่ API key ของ Google Gemini ของคุณ:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **รันเซิร์ฟเวอร์สำหรับการพัฒนา (Run development server):**
   ```bash
   npm run dev
   ```

5. เปิด [http://localhost:3000](http://localhost:3000) ด้วยเบราว์เซอร์ของคุณเพื่อดูผลลัพธ์

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

- `/app` - Next.js App Router ซึ่งประกอบไปด้วยหน้าหลักและ API routes (`/api/identify`)
- `/components` - คอมโพเนนต์ UI ที่ถูกแยกไว้เพื่อให้สามารถนำกลับมาใช้ใหม่ได้ (Sidebar, BottomNav, UploadPanel, ResultPanel, HistoryPanel, SettingsPanel, ForestDecoration)
- `/lib` - ลอจิกหลักและฟังก์ชันช่วยเหลือ (Utilities) รวมถึงการจัดการประวัติการใช้งานแบบ local (`history.ts`)
- `/types` - นิยามชนิดข้อมูล TypeScript (`animal.ts`)
- `/public` - ไฟล์รูปภาพหรือ Asset ต่างๆ (Static assets)

## 🎯 จุดประสงค์ (Purpose)

โปรเจกต์นี้ได้รับการพัฒนาขึ้นเพื่อแสดงทักษะของฉันในฐานะ Front-end / Full-stack Developer โดยเน้นไปที่:
- การเชื่อมต่อและนำ external AI APIs มาประยุกต์ใช้ในเว็บแอปพลิเคชัน
- การจัดการ State ของคอมโพเนนต์ที่ซับซ้อนและการใช้งาน local storage ใน React
- การสร้าง UI ที่ดูสวยงาม ทันสมัย เข้าถึงง่าย และรองรับทุกขนาดหน้าจอโดยเริ่มเขียนจากศูนย์โดยใช้ CSS Modules

---
*จัดทำขึ้นเพื่อใช้เป็นโปรเจกต์ผลงาน (Portfolio) สำหรับการยื่นสมัครฝึกงาน*
