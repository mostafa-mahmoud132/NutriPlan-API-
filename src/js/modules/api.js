export const BASE_URL = "https://nutriplan-api.vercel.app/api";

export async function fetchAPI(endpoint) {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
        }
        return await res.json();
    } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
    }
}
