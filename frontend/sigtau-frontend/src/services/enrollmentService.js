import { fetchWithAuth } from "./api";

export const enroll = (tutoringId) =>
    fetchWithAuth("/enrollments", { method: "POST", body: JSON.stringify({ tutoringId }) });
export const getMyEnrollments = () => fetchWithAuth("/enrollments/my");
export const getEnrollments = (tutoringId) =>
    fetchWithAuth(tutoringId ? `/enrollments?tutoringId=${tutoringId}` : "/enrollments");
export const cancelEnrollment = (id, reasonId) =>
    fetchWithAuth(`/enrollments/${id}/cancel`, { method: "PUT", body: JSON.stringify({ reasonId: reasonId || null }) });
