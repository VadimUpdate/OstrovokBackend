import axios from "axios";

// Создаём инстанс axios с базовым конфигом
const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, // важно, если сервер требует credentials
});

// 👉 добавляем интерцептор: автоматически подставляет токен во все запросы
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchSettings = () => api.get("/settings");

export const updateSetting = (id, setting) =>
    api.put(`/settings/${id}`, setting);
