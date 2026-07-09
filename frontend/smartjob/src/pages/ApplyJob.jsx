import { useEffect, useState } from "react";
import API from "../services/api";

import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function ApplyJob({ jobId }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Custom popup
  const { popup, showPopup } = usePopup();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    cover_letter: "",
    resume: null,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/accounts/profile/");
      const data = res.data;

      setForm({
        full_name: data.full_name || "",
        email: data.email || "",
        mobile: data.mobile || "",
        cover_letter: data.cover_letter || "",
        resume: null,
      });
    } catch (err) {
      console.log("Profile load error:", err);
      showPopup("Failed to load profile data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setForm({
      ...form,
      resume: e.target.files[0],
    });
  };

  const submitApplication = async () => {
    setSubmitting(true);

    // Validation
    if (!form.full_name || !form.email || !form.mobile) {
      showPopup("Please fill all required fields.", "warning");
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("job", jobId);
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("mobile", form.mobile);
      formData.append("cover_letter", form.cover_letter);

      if (form.resume) {
        formData.append("resume", form.resume);
      }

      await API.post("/applications/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showPopup("Application submitted successfully!", "success");

      // Reset form
      setForm({
        full_name: "",
        email: "",
        mobile: "",
        cover_letter: "",
        resume: null,
      });

    } catch (err) {
      console.log("Submit error:", err);

      if (err.response?.data?.detail) {
        showPopup(err.response.data.detail, "error");
      } else {
        showPopup("Failed to submit application.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h2>Apply Job</h2>

      <input
        name="full_name"
        placeholder="Full Name"
        value={form.full_name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="mobile"
        placeholder="Mobile"
        value={form.mobile}
        onChange={handleChange}
      />

      <textarea
        name="cover_letter"
        placeholder="Cover Letter"
        value={form.cover_letter}
        onChange={handleChange}
      />

      <label>Resume</label>

      <input
        type="file"
        onChange={handleFile}
      />

      <br />
      <br />

      <button
        onClick={submitApplication}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
}