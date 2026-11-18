import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getCareers } from "../services/careerService";
import { createSubject, getSubject, updateSubject } from "../services/subjectService";
import { getTone, getInitials } from "../utils/careerTone";
import "./CareerForm.css";

/** Crear / editar materia (con su carrera). */
function SubjectForm() {
    const { id } = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", description: "", careerId: "" });
    const [careers, setCareers] = useState([]);
    const [ready, setReady] = useState(false);
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const trimmed = form.name.trim();
    // El color de la ficha depende de la carrera, igual que en la lista de materias
    const careerName = careers.find((c) => String(c.id) === String(form.careerId))?.name ?? "";
    const tone = careerName ? getTone(careerName) : null;

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const list = await getCareers();
                if (!active) return;
                setCareers(list);
                if (editing) {
                    const s = await getSubject(id);
                    if (!active) return;
                    setForm({ name: s.name, description: s.description || "", careerId: s.careerId });
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
            const payload = {
                ...form,
                name: trimmed,
                description: form.description.trim(),
                careerId: Number(form.careerId),
            };
            if (editing) await updateSubject(id, payload);
            else await createSubject(payload);
            navigate("/subjects", {
                state: {
                    msg: {
                        type: "success",
                        text: editing ? "Materia actualizada." : "Materia creada.",
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
                        <h1 className="cform__title">{editing ? "Editar materia" : "Nueva materia"}</h1>
                        <p className="cform__lead">
                            {editing
                                ? "Los cambios se verán en el listado de materias."
                                : "Cada materia pertenece a una carrera."}
                        </p>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />
                    {!ready && !msg && <p className="cform__status" role="status">Cargando…</p>}

                    <form className="cform__form" onSubmit={handleSubmit}>
                        <fieldset className="cform__set" disabled={!ready || loading}>
                            <div className="cform__name-row">
                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="subject-name">Nombre</label>
                                    <input
                                        id="subject-name"
                                        className="cform__input"
                                        placeholder="Ej: Cálculo I"
                                        value={form.name}
                                        onChange={set("name")}
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <span
                                    className="cform__mark"
                                    style={tone ? { "--tone-bg": tone.bg, "--tone-fg": tone.fg } : undefined}
                                    aria-hidden="true"
                                    title="Así se verá en la lista"
                                >
                                    {trimmed ? getInitials(trimmed) : "?"}
                                </span>
                            </div>

                            <div className="cform__field">
                                <label className="cform__label" htmlFor="subject-career">Carrera</label>
                                <select
                                    id="subject-career"
                                    className="cform__input"
                                    value={form.careerId}
                                    onChange={set("careerId")}
                                    required
                                >
                                    <option value="">Selecciona una carrera</option>
                                    {careers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {ready && careers.length === 0 && (
                                    <span className="cform__hint">
                                        Todavía no hay carreras.{" "}
                                        <Link to="/create-career">Crea una primero</Link>.
                                    </span>
                                )}
                            </div>

                            <div className="cform__field">
                                <label className="cform__label" htmlFor="subject-desc">
                                    Descripción <span className="cform__hint">(opcional)</span>
                                </label>
                                <textarea
                                    id="subject-desc"
                                    className="cform__input cform__input--area"
                                    rows="4"
                                    value={form.description}
                                    onChange={set("description")}
                                    maxLength={255}
                                />
                            </div>
                        </fieldset>

                        <div className="cform__actions">
                            <button
                                type="submit"
                                className="cform__submit"
                                disabled={!ready || loading}
                            >
                                {loading ? "Guardando…" : editing ? "Guardar cambios" : "Crear materia"}
                            </button>
                            <button
                                type="button"
                                className="cform__cancel"
                                onClick={() => navigate("/subjects")}
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

export default SubjectForm;