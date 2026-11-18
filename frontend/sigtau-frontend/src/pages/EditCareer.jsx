import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { fetchWithAuth } from "../services/api";
import { getTone, getInitials } from "../utils/careerTone";
import "./CareerForm.css";

function EditCareer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ready, setReady] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const trimmed = name.trim();
    const tone = getTone(trimmed);

    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            try {
                const career = await fetchWithAuth(`/careers/${id}`);
                if (!active) return;
                setName(career.name);
                setDescription(career.description || "");
                setReady(true);
            } catch (error) {
                console.error(error);
                if (active) {
                    setMsg({ type: "danger", text: "No se pudo cargar la carrera. Vuelve a la lista e intenta de nuevo." });
                }
            }
        };
        fetchData();
        return () => { active = false; };
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trimmed) {
            setMsg({ type: "danger", text: "Escribe el nombre de la carrera para continuar." });
            return;
        }

        setSaving(true);
        setMsg(null);
        try {
            const careerData = {
                name: trimmed,
                description,
            };

            await fetchWithAuth(`/careers/${id}`, {
                method: "PUT",
                body: JSON.stringify(careerData),
            });

            navigate("/careers", {
                state: { msg: { type: "success", text: "Carrera actualizada." } },
            });
        } catch (error) {
            console.error(error);
            setMsg({ type: "danger", text: "No se pudo actualizar la carrera. Intenta de nuevo." });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="cform">
                <div className="cform__col">
                    <header className="cform__header">
                        <h1 className="cform__title">Editar carrera</h1>
                        <p className="cform__lead">
                            Los cambios se verán en el listado de carreras.
                        </p>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />
                    {!ready && !msg && (
                        <p className="cform__status" role="status">Cargando…</p>
                    )}

                    <form className="cform__form" onSubmit={handleSubmit}>
                        <fieldset className="cform__set" disabled={!ready || saving}>
                            <div className="cform__name-row">
                                <div className="cform__field">
                                    <label className="cform__label" htmlFor="career-name">
                                        Nombre
                                    </label>
                                    <input
                                        id="career-name"
                                        type="text"
                                        className="cform__input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
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
                                <label className="cform__label" htmlFor="career-desc">
                                    Descripción <span className="cform__hint">(opcional)</span>
                                </label>
                                <textarea
                                    id="career-desc"
                                    className="cform__input cform__input--area"
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </fieldset>

                        <div className="cform__actions">
                            <button
                                type="submit"
                                className="cform__submit"
                                disabled={!ready || saving}
                            >
                                {saving ? "Guardando…" : "Guardar cambios"}
                            </button>
                            <button
                                type="button"
                                className="cform__cancel"
                                onClick={() => navigate("/careers")}
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

export default EditCareer;