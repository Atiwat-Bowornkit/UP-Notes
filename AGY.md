```markdown
# AI Developer Instruction: UP-Notes Project

## 1. Role & Objective
You are an expert Senior Full-Stack Software Engineer. Your objective is to build a complete Next.js web application named "UP-Notes" based on the specifications in this document. Execute the tasks step-by-step, ensuring clean, modular, and type-safe code.

## 2. Project Overview
- **Project Name:** UP-Notes
- **Description:** A centralized note-sharing platform for university students. It allows users to upload, search, download, and like study summaries (PDF/Images) categorized by subject codes and academic years.
- **Tech Stack:**
  - **Framework:** Next.js (App Router) with TypeScript
  - **Styling:** Tailwind CSS, shadcn/ui (or Lucide React for icons)
  - **Database & ORM:** PostgreSQL (via Supabase), Prisma ORM
  - **Authentication:** Supabase Auth (Email/Password)
  - **Storage:** Supabase Storage (for PDF and Image uploads)

## 3. Database Schema (Prisma)
Initialize Prisma and use the following `schema.prisma`.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid()) // Maps to Supabase Auth UUID
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  notes     Note[]
  likes     Like[]
  reports   Report[]
  createdAt DateTime @default(now())
}

model Note {
  id            String   @id @default(cuid())
  subjectCode   String
  subjectName   String
  description   String?
  yearCategory  String   // e.g., "Year 1", "Year 2", "Year 3", "Year 4", "GE"
  fileUrl       String
  fileType      String   // "pdf", "image"
  viewCount     Int      @default(0)
  downloadCount Int      @default(0)
  uploaderId    String
  uploader      User     @relation(fields: [uploaderId], references: [id], onDelete: Cascade)
  likes         Like[]
  reports       Report[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Like {
  userId    String
  noteId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  note      Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@id([userId, noteId]) // Prevent duplicate likes
}

model Report {
  id        String   @id @default(cuid())
  reason    String
  noteId    String
  note      Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}

```

## 4. Application Architecture & Routes

Generate the following folder structure and routing using the Next.js App Router paradigm.

### 4.1 Public Routes (Accessible without login)

* `app/page.tsx`: Home page. Must include a Hero section, Global Search Bar (partial match on subjectCode/Name), Year Category quick-filter buttons, and a "Top Rated" note cards grid.
* `app/explore/page.tsx`: Explore page. Displays a grid of note cards with advanced sidebar filters (Year, Sort by Likes, Sort by Date).
* `app/note/[id]/page.tsx`: Note Detail page. Features a document preview (iframe for PDF, img for images), file metadata, Uploader name, Like button, Download button, and Report button.
* `app/login/page.tsx`: Authentication page using Supabase Auth (Email/Password registration and login).

### 4.2 Protected Routes (Require User Authentication)

* `app/upload/page.tsx`: Form to upload a note. Fields: Subject Code, Subject Name, Year Category (Dropdown), Description, File Input. Must validate file type (PDF/PNG/JPG) and size (<10MB) before uploading to Supabase Storage.
* `app/profile/page.tsx`: User dashboard containing two tabs: "My Uploads" (with Edit/Delete actions) and "My Favorites" (Liked notes).

### 4.3 Admin Routes (Require `ADMIN` Role)

* `app/admin/page.tsx`: Admin dashboard displaying total statistics (users, notes) and a Moderation Queue table fetching from the `Report` model. Includes actions to Delete Note or Ban (Delete) User.

### 4.4 API Routes (Route Handlers)

* `app/api/notes/route.ts`: `GET` (Search/Filter), `POST` (Create note metadata).
* `app/api/notes/[id]/route.ts`: `GET` (Fetch single), `DELETE` (Delete note & file from storage).
* `app/api/notes/[id]/like/route.ts`: `POST` (Toggle like status).
* `app/api/notes/[id]/view/route.ts`: `POST` (Increment `viewCount`).
* `app/api/notes/[id]/download/route.ts`: `POST` (Increment `downloadCount`).
* `app/api/reports/route.ts`: `POST` (Submit a report), `GET` (Fetch reports for admin).

## 5. Execution Steps

Please execute the project scaffolding and development in the following order:

1. **Initialization:** Initialize Next.js, install Tailwind CSS, Prisma, and Supabase client.
2. **Database Setup:** Create the `schema.prisma` file, format it, and prompt the user to run `npx prisma db push`.
3. **Core Library & Utilities:** Set up Supabase client utility (`lib/supabase.ts`) and Prisma client utility (`lib/prisma.ts`).
4. **UI Shell:** Build the global layout, Navigation Bar (Navbar with Login/Profile/Upload links), and Footer.
5. **Authentication:** Implement the Login/Register page and route protection middleware.
6. **Core Features (Backend):** Implement API route handlers for Notes and Upload to Supabase Storage.
7. **Core Features (Frontend):** Build the Upload Form, Home Page, and Explore Page.
8. **Detail & Interaction:** Build the Note Detail page, Like system, and Download counters.
9. **Admin Panel:** Build the Admin Dashboard and Report system.

```

```