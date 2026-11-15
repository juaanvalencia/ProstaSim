
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

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
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            <Activity size={30} />
          </div>

          <h1>
            PROSTA<span>-SIM</span>
          </h1>

          <p>Simulador educativo de próstata</p>
        </div>

        <div className="login-heading">
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresa tus credenciales para continuar.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>

          <div className="login-input">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label htmlFor="password">Contraseña</label>

          <div className="login-input">
            <LockKeyhole size={18} />
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="login-footer">
          <span>PROSTA-SIM</span>

          <p>Plataforma de aprendizaje y simulación educativa</p>

          <p>
            ¿No tienes una cuenta?{" "}
            <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </section>
    </main>
  );
}