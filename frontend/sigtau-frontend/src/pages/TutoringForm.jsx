import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getSubjects } from "../services/subjectService";
import { getModalities } from "../services/modalityService";
import { getUsers } from "../services/userService";
import { createTutoring, getTutoring, updateTutoring } from "../services/tutoringService";
import "./CareerForm.css";

const EMPTY = {
    title: "", description: "", tutoringDate: "", startTime: "", endTime: "",
    location: "", capacity: 10, subjectId: "", modalityId: "", tutorId: "", status: "OPEN",
};

/** Crear / editar tutoría. */
function TutoringForm() {
    const { id } = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";

    const [form, setForm] = useState(EMPTY);
    const [subjects, setSubjects] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [ready, setReady] = useState(false);
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const [s, m] = await Promise.all([getSubjects(), getModalities()]);
                if (!active) return;
                setSubjects(s);
                setModalities(m);
                if (role === "ADMIN") {
                    const users = await getUsers();
                    if (!active) return;
                    setTutors(users.filter((u) => u.roleName === "TUTOR"));
                }
                if (editing) {
                    const t = await getTutoring(id);
                    if (!active) return;
                    setForm({
                        title: t.title, description: t.description || "", tutoringDate: t.tutoringDate,
                        startTime: t.startTime.slice(0, 5), endTime: t.endTime.slice(0, 5),
                        location: t.location || "", capacity: t.capacity, subjectId: t.subjectId,
                        modalityId: t.modalityId, tutorId: t.tutorId, status: t.status,
                    });
                }
                setReady(true);
            } catch (e) {
                if (active) setMsg({ type: "danger", text: e.message });
            }
        })();
        return () => { active = false; };
    }, [id, editing, role]);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.startTime && form.endTime && form.endTime <= form.startTime) {
            setMsg({ type: "danger", text: "La hora de fin debe ser posterior a la de inicio." });
            return;
        }
        setLoading(true);
        setMsg(null);
        try {
            const payload = {
                ...form,
                capacity: Number(form.capacity),
                subjectId: Number(form.subjectId),
                modalityId: Number(form.modalityId),
                tutorId: form.tutorId ? Number(form.tutorId) : null,
            };
            if (editing) await updateTutoring(id, payload);
            else await createTutoring(payload);
            navigate("/manage-tutorings", {
                state: {
                    msg: {
                        type: "success",
                        text: editing ? "Tutoría actualizada." : "Tutoría creada.",
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
                        <h1 className="cform__title">{editing ? "Editar tutoría" : "Nueva tutoría"}</h1>
                        <p className="cform__lead">
                            {editing
                                ? "Los cambios se verán de inmediato para los estudiantes."
                                : "Los estudiantes podrán inscribirse cuando esté abierta."}
                        </p>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />
                    {!ready && !msg && <p className="cform__status" role="status">Cargando…</p>}

                    <form className="cform__form cform__form--wide" onSubmit={handleSubmit}>
                        <fieldset className="cform__set" disabled={!ready || loading}>
                            <section className="cform__section">
                                <h2 className="cform__section-title">Detalles</h2>

                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="t-title">Título</label>
                                    <input
                                        id="t-title"
                                        className="cform__input"
                                        value={form.title}
                                        onChange={set("title")}
                                        maxLength={150}
                                        required
                                    />
                                </div>

                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="t-desc">
                                        Descripción <span className="cform__hint">(opcional)</span>
                                    </label>
                                    <textarea
                                        id="t-desc"
                                        className="cform__input cform__input--area"
                                        rows="4"
                                        value={form.description}
                                        onChange={set("description")}
                                        maxLength={500}
                                    />
                                </div>

                                <div className="cform__row">
                                    <div className="cform__field">
                                        <label className="cform__label" htmlFor="t-subject">Materia</label>
                                        <select
                                            id="t-subject"
                                            className="cform__input"
                                            value={form.subjectId}
                                            onChange={set("subjectId")}
                                            required
                                        >
                                            <option value="">Selecciona una materia</option>
                                            {subjects.map((s) => (
                                                <option key={s.id} value={s.id}>{s.careerName} — {s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="cform__field">
                                        <label className="cform__label" htmlFor="t-modality">Modalidad</label>
                                        <select
                                            id="t-modality"
                                            className="cform__input"
                                            value={form.modalityId}
                                            onChange={set("modalityId")}
                                            required
                                        >
                                            <option value="">Selecciona una modalidad</option>
                                            {modalities.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section className="cform__section">
                                <h2 className="cform__section-title">Fecha y horario</h2>
                                <div className="cform__row cform__row--3">
                                    <div className="cform__field">
                                        <label className="cform__label" htmlFor="t-date">Fecha</label>
                                        <input
                                            id="t-date"
                                            type="date"
                                            className="cform__input"
                                            value={form.tutoringDate}
                                            onChange={set("tutoringDate")}
                                            required
                                        />
                                    </div>
                                    <div className="cform__field">
                                        <label className="cform__label" htmlFor="t-start">Inicio</label>
                                        <input
                                            id="t-start"
                                            type="time"
                                            className="cform__input"
                                            value={form.startTime}
                                            onChange={set("startTime")}
                                            required
                                        />
                                    </div>
                                    <div className="cform__field">
                                        <label className="cform__label" htmlFor="t-end">Fin</label>
                                        <input
                                            id="t-end"
                                            type="time"
                                            className="cform__input"
                                            value={form.endTime}
                                            onChange={set("endTime")}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="cform__section">
                                <h2 className="cform__section-title">Lugar y cupos</h2>
                                <div className="cform__row cform__row--wide-narrow">
                                    <div className="cform__field">
                                        <label className="cform__label" htmlFor="t-location">
                                            Lugar o enlace <span className="cform__hint">(opcional)</span>
                                        </label>
                                        <input
                                            id="t-location"
                                            className="cform__input"
                                            value={form.location}
                                            onChange={set("location")}
                                            maxLength={150}
                                        />
                                    </div>
                                    <div className="cform__field">
                                        <label className="cform__label" htmlFor="t-capacity">Cupos</label>
                                        <input
                                            id="t-capacity"
                                            type="number"
                                            min="1"
                                            className="cform__input"
                                            value={form.capacity}
                                            onChange={set("capacity")}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {(isAdmin || editing) && (
                                <section className="cform__section">
                                    <h2 className="cform__section-title">Gestión</h2>

                                    {isAdmin && (
                                        <div className="cform__field">
                                            <label className="cform__label" htmlFor="t-tutor">Tutor</label>
                                            <select
                                                id="t-tutor"
                                                className="cform__input"
                                                value={form.tutorId}
                                                onChange={set("tutorId")}
                                                required
                                            >
                                                <option value="">Selecciona un tutor</option>
                                                {tutors.map((t) => (
                                                    <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {editing && (
                                        <div className="cform__field">
                                            <label className="cform__label" htmlFor="t-status">Estado</label>
                                            <select
                                                id="t-status"
                                                className="cform__input"
                                                value={form.status}
                                                onChange={set("status")}
                                            >
                                                <option value="OPEN">Abierta (acepta inscripciones)</option>
                                                <option value="CLOSED">Cerrada</option>
                                            </select>
                                        </div>
                                    )}
                                </section>
                            )}
                        </fieldset>

                        <div className="cform__actions">
                            <button
                                type="submit"
                                className="cform__submit"
                                disabled={!ready || loading}
                            >
                                {loading ? "Guardando…" : editing ? "Guardar cambios" : "Crear tutoría"}
                            </button>
                            <button
                                type="button"
                                className="cform__cancel"
                                onClick={() => navigate("/manage-tutorings")}
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

export default TutoringForm;