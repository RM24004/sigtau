import { fetchWithAuth } from "./api";

export async function getCareers() {
    const data = await fetchWithAuth("/careers");
    return data;
}

export async function createCareer(career) {
  return await fetchWithAuth("/careers", {
        method: "POST",
        body: JSON.stringify(career)
    });     
}

export async function deleteCareer(id) {
    return await fetchWithAuth(`/careers/${id}`, {
        method: "DELETE"
    });
}