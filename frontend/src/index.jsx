import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";  // ← вот сюда реальный адрес бэкенда
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
