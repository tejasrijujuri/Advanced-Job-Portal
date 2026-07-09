import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";

import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function CreateJob() {
  const navigate = useNavigate();

  // Popup hook
  const { popup, showPopup } = usePopup();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills: "",
    salary: "",
    job_type: "full-time",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      showPopup("Please fill all required fields.", "warning");
      return;
    }

    try {
      await createJob(formData);

      showPopup("Job created successfully!", "success");

      // Navigate after popup is visible
      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1500);

    } catch (err) {
      console.error(err.response?.data || err);

      if (err.response?.data?.detail) {
        showPopup(err.response.data.detail, "error");
      } else {
        showPopup("Failed to create job.", "error");
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h1>Create Job</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
        />

        <br />
        <br />

        <select
          name="job_type"
          value={formData.job_type}
          onChange={handleChange}
        >
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>

        <br />
        <br />

        <button type="submit">
          Create Job
        </button>
      </form>
    </div>
  );
}