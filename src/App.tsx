// Import Main Libraries
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Custom Libraries
import { AuthProvider } from './contexts/AuthContext';
import ClientView from './view/client';
import AdminView from './view/admin';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminView />} />
          <Route path="/*" element={<ClientView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;