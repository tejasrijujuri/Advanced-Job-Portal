import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    applications: 0,
    saved: 0,
    interviews: 0,
  });

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/applications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apps = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setStats((prev) => ({
        ...prev,
        applications: apps.length,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>👋 Job Seeker Dashboard</h1>

      {/* STATS CARDS */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        <div style={cardStyle}>
          <h2>{stats.applications}</h2>
          <p>Applications</p>
        </div>

        <div style={cardStyle}>
          <h2>{stats.saved}</h2>
          <p>Saved Jobs</p>
        </div>

        <div style={cardStyle}>
          <h2>{stats.interviews}</h2>
          <p>Interviews</p>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div style={{ marginTop: "40px" }}>
        <h2>Quick Actions</h2>

        <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>

          <Link to="/dashboard/jobs" style={btnStyle}>
            🔍 Browse Jobs
          </Link>

          <Link to="/dashboard/applications" style={btnStyle}>
            📄 My Applications
          </Link>

          <Link to="/dashboard/saved-jobs" style={btnStyle}>
            ⭐ Saved Jobs
          </Link>

          <Link to="/dashboard/profile" style={btnStyle}>
            👤 Profile
          </Link>

        </div>
      </div>

    </div>
  );
}

/* Styles */
const cardStyle = {
  padding: "20px",
  borderRadius: "10px",
  background: "#f3f4f6",
  minWidth: "150px",
  textAlign: "center",
};

const btnStyle = {
  padding: "10px 15px",
  background: "#2563eb",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
};