import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../layout/admin";
import {
  DashboardPage,
  UsersPage,
  BookingsPage,
  SettingsPage
} from "../../page/admin";

const AdminView = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminView;
