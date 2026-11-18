import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { deleteReason, getReasons } from "../services/reasonService";
import { getTone, getInitials } from "../utils/careerTone";
import "./CatalogList.css";

function Reasons() {
    const navigate = useNavigate();
    const location = useLocation();
    const [reasons, setReasons] = useState([]);
    // Si venimos de crear o editar un motivo, mostramos su aviso
    const [msg, setMsg] = useState(location.state?.msg ?? null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        async function fetchData() {
            try {
                const data = await getReasons();
                setReasons(data);
            } catch (error) {
                console.error(error);
                setMsg({ type: "danger", text: "No se pudieron cargar los motivos. Recarga la página e intenta de nuevo." });
            }
        }
        fetchData();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que desea eliminar este motivo?")) {
            return;
        }
        try {
            await deleteReason(id);
            setReasons(reasons.filter((r) => r.id !== id));
            setMsg({ type: "success", text: "Motivo eliminado." });
        } catch (error) {
            console.error(error);
            setMsg({ type: "danger", text: "No se pudo eliminar el motivo. Intenta de nuevo." });
        }
    };

    const total = reasons.length;

    return (
        <>
            <Navbar />
            <main className="cl">
                <header className="cl__header">
                    <div>
                        <h1 className="cl__title">Motivos de cancelación</h1>
                        <p className="cl__count">
                            {total === 0
                                ? "Aún no hay motivos registrados"
                                : total === 1
                                ? "1 motivo registrado"
                                : `${total} motivos registrados`}
                        </p>
                    </div>
                    <button
                        className="cl__create"
                        onClick={() => navigate("/create-reason")}
                    >
                        Nuevo motivo
                    </button>
                </header>

                <Banner msg={msg} onClose={() => setMsg(null)} />

                {total === 0 ? (
                    <section className="cl__empty">
                        <p>Crea el primer motivo para que los estudiantes puedan elegirlo al cancelar.</p>
                        <button
                            className="cl__create"
                            onClick={() => navigate("/create-reason")}
                        >
                            Crear motivo
                        </button>
                    </section>
                ) : (
                    <ul className="cl__list">
                        {reasons.map((r) => {
                            const tone = getTone(r.name);
                            return (
                                <li
                                    key={r.id}
                                    className="cli"
                                    style={{ "--tone-bg": tone.bg, "--tone-fg": tone.fg }}
                                >
                                    <span className="cli__mark" aria-hidden="true">
                                        {getInitials(r.name)}
                                    </span>

                                    <div className="cli__body">
                                        <h2 className="cli__name">{r.name}</h2>
                                        <p
                                            className={
                                                r.description
                                                    ? "cli__desc"
                                                    : "cli__desc cli__desc--empty"
                                            }
                                        >
                                            {r.description || "Sin descripción"}
                                        </p>
                                    </div>

                                    <div className="cli__actions">
                                        <button
                                            className="cli__btn"
                                            onClick={() => navigate(`/reasons/edit/${r.id}`)}
                                            aria-label={`Editar ${r.name}`}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="cli__btn cli__btn--danger"
                                            onClick={() => handleDelete(r.id)}
                                            aria-label={`Eliminar ${r.name}`}
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

export default Reasons;