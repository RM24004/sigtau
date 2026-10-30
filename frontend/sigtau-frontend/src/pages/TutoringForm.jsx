import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { getSubjects } from "../services/subjectService";
import { getModalities } from "../services/modalityService";
import { getUsers } from "../services/userService";
import { createTutoring, getTutoring, updateTutoring } from "../services/tutoringService";

const EMPTY = {
    title: "", description: "", tutoringDate: "", startTime: "", endTime: "",
    location: "", capacity: 10, subjectId: "", modalityId: "", tutorId: "", status: "OPEN",
};

/** Crear / editar tutoría (reciclado del formulario de productos). */
function TutoringForm() {
    const { id } = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const [form, setForm] = useState(EMPTY);
    const [subjects, setSubjects] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [s, m] = await Promise.all([getSubjects(), getModalities()]);
                setSubjects(s);
                setModalities(m);
                if (role === "ADMIN") {
                    const users = await getUsers();
                    setTutors(users.filter((u) => u.roleName === "TUTOR"));
                }
                if (editing) {
                    const t = await getTutoring(id);
                    setForm({
                        title: t.title, description: t.description || "", tutoringDate: t.tutoringDate,
                        startTime: t.startTime.slice(0, 5), endTime: t.endTime.slice(0, 5),
                        location: t.location || "", capacity: t.capacity, subjectId: t.subjectId,
                        modalityId: t.modalityId, tutorId: t.tutorId, status: t.status,
                    });
                }
            } catch (e) {
                setMsg({ type: "danger", text: e.message });
            }
        })();
    }, [id, editing, role]);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                capacity: Number(form.capacity),
                subjectId: Number(form.subjectId),
                modalityId: Number(form.modalityId),
                tutorId: form.tutorId ? Number(form.tutorId) : null,
            };
            if (editing) await updateTutoring(id, payload);
            else await createTutoring(payload);
            navigate("/manage-tutorings");
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
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white py-3">
                                <h4 className="mb-0">{editing ? "Editar tutoría" : "Nueva tutoría"}</h4>
                            </div>
                            <form className="card-body p-4" onSubmit={handleSubmit}>
                                <Banner msg={msg} onClose={() => setMsg(null)} />
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Título *</label>
                                    <input className="form-control" value={form.title} onChange={set("title")} maxLength={150} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Descripción</label>
                                    <textarea className="form-control" rows="3" value={form.description} onChange={set("description")} maxLength={500} />
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Fecha *</label>
                                        <input type="date" className="form-control" value={form.tutoringDate} onChange={set("tutoringDate")} required />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Inicio *</label>
                                        <input type="time" className="form-control" value={form.startTime} onChange={set("startTime")} required />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Fin *</label>
                                        <input type="time" className="form-control" value={form.endTime} onChange={set("endTime")} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label className="form-label fw-semibold">Lugar / enlace</label>
                                        <input className="form-control" value={form.location} onChange={set("location")} maxLength={150} />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Cupos *</label>
                                        <input type="number" min="1" className="form-control" value={form.capacity} onChange={set("capacity")} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Materia *</label>
                                        <select className="form-select" value={form.subjectId} onChange={set("subjectId")} required>
                                            <option value="">Seleccione...</option>
                                            {subjects.map((s) => (
                                                <option key={s.id} value={s.id}>{s.careerName} — {s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Modalidad *</label>
                                        <select className="form-select" value={form.modalityId} onChange={set("modalityId")} required>
                                            <option value="">Seleccione...</option>
                                            {modalities.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {role === "ADMIN" && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Tutor *</label>
                                        <select className="form-select" value={form.tutorId} onChange={set("tutorId")} required>
                                            <option value="">Seleccione...</option>
                                            {tutors.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.email})</option>)}
                                        </select>
                                    </div>
                                )}
                                {editing && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Estado</label>
                                        <select className="form-select" value={form.status} onChange={set("status")}>
                                            <option value="OPEN">Abierta (acepta inscripciones)</option>
                                            <option value="CLOSED">Cerrada</option>
                                        </select>
                                    </div>
                                )}
                                <div className="d-grid gap-2 mt-4">
                                    <button className="btn btn-primary btn-lg" disabled={loading}>
                                        {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear tutoría"}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/manage-tutorings")}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TutoringForm;
