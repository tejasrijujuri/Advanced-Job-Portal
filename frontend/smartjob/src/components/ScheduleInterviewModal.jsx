import { useState } from "react";
import { scheduleInterview } from "../services/api";
import Popup from "./Popup";
import usePopup from "../hooks/usePopup";

export default function ScheduleInterviewModal({
  open,
  applicationId,
  onClose,
  onSuccess,
}) {
  const { popup, showPopup } = usePopup();

  const [form, setForm] = useState({
    mode: "online",
    interview_date: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.interview_date) {
      showPopup("Please select interview date and time.", "error");
      return;
    }

    if (form.mode === "offline" && !form.location.trim()) {
      showPopup("Location is required for an offline interview.", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        application: applicationId,
        interview_date: form.interview_date,
        mode: form.mode,
      };

      if (form.mode === "offline") {
        payload.location = form.location;
      }

      await scheduleInterview(payload);

      showPopup("Interview scheduled successfully.", "success");

      setForm({
        mode: "online",
        interview_date: "",
        location: "",
      });

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err.response?.data || err);

      showPopup(
        err.response?.data?.detail ||
          "Failed to schedule interview.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            padding: 20,
            width: 420,
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <h2>Schedule Interview</h2>

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: "10px",
            }}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          <input
            type="datetime-local"
            name="interview_date"
            value={form.interview_date}
            onChange={handleChange}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: "10px",
            }}
          />

          {form.mode === "offline" && (
            <input
              type="text"
              name="location"
              placeholder="Interview Location"
              value={form.location}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: 12,
                padding: "10px",
              }}
            />
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Scheduling..." : "Schedule"}
            </button>

            <button onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}