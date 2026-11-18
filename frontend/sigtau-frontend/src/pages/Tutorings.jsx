import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getTutorings } from "../services/tutoringService";
import { enroll } from "../services/enrollmentService";
import { fmtTime } from "../utils/format";
import { canEnroll, hasTutoringStarted } from "../utils/tutoringAvailability";
import { getTone } from "../utils/careerTone";
import useNow from "../hooks/useNow";
import "./Tutorings.css";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MUTED = { bg: "#e6e9f0", fg: "#6b7488" };

/** "2026-11-17" → { weekday, day, month }. Devuelve null si el formato es otro. */
function parseDate(str) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(str || "");
    if (!m) return null;
    const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return {
        weekday: WEEKDAYS[date.getDay()],
        day: Number(m[3]),
        month: MONTHS[Number(m[2]) - 1],
    };
}

/** Catálogo de tutorías. El estudiante puede inscribirse desde aquí. */
function Tutorings() {
    const now = useNow();
    const role = localStorage.getItem("role");
    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const [onlyOpen, setOnlyOpen] = useState(true);
    const [msg, setMsg] = useState(null);
    const [busy, setBusy] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const load = useCallback(async () => {
        try {
            setItems(await getTutorings());
        } catch (e) {
            setMsg({ type: "danger", text: e.message });
        } finally {
            setLoaded(true);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleEnroll = async (t) => {
        if (!canEnroll(t) || busy !== null) return;
        setBusy(t.id);
        try {
            await enroll(t.id);
            setMsg({ type: "success", text: `Te inscribiste en “${t.title}”.` });
        } catch (e) {
            setMsg({ type: "danger", text: e.message });
        } finally {
            await load(); // refresca cupos
            setBusy(null);
        }
    };

    const visible = items.filter((t) => {
        const open = canEnroll(t, now);
        const text = [t.title, t.subjectName, t.careerName, t.tutorName].join(" ").toLowerCase();
        return (!onlyOpen || open) && text.includes(q.toLowerCase());
    });

    const clearFilters = () => { setQ(""); setOnlyOpen(false); };

    return (
        <>
            <Navbar />
            <main className="tg">
                <div className="tg__col">
                    <header className="tg__header">
                        <h1 className="tg__title">Tutorías disponibles</h1>
                        <p className="tg__count">
                            {!loaded
                                ? "Cargando…"
                                : visible.length === 1
                                ? "1 tutoría"
                                : `${visible.length} tutorías`}
                        </p>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />

                    <div className="tg__toolbar">
                        <div className="tg__search">
                            <label htmlFor="tg-q">Buscar</label>
                            <input
                                id="tg-q"
                                type="search"
                                placeholder="Título, materia, carrera o tutor"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </div>
                        <label className="tg__check" htmlFor="onlyOpen">
                            <input
                                id="onlyOpen"
                                type="checkbox"
                                checked={onlyOpen}
                                onChange={(e) => setOnlyOpen(e.target.checked)}
                            />
                            Solo próximas con cupos disponibles
                        </label>
                    </div>

                    {loaded && visible.length === 0 ? (
                        <section className="tg__empty">
                            <p>
                                {items.length === 0
                                    ? "Todavía no hay tutorías publicadas."
                                    : "Ninguna tutoría coincide con tu búsqueda."}
                            </p>
                            {items.length > 0 && (
                                <button className="tg__secondary" onClick={clearFilters}>
                                    Quitar filtros
                                </button>
                            )}
                        </section>
                    ) : (
                        <ul className="tg__grid">
                            {visible.map((t) => {
                                const full = t.availableSpots <= 0;
                                const closed = t.status !== "OPEN";
                                const started = hasTutoringStarted(t, now);
                                const unavailable = closed || full || started;
                                const tone = unavailable ? MUTED : getTone(t.careerName);
                                const date = parseDate(t.tutoringDate);
                                const taken = t.capacity - t.availableSpots;
                                const pct = t.capacity > 0
                                    ? Math.min(100, Math.round((taken / t.capacity) * 100))
                                    : 0;
                                const state = started
                                    ? "Iniciada o finalizada"
                                    : closed
                                    ? "Cerrada"
                                    : full
                                    ? "Sin cupos"
                                    : t.availableSpots === 1
                                    ? "1 cupo disponible"
                                    : `${t.availableSpots} cupos disponibles`;

                                return (
                                    <li
                                        key={t.id}
                                        className="tg__card"
                                        style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                                    >
                                        <header className="tg__head">
                                            {date && (
                                                <div className="tg__date" aria-hidden="true">
                                                    <span className="tg__weekday">{date.weekday}</span>
                                                    <span className="tg__day">{date.day}</span>
                                                    <span className="tg__month">{date.month}</span>
                                                </div>
                                            )}
                                            <div className="tg__head-text">
                                                <p className="tg__mode">{t.modalityName}</p>
                                                <h2 className="tg__card-title">{t.title}</h2>
                                                <p className="tg__subject">
                                                    {t.subjectName} · {t.careerName}
                                                </p>
                                            </div>
                                        </header>

                                        {t.description && <p className="tg__desc">{t.description}</p>}

                                        <dl className="tg__facts">
                                            {!date && (
                                                <div><dt>Fecha</dt><dd>{t.tutoringDate}</dd></div>
                                            )}
                                            <div>
                                                <dt>Horario</dt>
                                                <dd>{fmtTime(t.startTime)} – {fmtTime(t.endTime)}</dd>
                                            </div>
                                            {t.location && (
                                                <div><dt>Lugar</dt><dd>{t.location}</dd></div>
                                            )}
                                            <div><dt>Tutor</dt><dd>{t.tutorName}</dd></div>
                                        </dl>

                                        <footer className="tg__foot">
                                            <div className="tg__spots">
                                                <span className={unavailable ? "tg__state" : "tg__state tg__state--on"}>
                                                    {state}
                                                </span>
                                                {!closed && !started && (
                                                    <span className="tg__meter" aria-hidden="true">
                                                        <span style={{ width: `${pct}%` }}></span>
                                                    </span>
                                                )}
                                            </div>

                                            {role === "STUDENT" && (
                                                t.enrolledByMe ? (
                                                    <button className="tg__enrolled" disabled>
                                                        ✓ Ya estás inscrito
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="tg__enroll"
                                                        disabled={!canEnroll(t, now) || busy !== null}
                                                        onClick={() => handleEnroll(t)}
                                                        aria-label={`Inscribirme en ${t.title}`}
                                                    >
                                                        {busy === t.id ? "Inscribiendo…" : "Inscribirme"}
                                                    </button>
                                                )
                                            )}
                                        </footer>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </main>
        </>
    );
}

export default Tutorings;