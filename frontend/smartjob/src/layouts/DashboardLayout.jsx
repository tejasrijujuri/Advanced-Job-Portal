import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Advanced Job Portal</h2>
          <p>Job Seeker Panel</p>
        </div>

        <nav className="sidebar-menu">
          <Link
            to="/dashboard"
            className={isActive("/dashboard") ? "active" : ""}
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/dashboard/jobs"
            className={isActive("/dashboard/jobs") ? "active" : ""}
          >
            💼 Jobs
          </Link>

          <Link
            to="/dashboard/applications"
            className={isActive("/dashboard/applications") ? "active" : ""}
          >
            📄 My Applications
          </Link>

          <Link
            to="/dashboard/interviews"
            className={isActive("/dashboard/interviews") ? "active" : ""}
          >
            🎥 Interviews
          </Link>

          <Link
            to="/dashboard/saved-jobs"
            className={isActive("/dashboard/saved-jobs") ? "active" : ""}
          >
            ⭐ Saved Jobs
          </Link>

          <Link
            to="/dashboard/profile"
            className={isActive("/dashboard/profile") ? "active" : ""}
          >
            👤 My Profile
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="dashboard-main">
        <header className="topbar">
          <div>
            <h1>Advanced Job Portal</h1>
            <p>Welcome Back!</p>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}