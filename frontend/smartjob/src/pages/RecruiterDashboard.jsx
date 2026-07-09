import { Link } from "react-router-dom";
import "../css/RecruiterDashboard.css";

export default function RecruiterDashboard() {
  const cards = [
    {
      id: 1,
      title: "Create Job",
      icon: "➕",
      desc: "Post a new job opening",
      link: "/recruiter/create-job",
    },
    {
      id: 2,
      title: "My Jobs",
      icon: "💼",
      desc: "Manage all posted jobs",
      link: "/recruiter/jobs",
    },
    {
      id: 3,
      title: "Applicants",
      icon: "👥",
      desc: "View job applicants",
      link: "/recruiter/jobs",
    },
    {
      id: 4,
      title: "Interviews",
      icon: "📅",
      desc: "Manage interviews",
      link: "/recruiter/interviews",
    },
    {
      id: 5,
      title: "Analytics",
      icon: "📊",
      desc: "View recruiter analytics",
      link: "/recruiter/analytics",
    },
  ];

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Recruiter Dashboard</h1>
          <p>
            Welcome back! Manage your jobs and candidates efficiently.
          </p>
        </div>
      </div>

      <div className="hero-section">
        <div className="hero-content">
          <h2>Find the Best Talent</h2>

          <p>
            Create jobs, review applications, schedule interviews, and monitor
            hiring performance from one place.
          </p>

          <Link className="hero-btn" to="/recruiter/create-job">
            ➕ Post New Job
          </Link>
        </div>
      </div>

      <h2 className="section-title">Quick Actions</h2>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <Link
            key={card.id}
            to={card.link}
            className="dashboard-card"
          >
            <div className="card-icon">{card.icon}</div>

            <h3>{card.title}</h3>

            <p>{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="tips-box">
        <h2>💡 Recruiter Tips</h2>

        <ul>
          <li>
            Create detailed job descriptions to attract quality candidates.
          </li>
          <li>Review applications regularly.</li>
          <li>
            Schedule interviews quickly to improve hiring success.
          </li>
          <li>
            Use Analytics to monitor recruitment performance.
          </li>
        </ul>
      </div>
    </div>
  );
}