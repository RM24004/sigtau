import { NavLink, useNavigate } from "react-router-dom";
import { clearSession, homeFor } from "../utils/auth";

const MENU = {
    STUDENT: [
        ["Tutorías", "/tutorings"],
        ["Mis inscripciones", "/my-enrollments"],
    ],
    TUTOR: [
        ["Mis tutorías", "/manage-tutorings"],
        ["Inscritos", "/enrollments"],
    ],
    ADMIN: [
        ["Tutorías", "/manage-tutorings"],
        ["Inscripciones", "/enrollments"],
        ["Carreras", "/careers"],
        ["Materias", "/subjects"],
        ["Modalidades", "/modalities"],
        ["Motivos", "/reasons"],
        ["Usuarios", "/users"],
    ],
};

const ROLE_LABEL = { STUDENT: "Estudiante", TUTOR: "Tutor", ADMIN: "Administrador" };

function Navbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name") || localStorage.getItem("email");

    const handleLogout = () => {
        clearSession();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
            <div className="container">
                <NavLink className="navbar-brand fw-bold" to={homeFor(role)}>SIGTAU</NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-label="Mostrar menú"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {(MENU[role] || []).map(([label, path]) => (
                            <li className="nav-item" key={path}>
                                <NavLink className="nav-link" to={path}>{label}</NavLink>
                            </li>
                        ))}
                    </ul>

                    <span className="navbar-text me-3">
                        {name} <span className="badge bg-light text-primary ms-1">{ROLE_LABEL[role] || role}</span>
                    </span>
                    <button className="btn btn-outline-light" onClick={handleLogout}>Cerrar sesión</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
