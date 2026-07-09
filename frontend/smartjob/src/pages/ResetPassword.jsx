import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";
import "../css/Forms.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("otp_email");

  const { popup, showPopup } = usePopup();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      showPopup("Session expired. Please request a new OTP.", "error");
      navigate("/forgot-password");
      return;
    }

    if (password.length < 8) {
      showPopup(
        "Password must be at least 8 characters long.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email,
        password,
      });

      showPopup("Password reset successful.", "success");

      localStorage.removeItem("otp_email");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      showPopup(
        err.response?.data?.error || "Error resetting password.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <div className="auth-card">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <h1>Advanced Job Portal</h1>

          <p>
            Create a new strong password for your account. Make sure it's
            secure and easy for you to remember.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h2>Reset Password</h2>

          <form onSubmit={handleReset}>
            <input
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}