import axios from "axios";

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// Пример запроса для получения настроек
export const fetchSettings = (section) => {
    if (!section) {
        throw new Error("Section is required");
    }

    return api.get("/settings", { params: { section } })
        .catch((error) => {
            console.error("Error fetching settings:", error);
            throw error;
        });
};

// Пример запроса для обновления настройки
export const updateSetting = (id, data) => {
    if (!id || !data) {
        throw new Error("ID and data are required to update the setting");
    }

    return api.put(`/settings/${id}`, data)
        .catch((error) => {
            console.error("Error updating setting:", error);
            throw error;
        });
};
