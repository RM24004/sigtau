import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUsers, deleteUser } from "../services/userService";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getTone, getInitials } from "../utils/careerTone";
import "./DataTable.css";

const ROLE_LABEL = { ADMIN: "Administrador", TUTOR: "Tutor", STUDENT: "Estudiante" };
const ROLE_CLASS = { ADMIN: "dt__role dt__role--admin", TUTOR: "dt__role dt__role--tutor" };

function Users() {
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [loaded, setLoaded] = useState(false);
    // Si venimos de crear o editar un usuario, mostramos su aviso
    const [msg, setMsg] = useState(location.state?.msg ?? null);

    const load = useCallback(() => getUsers()
        .then(setUsers)
        .catch(e => setMsg({ type: "danger", text: e.message }))
        .finally(() => setLoaded(true)), []);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async (u) => {
        if (!window.confirm(`¿Eliminar a ${u.name}?`)) return;
        try {
            await deleteUser(u.id);
            setMsg({ type: "success", text: "Usuario eliminado." });
            await load();
        } catch (e) {
            setMsg({ type: "danger", text: e.message });
        }
    };

    const total = users.length;

    return (
        <>
            <Navbar />
            <main className="dt">
                <div className="dt__col">
                    <header className="dt__header">
                        <div>
                            <h1 className="dt__title">Usuarios</h1>
                            <p className="dt__count">
                                {!loaded
                                    ? "Cargando…"
                                    : total === 0
                                    ? "Sin usuarios registrados"
                                    : total === 1
                                    ? "1 usuario"
                                    : `${total} usuarios`}
                            </p>
                        </div>
                        <button className="dt__create" onClick={() => navigate("/users/new")}>
                            Nuevo usuario
                        </button>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />

                    {loaded && total === 0 ? (
                        <p className="dt__empty">Todavía no hay usuarios registrados.</p>
                    ) : (
                        <div className="dt__scroll">
                            <table className="dt__table">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Usuario</th>
                                        <th scope="col">Teléfono</th>
                                        <th scope="col">Rol</th>
                                        <th scope="col"><span className="dt__sr">Acciones</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => {
                                        const tone = getTone(u.name);
                                        return (
                                            <tr key={u.id}>
                                                <td data-label="ID" className="dt__soft">{u.id}</td>
                                                <td>
                                                    <div
                                                        className="dt__who"
                                                        style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                                                    >
                                                        <span className="dt__avatar" aria-hidden="true">
                                                            {getInitials(u.name)}
                                                        </span>
                                                        <div>
                                                            <span className="dt__main">{u.name}</span>
                                                            <span className="dt__sub">{u.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td data-label="Teléfono" className="dt__soft">
                                                    {u.phone || "N/A"}
                                                </td>
                                                <td>
                                                    <span className={ROLE_CLASS[u.roleName] || "dt__role"}>
                                                        {ROLE_LABEL[u.roleName] || u.roleName}
                                                    </span>
                                                </td>
                                                <td className="dt__actions">
                                                    <div className="dt__links">
                                                        <button
                                                            className="dt__link"
                                                            onClick={() => navigate(`/users/edit/${u.id}`)}
                                                            aria-label={`Editar a ${u.name}`}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="dt__danger"
                                                            onClick={() => handleDelete(u)}
                                                            aria-label={`Eliminar a ${u.name}`}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default Users;