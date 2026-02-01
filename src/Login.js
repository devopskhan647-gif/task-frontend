import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });

      // Save token, role, and user_id to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);      // <-- fixed
      localStorage.setItem("user_id", res.data.user.id);

      setError("");
      navigate("/projects");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Task & Project Management System</h2>
        <p style={styles.subtitle}>Welcome! Please login to continue</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #667eea, #764ba2)",
  },
  card: {
    width: 350,
    padding: 30,
    borderRadius: 12,
    backgroundColor: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    marginBottom: 20,
    color: "#666",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#667eea",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  error: {
    marginTop: 15,
    color: "red",
    fontSize: 14,
  },
};
