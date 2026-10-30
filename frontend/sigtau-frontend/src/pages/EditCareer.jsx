import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchWithAuth } from "../services/api";

function EditCareer() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const career = await fetchWithAuth(`/careers/${id}`);
                setName(career.name);
                setDescription(career.description || "");
            } catch (error) {
                console.error(error);
                alert("Error al cargar la carrera");
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const careerData = {
                name,
                description
            };

            await fetchWithAuth(`/careers/${id}`, {
                method: "PUT",
                body: JSON.stringify(careerData)
            });

            alert("Carrera Actualizada");
            navigate("/careers");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar carrera");
        }
    };

    return (
        <>
            <Navbar />
            <h2>Editar carrera</h2>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                </div>

                <div>
                    <label>Descripción:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button type="submit">Actualizar</button>
                <button type="button" onClick={() => navigate("/careers")}>Cancelar</button>
            </form>
        </>
    );
}

export default EditCareer;