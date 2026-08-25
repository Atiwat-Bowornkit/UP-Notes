# ADR-001: Selection of Core Technology Stack

**Status:** Accepted

**Context:**
Our project, UP-Notes, is a web application for university students to view and manage course summary files. We are a team of students with existing experience in HTML, CSS (Flexbox, Grid), modern JavaScript/TypeScript, Next.js, Tailwind CSS, Docker, and Git. Our primary constraints are the project timeline (one semester) and the need for rapid prototyping and iteration.

**Decision:**
We have decided to adopt the following core technology stack:
- **Frontend:** React with Vite (for fast UI development and hot module replacement)
- **Backend:** Python with Flask (for simplicity, flexibility, and easy integration with data processing libraries)
- **Database:** PostgreSQL (for robust relational data management between users, notes, and course information)
- **Deployment:** Vercel for Frontend, Render/Heroku for Backend

**Consequences:**
*   **Positive:**
    - The chosen stack aligns with our team's existing skills, reducing the learning curve and accelerating initial development.
    - The chosen stack aligns with our team's existing skills, significantly reducing the learning curve and allowing us to focus on delivering features faster.
    - PostgreSQL's relational structure is perfectly suited for managing the complex relationships between students, lecturers, study materials, and endorsement metrics.
*   **Negative:**
    - By not choosing a full-stack framework like Next.js, we must manage the frontend and backend deployments separately and handle CORS configurations manually.
    - Using free tiers on Vercel/Render may lead to performance limitations (e.g., 'cold starts') that we need to mitigate or be aware of during final presentations.