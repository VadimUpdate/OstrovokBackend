import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSettings } from '../api/settings';
import SettingsTable from './SettingsTable';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { section } = useParams();  // Получаем раздел из URL

    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Загружаем настройки каждый раз при изменении section в URL
    useEffect(() => {
        const userRoleFromStorage = localStorage.getItem('role');
        console.log('Role from localStorage:', userRoleFromStorage);

        if (userRoleFromStorage === 'ROLE_ADMIN') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        setLoading(true);  // Начинаем загрузку данных при каждом изменении раздела

        // Загружаем настройки для выбранного раздела
        fetchSettings(section)
            .then((res) => {
                if (!Array.isArray(res.data)) {
                    throw new Error("Некорректный формат данных");
                }
                console.log("Fetched settings:", res.data); // Проверим, что данные приходят

                // Добавляем поле section вручную
                const dataWithSection = res.data.map(setting => ({
                    ...setting,
                    section: section // Добавляем правильное значение для section
                }));

                setSettings(dataWithSection);  // Передаем данные для текущего раздела
            })
            .catch((e) => {
                console.error(e);
                setError("Ошибка загрузки настроек");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [section]); // Зависимость от section, чтобы загрузить новые данные при изменении URL

    const handleSwitch = (newSection) => {
        if (newSection !== section) {
            navigate(`/settings/${newSection}`);  // Переходим на новый раздел
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div className="p-4">
            {isAdmin ? (
                <div className="mb-6 border-b border-gray-300">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleSwitch("test")}
                            className={`px-4 py-2 rounded-t text-sm font-medium transition-all duration-200 ${
                                section === "test"
                                    ? "bg-white border-l border-t border-r border-gray-300 text-blue-600"
                                    : "bg-gray-100 text-gray-600 hover:text-blue-600"
                            }`}
                        >
                            Test
                        </button>
                        <button
                            onClick={() => handleSwitch("sbp")}
                            className={`px-4 py-2 rounded-t text-sm font-medium transition-all duration-200 ${
                                section === "sbp"
                                ? "bg-white border-l border-t border-r border-gray-300 text-blue-600"
                                : "bg-gray-100 text-gray-600 hover:text-blue-600"
                            }`}
                        >
                            SBP
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-red-500">You are not an Admin</div>
            )}

            {/* Отображаем таблицу с фильтрацией по разделу */}
            <SettingsTable settings={settings} section={section} />
        </div>
    );
};

export default SettingsPage;