import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getMyTutorings, deleteTutoring } from "../services/tutoringService";
import { fmtTime } from "../utils/format";
import "./DataTable.css";

/** Tutor: sus tutorías. Admin: todas. */
function ManageTutorings() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role");
    const [items, setItems] = useState([]);
    // Si venimos de crear o editar una tutoría, mostramos su aviso
    const [msg, setMsg] = useState(location.state?.msg ?? null);

    const load = useCallback(() => getMyTutorings()
        .then(setItems)
        .catch(e => setMsg({ type: "danger", text: e.message })), []);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async (t) => {
        if (!window.confirm(`¿Eliminar la tutoría "${t.title}"?`)) return;
        try {
            await deleteTutoring(t.id);
            setMsg({ type: "success", text: "Tutoría eliminada." });
            await load();
        } catch (e) {
            setMsg({ type: "danger", text: e.message });
        }
    };

    const total = items.length;
    const isAdmin = role === "ADMIN";

    return (
        <>
            <Navbar />
            <main className="dt">
                <div className="dt__col">
                    <header className="dt__header">
                        <div>
                            <h1 className="dt__title">{isAdmin ? "Todas las tutorías" : "Mis tutorías"}</h1>
                            <p className="dt__count">
                                {total === 0
                                    ? "Sin tutorías registradas"
                                    : total === 1
                                    ? "1 tutoría"
                                    : `${total} tutorías`}
                            </p>
                        </div>
                        <button className="dt__create" onClick={() => navigate("/tutorings/new")}>
                            Nueva tutoría
                        </button>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />

                    {total === 0 ? (
                        <p className="dt__empty">Todavía no hay tutorías registradas.</p>
                    ) : (
                        <div className="dt__scroll">
                            <table className="dt__table">
                                <thead>
                                    <tr>
                                        <th scope="col">Tutoría</th>
                                        <th scope="col">Cuándo</th>
                                        {isAdmin && <th scope="col">Tutor</th>}
                                        <th scope="col">Inscritos</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col"><span className="dt__sr">Acciones</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((t) => {
                                        const enrolled = t.capacity - t.availableSpots;
                                        const pct = t.capacity > 0
                                            ? Math.min(100, Math.round((enrolled / t.capacity) * 100))
                                            : 0;
                                        const open = t.status === "OPEN";
                                        return (
                                            <tr key={t.id}>
                                                <td>
                                                    <span className="dt__main">{t.title}</span>
                                                    <span className="dt__sub">{t.subjectName}</span>
                                                </td>
                                                <td>
                                                    <span className="dt__main">{t.tutoringDate}</span>
                                                    <span className="dt__sub">
                                                        {fmtTime(t.startTime)} – {fmtTime(t.endTime)}
                                                    </span>
                                                </td>
                                                {isAdmin && (
                                                    <td data-label="Tutor">{t.tutorName}</td>
                                                )}
                                                <td data-label="Inscritos" className="dt__meter-wrap">
                                                    <span className="dt__meter-num">
                                                        {enrolled} / {t.capacity}
                                                    </span>
                                                    <span className="dt__meter" aria-hidden="true">
                                                        <span style={{ width: `${pct}%` }}></span>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={open ? "dt__status dt__status--on" : "dt__status"}>
                                                        {open ? "Abierta" : "Cerrada"}
                                                    </span>
                                                </td>
                                                <td className="dt__actions">
                                                    <div className="dt__links">
                                                        <button
                                                            className="dt__link"
                                                            onClick={() => navigate(`/enrollments?tutoringId=${t.id}`)}
                                                            aria-label={`Ver inscritos de ${t.title}`}
                                                        >
                                                            Inscritos
                                                        </button>
                                                        <button
                                                            className="dt__link"
                                                            onClick={() => navigate(`/tutorings/edit/${t.id}`)}
                                                            aria-label={`Editar ${t.title}`}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="dt__danger"
                                                            onClick={() => handleDelete(t)}
                                                            aria-label={`Eliminar ${t.title}`}
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

export default ManageTutorings;