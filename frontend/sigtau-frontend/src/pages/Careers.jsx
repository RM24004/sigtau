import { useEffect, useState } from "react";
import { getCareers, deleteCareer } from "../services/careerService";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getTone, getInitials } from "../utils/careerTone";
import "./CatalogList.css";

function Careers() {
    const navigate = useNavigate();
    const location = useLocation();
    const [careers, setCareers] = useState([]);
    // Si venimos de crear o editar una carrera, mostramos su aviso
    const [msg, setMsg] = useState(location.state?.msg ?? null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        async function fetchData() {
            try {
                const data = await getCareers();
                setCareers(data);
            } catch (error) {
                console.error(error);
                setMsg({ type: "danger", text: "No se pudieron cargar las carreras. Recarga la página e intenta de nuevo." });
            }
        }
        fetchData();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que desea eliminar esta carrera?")) {
            return;
        }
        try {
            await deleteCareer(id);
            setCareers(careers.filter((c) => c.id !== id));
            setMsg({ type: "success", text: "Carrera eliminada." });
        } catch (error) {
            console.error(error);
            setMsg({ type: "danger", text: "No se pudo eliminar la carrera. Intenta de nuevo." });
        }
    };

    const total = careers.length;

    return (
        <>
            <Navbar />
            <main className="cl">
                <header className="cl__header">
                    <div>
                        <h1 className="cl__title">Carreras</h1>
                        <p className="cl__count">
                            {total === 0
                                ? "Aún no hay carreras registradas"
                                : total === 1
                                ? "1 carrera registrada"
                                : `${total} carreras registradas`}
                        </p>
                    </div>
                    <button
                        className="cl__create"
                        onClick={() => navigate("/create-career")}
                    >
                        Nueva carrera
                    </button>
                </header>

                <Banner msg={msg} onClose={() => setMsg(null)} />

                {total === 0 ? (
                    <section className="cl__empty">
                        <p>Crea la primera carrera para empezar a organizar tu oferta académica.</p>
                        <button
                            className="cl__create"
                            onClick={() => navigate("/create-career")}
                        >
                            Crear carrera
                        </button>
                    </section>
                ) : (
                    <ul className="cl__list">
                        {careers.map((c) => {
                            const tone = getTone(c.name);
                            return (
                                <li
                                    key={c.id}
                                    className="cli"
                                    style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                                >
                                    <span className="cli__mark" aria-hidden="true">
                                        {getInitials(c.name)}
                                    </span>

                                    <div className="cli__body">
                                        <h2 className="cli__name">{c.name}</h2>
                                        <p
                                            className={
                                                c.description
                                                    ? "cli__desc"
                                                    : "cli__desc cli__desc--empty"
                                            }
                                        >
                                            {c.description || "Sin descripción"}
                                        </p>
                                    </div>

                                    <div className="cli__actions">
                                        <button
                                            className="cli__btn"
                                            onClick={() => navigate(`/careers/edit/${c.id}`)}
                                            aria-label={`Editar ${c.name}`}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="cli__btn cli__btn--danger"
                                            onClick={() => handleDelete(c.id)}
                                            aria-label={`Eliminar ${c.name}`}
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

export default Careers;