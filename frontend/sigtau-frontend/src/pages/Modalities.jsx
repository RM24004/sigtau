import { useEffect, useState } from "react";
import { getModalities, deleteModality } from "../services/modalityService";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getTone, getInitials } from "../utils/careerTone";
import "./CatalogList.css";

function Modalities() {
    const navigate = useNavigate();
    const location = useLocation();
    const [modalities, setModalities] = useState([]);
    // Si venimos de crear o editar una modalidad, mostramos su aviso
    const [msg, setMsg] = useState(location.state?.msg ?? null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        async function fetchData() {
            try {
                const data = await getModalities();
                setModalities(data);
            } catch (error) {
                console.error(error);
                setMsg({ type: "danger", text: "No se pudieron cargar las modalidades. Recarga la página e intenta de nuevo." });
            }
        }
        fetchData();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que desea eliminar esta modalidad?")) {
            return;
        }
        try {
            await deleteModality(id);
            setModalities(modalities.filter((p) => p.id !== id));
            setMsg({ type: "success", text: "Modalidad eliminada." });
        } catch (error) {
            console.error(error);
            setMsg({ type: "danger", text: "No se pudo eliminar la modalidad. Intenta de nuevo." });
        }
    };

    const total = modalities.length;

    return (
        <>
            <Navbar />
            <main className="cl">
                <header className="cl__header">
                    <div>
                        <h1 className="cl__title">Modalidades</h1>
                        <p className="cl__count">
                            {total === 0
                                ? "Aún no hay modalidades registradas"
                                : total === 1
                                ? "1 modalidad registrada"
                                : `${total} modalidades registradas`}
                        </p>
                    </div>
                    <button
                        className="cl__create"
                        onClick={() => navigate("/create-modality")}
                    >
                        Nueva modalidad
                    </button>
                </header>

                <Banner msg={msg} onClose={() => setMsg(null)} />

                {total === 0 ? (
                    <section className="cl__empty">
                        <p>Crea la primera modalidad para empezar.</p>
                        <button
                            className="cl__create"
                            onClick={() => navigate("/create-modality")}
                        >
                            Crear modalidad
                        </button>
                    </section>
                ) : (
                    <ul className="cl__list">
                        {modalities.map((p) => {
                            const tone = getTone(p.name);
                            return (
                                <li
                                    key={p.id}
                                    className="cli"
                                    style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                                >
                                    <span className="cli__mark" aria-hidden="true">
                                        {getInitials(p.name)}
                                    </span>

                                    <div className="cli__body">
                                        <h2 className="cli__name">{p.name}</h2>
                                        <p
                                            className={
                                                p.description
                                                    ? "cli__desc"
                                                    : "cli__desc cli__desc--empty"
                                            }
                                        >
                                            {p.description || "Sin descripción"}
                                        </p>
                                    </div>

                                    <div className="cli__actions">
                                        <button
                                            className="cli__btn"
                                            onClick={() => navigate(`/modalities/edit/${p.id}`)}
                                            aria-label={`Editar ${p.name}`}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="cli__btn cli__btn--danger"
                                            onClick={() => handleDelete(p.id)}
                                            aria-label={`Eliminar ${p.name}`}
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

export default Modalities;