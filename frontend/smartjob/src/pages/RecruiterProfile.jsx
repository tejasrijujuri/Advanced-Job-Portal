import { useEffect, useState } from "react";
import API from "../services/api";
import "../css/RecruiterProfile.css";

export default function RecruiterProfile() {
  const [profile, setProfile] = useState({
    company_name: "",
    designation: "",
    website: "",
    industry: "",
    company_size: "",
    address: "",
    description: "",
    logo: null,
    username: "",
    email: "",
    role: "",
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  // ✅ FIX: correct API endpoint
  const loadProfile = async () => {
    try {
      const res = await API.get("/api/accounts/recruiter-profile/");

      setProfile(res.data);

      if (res.data.logo) {
        setLogoPreview(res.data.logo);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setProfile((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(profile).forEach((key) => {
      if (profile[key] !== null && profile[key] !== undefined) {
        formData.append(key, profile[key]);
      }
    });

    try {
      await API.put("/api/accounts/recruiter-profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully");
      loadProfile();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Profile...</h2>;
  }

  return (
    <div className="recruiter-profile-page">
      <div className="profile-card">

        <h1>👤 Recruiter Profile</h1>

        <form onSubmit={handleSubmit}>

          <div className="image-section">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company Logo"
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">🏢</div>
            )}

            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="grid">

            <div>
              <label>Username</label>
              <input value={profile.username || ""} disabled />
            </div>

            <div>
              <label>Email</label>
              <input value={profile.email || ""} disabled />
            </div>

            <div>
              <label>Role</label>
              <input value={profile.role || ""} disabled />
            </div>

            <div>
              <label>Company Name</label>
              <input
                name="company_name"
                value={profile.company_name || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Designation</label>
              <input
                name="designation"
                value={profile.designation || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Website</label>
              <input
                name="website"
                value={profile.website || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Industry</label>
              <input
                name="industry"
                value={profile.industry || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Company Size</label>
              <input
                name="company_size"
                value={profile.company_size || ""}
                onChange={handleChange}
              />
            </div>

          </div>

          <label>Address</label>
          <textarea
            name="address"
            rows="3"
            value={profile.address || ""}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            value={profile.description || ""}
            onChange={handleChange}
          />

          <button type="submit" className="save-btn">
            💾 Update Profile
          </button>

        </form>
      </div>
    </div>
  );
}