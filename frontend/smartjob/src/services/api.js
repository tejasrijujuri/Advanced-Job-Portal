import axios from "axios";

/* =========================
   BASE INSTANCE
========================= */

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

/* =========================
   AUTH HEADER HELPER
========================= */

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

/* =========================
   REQUEST INTERCEPTOR
========================= */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   RESPONSE INTERCEPTOR (REFRESH TOKEN)
========================= */

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access", newAccess);
        setAuthToken(newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* =========================
   AUTH
========================= */

export const login = (data) => API.post("/api/token/", data);
export const register = (data) => API.post("/api/accounts/register/", data);

export const getProfile = () => API.get("/api/accounts/profile/");
export const updateProfile = (data) =>
  API.put("/api/accounts/profile/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================
   JOBS
========================= */

export const getJobs = () => API.get("/api/jobs/");
export const getJob = (id) => API.get(`/api/jobs/${id}/`);
export const createJob = (data) => API.post("/api/jobs/", data);
export const updateJob = (id, data) => API.put(`/api/jobs/${id}/`, data);
export const deleteJob = (id) => API.delete(`/api/jobs/${id}/`);
export const getRecruiterJobs = () => API.get("/api/jobs/?mine=true");

/* =========================
   APPLICATIONS (ATS CORE)
========================= */

export const applyJob = (jobId, data = {}) =>
  API.post(`/api/jobs/${jobId}/apply/`, data);

export const getApplications = () =>
  API.get("/api/applications/");

export const getJobApplications = (jobId) =>
  API.get(`/api/applications/job/${jobId}/`);

export const updateApplicationStatus = (id, data) =>
  API.patch(`/api/applications/${id}/update_status/`, data);

export const getCandidateProfile = (applicationId) =>
  API.get(`/api/applications/${applicationId}/candidate-profile/`);

export const withdrawApplication = (id) =>
  API.delete(`/api/applications/${id}/withdraw/`);
/* =========================
   INTERVIEWS
========================= */

export const scheduleInterview = (data) =>
  API.post("/api/interviews/", data);

export const getInterviews = () =>
  API.get("/api/interviews/");

export const updateInterview = (id, data) =>
  API.put(`/api/interviews/${id}/`, data);

export const deleteInterview = (id) =>
  API.delete(`/api/interviews/${id}/`);

export const updateInterviewStatus = (id, data) =>
  API.patch(`/api/interviews/${id}/update_status/`, data);

/* =========================
   SAVED JOBS
========================= */

export const getSavedJobs = () => API.get("/api/saved-jobs/");
export const saveJob = (data) => API.post("/api/saved-jobs/", data);
export const deleteSavedJob = (id) =>
  API.delete(`/api/saved-jobs/${id}/`);

/* =========================
   RESUME
========================= */

export const getResumes = () =>
  API.get("/api/resumes/resumes/");

export const uploadResume = (formData) =>
  API.post("/api/resumes/resumes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteResume = (id) =>
  API.delete(`/api/resumes/resumes/${id}/`);

/* =========================
   NOTIFICATIONS
========================= */

export const getNotifications = () =>
  API.get("/api/notifications/");

export const markNotificationRead = (id) =>
  API.patch(`/api/notifications/${id}/mark_read/`);

/* =========================
   PASSWORD RESET
========================= */

export const sendOTP = (email) =>
  API.post("/api/accounts/send-otp/", { email });

export const verifyOTP = (data) =>
  API.post("/api/accounts/verify-otp/", data);

export const resetPassword = (data) =>
  API.post("/api/accounts/reset-password/", data);

export default API;