import { useState } from "react";
import API from "../services/api";

export default function ScheduleInterview() {
  const [form, setForm] = useState({
    job: "",
    candidate: "",
    interview_date: "",
    location: "",
    meeting_link: "",
    status: "scheduled",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/interviews/", form);
      alert("Interview Scheduled Successfully");
      setForm({
        job: "",
        candidate: "",
        interview_date: "",
        location: "",
        meeting_link: "",
        status: "scheduled",
      });
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to schedule interview");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Schedule Interview</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="job"
          placeholder="Job ID"
          value={form.job}
          onChange={handleChange}
        />
        <br />

        <input
          name="candidate"
          placeholder="Candidate ID"
          value={form.candidate}
          onChange={handleChange}
        />
        <br />

        <input
          type="datetime-local"
          name="interview_date"
          value={form.interview_date}
          onChange={handleChange}
        />
        <br />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <br />

        <input
          name="meeting_link"
          placeholder="Meeting Link"
          value={form.meeting_link}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Schedule</button>
      </form>
    </div>
  );
}