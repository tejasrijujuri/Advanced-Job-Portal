import { useState } from "react";
import { scheduleInterview } from "../services/api";

export default function ScheduleInterviewModal({
  open,
  applicationId,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    interview_date: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.interview_date || !form.location) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await scheduleInterview({
        application: applicationId,
        interview_date: form.interview_date,
        location: form.location,
      });

      alert("Interview scheduled successfully");

      setForm({
        interview_date: "",
        location: "",
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: 20,
          width: 420,
          borderRadius: 10,
        }}
      >
        <h2>Schedule Interview</h2>

        <input
          type="datetime-local"
          name="interview_date"
          value={form.interview_date}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="text"
          name="location"
          placeholder="Interview Location"
          value={form.location}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 15 }}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Scheduling..." : "Schedule"}
        </button>

        <button onClick={onClose} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}