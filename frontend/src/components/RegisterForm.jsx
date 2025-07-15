import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            alert("Пароли не совпадают");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                password
            });

            if (response.status === 200) {
                alert("Успешная регистрация");
                navigate('/login');
            }
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            alert("Ошибка регистрации");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4 relative">
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-0"></div>
            <div className="relative z-10 w-full max-w-md p-8 rounded-lg border border-white/30 backdrop-blur-md shadow-xl">
                <h2 className="text-3xl text-white text-center mb-6 font-semibold">Регистрация</h2>

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-6 border-b-2 border-gray-300">
                        <input
                            type="text"
                            id="login"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-0 py-2 text-white bg-transparent border-none outline-none peer"
                        />
                        <label
                            htmlFor="login"
                            className="absolute left-0 text-white transition-all duration-200 transform peer-placeholder-shown:translate-y-2 peer-placeholder-shown:text-base peer-focus:text-sm peer-focus:-translate-y-4"
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
                            className="w-full px-0 py-2 text-white bg-transparent border-none outline-none peer"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-0 text-white transition-all duration-200 transform peer-placeholder-shown:translate-y-2 peer-placeholder-shown:text-base peer-focus:text-sm peer-focus:-translate-y-4"
                        >
                            Пароль
                        </label>
                    </div>

                    <div className="relative mb-6 border-b-2 border-gray-300">
                        <input
                            type="password"
                            id="password2"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                            className="w-full px-0 py-2 text-white bg-transparent border-none outline-none peer"
                        />
                        <label
                            htmlFor="password2"
                            className="absolute left-0 text-white transition-all duration-200 transform peer-placeholder-shown:translate-y-2 peer-placeholder-shown:text-base peer-focus:text-sm peer-focus:-translate-y-4"
                        >
                            Повторите пароль
                        </label>
                    </div>

                    <div className="flex items-center text-white text-sm mb-6">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="accent-white" />
                            <span>Запомнить меня</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-white/20 hover:text-white border-2 border-transparent hover:border-white transition"
                    >
                        Зарегистрироваться
                    </button>

                    <p className="text-white mt-6 text-center">
                        Уже есть аккаунт? <Link to="/login" className="underline">Войти</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
