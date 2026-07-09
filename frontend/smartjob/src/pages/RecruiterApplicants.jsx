import { useEffect, useState } from "react";
import axios from "axios";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function RecruiterApplicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { popup, showPopup } = usePopup();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://127.0.0.1:8000/api/applications/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setApplications(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error(err);
      showPopup("Failed to load applicants.", "error");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/applications/${id}/update_status/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      showPopup(
        `Application ${status === "shortlisted" ? "shortlisted" : "rejected"} successfully.`,
        "success"
      );

      fetchData();
    } catch (err) {
      console.error(err);
      showPopup("Failed to update application status.", "error");
    }
  };

  if (loading) {
    return (
      <>
        <Popup
          show={popup.show}
          message={popup.message}
          type={popup.type}
        />
        <h2 style={{ textAlign: "center" }}>Loading...</h2>
      </>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h2>Applicants</h2>

      {applications.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "15px",
              padding: "15px",
              background: "#fff",
            }}
          >
            <p>
              <strong>Name:</strong> {app.candidate}
            </p>

            <p>
              <strong>Email:</strong> {app.email}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    app.status === "selected"
                      ? "green"
                      : app.status === "shortlisted"
                      ? "blue"
                      : app.status === "rejected"
                      ? "red"
                      : "orange",
                  fontWeight: "bold",
                }}
              >
                {app.status}
              </span>
            </p>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => updateStatus(app.id, "shortlisted")}
              >
                ⭐ Shortlist
              </button>

              <button
                onClick={() => updateStatus(app.id, "rejected")}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}