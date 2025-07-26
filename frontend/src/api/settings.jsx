import axios from "axios";

// Создание экземпляра axios с базовым URL
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Интерсептор для добавления токена в заголовок Authorization
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Получение настроек
export const fetchSettings = (section) => {
    if (!section) {
        throw new Error("Section is required");
    }

    return api.get("/settings", { params: { section } })
        .catch((error) => {
            console.error("Error fetching settings:", error.response || error.message);
            throw error;
        });
};

// Обновление настройки
export const updateSetting = (id, { section, newValue }) => {
    return api.put(`/settings/${id}`, { section, newValue })
        .then(res => res.data)
        .catch((error) => {
            console.error("Error updating setting:", error.response || error.message);
            throw error;
        });
};
