import { API_URL } from "./api";

async function post(path, body) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Error en la solicitud");
    return data;
}

export const login = (email, password) => post("/auth/login", { email, password });
export const register = (user) => post("/auth/register", user);
