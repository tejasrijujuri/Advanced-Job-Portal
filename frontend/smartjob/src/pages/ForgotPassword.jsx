import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOTP } from "../services/api";

import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // Popup Hook
  const { popup, showPopup } = usePopup();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Email validation
    if (!email.trim()) {
      showPopup("Please enter your registered email address.", "warning");
      return;
    }

    try {
      await sendOTP(email);

      // Save email for OTP verification
      localStorage.setItem("otp_email", email);

      showPopup("OTP sent successfully.", "success");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email },
        });
      }, 1500);

    } catch (err) {
      console.log(err);

      if (err.response?.data?.error) {
        showPopup(err.response.data.error, "error");
      } else if (err.response?.data?.detail) {
        showPopup(err.response.data.detail, "error");
      } else {
        showPopup("Failed to send OTP. Please try again.", "error");
      }
    }
  };

  return (
    <div className="forgot-page">
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <div className="forgot-card">
        <div className="forgot-left">
          <h1>Advanced Job Portal</h1>

          <p>
            Forgot your password? Enter your registered email address and we'll
            send a One-Time Password (OTP) to reset your password securely.
          </p>
        </div>

        <div className="forgot-right">
          <h2>Forgot Password</h2>

          <form onSubmit={handleSendOTP}>
            <input
              type="email"
              placeholder="Registered Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">
              Send OTP
            </button>
          </form>

          <div className="forgot-links">
            <Link to="/login">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}