import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getCareers } from "../services/careerService";
import { createSubject, getSubject, updateSubject } from "../services/subjectService";

/** Crear / editar materia (reciclado del formulario de marcas, ahora con carrera). */
function SubjectForm() {
    const { id } = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", description: "", careerId: "" });
    const [careers, setCareers] = useState([]);
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setCareers(await getCareers());
                if (editing) {
                    const s = await getSubject(id);
                    setForm({ name: s.name, description: s.description || "", careerId: s.careerId });
                }
            } catch (e) {
                setMsg({ type: "danger", text: e.message });
            }
        })();
    }, [id, editing]);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form, careerId: Number(form.careerId) };
            if (editing) await updateSubject(id, payload);
            else await createSubject(payload);
            navigate("/subjects");
        } catch (error) {
            setMsg({ type: "danger", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white py-3">
                                <h4 className="mb-0">{editing ? "Editar materia" : "Nueva materia"}</h4>
                            </div>
                            <form className="card-body p-4" onSubmit={handleSubmit}>
                                <Banner msg={msg} onClose={() => setMsg(null)} />
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Nombre *</label>
                                    <input className="form-control" value={form.name} onChange={set("name")} maxLength={100} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Carrera *</label>
                                    <select className="form-select" value={form.careerId} onChange={set("careerId")} required>
                                        <option value="">Seleccione...</option>
                                        {careers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Descripción</label>
                                    <textarea className="form-control" rows="3" value={form.description} onChange={set("description")} maxLength={255} />
                                </div>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/subjects")}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubjectForm;
