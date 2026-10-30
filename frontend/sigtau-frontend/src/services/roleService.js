import { fetchWithAuth } from "./api";

export async function getRoles() {
    const data = await fetchWithAuth("/roles");
    return data;
}

export async function createRole(role) {
  return await fetchWithAuth("/roles", {
        method: "POST",
        body: JSON.stringify(role)
    });     
}

export async function deleteRole(id) {
    return await fetchWithAuth(`/roles/${id}`, {
        method: "DELETE"
    });
}