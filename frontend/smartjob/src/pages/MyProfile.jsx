import { useEffect, useState } from "react";
import Popup from "../components/Popup";
import usePopup from "../hooks/usePopup";
import { getProfile, updateProfile } from "../services/api";
import "../css/Profile.css";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { popup, showPopup } = usePopup();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      showPopup("Failed to load profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setProfile((prev) => ({
      ...prev,
      [e.target.name]: file,
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("full_name", profile.full_name || "");
      formData.append("mobile", profile.mobile || "");
      formData.append("skills", profile.skills || "");
      formData.append("experience", profile.experience || "");
      formData.append(
        "highest_education",
        profile.highest_education || ""
      );
      formData.append("percentage", profile.percentage || "");
      formData.append("projects", profile.projects || "");

      if (profile.photo instanceof File) {
        formData.append("photo", profile.photo);
      }

      if (profile.resume instanceof File) {
        formData.append("resume", profile.resume);
      }

      if (profile.certificates instanceof File) {
        formData.append("certificates", profile.certificates);
      }

      await updateProfile(formData);

      showPopup("Profile updated successfully.", "success");

      fetchProfile();
    } catch (err) {
      console.error(err);
      showPopup("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        Profile not found.
      </div>
    );
  }

  const photoUrl =
    profile.photo && !(profile.photo instanceof File)
      ? profile.photo.startsWith("http")
        ? profile.photo
        : `http://127.0.0.1:8000${profile.photo}`
      : null;

  const resumeUrl =
    profile.resume && !(profile.resume instanceof File)
      ? profile.resume.startsWith("http")
        ? profile.resume
        : `http://127.0.0.1:8000${profile.resume}`
      : null;

  const certificateUrl =
    profile.certificates &&
    !(profile.certificates instanceof File)
      ? profile.certificates.startsWith("http")
        ? profile.certificates
        : `http://127.0.0.1:8000${profile.certificates}`
      : null;

  return (
    <div className="profile-page">
      <Popup
        show={popup.show}
        message={popup.message}
        type={popup.type}
      />

      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>

        <div className="profile-grid">

          {/* LEFT SIDE */}
          <div className="profile-left">

            <div className="profile-photo-box">
              {profile.photo ? (
                <img
                  src={
                    profile.photo instanceof File
                      ? URL.createObjectURL(profile.photo)
                      : photoUrl
                  }
                  alt="Profile"
                  className="profile-photo"
                />
              ) : (
                <div className="no-photo">No Photo</div>
              )}
            </div>

            <label>Upload Photo</label>
            <input
              type="file"
              name="photo"
              onChange={handleFileChange}
            />

            <div className="resume-box">
              <label>Resume</label>

              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
              />

              {resumeUrl && !(profile.resume instanceof File) && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Current Resume
                </a>
              )}
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="profile-right">

            <div className="grid-2">

              <div>
                <label>Full Name</label>
                <input
                  name="full_name"
                  value={profile.full_name || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  value={profile.email || ""}
                  disabled
                />
              </div>

              <div>
                <label>Mobile</label>
                <input
                  name="mobile"
                  value={profile.mobile || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Education</label>
                <input
                  name="highest_education"
                  value={profile.highest_education || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Percentage</label>
                <input
                  name="percentage"
                  value={profile.percentage || ""}
                  onChange={handleChange}
                />
              </div>

            </div>

            <label>Skills</label>
            <textarea
              name="skills"
              value={profile.skills || ""}
              onChange={handleChange}
            />

            <label>Experience</label>
            <textarea
              name="experience"
              value={profile.experience || ""}
              onChange={handleChange}
            />

            <label>Projects</label>
            <textarea
              name="projects"
              value={profile.projects || ""}
              onChange={handleChange}
            />

            <label>Certificates</label>

            <input
              type="file"
              name="certificates"
              onChange={handleFileChange}
            />

            {certificateUrl && !(profile.certificates instanceof File) && (
              <a
                href={certificateUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Current Certificate
              </a>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}