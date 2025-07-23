import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const fetchSettings = (section) => api.get("/settings", { params: { section } });
export const updateSetting = (id, data) => api.put(`/settings/${id}`, data);
