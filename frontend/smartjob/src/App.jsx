import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* PUBLIC */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

/* JOBSEEKER */
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import SavedJobs from "./pages/SavedJobs";
import MyProfile from "./pages/MyProfile";
import Interviews from "./pages/Interviews";
import JobseekerDashboard from "./pages/JobseekerDashboard";

/* RECRUITER */
import RecruiterLayout from "./layouts/RecruiterLayout";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import JobApplicants from "./pages/JobApplicants";
import RecruiterAnalytics from "./pages/RecruiterAnalytics";
import RecruiterProfile from "./pages/RecruiterProfile";

/* ADMIN */
import AdminDashboard from "./pages/AdminDashboard";

/* AUTH GUARD */
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* JOBSEEKER */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="saved-jobs" element={<SavedJobs />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="interviews" element={<Interviews />} />
        </Route>

        {/* JOBSEEKER ALT */}
        <Route
          path="/jobseeker/dashboard"
          element={
            <ProtectedRoute>
              <JobseekerDashboard />
            </ProtectedRoute>
          }
        />

        {/* RECRUITER */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute>
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RecruiterDashboard />} />
          <Route path="jobs" element={<RecruiterJobs />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="edit-job/:id" element={<EditJob />} />
          <Route path="applicants" element={<JobApplicants />} />
          <Route path="job/:id/applications" element={<JobApplicants />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="analytics" element={<RecruiterAnalytics />} />
          <Route path="profile" element={<RecruiterProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}