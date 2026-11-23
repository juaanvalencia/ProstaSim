import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthShell, { PasswordField, TextField } from "./AuthShell";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await login(email, password);

    setLoading(false);

    if (error) {
      setError("No fue posible iniciar sesión. Verifica tus datos.");
      return;
    }

    navigate("/");
  };

  return (
    <AuthShell
      title="Bienvenido de nuevo"
      subtitle="Ingresa tus credenciales para continuar."
      footer={
        <p>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} aria-busy={loading}>
        <TextField
          id="email"
          label="Correo electrónico"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordField
          id="password"
          label="Contraseña"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="auth-message auth-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading && <span className="auth-spinner" aria-hidden="true" />}
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </AuthShell>
  );
}
