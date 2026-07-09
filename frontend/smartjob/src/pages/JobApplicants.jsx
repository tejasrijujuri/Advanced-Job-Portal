import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getApplications,
  getJobApplications,
  updateApplicationStatus,
  getCandidateProfile,
} from "../services/api";

import CandidateProfileModal from "../components/CandidateProfileModal";
import ScheduleInterviewModal from "../components/ScheduleInterviewModal";

export default function JobApplicants() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const [profileData, setProfileData] = useState(null);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const { popup, showPopup } = usePopup();

  useEffect(() => {
    loadApplications();
  }, [id]);

 async function loadApplications() {
  try {
    setLoading(true);

    let res;

    if (id) {
      res = await getJobApplications(id);
    } else {
      res = await getApplications();
    }

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.results || [];

    setApplications(data);
  } catch (err) {
    console.error(err);

    showPopup("Failed to load applicants.", "error");
  } finally {
    setLoading(false);
  }
}
  async function handleViewProfile(appId) {
  try {
    const res = await getCandidateProfile(appId);

    setProfileData(res.data);
    setScheduleOpen(false);
    setProfileOpen(true);

  } catch (err) {
    console.error(err);

    showPopup("Unable to load candidate profile.", "error");
  }
}

  function handleSchedule(appId) {
    setProfileOpen(false);
    setSelectedAppId(appId);
    setScheduleOpen(true);
  }

  const quickStatusUpdate = async (appId, status) => {
  try {
    await updateApplicationStatus(appId, { status });

    if (status === "rejected") {
      setApplications((prev) =>
        prev.filter((app) => app.id !== appId)
      );

      showPopup("Application rejected.", "success");
      return;
    }

    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status } : app
      )
    );

    showPopup(`Application marked as ${status}.`, "success");

  } catch (err) {
    console.error(err);

    showPopup("Failed to update application status.", "error");
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case "shortlisted":
        return "blue";
      case "selected":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
  <div
    style={{
      padding: 20,
      background: "#f7f7f7",
      minHeight: "100vh",
    }}
  >
    <Popup
      show={popup.show}
      message={popup.message}
      type={popup.type}
    />

    <h2 style={{ marginBottom: 20 }}>Job Applicants</h2>

      {applications.map((app) => {
        const interview = app.interviews?.[0];

        return (
          <div
  key={app.id}
  style={{
    background: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  }}
>
  {/* HEADER */}
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <div>
      <h3 style={{ margin: 0 }}>{app.candidate}</h3>

      <p style={{ margin: "4px 0", color: "#666" }}>
        {app.email}
      </p>

      <p style={{ margin: "4px 0" }}>
        <strong>Job:</strong>{" "}
        {app.job_title || app.job?.title || "N/A"}
      </p>
    </div>

    <span
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        background: getStatusColor(app.status),
        color: "#fff",
        fontSize: 12,
        height: "fit-content",
      }}
    >
      {app.status}
    </span>
  </div>
{/* RESUME */}
<div style={{ marginTop: 12 }}>
  <strong>Resume:</strong>{" "}

  {app.resume_file ? (
    <button
      style={{
        marginLeft: 10,
        padding: "6px 12px",
        cursor: "pointer",
      }}
      onClick={() =>
        window.open(
          `http://127.0.0.1:8000${app.resume_file}`,
          "_blank",
          "noopener,noreferrer"
        )
      }
    >
      📄 View Resume
    </button>
  ) : (
    <span style={{ color: "#999", marginLeft: 10 }}>
      Resume Not Uploaded
    </span>
  )}
</div>
  
  {/* ACTION BUTTONS */}
  <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
    <button onClick={() => handleViewProfile(app.id)}>
      👤 Profile
    </button>

    <button onClick={() => handleSchedule(app.id)}>
      📅 Schedule
    </button>
  </div>

  {/* QUICK ACTIONS */}
  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
    <button onClick={() => quickStatusUpdate(app.id, "shortlisted")}>
      ⭐
    </button>

    <button onClick={() => quickStatusUpdate(app.id, "selected")}>
      ✅
    </button>

    <button onClick={() => quickStatusUpdate(app.id, "rejected")}>
      ❌
    </button>
  </div>

  {/* STATUS */}
  <select
    value={app.status}
    onChange={(e) =>
      quickStatusUpdate(app.id, e.target.value)
    }
    style={{ marginTop: 10 }}
  >
    <option value="applied">Applied</option>
    <option value="shortlisted">Shortlisted</option>
    <option value="selected">Selected</option>
    <option value="rejected">Rejected</option>
  </select>

  {/* INTERVIEW */}
  {interview && (
    <div
      style={{
        marginTop: 15,
        padding: 12,
        borderRadius: 8,
        background: "#e8fff0",
      }}
    >
      <strong style={{ color: "green" }}>
        📅 Interview Scheduled
      </strong>

      <p>
        <b>Mode:</b> {interview.mode}
      </p>

      <p>
        <b>Date:</b>{" "}
        {new Date(interview.interview_date).toLocaleString()}
      </p>

      {interview.mode === "online" &&
        interview.meeting_link && (
          <p>
            <b>Meeting:</b>{" "}
            <a
              href={interview.meeting_link}
              target="_blank"
              rel="noreferrer"
            >
              Join Meeting
            </a>
          </p>
        )}

      {interview.mode === "offline" &&
        interview.location && (
          <p>
            <b>Location:</b> {interview.location}
          </p>
        )}
    </div>
  )}
</div>
        );
      })}

      {applications.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 30,
            color: "#666",
          }}
        >
          No applicants found.
        </div>
      )}

      <CandidateProfileModal
        open={profileOpen}
        profile={profileData}
        onClose={() => setProfileOpen(false)}
      />

      <ScheduleInterviewModal
        open={scheduleOpen}
        applicationId={selectedAppId}
        onClose={() => setScheduleOpen(false)}
        onSuccess={loadApplications}
      />
    </div>
  );
}