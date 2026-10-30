import { fetchWithAuth } from "./api";

export const getTutorings = () => fetchWithAuth("/tutorings");
export const getMyTutorings = () => fetchWithAuth("/tutorings/mine");
export const getTutoring = (id) => fetchWithAuth(`/tutorings/${id}`);
export const createTutoring = (t) => fetchWithAuth("/tutorings", { method: "POST", body: JSON.stringify(t) });
export const updateTutoring = (id, t) => fetchWithAuth(`/tutorings/${id}`, { method: "PUT", body: JSON.stringify(t) });
export const deleteTutoring = (id) => fetchWithAuth(`/tutorings/${id}`, { method: "DELETE" });
