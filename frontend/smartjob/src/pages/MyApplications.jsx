import { useEffect, useState } from "react";
import {
  getApplications,
  withdrawApplication,
} from "../services/api";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { popup, showPopup } = usePopup();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const res = await getApplications();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setApplications(data);
    } catch (err) {
      console.error(err);

      setApplications([]);
      showPopup("Failed to load applications.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (!confirmWithdraw) return;

    try {
      await withdrawApplication(id);

      showPopup(
        "Application withdrawn successfully.",
        "success"
      );

      loadApplications();
    } catch (err) {
      console.error(err);

      showPopup(
        err.response?.data?.error ||
          "Failed to withdraw application.",
        "error"
      );
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>
          My Applications
        </h1>

        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                backgroundColor: "#fff",
              }}
            >
              <h2 style={{ marginBottom: "10px" }}>
                {app.job_title}
              </h2>

              <p>
                <strong>Company:</strong> {app.company}
              </p>

              <p>
                <strong>Location:</strong> {app.location}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    display: "inline-block",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    backgroundColor:
                      app.status === "applied"
                        ? "#f59e0b"
                        : app.status === "shortlisted"
                        ? "#3b82f6"
                        : app.status === "selected"
                        ? "#22c55e"
                        : app.status === "rejected"
                        ? "#ef4444"
                        : "#6b7280",
                  }}
                >
                  {app.status.charAt(0).toUpperCase() +
                    app.status.slice(1)}
                </span>
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {app.applied_at
                  ? new Date(
                      app.applied_at
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

              {app.status !== "selected" && (
                <button
                  onClick={() => handleWithdraw(app.id)}
                  style={{
                    marginTop: "15px",
                    padding: "10px 18px",
                    backgroundColor: "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Withdraw Application
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}