import { useEffect, useState } from "react";
import axios from "axios";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function JobseekerDashboard() {
  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("access");
  const { popup, showPopup } = usePopup();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/applications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setApplications(data);

      if (data.length === 0) {
        showPopup("No applications found.", "warning");
      } else {
        showPopup("Applications loaded successfully.", "success");
      }
    } catch (err) {
      console.error(err);
      setApplications([]);
      showPopup("Failed to load applications.", "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Popup
        message={popup.message}
        type={popup.type}
        show={popup.show}
      />

      <h2>👤 My Applications Dashboard</h2>

      {applications.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{app.job_title || "Job Application"}</h3>

            <p>
              <b>Status:</b> {app.status}
            </p>

            <p>
              <b>Applied On:</b>{" "}
              {app.applied_at
                ? new Date(app.applied_at).toLocaleString()
                : "N/A"}
            </p>

            <span
              style={{
                padding: "5px 10px",
                borderRadius: "5px",
                background:
                  app.status === "selected"
                    ? "green"
                    : app.status === "rejected"
                    ? "red"
                    : app.status === "shortlisted"
                    ? "blue"
                    : "orange",
                color: "white",
              }}
            >
              {app.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}