import { useEffect, useState } from "react";
import API from "../services/api";

import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Popup Hook
  const { popup, showPopup } = usePopup();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await API.get("/api/interviews/");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setInterviews(data);
    } catch (err) {
      console.log(err);

      setInterviews([]);

      showPopup("Failed to load interviews.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === "all"
      ? interviews
      : interviews.filter((i) => i.status === filter);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <h2>Interviews</h2>

      {/* Filter Buttons */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button onClick={() => setFilter("scheduled")}>
          Scheduled
        </button>

        <button onClick={() => setFilter("completed")}>
          Completed
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        filtered.map((i) => (
          <div
            key={i.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    i.status === "completed"
                      ? "green"
                      : i.status === "scheduled"
                      ? "blue"
                      : "orange",
                }}
              >
                {i.status}
              </span>
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(i.interview_date).toLocaleString("en-IN")}
            </p>

            <p>
              <strong>Location:</strong> {i.location}
            </p>

            {i.meeting_link && (
              <a
                href={i.meeting_link}
                target="_blank"
                rel="noreferrer"
              >
                <button>Join Meeting</button>
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}