import { useEffect, useState } from "react";
import API from "../services/api";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";
import "../css/RecruiterAnalytics.css";

export default function RecruiterAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { popup, showPopup } = usePopup();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/api/analytics/");
      setData(res.data);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      setData(null);
      showPopup("Unable to load analytics.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Popup
          show={popup.show}
          message={popup.message}
          type={popup.type}
        />
        <h2 className="loading">Loading Analytics...</h2>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Popup
          show={popup.show}
          message={popup.message}
          type={popup.type}
        />
        <h2 className="loading">Unable to load analytics.</h2>
      </>
    );
  }

  return (
    <div className="analytics-page">
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h1 className="title">📊 Recruiter Analytics</h1>

      {/* Main Statistics */}
      <div className="stats-grid">
        <div className="card">
          <h3>Total Jobs</h3>
          <h1>{data.total_jobs || 0}</h1>
        </div>

        <div className="card">
          <h3>Applications</h3>
          <h1>{data.total_applications || 0}</h1>
        </div>

        <div className="card">
          <h3>Interviews</h3>
          <h1>{data.total_interviews || 0}</h1>
        </div>
      </div>

      {/* Application Status */}
      <div className="section">
        <h2>📄 Application Status</h2>

        <div className="status-grid">
          <div className="small-card">
            <h4>Pending</h4>
            <span>{data.applications_status?.pending || 0}</span>
          </div>

          <div className="small-card">
            <h4>Accepted</h4>
            <span>{data.applications_status?.accepted || 0}</span>
          </div>

          <div className="small-card">
            <h4>Rejected</h4>
            <span>{data.applications_status?.rejected || 0}</span>
          </div>
        </div>
      </div>

      {/* Interview Status */}
      <div className="section">
        <h2>🎥 Interview Status</h2>

        <div className="status-grid">
          <div className="small-card">
            <h4>Scheduled</h4>
            <span>{data.interviews_status?.scheduled || 0}</span>
          </div>

          <div className="small-card">
            <h4>Completed</h4>
            <span>{data.interviews_status?.completed || 0}</span>
          </div>

          <div className="small-card">
            <h4>Cancelled</h4>
            <span>{data.interviews_status?.cancelled || 0}</span>
          </div>
        </div>
      </div>

      {/* Job Wise Applications */}
      <div className="section">
        <h2>💼 Job Wise Applications</h2>

        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Total Applications</th>
            </tr>
          </thead>

          <tbody>
            {(data.job_wise || []).length > 0 ? (
              data.job_wise.map((job, index) => (
                <tr key={index}>
                  <td>{job.title}</td>
                  <td>{job.applications}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  No jobs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}