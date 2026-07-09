import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJob, updateJob } from "../services/api";

import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Popup Hook
  const { popup, showPopup } = usePopup();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    skills: "",
    description: "",
    job_type: "full-time",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    try {
      const res = await getJob(id);

      setFormData({
        title: res.data.title || "",
        company: res.data.company || "",
        location: res.data.location || "",
        salary: res.data.salary || "",
        skills: res.data.skills || "",
        description: res.data.description || "",
        job_type: res.data.job_type || "full-time",
      });
    } catch (err) {
      console.error(err);
      showPopup("Failed to load job.", "error");
    } finally {
      setLoading(false);
    }
  };

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
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.salary ||
      !formData.skills ||
      !formData.description
    ) {
      showPopup("Please fill all required fields.", "warning");
      return;
    }

    try {
      await updateJob(id, formData);

      showPopup("Job updated successfully!", "success");

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1500);

    } catch (err) {
      console.error(err.response?.data || err);

      if (err.response?.data?.detail) {
        showPopup(err.response.data.detail, "error");
      } else {
        showPopup("Failed to update job.", "error");
      }
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h1>Edit Job</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Job Title</label>
          <br />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Company</label>
          <br />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Location</label>
          <br />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Salary</label>
          <br />
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Skills</label>
          <br />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Python, Django, React"
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Job Type</label>
          <br />
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Update Job
        </button>
      </form>
    </div>
  );
}