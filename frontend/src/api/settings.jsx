import axios from "axios";

const api = axios.create({
    baseURL: '/api',          // Базовый URL для всех запросов
    withCredentials: true,    // Отправка cookies с каждым запросом
});

// Интерсептор для добавления токена в заголовок Authorization
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;  // Добавление токена в заголовок
    }
    return config;
});

// Пример запроса для получения настроек
export const fetchSettings = (section) => {
    if (!section) {
        throw new Error("Section is required"); // Проверка наличия секции
    }

    return api.get("/settings", { params: { section } })  // Запрос с параметром section
        .catch((error) => {
            console.error("Error fetching settings:", error); // Логирование ошибок
            throw error;
        });
};

// Пример запроса для обновления настройки
export const updateSetting = (id, data) => {
    if (!id || !data) {
        throw new Error("ID and data are required to update the setting"); // Проверка параметров
    }

    return api.put(`/settings/${id}`, data)  // PUT запрос для обновления настройки по id
        .catch((error) => {
            console.error("Error updating setting:", error); // Логирование ошибок
            throw error;
        });
};
