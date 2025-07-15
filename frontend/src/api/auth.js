import axios from "axios"

export const register = (username, password) => axios.post("/api/auth/register", {username,password});

export const login = (username, password) => axios.post("/api/auth/login", {username,password});

