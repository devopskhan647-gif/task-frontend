import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const role = localStorage.getItem("role"); // admin | user
  const userId = parseInt(localStorage.getItem("user_id"));

  // Task modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [users, setUsers] = useState([]);

  /* ================= API CALLS ================= */

  const fetchProject = useCallback(async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchProject();
    if (role === "admin") {
      fetchUsers();
    }
  }, [fetchProject, fetchUsers, role]);

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      setProject(prev => ({
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === taskId ? { ...t, status } : t
        )
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !taskAssignedTo || !taskDueDate) {
      return alert("All required fields are mandatory");
    }

    try {
      const res = await API.post("/tasks", {
        project_id: project.id,
        title: taskTitle,
        description: taskDesc,
        assigned_to: taskAssignedTo,
        status: "TODO",
        priority: taskPriority,
        due_date: taskDueDate
      });

      setProject(prev => ({
        ...prev,
        tasks: [...prev.tasks, res.data.task ?? res.data]
      }));

      setShowTaskModal(false);
      setTaskTitle("");
      setTaskDesc("");
      setTaskAssignedTo("");
      setTaskPriority("MEDIUM");
      setTaskDueDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Task create failed");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/${taskId}`);
      setProject(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId)
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const deleteProject = async () => {
    if (!window.confirm("Delete project with all tasks?")) return;

    try {
      await API.delete(`/projects/${project.id}`);
      navigate("/projects");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  /* ================= UI ================= */

  if (!project) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading...</p>;
  }

  const visibleTasks =
    role === "admin"
      ? project.tasks
      : project.tasks.filter(t => t.assigned_to === userId);

  const statusColors = {
    TODO: "#f0ad4e",
    IN_PROGRESS: "#5bc0de",
    DONE: "#5cb85c",
    OVERDUE: "#d9534f"
  };

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center" }}>{project.name}</h2>

      {role === "admin" && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button
            onClick={() => setShowTaskModal(true)}
            style={{ marginRight: 10, padding: 8 }}
          >
            + Add Task
          </button>
          <button
            onClick={deleteProject}
            style={{ padding: 8, background: "#d9534f", color: "#fff" }}
          >
            Delete Project
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))" }}>
        {visibleTasks.map(t => (
          <div key={t.id} style={{ padding: 20, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}>
            <h4>{t.title}</h4>
            <p>{t.description}</p>

            <span style={{
              padding: "4px 8px",
              background: statusColors[t.status],
              color: "#fff",
              borderRadius: 4,
              fontSize: 12
            }}>
              {t.status}
            </span>

            {(role === "admin" || t.assigned_to === userId) && (
              <select
                value={t.status}
                onChange={e => updateStatus(t.id, e.target.value)}
                style={{ width: "100%", marginTop: 10 }}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
            )}

            {role === "admin" && (
              <button
                onClick={() => deleteTask(t.id)}
                style={{ marginTop: 20, width: "35%", background: "#d9534f", color: "#fff" }}
              >
                Delete Task
              </button>
            )}
          </div>
        ))}
      </div>

      {showTaskModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            padding: 30,
            width: 400,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            gap: 15
          }}>
            <h3 style={{ textAlign: "center" }}>Add Task</h3>

            <input placeholder="Title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
            <textarea placeholder="Description" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />

            <select value={taskAssignedTo} onChange={e => setTaskAssignedTo(e.target.value)}>
              <option value="">Assign to</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>

            <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleCreateTask}>Create</button>
              <button onClick={() => setShowTaskModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
