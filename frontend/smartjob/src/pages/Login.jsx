import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { login as loginAPI, getProfile } from "../services/api";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function Login() {
  const navigate = useNavigate();
  const { popup, showPopup } = usePopup();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showPopup("Please enter username and password.", "warning");
      return;
    }

    try {
      const res = await loginAPI({
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      API.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.access}`;

      const profileRes = await getProfile();

      localStorage.setItem(
        "user",
        JSON.stringify(profileRes.data)
      );

      showPopup("Login successful.", "success");

      const role = profileRes.data.role;

      setTimeout(() => {
        if (role === "recruiter") {
          navigate("/recruiter");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        showPopup("Invalid username or password.", "error");
      } else {
        showPopup("Login failed. Please try again.", "error");
      }
    }
  };

  return (
    <div className="login-page">
      <Popup
        message={popup.message}
        type={popup.type}
        show={popup.show}
      />

      {/* Left Side */}
      <div className="login-left">
        <div className="login-brand">
          <h1>Advanced Job Portal</h1>

          <p>
            Find your dream job, connect with top recruiters,
            and build your career with confidence.
          </p>

          <ul>
            <li>✔ Thousands of verified jobs</li>
            <li>✔ One-click job applications</li>
            <li>✔ Track application status</li>
            <li>✔ Secure recruitment platform</li>
          </ul>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>

          <p className="subtitle">
            Login to continue
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Login
            </button>
          </form>

          <div className="login-links">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>

            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}