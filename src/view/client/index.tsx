import { Routes, Route } from "react-router-dom";
import ClientLayout from "../../layout/client";
import {
  HomePage,
  Page1
} from "../../page/client";

const ClientView = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="page1" element={<Page1 />} />
      </Route>
    </Routes>
  );
};

export default ClientView;