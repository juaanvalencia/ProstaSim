
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserRound, Mail, LockKeyhole, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

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
    <main className="register-page">
      <section className="register-card">
        <div className="register-brand">
          <div className="register-logo">
            <Activity size={30} />
          </div>

          <h1>PROSTA<span>-SIM</span></h1>
          <p>Simulador educativo de próstata</p>
        </div>

        <div className="register-heading">
          <h2>Crear una cuenta</h2>
          <p>Regístrate para acceder a la plataforma.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Nombre completo</label>
          <div className="register-input">
            <UserRound size={18} />
            <input
              id="fullName"
              type="text"
              placeholder="Tu nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <label htmlFor="registerEmail">Correo electrónico</label>
          <div className="register-input">
            <Mail size={18} />
            <input
              id="registerEmail"
              type="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="registerPassword">Contraseña</label>
          <div className="register-input">
            <LockKeyhole size={18} />
            <input
              id="registerPassword"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <div className="register-input">
            <LockKeyhole size={18} />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </section>
    </main>
  );
}