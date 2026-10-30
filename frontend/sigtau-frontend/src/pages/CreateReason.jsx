import { useState } from "react";
import Navbar from "../components/Navbar";
import { createReason } from "../services/reasonService";
import { useNavigate } from "react-router-dom";

function CreateReason() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            alert("Por favor complete el campo nombre");
            return;
        }

        setLoading(true);
        try {
            const reason = {
                name,
                description
            };

            await createReason(reason);
            alert("Motivo creado correctamente");
            navigate("/exits");
        } catch (error) {
            console.error(error);
            alert("Error al crear motivo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white py-3">
                                <h4 className="mb-0 text-center">Crear Motivo</h4>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Nombre del Motivo *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            placeholder="Ej: Conflicto de horario"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Descripción
                                        </label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Descripción opcional del motivo"
                                            rows="3"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Guardando...
                                                </>
                                            ) : (
                                                "Crear Motivo"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate("/exits")}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateReason;
