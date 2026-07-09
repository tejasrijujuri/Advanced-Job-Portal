import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function Register() {
  const navigate = useNavigate();
  const { popup, showPopup } = usePopup();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "jobseeker",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Username validation
    if (formData.username.trim() === "") {
      showPopup("Username is required.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      showPopup("Please enter a valid email address.", "error");
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      showPopup("Password must be at least 8 characters long.", "error");
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(formData.phone)) {
      showPopup("Phone number must contain exactly 10 digits.", "error");
      return;
    }

    try {
      setLoading(true);

      await register(formData);

      showPopup("Registration successful!", "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log("Registration Error:", err.response?.data);

      if (typeof err.response?.data === "string") {
        showPopup(err.response.data, "error");
      } else if (err.response?.data) {
        const firstError = Object.values(err.response.data)
          .flat()
          .join(" ");

        showPopup(firstError, "error");
      } else {
        showPopup("Registration failed.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <div className="register-card">
        <div className="register-left">
          <h1>Advanced Job Portal</h1>

          <p>
            Create your account and unlock thousands of career opportunities
            with top companies.
          </p>
        </div>

        <div className="register-right">
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="register-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}