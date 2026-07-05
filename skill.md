# Skills Demonstrated in This Project

โปรเจกต์นี้แสดงให้เห็นถึงทักษะ (Skills) ระดับมืออาชีพดังต่อไปนี้ เหมาะสำหรับนำไปอ้างอิงใน Portfolio / Resume:

### 1. Modern Frontend Development
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Language:** TypeScript — Type Safety, Interfaces, Generic Types
- **Component Design:** Reusable components, separation of concerns

### 2. Generative AI & Prompt Engineering
- **Model:** Google Gemini 1.5 Flash (Vision / Multimodal)
- **Integration:** `@google/generative-ai` SDK
- **Structured Output:** การเขียน Prompt ควบคุมให้ AI ตอบกลับเป็น JSON ที่มีโครงสร้างชัดเจน พร้อม fields ครบถ้วน
- **Dynamic MIME handling:** รองรับไฟล์ภาพหลายรูปแบบ (JPEG, PNG, WEBP)

### 3. Secure API Architecture
- **Backend/API:** Next.js Route Handlers (`app/api/identify/route.ts`)
- **Security:** API Key ถูกซ่อนไว้ฝั่ง Server-side อย่างสมบูรณ์ — ไม่มีการส่ง Key ไปยัง Browser

### 4. Responsive UI/UX Design (Mobile-First)
- **Styling:** Vanilla CSS — CSS Variables, Flexbox, CSS Grid
- **Mobile-First:** Layout ออกแบบให้รองรับมือถือเป็นอันดับแรก ขยายไปยัง Tablet และ Desktop
- **Adaptive Navigation:** Bottom Navigation Bar บนมือถือ, Sidebar บน Desktop
- **Aesthetics:** Dark Tech Theme, Glassmorphism, CSS Animations (Scan Line, Float, Pulse, Fade)

### 5. Browser & Device APIs
- **Drag-and-Drop:** HTML5 Drag & Drop API สำหรับ Upload ไฟล์
- **Camera API:** `capture="environment"` — เปิดกล้องหลังของมือถือโดยตรง (ไม่ต้องใช้ Library เพิ่ม)
- **FileReader API:** แปลงไฟล์ภาพเป็น Base64 ก่อนส่งไป API

### 6. SEO & Web Standards
- **Metadata API:** Next.js Metadata สำหรับ Title, Description, Keywords, Open Graph
- **Viewport Config:** Proper mobile viewport configuration
- **Semantic HTML:** ใช้ `<main>`, `<aside>`, `<nav>`, `<section>`, `<footer>`
- **Accessibility (a11y):** `aria-label`, `role`, `tabIndex`, `alt` attributes ครบถ้วน
