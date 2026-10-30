import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getTutorings } from "../services/tutoringService";
import { enroll } from "../services/enrollmentService";
import { fmtTime } from "../utils/format";

/** Catálogo de tutorías. El estudiante puede inscribirse desde aquí. */
function Tutorings() {
    const role = localStorage.getItem("role");
    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const [onlyOpen, setOnlyOpen] = useState(true);
    const [msg, setMsg] = useState(null);
    const [busy, setBusy] = useState(null);

    const load = useCallback(async () => {
        try {
            setItems(await getTutorings());
        } catch (e) {
            setMsg({ type: "danger", text: e.message });
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleEnroll = async (t) => {
        setBusy(t.id);
        try {
            await enroll(t.id);
            setMsg({ type: "success", text: `Te inscribiste en "${t.title}"` });
        } catch (e) {
            setMsg({ type: "danger", text: e.message });
        } finally {
            await load(); // refresca cupos
            setBusy(null);
        }
    };

    const visible = items.filter((t) => {
        const open = t.status === "OPEN" && t.availableSpots > 0;
        const text = [t.title, t.subjectName, t.careerName, t.tutorName].join(" ").toLowerCase();
        return (!onlyOpen || open) && text.includes(q.toLowerCase());
    });

    return (
        <>
            <Navbar />
            <div className="container">
                <h2 className="text-primary mb-3">Tutorías disponibles</h2>
                <Banner msg={msg} onClose={() => setMsg(null)} />

                <div className="row g-2 mb-4 align-items-center">
                    <div className="col-md-6">
                        <input
                            className="form-control"
                            placeholder="Buscar por título, materia, carrera o tutor"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="form-check">
                            <input id="onlyOpen" type="checkbox" className="form-check-input"
                                checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
                            <label htmlFor="onlyOpen" className="form-check-label">Solo con cupos disponibles</label>
                        </div>
                    </div>
                </div>

                {visible.length === 0 ? (
                    <div className="alert alert-info text-center">No hay tutorías para mostrar</div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {visible.map((t) => {
                            const full = t.availableSpots <= 0;
                            const closed = t.status !== "OPEN";
                            return (
                                <div className="col" key={t.id}>
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <span className="badge bg-secondary">{t.modalityName}</span>
                                                <span className={`badge ${closed || full ? "bg-danger" : "bg-success"}`}>
                                                    {closed ? "Cerrada" : full ? "Sin cupos" : `${t.availableSpots} cupos`}
                                                </span>
                                            </div>
                                            <h5 className="card-title text-primary mt-2">{t.title}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">{t.subjectName} · {t.careerName}</h6>
                                            {t.description && <p className="card-text small">{t.description}</p>}
                                            <ul className="list-unstyled small mb-0">
                                                <li><strong>Fecha:</strong> {t.tutoringDate}</li>
                                                <li><strong>Horario:</strong> {fmtTime(t.startTime)} – {fmtTime(t.endTime)}</li>
                                                {t.location && <li><strong>Lugar:</strong> {t.location}</li>}
                                                <li><strong>Tutor:</strong> {t.tutorName}</li>
                                            </ul>
                                        </div>
                                        {role === "STUDENT" && (
                                            <div className="card-footer bg-white border-top-0">
                                                {t.enrolledByMe ? (
                                                    <button className="btn btn-outline-success w-100" disabled>Ya estás inscrito</button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary w-100"
                                                        disabled={closed || full || busy === t.id}
                                                        onClick={() => handleEnroll(t)}
                                                    >
                                                        {busy === t.id ? "Inscribiendo..." : "Inscribirme"}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default Tutorings;
