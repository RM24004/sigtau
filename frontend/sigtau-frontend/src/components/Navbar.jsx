import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearSession, homeFor } from "../utils/auth";
import "./Navbar.css";

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
    const [open, setOpen] = useState(false);
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name") || localStorage.getItem("email");

    const handleLogout = () => {
        clearSession();
        navigate("/login");
    };

    return (
        <header className="nav">
            <div className="nav__inner">
                <NavLink className="nav__brand" to={homeFor(role)} onClick={() => setOpen(false)}>
                    SIGTAU
                </NavLink>

                <button
                    type="button"
                    className="nav__toggle"
                    aria-label={open ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={open}
                    aria-controls="nav-panel"
                    onClick={() => setOpen(!open)}
                >
                    <span className="nav__bars" aria-hidden="true"></span>
                </button>

                <nav
                    id="nav-panel"
                    className={open ? "nav__panel nav__panel--open" : "nav__panel"}
                    aria-label="Principal"
                >
                    <ul className="nav__links">
                        {(MENU[role] || []).map(([label, path]) => (
                            <li key={path}>
                                <NavLink
                                    className="nav__link"
                                    to={path}
                                    onClick={() => setOpen(false)}
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="nav__user">
                        <span className="nav__name">{name}</span>
                        <span className="nav__role">{ROLE_LABEL[role] || role}</span>
                        <button className="nav__logout" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;