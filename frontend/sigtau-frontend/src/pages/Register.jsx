import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import Banner from "../components/Banner";
import AuthBrand from "../components/AuthBrand";
import "./Login.css";

/** Registro público: siempre crea un ESTUDIANTE (el rol lo fija el servidor). */
function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setMsg({ type: "danger", text: "Las contraseñas no coinciden." });
            return;
        }
        setLoading(true);
        setMsg(null);
        try {
            const { name, email, phone, password } = form;
            await register({ name, email, phone, password });
            navigate("/login", {
                state: { msg: { type: "success", text: "Registro exitoso. Ya puedes iniciar sesión." } },
            });
        } catch (error) {
            setMsg({ type: "danger", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <AuthBrand />

            <main className="login__panel">
                <form className="login__form" onSubmit={handleSubmit}>
                    <h1 className="login__title">Crear cuenta</h1>
                    <p className="login__lead">Regístrate como estudiante para inscribirte en tutorías.</p>

                    <Banner msg={msg} onClose={() => setMsg(null)} />

                    <div className="login__field">
                        <label className="login__label" htmlFor="reg-name">Nombre completo</label>
                        <input
                            id="reg-name"
                            className="login__input"
                            autoComplete="name"
                            value={form.name}
                            onChange={set("name")}
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="login__field">
                        <label className="login__label" htmlFor="reg-email">Correo electrónico</label>
                        <input
                            id="reg-email"
                            type="email"
                            className="login__input"
                            placeholder="correo@ejemplo.com"
                            autoComplete="email"
                            value={form.email}
                            onChange={set("email")}
                            required
                        />
                    </div>

                    <div className="login__field">
                        <label className="login__label" htmlFor="reg-phone">Teléfono</label>
                        <input
                            id="reg-phone"
                            type="tel"
                            className="login__input"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={set("phone")}
                            maxLength={20}
                            required
                        />
                    </div>

                    <div className="login__field">
                        <label className="login__label" htmlFor="reg-password">Contraseña</label>
                        <input
                            id="reg-password"
                            type="password"
                            className="login__input"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={set("password")}
                            minLength={6}
                            maxLength={64}
                            required
                        />
                        <span className="login__hint">Mínimo 6 caracteres.</span>
                    </div>

                    <div className="login__field">
                        <label className="login__label" htmlFor="reg-confirm">Confirmar contraseña</label>
                        <input
                            id="reg-confirm"
                            type="password"
                            className="login__input"
                            autoComplete="new-password"
                            value={form.confirm}
                            onChange={set("confirm")}
                            required
                        />
                    </div>

                    <button type="submit" className="login__submit" disabled={loading}>
                        {loading ? "Registrando…" : "Crear cuenta"}
                    </button>

                    <p className="login__register">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="login__link">Inicia sesión</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}

export default Register;