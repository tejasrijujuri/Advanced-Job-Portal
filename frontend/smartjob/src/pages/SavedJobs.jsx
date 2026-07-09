import { useEffect, useState } from "react";
import { getSavedJobs, deleteSavedJob } from "../services/api";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const { popup, showPopup } = usePopup();

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const res = await getSavedJobs();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setSavedJobs(data);
    } catch (err) {
      console.error(err);
      showPopup("Failed to load saved jobs.", "error");
    }
  };

  const removeSavedJob = async (id) => {
    try {
      await deleteSavedJob(id);

      setSavedJobs((prev) => prev.filter((job) => job.id !== id));

      showPopup("Job removed successfully.", "success");
    } catch (err) {
      console.error(err);
      showPopup("Failed to remove job.", "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h1>Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <p>No saved jobs.</p>
      ) : (
        savedJobs.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <h2>{item.job?.title}</h2>

            <p>
              <strong>Company:</strong> {item.job?.company}
            </p>

            <p>
              <strong>Location:</strong> {item.job?.location}
            </p>

            <p>
              <strong>Salary:</strong> ₹{item.job?.salary}
            </p>

            <button
              onClick={() => removeSavedJob(item.id)}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}