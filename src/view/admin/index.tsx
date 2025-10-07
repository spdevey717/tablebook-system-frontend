import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../layout/admin";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  DashboardPage,
  UsersPage,
  BookingsPage,
  PhoneUploadPage,
  RetellAgentsPage,
  SettingsPage,
  ProfilePage
} from "../../page/admin";
import FileBookingsPage from "../../page/admin/bookings/[fileId]";

const AdminView = () => {
  return (
    <Routes>
      {/* Redirect /admin to /admin/dashboard */}
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      
      {/* Protected admin routes */}
      <Route path="/" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/:fileId" element={<FileBookingsPage />} />
        <Route path="phone-upload" element={<PhoneUploadPage />} />
        <Route path="retell-agents" element={<RetellAgentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminView;
