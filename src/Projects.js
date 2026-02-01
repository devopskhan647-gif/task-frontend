import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const role = localStorage.getItem("role"); // Admin or User

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName) return alert("Project name is required");

    try {
      const res = await API.post("/projects", {
        name: newProjectName,
        description: newProjectDesc,
      });

      setProjects(prev => [...prev, res.data]);
      setNewProjectName("");
      setNewProjectDesc("");
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 40 }}>Projects</h2>

      {role === "admin" && (
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              borderRadius: 8,
              border: "none",
              backgroundColor: "#667eea",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            + Create Project
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
        }}
      >
        {projects.map(p => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            style={{
              textDecoration: "none",
              color: "#333",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 500,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.1)";
            }}
          >
            {p.name}
          </Link>
        ))}
      </div>

      {/* Modal for creating project */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: 30, borderRadius: 12, width: 400 }}>
            <h3 style={{ marginBottom: 20 }}>Create Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 15,
                borderRadius: 5,
                border: "1px solid #ccc",
              }}
            />
            <textarea
              placeholder="Description"
              value={newProjectDesc}
              onChange={e => setNewProjectDesc(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 15,
                borderRadius: 5,
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ marginRight: 10, padding: "8px 15px", borderRadius: 5, border: "none", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                style={{
                  padding: "8px 15px",
                  borderRadius: 5,
                  border: "none",
                  backgroundColor: "#667eea",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
