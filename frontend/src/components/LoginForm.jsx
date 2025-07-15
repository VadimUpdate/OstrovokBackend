import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            }, { withCredentials: true });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token); // сохраняем токен
                navigate('/settings');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Неверные данные');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4 relative">
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-0"></div>
            <div className="relative z-10 w-full max-w-md p-8 rounded-lg border border-white/30 backdrop-blur-md shadow-xl">
                <h2 className="text-3xl text-white text-center mb-6 font-semibold">Вход</h2>

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-6 border-b-2 border-gray-300">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder=" "
                            className="w-full px-0 py-2 text-white bg-transparent border-none outline-none peer"
                        />
                        <label
                            htmlFor="username"
                            className="absolute left-0 text-white transition-all duration-200 transform
                                       peer-placeholder-shown:translate-y-2 peer-placeholder-shown:text-base
                                       peer-focus:text-sm peer-focus:-translate-y-4"
                        >
                            Имя пользователя
                        </label>
                    </div>

                    <div className="relative mb-6 border-b-2 border-gray-300">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder=" "
                            className="w-full px-0 py-2 text-white bg-transparent border-none outline-none peer"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-0 text-white transition-all duration-200 transform
                                       peer-placeholder-shown:translate-y-2 peer-placeholder-shown:text-base
                                       peer-focus:text-sm peer-focus:-translate-y-4"
                        >
                            Пароль
                        </label>
                    </div>

                    <div className="flex items-center text-white text-sm mb-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                                className="accent-white"
                            />
                            <span>Запомнить меня</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-white/20 hover:text-white border-2 border-transparent hover:border-white transition"
                    >
                        Войти
                    </button>

                    <p className="text-white mt-6 text-center">
                        Нет аккаунта? <Link to="/register" className="underline">Зарегистрироваться</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
