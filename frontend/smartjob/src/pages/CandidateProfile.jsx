import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "../css/CandidateProfile.css";

import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom popup
  const { popup, showPopup } = usePopup();

  useEffect(() => {
    loadCandidate();
  }, [id]);

  const loadCandidate = async () => {
    try {
      const res = await API.get(
        `/api/applications/${id}/candidate-profile/`
      );

      setCandidate(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);

      showPopup("Unable to load candidate profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (!candidate) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Popup
          show={popup.show}
          message={popup.message}
          type={popup.type}
        />

        <h2>No candidate found.</h2>
      </div>
    );
  }

  return (
    <div className="candidate-page">
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <div className="candidate-card">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Existing JSX continues here */}
      </div>
    </div>
  );
}