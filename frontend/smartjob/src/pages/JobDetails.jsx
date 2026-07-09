import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJob, applyJob, saveJob } from "../services/api";

import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  const { popup, showPopup } = usePopup();

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    try {
      const res = await getJob(id);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      showPopup("Failed to load job details.", "error");
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);

      await applyJob(id, {});

      showPopup("Application submitted successfully!", "success");

      loadJob();
    } catch (err) {
      console.error(err.response?.data || err);

      if (err.response?.status === 400) {
        showPopup("You have already applied for this job.", "warning");
      } else if (err.response?.status === 401) {
        showPopup("Please login again.", "error");
      } else {
        showPopup("Application failed.", "error");
      }
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await saveJob({
        job_id: Number(id),
      });

      showPopup("Job saved successfully!", "success");
    } catch (err) {
      console.error(err.response?.data || err);

      if (err.response?.status === 400) {
        showPopup("Job already saved.", "warning");
      } else {
        showPopup("Failed to save job.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!job) {
    return (
      <div className="loading">
        Loading Job Details...
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <div className="job-banner">
        <h1>{job.title}</h1>

        <p>
          {job.company} • {job.location}
        </p>
      </div>

      <div className="job-details-card">
        <div className="job-info">
          <div className="info-box">
            <span>Company</span>
            <h3>{job.company}</h3>
          </div>

          <div className="info-box">
            <span>Location</span>
            <h3>{job.location}</h3>
          </div>

          <div className="info-box">
            <span>Salary</span>
            <h3>₹ {job.salary}</h3>
          </div>

          <div className="info-box">
            <span>Skills</span>
            <h3>{job.skills || "Not Mentioned"}</h3>
          </div>
        </div>

        <div className="description-card">
          <h2>Job Description</h2>

          <p>{job.description}</p>
        </div>

        <div className="job-actions">
          {job.has_applied ? (
            <button
              className="applied-btn"
              disabled
            >
              ✓ Already Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="apply-btn"
            >
              {applying ? "Applying..." : "Apply Now"}
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="save-btn"
          >
            {saving ? "Saving..." : "Save Job"}
          </button>
        </div>
      </div>
    </div>
  );
}