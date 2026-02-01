import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components imports (make sure these file names match exactly)
import Login from "./Login";
import Projects from "./Projects";
import ProjectDetails from "./ProjectDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Projects list page */}
        <Route path="/projects" element={<Projects />} />

        {/* Project details page */}
        <Route path="/projects/:id" element={<ProjectDetails />} />

        {/* Optional: Catch-all route for 404 */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: 50 }}>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
