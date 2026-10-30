import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import Banner from "../components/Banner";

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
            setMsg({ type: "danger", text: "Las contraseñas no coinciden" });
            return;
        }
        setLoading(true);
        try {
            const { name, email, phone, password } = form;
            await register({ name, email, phone, password });
            alert("Registro exitoso. Ya puedes iniciar sesión.");
            navigate("/login");
        } catch (error) {
            setMsg({ type: "danger", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-lg">
                    <div className="card-header bg-primary text-white text-center py-3">
                        <h4 className="mb-0">SIGTAU · Registro de estudiante</h4>
                    </div>
                    <form className="card-body p-4" onSubmit={handleSubmit}>
                        <Banner msg={msg} onClose={() => setMsg(null)} />
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Nombre completo</label>
                            <input className="form-control" value={form.name} onChange={set("name")} maxLength={100} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Correo electrónico</label>
                            <input type="email" className="form-control" value={form.email} onChange={set("email")} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Teléfono</label>
                            <input className="form-control" value={form.phone} onChange={set("phone")} maxLength={20} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Contraseña</label>
                            <input type="password" className="form-control" value={form.password} onChange={set("password")} minLength={6} maxLength={64} required />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Confirmar contraseña</label>
                            <input type="password" className="form-control" value={form.confirm} onChange={set("confirm")} required />
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-primary" disabled={loading}>
                                {loading ? "Registrando..." : "Crear cuenta"}
                            </button>
                        </div>
                        <p className="text-center text-muted mt-3 mb-0">
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
