import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserRound, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthShell, { PasswordField, TextField } from "./AuthShell";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const { data, error } = await register(
      fullName.trim(),
      email.trim(),
      password
    );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      navigate("/");
    } else {
      setSuccess(
        "Registro exitoso. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión."
      );
    }
  };

  return (
    <AuthShell
      title="Crear una cuenta"
      subtitle="Regístrate para acceder a la plataforma."
      footer={
        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} aria-busy={loading}>
        <TextField
          id="fullName"
          label="Nombre completo"
          icon={UserRound}
          type="text"
          autoComplete="name"
          placeholder="Tu nombre completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <TextField
          id="registerEmail"
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
          id="registerPassword"
          label="Contraseña"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <PasswordField
          id="confirmPassword"
          label="Confirmar contraseña"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <p className="auth-message auth-error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="auth-message auth-success" role="status">
            {success}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading && <span className="auth-spinner" aria-hidden="true" />}
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </AuthShell>
  );
}
