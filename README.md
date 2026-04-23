# 📦 EdBox: A simple library for my dad

I built this because my dad needed a clean way to share course materials with his students without the mess of Google Drive or the complexity of a full LMS. 

It’s a minimalist "Digital Library" where he can drop PDFs into folders from his phone, and his students can find them instantly. No ads, no tracking, just the lessons.

## Why I built it this way

### **1. The "1337" Aesthetic**
Coming from 1337, I’m obsessed with clean, high-contrast UIs. I used a **Zinc/Monochrome** theme with a subtle grainy texture to make it feel like "premium digital paper." It’s designed to be fast and distraction-free.

### **2. Tech that stays out of the way**
I didn't want a heavy backend or unnecessary complexity.
* **Next.js 15 & Server Actions:** The whole site has zero API routes. Everything happens on the server, which makes it feel incredibly snappy.
* **Supabase:** I used it for the database and file storage because it handles the heavy lifting of PDF hosting effortlessly.
* **Custom Auth:** Since it's just for my dad, I built a custom password-protected dashboard using Middleware and cookies. No need for complex OAuth—just one secret code to enter his workspace.

### **3. Smart File Management**
The folder system is recursive. You can put a folder inside a folder inside a folder—just like a real filing cabinet. If he deletes a folder, the database automatically cleans up all the files inside it so the storage stays tidy.
<img width="1444" height="831" alt="Screenshot From 2026-04-23 19-39-25" src="https://github.com/user-attachments/assets/2ccea887-1249-453f-b7f1-1f6a136c179b" />
<img width="1444" height="831" alt="Screenshot From 2026-04-23 19-39-45" src="https://github.com/user-attachments/assets/adc61b9d-a502-41b4-8677-613ba3d1b5dc" />

## How to use it

1.  **Clone it:** `git clone ...`
2.  **Environment:** Grab your Supabase keys and set an `ADMIN_PASSWORD` in your `.env.local`.
3.  **Run it:** `npm run dev`
4.  **Admin:** Go to `/dashboard` to start uploading.
5.  **Students:** They just visit the home page—no login required.

## About me
I’m **Soukaina**, a final-year student at **1337 Coding School**. I love building tools that solve real-world problems (and when I'm not coding, I'm usually out trail running or baking bread).
