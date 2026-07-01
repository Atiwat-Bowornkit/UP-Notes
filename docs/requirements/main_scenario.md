Here is the Agile decomposition and INVEST analysis based on Nutthanon’s scenario.

## User Story 1: Course Code Search

**As a** university student, **I want** to search for study materials using a specific course code, **so that** I can instantly find relevant summary sheets without sifting through scattered links.

**INVEST Analysis:**

* **Independent:** Yes. The search function can be developed and released independently of filtering or rating systems.
* **Negotiable:** Yes. The team can discuss whether the search supports partial matches, autocomplete, or includes course names alongside codes.
* **Valuable:** High value. It directly solves the user's pain point of scattered, hard-to-find files.
* **Estimable:** Yes. Querying a database by a string (course code) is a standard, well-understood development task.
* **Small:** Yes. This is small enough to fit easily within a single sprint.
* **Testable:** Yes. Testers can input valid and invalid course codes to verify that the correct subset of documents is returned.

---

## User Story 2: Sorting by Popularity

**As a** university student, **I want** to sort search results by the highest number of likes, **so that** I can quickly identify the most useful and trusted study materials.

**INVEST Analysis:**

* **Independent:** Mostly independent, though it requires a basic list of documents to sort. It does not depend on how the documents are viewed.
* **Negotiable:** Yes. We can negotiate whether to use a "Like" button, a 5-star rating system, or an upvote/downvote mechanism.
* **Valuable:** Provides immediate value by addressing the user's uncertainty about content quality and accuracy.
* **Estimable:** Yes. Sorting an array of database objects by a specific integer field is straightforward.
* **Small:** Yes. Can be completed in a few days of development.
* **Testable:** Yes. Can be tested by verifying that the top results match the highest numerical value in the "likes" column.

---

## User Story 3: Quality Assurance via Reviews

**As a** university student, **I want** to read short review comments attached to a summary sheet, **so that** I can verify if the content is accurate and up-to-date with the current syllabus before spending time on it.

**INVEST Analysis:**

* **Independent:** Yes. The ability to fetch and display text comments on a document's detail page is a standalone feature.
* **Negotiable:** Yes. The team can negotiate character limits for comments, display order (newest vs. top-rated comments), and UI placement.
* **Valuable:** Solves the pain point of not knowing if community-shared files are factually correct or outdated.
* **Estimable:** Yes. Standard CRUD (Create, Read, Update, Delete) operations for text data.
* **Small:** Yes. Displaying read-only comments is a small effort.
* **Testable:** Yes. Ensure comments map to the correct document ID and render properly on the UI.

---

## User Story 4: Fast In-App Document Preview

**As a** mobile user on a limited cellular connection, **I want** to preview documents in a fast, mobile-optimized format directly within the app, **so that** I can read the content smoothly without waiting for large PDF files to download.

**INVEST Analysis:**

* **Independent:** Yes. Can be built independently of how the user searches for the document.
* **Negotiable:** Yes. The technical implementation is highly negotiable (e.g., rendering a lightweight web view, compressing PDFs on the server side, or converting text to native UI components).
* **Valuable:** High value. Directly eliminates the frustration of slow load times and heavy data usage.
* **Estimable:** Can be difficult to estimate depending on the variety of file formats uploaded by users (PDF, Word, images).
* **Small:** **No. This is likely an Epic.** Building a universal, fast-loading previewer that handles various file sizes and types across different mobile devices is a large undertaking.
* **Testable:** Yes. Can be tested by measuring load times on 3G/4G networks and verifying formatting.

### 💡 Epic Split Suggestion for Story 4:

To make Story 4 "Small" and actionable, it should be split into smaller, format-specific stories:

1. *As a student, I want to preview text-only (.txt or markdown) summaries instantly in the app.*
2. *As a student, I want the server to compress uploaded PDFs into lightweight images for fast mobile swiping.*
3. *As a student, I want a "lazy-loading" feature for large PDFs so that I can read the first page immediately while the rest loads in the background.*