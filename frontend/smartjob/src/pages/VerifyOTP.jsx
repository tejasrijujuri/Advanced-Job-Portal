import { useState, useEffect } from "react";
import { verifyOTP, sendOTP } from "../services/api";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";
import "../css/Forms.css";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { popup, showPopup } = usePopup();
  const navigate = useNavigate();

  const email = localStorage.getItem("otp_email");

  // =========================
  // FORMAT TIMER (MM:SS)
  // =========================
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      showPopup("OTP must be 6 digits.", "error");
      return;
    }

    try {
      setLoading(true);

      await verifyOTP({
        email,
        otp,
      });

      showPopup("OTP verified successfully.", "success");

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);
    } catch (err) {
      console.error(err.response?.data || err);

      showPopup(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Invalid OTP.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResend = async () => {
    try {
      setResending(true);

      await sendOTP({ email });

      showPopup("OTP sent successfully.", "success");

      setTimer(300);
      setCanResend(false);
    } catch (err) {
      console.error(err.response?.data || err);

      showPopup(
        err.response?.data?.error ||
          "Failed to resend OTP.",
        "error"
      );
    } finally {
      setResending(false);
    }
  };

  // =========================
  // TIMER
  // =========================
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

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
            Enter the OTP sent to your email to reset your password securely.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <h2>Verify OTP</h2>

          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              maxLength={6}
              className="otp-input"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <p className="auth-link">
            {canResend ? (
              <span
                onClick={!resending ? handleResend : undefined}
                style={{
                  color: "#2563eb",
                  cursor: resending ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                {resending ? "Sending..." : "Resend OTP"}
              </span>
            ) : (
              <span style={{ color: "#6b7280" }}>
                Resend OTP in {formatTime(timer)}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}