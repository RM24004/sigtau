import { useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { createCareer } from "../services/careerService";
import { useNavigate } from "react-router-dom";
import { getTone, getInitials } from "../utils/careerTone";
import "./CareerForm.css";

function CreateCareer() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();

    const trimmed = name.trim();
    const tone = getTone(trimmed);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trimmed) {
            setMsg({ type: "danger", text: "Escribe el nombre de la carrera para continuar." });
            return;
        }

        setLoading(true);
        setMsg(null);
        try {
            const career = {
                name: trimmed,
                description,
            };

            await createCareer(career);
            navigate("/careers", {
                state: { msg: { type: "success", text: "Carrera creada." } },
            });
        } catch (error) {
            console.error(error);
            setMsg({ type: "danger", text: "No se pudo crear la carrera. Intenta de nuevo." });
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
                        <h1 className="cform__title">Nueva carrera</h1>
                        <p className="cform__lead">
                            Aparecerá en el listado de carreras.
                        </p>
                    </header>

                    <Banner msg={msg} onClose={() => setMsg(null)} />

                    <form className="cform__form" onSubmit={handleSubmit}>
                        <div className="cform__name-row">
                            <div className="cform__field">
                                <label className="cform__label" htmlFor="career-name">
                                    Nombre
                                </label>
                                <input
                                    id="career-name"
                                    type="text"
                                    className="cform__input"
                                    placeholder="Ej: Ingeniería de Sistemas"
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
                                placeholder="¿De qué trata la carrera?"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="cform__actions">
                            <button
                                type="submit"
                                className="cform__submit"
                                disabled={loading}
                            >
                                {loading ? "Guardando…" : "Crear carrera"}
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

export default CreateCareer;