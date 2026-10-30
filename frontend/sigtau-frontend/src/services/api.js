import { clearSession } from "../utils/auth";

// Configurable con VITE_API_URL (ver .env.example)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/** Petición autenticada con JWT. Acepta rutas relativas ("/tutorings"). */
export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");
    const full = url.startsWith("http") ? url : `${API_URL}${url}`;
    const response = await fetch(full, {
        ...options,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    // 401 = sesión inválida o expirada -> volver al login
    if (response.status === 401) {
        clearSession();
        window.location.href = "/login";
        throw new Error("Sesión expirada");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        // 403 = autenticado pero sin permiso: se muestra el error, no se cierra la sesión
        throw new Error(
            data.error || (response.status === 403 ? "No tienes permisos para esta acción" : `Error: ${response.status}`)
        );
    }
    return data;
}
