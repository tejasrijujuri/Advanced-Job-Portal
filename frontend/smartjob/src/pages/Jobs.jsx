import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");

  const { popup, showPopup } = usePopup();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = {};

      if (title) params.title = title;
      if (company) params.company = company;
      if (location) params.location = location;

      const res = await API.get("/api/jobs/", { params });

      const data = res.data.results || res.data;
      setJobs(data);

      if (data.length === 0) {
        showPopup("No jobs found.", "warning");
      } else {
        showPopup("Jobs loaded successfully.", "success");
      }
    } catch (err) {
      console.error(err);

      setJobs([]);
      showPopup("Failed to load jobs.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobs-page">
      <Popup
        message={popup.message}
        type={popup.type}
        show={popup.show}
      />

      <div className="jobs-header">
        <h1>Available Jobs</h1>
        <p>Explore opportunities and apply for your dream job.</p>
      </div>

      {/* Search Filters */}

      <div className="job-search">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button onClick={fetchJobs}>
          Search Jobs
        </button>
      </div>

      {loading ? (
        <div className="loading">
          Loading Jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="no-jobs">
          No jobs found.
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h2>{job.title}</h2>

              <p>
                <strong>Company:</strong> {job.company}
              </p>

              <p>
                <strong>Location:</strong> {job.location}
              </p>

              <p>
                <strong>Salary:</strong> ₹{job.salary}
              </p>

              {job.has_applied ? (
                <button
                  className="applied-btn"
                  disabled
                >
                  ✓ Already Applied
                </button>
              ) : (
                <Link
                  to={`/dashboard/jobs/${job.id}`}
                  className="apply-btn"
                >
                  View Details
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}