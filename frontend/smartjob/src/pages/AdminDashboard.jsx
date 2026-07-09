import { useEffect, useState } from "react";
import axios from "axios";

import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_applications: 0,
    active_jobs: 0,
  });

  const [loading, setLoading] = useState(true);

  // Popup Hook
  const { popup, showPopup } = usePopup();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/analytics/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.log("Admin stats error:", err);

      showPopup(
        "Failed to load dashboard data. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading dashboard...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Popup */}
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* Total Jobs */}
        <div style={cardStyle}>
          <h2>{stats.total_jobs}</h2>
          <p>Total Jobs</p>
        </div>

        {/* Total Applications */}
        <div style={cardStyle}>
          <h2>{stats.total_applications}</h2>
          <p>Total Applications</p>
        </div>

        {/* Active Jobs */}
        <div style={cardStyle}>
          <h2>{stats.active_jobs}</h2>
          <p>Active Jobs</p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const cardStyle = {
  width: "200px",
  padding: "20px",
  background: "#2563eb",
  color: "white",
  borderRadius: "10px",
  textAlign: "center",
  fontWeight: "bold",
};