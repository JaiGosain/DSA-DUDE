## DSA Dude

An interactive platform to learn and practice Data Structures & Algorithms with:

- **Visualizers** for arrays and other concepts
- **Quizzes** to test understanding
- **AI helpers** for explanations, hints, and code review
- **PDF Q&A tool** to ask questions on uploaded problem sheets and notes

---

### Project structure

- **`client/`**: React + Vite frontend (TailwindCSS, Framer Motion, React Router).
- **`server/`**: Node.js + Express backend (MongoDB via Mongoose, JWT auth, AI services).
- **`server/config/config.env`**: Environment variables (you should keep your own local copy and never commit real secrets).

---

### Tech stack

- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion, React Router, Three.js/@react-three/fiber
- **Backend**: Node.js, Express 5, MongoDB (Mongoose), JWT, Multer, PDF parsing
- **AI**: OpenAI / Gemini models (see environment variables)

---

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (ships with Node)
- **MongoDB** running locally or in the cloud

---

### Setup & installation

1. **Clone / open the project**
2. **Install root tools (optional)**:
   - This repo has a minimal root `package.json`; you can usually skip installing here.
3. **Install frontend dependencies**
   - Navigate to `client/` and run:

```bash
cd client
npm install
```

4. **Install backend dependencies**
   - Navigate to `server/` and run:

```bash
cd server
npm install
```

---

### Environment variables

In `server/config/config.env` (or a `.env` loaded by your env config), define the following keys with **your own values**:

- **`OPENAI_API_KEY`**: API key for OpenAI (if used).
- **`GEMINI_API_KEY`**: API key for Google Gemini (if used).
- **`MONGO_URI`**: Connection string to your MongoDB instance.
- **`PORT`**: Port for the backend server (e.g. `5000`).
- **`FRONTEND_URL`**: Frontend origin (e.g. `http://localhost:5173`).
- **`JWT_SECRET`**: Secret string used to sign JWT tokens.

Never commit real API keys or secrets to version control; use local `.env` files or a secure secrets manager.

---

### Running the app in development

1. **Start the backend**

```bash
cd server
npm start
```

By default this runs `nodemon server.js` and starts the API on the configured `PORT`.

2. **Start the frontend**

In a separate terminal:

```bash
cd client
npm run dev
```

Vite will start the dev server (typically on `http://localhost:5173`).

3. **Open the app**

Visit the frontend URL in your browser; make sure `FRONTEND_URL` in the backend config matches this origin.

---

### Key features (high level)

- **Authentication & user profiles**
  - Signup / login and JWT-based auth middleware.
  - User progress and saved problems persisted in MongoDB.

- **DSA visualizers**
  - Interactive visual tools (e.g. `ArrayVisualizer`) to understand algorithm behavior step by step.

- **Quiz engine**
  - Server-side quiz controllers and routes for DSA questions.
  - Frontend quiz pages with scoring and feedback.

- **Problem history & saved problems**
  - APIs and models for `ProblemHistory` and `SavedProblem` to track learning progress.

- **AI & PDF Q&A tools**
  - AI controllers/services using OpenAI/Gemini to:
    - Explain problems
    - Generate hints
    - Answer questions over uploaded PDFs (via `pdf-parse` and related controllers/services).

---

### Production build (frontend)

To create an optimized production build of the frontend:

```bash
cd client
npm run build
```

You can then serve the generated `dist/` folder with any static file server or integrate it behind a reverse proxy with the backend.

---

### Notes for contributors / future work

- **Security**: Move real secrets into environment variables and ensure `config.env` or `.env` files are git-ignored.
- **Docs**: Add detailed documentation per feature (Quizzes, Visualizers, AI helpers) under a `docs/` folder if the project grows.
- **Testing**: Consider adding automated tests for critical routes (auth, AI, and quiz endpoints).

