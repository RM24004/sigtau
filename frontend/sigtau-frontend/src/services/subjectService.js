import { fetchWithAuth } from "./api";

export const getSubjects = (careerId) =>
    fetchWithAuth(careerId ? `/subjects?careerId=${careerId}` : "/subjects");
export const getSubject = (id) => fetchWithAuth(`/subjects/${id}`);
export const createSubject = (s) => fetchWithAuth("/subjects", { method: "POST", body: JSON.stringify(s) });
export const updateSubject = (id, s) => fetchWithAuth(`/subjects/${id}`, { method: "PUT", body: JSON.stringify(s) });
export const deleteSubject = (id) => fetchWithAuth(`/subjects/${id}`, { method: "DELETE" });
