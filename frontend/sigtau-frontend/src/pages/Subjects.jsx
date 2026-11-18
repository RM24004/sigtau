import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getSubjects, deleteSubject } from "../services/subjectService";
import { getCareers } from "../services/careerService";
import { getTone, getInitials } from "../utils/careerTone";
import "./CatalogList.css";

function Subjects() {
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [careers, setCareers] = useState([]);
    const [careerId, setCareerId] = useState("");
    const [loaded, setLoaded] = useState(false);
    // Si venimos de crear o editar una materia, mostramos su aviso
    const [msg, setMsg] = useState(location.state?.msg ?? null);

    const load = useCallback(() => getSubjects(careerId || null)
        .then(setItems)
        .catch(e => setMsg({ type: "danger", text: e.message }))
        .finally(() => setLoaded(true)), [careerId]);

    useEffect(() => { getCareers().then(setCareers).catch(() => {}); }, []);
    useEffect(() => { load(); }, [load]);

    const handleDelete = async (s) => {
        if (!window.confirm(`¿Eliminar la materia "${s.name}"?`)) return;
        try {
            await deleteSubject(s.id);
            setMsg({ type: "success", text: "Materia eliminada." });
            await load();
        } catch (e) {
            setMsg({ type: "danger", text: e.message });
        }
    };

    const total = items.length;
    const filtered = Boolean(careerId);

    return (
        <>
            <Navbar />
            <main className="cl">
                <header className="cl__header">
                    <div>
                        <h1 className="cl__title">Materias</h1>
                        <p className="cl__count">
                            {!loaded
                                ? "Cargando…"
                                : total === 0
                                ? "Sin materias registradas"
                                : total === 1
                                ? "1 materia registrada"
                                : `${total} materias registradas`}
                        </p>
                    </div>
                    <button className="cl__create" onClick={() => navigate("/subjects/new")}>
                        Nueva materia
                    </button>
                </header>

                <Banner msg={msg} onClose={() => setMsg(null)} />

                <div className="cl__filter">
                    <label htmlFor="subjects-career">Filtrar por carrera</label>
                    <select
                        id="subjects-career"
                        className="cl__select"
                        value={careerId}
                        onChange={(e) => setCareerId(e.target.value)}
                    >
                        <option value="">Todas las carreras</option>
                        {careers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {loaded && total === 0 ? (
                    <section className="cl__empty">
                        <p>
                            {filtered
                                ? "No hay materias en esta carrera."
                                : "Crea la primera materia para empezar."}
                        </p>
                        {filtered ? (
                            <button className="cl__create" onClick={() => setCareerId("")}>
                                Ver todas las materias
                            </button>
                        ) : (
                            <button className="cl__create" onClick={() => navigate("/subjects/new")}>
                                Crear materia
                            </button>
                        )}
                    </section>
                ) : (
                    <ul className="cl__list">
                        {items.map((s) => {
                            // El color lo da la carrera: las materias de una misma carrera se agrupan a la vista
                            const tone = getTone(s.careerName);
                            return (
                                <li
                                    key={s.id}
                                    className="cli"
                                    style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                                >
                                    <span className="cli__mark" aria-hidden="true">
                                        {getInitials(s.name)}
                                    </span>

                                    <div className="cli__body">
                                        <h2 className="cli__name">{s.name}</h2>
                                        <p className="cli__meta">{s.careerName}</p>
                                        <p
                                            className={
                                                s.description
                                                    ? "cli__desc"
                                                    : "cli__desc cli__desc--empty"
                                            }
                                        >
                                            {s.description || "Sin descripción"}
                                        </p>
                                    </div>

                                    <div className="cli__actions">
                                        <button
                                            className="cli__btn"
                                            onClick={() => navigate(`/subjects/edit/${s.id}`)}
                                            aria-label={`Editar ${s.name}`}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="cli__btn cli__btn--danger"
                                            onClick={() => handleDelete(s)}
                                            aria-label={`Eliminar ${s.name}`}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </>
    );
}

export default Subjects;