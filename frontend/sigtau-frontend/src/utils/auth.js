import { jwtDecode } from "jwt-decode";

const KEYS = ["token", "email", "userId", "role", "name"];

/** Guarda la sesión a partir del JWT y devuelve el rol. */
export function saveSession(token) {
    const d = jwtDecode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("email", d.sub);
    localStorage.setItem("userId", d.userId);
    localStorage.setItem("role", d.role);
    localStorage.setItem("name", d.name || d.sub);
    return d.role;
}

export function clearSession() {
    KEYS.forEach((k) => localStorage.removeItem(k));
}

export function isSessionValid() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
        const { exp } = jwtDecode(token);
        return !exp || exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

/** Página de inicio según el rol. */
export function homeFor(role) {
    return role === "STUDENT" ? "/tutorings" : "/manage-tutorings";
}
