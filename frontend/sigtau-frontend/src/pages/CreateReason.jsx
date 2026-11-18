import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { createReason, getReason, updateReason } from "../services/reasonService";
import { getTone, getInitials } from "../utils/careerTone";
import "./CareerForm.css";

export default function CreateReason() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", description: "" });
    const [ready, setReady] = useState(!id);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const trimmed = form.name.trim();
    const tone = getTone(trimmed);

    useEffect(() => {
        if (!id) return;
        let active = true;
        getReason(id).then(data => {
            if (active) {
                setForm({ name: data.name, description: data.description || "" });
                setReady(true);
            }
        }).catch(error => {
            if (active) setMsg({ type: "danger", text: error.message });
        });
        return () => { active = false; };
    }, [id]);

    async function submit(event) {
        event.preventDefault();
        if (!trimmed) {
            setMsg({ type: "danger", text: "El nombre es obligatorio." });
            return;
        }
        setSaving(true);
        setMsg(null);
        try {
            const data = { name: trimmed, description: form.description.trim() };
            if (id) await updateReason(id, data);
            else await createReason(data);
            navigate("/reasons", {
                state: {
                    msg: {
                        type: "success",
                        text: id ? "Motivo actualizado." : "Motivo creado.",
                    },
                },
            });
        } catch (error) {
            setMsg({ type: "danger", text: error.message });
        } finally { setSaving(false); }
    }

    return <>
        <Navbar />
        <main className="cform">
            <div className="cform__col">
                <header className="cform__header">
                    <h1 className="cform__title">{id ? "Editar motivo" : "Nuevo motivo"}</h1>
                    <p className="cform__lead">
                        {id
                            ? "Los cambios se verán en el listado y cuando alguien cancele una inscripción."
                            : "Los estudiantes podrán elegirlo al cancelar una inscripción."}
                    </p>
                </header>

                <Banner msg={msg} onClose={() => setMsg(null)} />
                {!ready && !msg && <p className="cform__status" role="status">Cargando…</p>}

                <form onSubmit={submit} className="cform__form">
                    <fieldset className="cform__set" disabled={!ready || saving}>
                        <div className="cform__name-row">
                            <div className="cform__field">
                                <label htmlFor="catalog-name" className="cform__label">Nombre</label>
                                <input
                                    id="catalog-name"
                                    className="cform__input"
                                    placeholder="Ej: Conflicto de horario"
                                    required
                                    maxLength={100}
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <span
                                className="cform__mark"
                                style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                                aria-hidden="true"
                                title="Así se verá en la lista"
                            >
                                {trimmed ? getInitials(trimmed) : "?"}
                            </span>
                        </div>

                        <div className="cform__field">
                            <label htmlFor="catalog-description" className="cform__label">
                                Descripción <span className="cform__hint">(opcional)</span>
                            </label>
                            <textarea
                                id="catalog-description"
                                className="cform__input cform__input--area"
                                placeholder="Detalle opcional del motivo"
                                rows="4"
                                maxLength={255}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </fieldset>

                    <div className="cform__actions">
                        <button
                            type="submit"
                            className="cform__submit"
                            disabled={!ready || saving}
                        >
                            {saving ? "Guardando…" : id ? "Guardar cambios" : "Crear motivo"}
                        </button>
                        <button
                            type="button"
                            className="cform__cancel"
                            onClick={() => navigate("/reasons")}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </>;
}