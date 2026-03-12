## DSA Dude Frontend (`client`)

This is the **React + Vite** frontend for the DSA Dude project. It provides the user interface for:

- **Landing and onboarding**
- **Authentication flows**
- **DSA visualizers**
- **Quizzes and progress tracking**
- **AI helpers and PDF Q&A tools**

---

### Tech stack

- **React 19** with **Vite**
- **React Router** for client-side routing
- **TailwindCSS** for styling and layout
- **Framer Motion** and **motion** for animations
- **Three.js / @react-three/fiber / @react-three/drei** for 3D and visualizations
- **Axios** for talking to the backend API
- **React Hot Toast** for notifications

---

### Scripts

- **`npm run dev`**: Start the Vite dev server.
- **`npm run build`**: Create an optimized production build.
- **`npm run preview`**: Preview the production build locally.
- **`npm run lint`**: Run ESLint on the codebase.

---

### Getting started

From the `client` directory:

```bash
npm install
npm run dev
```

The app will start on the default Vite port (usually `http://localhost:5173`). Make sure the backend server is running and that its CORS/`FRONTEND_URL` settings allow this origin.

---

### Project layout (high level)

- **`src/App.jsx`**: Root application component and routing shell.
- **`src/components/`**: Reusable UI components (navbar, theme toggle, activity calendar, etc.).
- **`src/pages/`**: Top-level pages (landing, auth, quizzes, visualizers, dashboards, etc.).
- **`src/context/`**: Context providers such as authentication.
- **`src/api/`**: API helper(s) for communicating with the backend.
- **`src/utils/` and `src/visualizers/`**: Utility logic and DSA visualizer components.

For backend configuration and overall project documentation, see the main `README.md` in the project root.
