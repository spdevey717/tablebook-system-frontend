import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../layout/admin";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  DashboardPage,
  UsersPage,
  BookingsPage,
  SettingsPage
} from "../../page/admin";
import RestaurantsPage from "../../page/admin/restaurants";

const AdminView = () => {
  return (
    <ProtectedRoute requireAdmin>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="restaurants" element={<RestaurantsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminView;
