import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./components/landing/Welcome";
import Dashboard from "./Dashboard";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Cargando PROSTA-SIM...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
}
