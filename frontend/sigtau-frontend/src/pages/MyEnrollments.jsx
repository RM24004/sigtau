import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getMyEnrollments, cancelEnrollment } from "../services/enrollmentService";
import { getReasons } from "../services/reasonService";
import { fmtTime } from "../utils/format";
import { hasTutoringStarted } from "../utils/tutoringAvailability";
import useNow from "../hooks/useNow";
import "./DataTable.css";

/** Inscripciones del estudiante autenticado, con opción de cancelar. */
function MyEnrollments() {
    const navigate = useNavigate();
    const now = useNow();
    const [items, setItems] = useState([]);
    const [reasons, setReasons] = useState([]);
    const [target, setTarget] = useState(null);
    const [reasonId, setReasonId] = useState("");
    const [msg, setMsg] = useState(null);
    const [busy, setBusy] = useState(false);
    const panelRef = useRef(null);

    const load = useCallback(() => getMyEnrollments()
        .then(setItems)
        .catch(e => setMsg({ type: "danger", text: e.message })), []);

    useEffect(() => {
        load();
        getReasons().then(setReasons).catch(() => {});
    }, [load]);

    // Al abrir el panel de cancelación, lo traemos a la vista (la lista puede ser larga)
    useEffect(() => {
        if (target) panelRef.current?.scrollIntoView({ block: "center" });
    }, [target]);

    const confirmCancel = async () => {
        if (busy || !target) return;
        if (hasTutoringStarted(target)) {
            setMsg({ type: "warning", text: "La tutoría ya comenzó; no puedes cancelar la inscripción." });
            setTarget(null);
            return;
        }
        setBusy(true);
        try {
            await cancelEnrollment(target.id, reasonId ? Number(reasonId) : null);
            setMsg({ type: "success", text: "Inscripción cancelada." });
            setTarget(null);
            setReasonId("");
            await load();
        } catch (e) {
            setMsg({ type: "danger", text: e.message });
        } finally {
            setBusy(false);
        }
    };

    const total = items.length;
    const started = target ? hasTutoringStarted(target, now) : false;

    return (
        <>
            <Navbar />
            <main className="dt">
                <div className="dt__col">
                    <header className="dt__header">
                        <div>
                            <h1 className="dt__title">Mis inscripciones</h1>
                            <p className="dt__count">
                                {total === 0
                                    ? "Sin inscripciones"
                                    : total === 1
                                    ? "1 inscripción"
                                    : `${total} inscripciones`}
                            </p>
                        </div>
                        <button className="dt__secondary" onClick={() => navigate("/tutorings")}>
                            Ver tutorías
                        </button>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />

                    {target && (
                        <section
                            className="dt__panel"
                            ref={panelRef}
                            aria-label="Cancelar inscripción"
                        >
                            <h2 className="dt__panel-title">
                                Cancelar tu inscripción en “{target.tutoringTitle}”
                            </h2>

                            <label className="dt__label" htmlFor="cancel-reason">
                                Motivo <span className="dt__note">(opcional)</span>
                            </label>
                            <select
                                id="cancel-reason"
                                className="dt__select"
                                value={reasonId}
                                onChange={(e) => setReasonId(e.target.value)}
                            >
                                <option value="">Sin motivo</option>
                                {reasons.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>

                            {started && (
                                <p className="dt__warn" role="status">
                                    La tutoría ya comenzó; no puedes cancelar la inscripción.
                                </p>
                            )}

                            <div className="dt__panel-actions">
                                <button
                                    className="dt__danger-solid"
                                    disabled={busy || started}
                                    onClick={confirmCancel}
                                >
                                    {busy ? "Cancelando…" : "Confirmar cancelación"}
                                </button>
                                <button
                                    className="dt__link"
                                    disabled={busy}
                                    onClick={() => setTarget(null)}
                                >
                                    Volver
                                </button>
                            </div>
                        </section>
                    )}

                    {total === 0 ? (
                        <p className="dt__empty">Aún no te has inscrito en ninguna tutoría.</p>
                    ) : (
                        <div className="dt__scroll">
                            <table className="dt__table">
                                <thead>
                                    <tr>
                                        <th scope="col">Tutoría</th>
                                        <th scope="col">Cuándo</th>
                                        <th scope="col">Tutor</th>
                                        <th scope="col">Estado</th>
                                        <th scope="col"><span className="dt__sr">Acciones</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((e) => {
                                        const active = e.status === "ACTIVE";
                                        const begun = hasTutoringStarted(e, now);
                                        return (
                                            <tr key={e.id}>
                                                <td>
                                                    <span className="dt__main">{e.tutoringTitle}</span>
                                                    <span className="dt__sub">{e.subjectName}</span>
                                                </td>
                                                <td>
                                                    <span className="dt__main">{e.tutoringDate}</span>
                                                    <span className="dt__sub">
                                                        {fmtTime(e.startTime)} – {fmtTime(e.endTime)}
                                                    </span>
                                                </td>
                                                <td data-label="Tutor">{e.tutorName}</td>
                                                <td>
                                                    <span className={active ? "dt__status dt__status--on" : "dt__status"}>
                                                        {active ? "Activa" : "Cancelada"}
                                                    </span>
                                                    {e.reasonName && (
                                                        <span className="dt__sub">{e.reasonName}</span>
                                                    )}
                                                </td>
                                                <td className="dt__actions">
                                                    {active && !begun && (
                                                        <button
                                                            className="dt__danger"
                                                            disabled={busy}
                                                            onClick={() => { setTarget(e); setReasonId(""); }}
                                                            aria-label={`Cancelar inscripción en ${e.tutoringTitle}`}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    )}
                                                    {active && begun && (
                                                        <span className="dt__note">Plazo de cancelación finalizado</span>
                                                    )}
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

export default MyEnrollments;