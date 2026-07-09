import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../css/RecruiterLayout.css";

export default function RecruiterLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const active = (path) => location.pathname === path;

  return (
    <div className="recruiter-layout">
      {/* Sidebar */}
      <aside className="recruiter-sidebar">
        <div className="logo">
          <h2>Advanced Job Portal</h2>
          <p>Recruiter Panel</p>
        </div>

        <nav>
          <Link
            to="/recruiter"
            className={active("/recruiter") ? "active" : ""}
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/recruiter/jobs"
            className={active("/recruiter/jobs") ? "active" : ""}
          >
            💼 My Jobs
          </Link>

          <Link
            to="/recruiter/create-job"
            className={active("/recruiter/create-job") ? "active" : ""}
          >
            ➕ Create Job
          </Link>

          <Link
            to="/recruiter/applicants"
            className={active("/recruiter/applicants") ? "active" : ""}
          >
            👥 Applicants
          </Link>

          <Link
            to="/recruiter/interviews"
            className={active("/recruiter/interviews") ? "active" : ""}
          >
            📅 Interviews
          </Link>

          <Link
            to="/recruiter/analytics"
            className={active("/recruiter/analytics") ? "active" : ""}
          >
            📊 Analytics
          </Link>

          <Link
            to="/recruiter/profile"
            className={active("/recruiter/profile") ? "active" : ""}
          >
            👤 Profile
          </Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="recruiter-main">
        <Outlet />
      </main>
    </div>
  );
}