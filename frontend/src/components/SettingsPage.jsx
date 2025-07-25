import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSettings } from '../api/settings';
import SettingsTable from './SettingsTable';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { section } = useParams();

    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSection, setCurrentSection] = useState(section || 'default');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Получаем роль из localStorage
        const userRoleFromStorage = localStorage.getItem('role');
        console.log('Role from localStorage:', userRoleFromStorage);

        if (userRoleFromStorage === 'ROLE_ADMIN') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

        // Загружаем настройки
        fetchSettings(section)
            .then((res) => {
                if (!Array.isArray(res.data)) {
                    throw new Error("Некорректный формат данных");
                }
                setSettings(res.data);
                setCurrentSection(section);
            })
            .catch((e) => {
                console.error(e);
                setError("Ошибка загрузки настроек");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [section]);

    const handleSwitch = (newSection) => {
        if (newSection !== currentSection) {
            navigate(`/settings/${newSection}`);
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div className="p-4">
            {/* Переключатель для админа */}
            {isAdmin ? (
                <div className="mb-6 border-b border-gray-300">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleSwitch("test")}
                            className={`px-4 py-2 rounded-t text-sm font-medium transition-all duration-200 ${
                                currentSection === "test"
                                    ? "bg-white border-l border-t border-r border-gray-300 text-blue-600"
                                    : "bg-gray-100 text-gray-600 hover:text-blue-600"
                            }`}
                        >
                            Test
                        </button>
                        <button
                            onClick={() => handleSwitch("sbp")}
                            className={`px-4 py-2 rounded-t text-sm font-medium transition-all duration-200 ${
                                currentSection === "sbp"
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

            {/* Вставляем таблицу настроек */}
            <SettingsTable settings={settings} />
        </div>
    );
};

export default SettingsPage;
