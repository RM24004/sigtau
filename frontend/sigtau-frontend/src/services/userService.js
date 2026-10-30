import { fetchWithAuth } from "./api";

export async function getUsers() {
    const data = await fetchWithAuth("/users");
    return data;
}

export async function createUser(user) {
  return await fetchWithAuth("/users", {
        method: "POST",
        body: JSON.stringify(user)
    });     
}

export async function deleteUser(id) {
    return await fetchWithAuth(`/users/${id}`, {
        method: "DELETE"
    });
}

export const getUser = (id) => fetchWithAuth(`/users/${id}`);
export const updateUser = (id, user) =>
    fetchWithAuth(`/users/${id}`, { method: "PUT", body: JSON.stringify(user) });
