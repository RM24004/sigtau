import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { saveSession, homeFor } from "../utils/auth";
import Banner from "../components/Banner";
import AuthBrand from "../components/AuthBrand";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // Si venimos del registro, mostramos su aviso
    const [msg, setMsg] = useState(location.state?.msg ?? null);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setMsg({ type: "danger", text: "Completa tu correo y tu contraseña para continuar." });
            return;
        }

        setLoading(true);
        setMsg(null);
        try {
            const data = await login(email, password);
            const role = saveSession(data.token);
            navigate(homeFor(role));
        } catch (error) {
            console.error(error);
            setMsg({ type: "danger", text: error.message || "No se pudo iniciar sesión. Intenta de nuevo." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <AuthBrand />

            <main className="login__panel">
                <form className="login__form" onSubmit={handleLogin} noValidate>
                    <h1 className="login__title">Iniciar sesión</h1>
                    <p className="login__lead">Ingresa para ver tus tutorías.</p>

                    <Banner msg={msg} onClose={() => setMsg(null)} />

                    <div className="login__field">
                        <label className="login__label" htmlFor="login-email">Correo electrónico</label>
                        <input
                            id="login-email"
                            type="email"
                            className="login__input"
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login__field">
                        <label className="login__label" htmlFor="login-password">Contraseña</label>
                        <input
                            id="login-password"
                            type="password"
                            className="login__input"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="login__submit" disabled={loading}>
                        {loading ? "Ingresando…" : "Iniciar sesión"}
                    </button>

                    <p className="login__register">
                        ¿No tienes cuenta?{" "}
                        <Link to="/register" className="login__link">Regístrate aquí</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}

export default Login;