# ADR-001: Selection of Core Technology Stack

**Status:** Accepted

**Context:**
Our project, **Community Connector**, is a **web application** designed to facilitate accurate peer-to-peer knowledge sharing for **University students and lecturers**. We are a team of **4** students with existing experience in **JavaScript, React, and Python**. Our primary constraints are the project timeline (one semester) and the need for rapid prototyping and iteration to ensure the platform is usable within the current academic term.

**Decision:**
We have decided to adopt the following core technology stack:
- **Frontend:** React with Vite (for fast UI development and hot module replacement)
- **Backend:** Python with Flask (for simplicity, flexibility, and easy integration with data processing libraries)
- **Database:** PostgreSQL (for robust relational data management between users, notes, and course information)
- **Deployment:** Vercel for Frontend, Render/Heroku for Backend

**Consequences:**
* **Positive:**
  - The chosen stack aligns with our team's existing skills, significantly reducing the learning curve and allowing us to focus on delivering features faster.
  - PostgreSQL's relational structure is perfectly suited for managing the complex relationships between students, lecturers, study materials, and endorsement metrics.
  - The React component model will allow us to create reusable UI elements, ensuring consistency throughout the platform.
* **Negative:**
  - By not choosing a full-stack framework like Next.js, we must manage the frontend and backend deployments separately and handle CORS configurations manually.
  - Using free tiers on Vercel/Render may lead to performance limitations (e.g., 'cold starts') that we need to mitigate or be aware of during final presentations.