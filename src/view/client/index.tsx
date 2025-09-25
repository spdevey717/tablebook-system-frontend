import { Routes, Route } from "react-router-dom";
import ClientLayout from "../../layout/client";
import {
  HomePage,
  RestaurantsPage
} from "../../page/client";
import SigninPage from "../../page/admin/auth/signin";
import SignupPage from "../../page/admin/auth/signup";

const ClientView = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
      </Route>
      <Route path="auth/signin" element={<SigninPage />} />
      <Route path="auth/signup" element={<SignupPage />} />
    </Routes>
  );
};

export default ClientView;