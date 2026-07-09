export default function CandidateProfileModal({
  open,
  profile,
  onClose,
}) {
  if (!open || !profile) return null;

  const resumeUrl =
    profile.resume &&
    (profile.resume.startsWith("http")
      ? profile.resume
      : `http://127.0.0.1:8000${profile.resume}`);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "500px",
          maxWidth: "90%",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Candidate Profile
        </h2>

        <p>
          <strong>Name:</strong> {profile.full_name || "-"}
        </p>

        <p>
          <strong>Email:</strong> {profile.email || "-"}
        </p>

        <p>
          <strong>Mobile:</strong> {profile.mobile || "-"}
        </p>

        <p>
          <strong>Skills:</strong>{" "}
          {profile.profile_skills || profile.skills || "-"}
        </p>

        <p>
          <strong>Experience:</strong>{" "}
          {profile.experience || "-"}
        </p>

        {resumeUrl && (
          <p>
            <strong>Resume:</strong>{" "}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </p>
        )}

        <div
          style={{
            marginTop: "20px",
            textAlign: "right",
          }}
        >
          <button onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}