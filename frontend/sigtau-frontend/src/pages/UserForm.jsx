import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getRoles } from "../services/roleService";
import { createUser, getUser, updateUser } from "../services/userService";
import { getTone, getInitials } from "../utils/careerTone";
import "./CareerForm.css";

const ROLE_LABEL = { STUDENT: "Estudiante", TUTOR: "Tutor", ADMIN: "Administrador" };

/** El ADMIN crea tutores, administradores o estudiantes y puede cambiar roles. */
function UserForm() {
    const { id } = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", roleId: "" });
    const [roles, setRoles] = useState([]);
    const [ready, setReady] = useState(false);
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const trimmed = form.name.trim();
    const tone = getTone(trimmed);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const list = await getRoles();
                if (!active) return;
                setRoles(list);
                if (editing) {
                    const u = await getUser(id);
                    if (!active) return;
                    setForm({ name: u.name, email: u.email, phone: u.phone || "", password: "", roleId: u.roleId });
                }
                setReady(true);
            } catch (e) {
                if (active) setMsg({ type: "danger", text: e.message });
            }
        })();
        return () => { active = false; };
    }, [id, editing]);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!trimmed) {
            setMsg({ type: "danger", text: "El nombre es obligatorio." });
            return;
        }
        setLoading(true);
        setMsg(null);
        try {
            const payload = { ...form, name: trimmed, roleId: Number(form.roleId) };
            if (editing && !payload.password) delete payload.password;
            if (editing) await updateUser(id, payload);
            else await createUser(payload);
            navigate("/users", {
                state: {
                    msg: {
                        type: "success",
                        text: editing ? "Usuario actualizado." : "Usuario creado.",
                    },
                },
            });
        } catch (error) {
            setMsg({ type: "danger", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="cform">
                <div className="cform__col">
                    <header className="cform__header">
                        <h1 className="cform__title">{editing ? "Editar usuario" : "Nuevo usuario"}</h1>
                        <p className="cform__lead">
                            {editing
                                ? "Puedes cambiar sus datos y su rol."
                                : "Crea una cuenta de estudiante, tutor o administrador."}
                        </p>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />
                    {!ready && !msg && <p className="cform__status" role="status">Cargando…</p>}

                    <form className="cform__form" onSubmit={handleSubmit}>
                        <fieldset className="cform__set" disabled={!ready || loading}>
                            <div className="cform__name-row">
                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="user-name">Nombre</label>
                                    <input
                                        id="user-name"
                                        className="cform__input"
                                        autoComplete="off"
                                        value={form.name}
                                        onChange={set("name")}
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <span
                                    className="cform__mark"
                                    style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                                    aria-hidden="true"
                                    title="Así se verá en la lista"
                                >
                                    {trimmed ? getInitials(trimmed) : "?"}
                                </span>
                            </div>

                            <div className="cform__row">
                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="user-email">Correo</label>
                                    <input
                                        id="user-email"
                                        type="email"
                                        className="cform__input"
                                        autoComplete="off"
                                        value={form.email}
                                        onChange={set("email")}
                                        required
                                    />
                                </div>
                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="user-phone">Teléfono</label>
                                    <input
                                        id="user-phone"
                                        type="tel"
                                        className="cform__input"
                                        autoComplete="off"
                                        value={form.phone}
                                        onChange={set("phone")}
                                        maxLength={20}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="cform__row">
                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="user-password">Contraseña</label>
                                    <input
                                        id="user-password"
                                        type="password"
                                        className="cform__input"
                                        autoComplete="new-password"
                                        value={form.password}
                                        onChange={set("password")}
                                        minLength={6}
                                        maxLength={64}
                                        required={!editing}
                                    />
                                    <span className="cform__hint">
                                        {editing
                                            ? "Déjala vacía para conservar la actual."
                                            : "Mínimo 6 caracteres."}
                                    </span>
                                </div>
                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="user-role">Rol</label>
                                    <select
                                        id="user-role"
                                        className="cform__input"
                                        value={form.roleId}
                                        onChange={set("roleId")}
                                        required
                                    >
                                        <option value="">Selecciona un rol</option>
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {ROLE_LABEL[r.name] || r.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <div className="cform__actions">
                            <button
                                type="submit"
                                className="cform__submit"
                                disabled={!ready || loading}
                            >
                                {loading ? "Guardando…" : editing ? "Guardar cambios" : "Crear usuario"}
                            </button>
                            <button
                                type="button"
                                className="cform__cancel"
                                onClick={() => navigate("/users")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default UserForm;