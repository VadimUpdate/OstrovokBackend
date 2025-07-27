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
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userRoleFromStorage = localStorage.getItem('role');
        console.log('Role from localStorage:', userRoleFromStorage);

        setIsAdmin(userRoleFromStorage === 'ROLE_ADMIN');
        setLoading(true);

        fetchSettings(section)
            .then((res) => {
                if (!Array.isArray(res.data)) {
                    throw new Error("Некорректный формат данных");
                }

                const dataWithSection = res.data.map(setting => ({
                    ...setting,
                    section: section
                }));

                setSettings(dataWithSection);
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
        if (newSection !== section) {
            navigate(`/settings/${newSection}`);
        }
    };

    return (
        <div className="p-4">
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

                    {isAdmin && (
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
                    )}
                </div>
            </div>

            <SettingsTable settings={settings} section={section} />
        </div>
    );
};

export default SettingsPage;
