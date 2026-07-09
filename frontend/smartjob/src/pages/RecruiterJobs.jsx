import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";
import {
  getRecruiterJobs,
  deleteJob,
} from "../services/api";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { popup, showPopup } = usePopup();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const res = await getRecruiterJobs();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setJobs(data);
    } catch (err) {
      console.error("Error loading jobs:", err);
      setJobs([]);
      showPopup("Failed to load jobs.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(id);

      setJobs((prev) => prev.filter((job) => job.id !== id));

      showPopup("Job deleted successfully.", "success");
    } catch (err) {
      console.error(err);
      showPopup("Failed to delete job.", "error");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <Popup
          show={popup.show}
          message={popup.message}
          type={popup.type}
        />
        <h2>Loading Jobs...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h1>My Posted Jobs</h1>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{job.title}</h2>

            <p>
              <strong>Company:</strong> {job.company}
            </p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <p>
              <strong>Salary:</strong> ₹{job.salary}
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginTop: "15px",
              }}
            >
              <Link
                to={`/recruiter/edit-job/${job.id}`}
                style={{
                  textDecoration: "none",
                  color: "#2563eb",
                  fontWeight: "600",
                }}
              >
                ✏️ Edit
              </Link>

              <button
                onClick={() => handleDelete(job.id)}
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: "6px",
                }}
              >
                🗑 Delete
              </button>

              <Link
                to={`/recruiter/job/${job.id}/applications`}
                style={{
                  textDecoration: "none",
                  color: "#16a34a",
                  fontWeight: "600",
                }}
              >
                👥 View Applicants
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}