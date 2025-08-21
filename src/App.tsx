import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientView from './view/client';
import AdminView from './view/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<ClientView />} />
        <Route path="/admin/*" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;