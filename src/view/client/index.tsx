import { Routes, Route } from "react-router-dom";
import ClientLayout from "../../layout/client";
import {
  HomePage,
  RestaurantsPage
} from "../../page/client";

const ClientView = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
      </Route>
    </Routes>
  );
};

export default ClientView;