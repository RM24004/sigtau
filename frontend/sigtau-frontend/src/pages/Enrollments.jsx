import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getEnrollments, cancelEnrollment } from "../services/enrollmentService";
import { fmtDateTime, fmtTime } from "../utils/format";
import "./DataTable.css";

/** Tutor: inscritos en sus tutorías. Admin: todas las inscripciones (y puede cancelarlas). */
function Enrollments() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const tutoringId = params.get("tutoringId");
    const role = localStorage.getItem("role");
    const [items, setItems] = useState([]);
    const [msg, setMsg] = useState(null);

    const load = useCallback(() => getEnrollments(tutoringId)
        .then(setItems)
        .catch(e => setMsg({ type: "danger", text: e.message })), [tutoringId]);

    useEffect(() => { load(); }, [load]);

    const handleCancel = async (e) => {
        if (!window.confirm(`¿Cancelar la inscripción de ${e.studentName}?`)) return;
        try {
            await cancelEnrollment(e.id, null);
            setMsg({ type: "success", text: "Inscripción cancelada." });
            await load();
        } catch (err) {
            setMsg({ type: "danger", text: err.message });
        }
    };

    const total = items.length;

    return (
        <>
            <Navbar />
            <main className="dt">
                <div className="dt__col">
                    <header className="dt__header">
                        <div>
                            <h1 className="dt__title">
                                {tutoringId ? "Inscritos en la tutoría" : "Inscripciones"}
                            </h1>
                            <p className="dt__count">
                                {total === 0
                                    ? "Sin inscripciones"
                                    : total === 1
                                    ? "1 inscripción"
                                    : `${total} inscripciones`}
                            </p>
                        </div>
                        {tutoringId && (
                            <button className="dt__secondary" onClick={() => navigate("/enrollments")}>
                                Ver todas
                            </button>
                        )}
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />

                    {total === 0 ? (
                        <p className="dt__empty">
                            {tutoringId
                                ? "Nadie se ha inscrito en esta tutoría todavía."
                                : "Todavía no hay inscripciones registradas."}
                        </p>
                    ) : (
                        <div className="dt__scroll">
                            <table className="dt__table">
                                <thead>
                                    <tr>
                                        <th scope="col">Estudiante</th>
                                        <th scope="col">Tutoría</th>
                                        <th scope="col">Inscrito el</th>
                                        <th scope="col">Estado</th>
                                        {role === "ADMIN" && (
                                            <th scope="col"><span className="dt__sr">Acciones</span></th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((e) => {
                                        const active = e.status === "ACTIVE";
                                        return (
                                            <tr key={e.id}>
                                                <td>
                                                    <span className="dt__main">{e.studentName}</span>
                                                    <span className="dt__sub">{e.studentEmail}</span>
                                                </td>
                                                <td>
                                                    <span className="dt__main">{e.tutoringTitle}</span>
                                                    <span className="dt__sub">
                                                        {e.tutoringDate} · {fmtTime(e.startTime)} – {fmtTime(e.endTime)}
                                                    </span>
                                                </td>
                                                <td data-label="Inscrito el" className="dt__when">
                                                    {fmtDateTime(e.enrolledAt)}
                                                </td>
                                                <td>
                                                    <span className={active ? "dt__status dt__status--on" : "dt__status"}>
                                                        {active ? "Activa" : "Cancelada"}
                                                    </span>
                                                </td>
                                                {role === "ADMIN" && (
                                                    <td className="dt__actions">
                                                        {active && (
                                                            <button
                                                                className="dt__danger"
                                                                onClick={() => handleCancel(e)}
                                                                aria-label={`Cancelar inscripción de ${e.studentName}`}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
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

export default Enrollments;