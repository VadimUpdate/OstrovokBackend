import { useParams, useNavigate, Navigate } from "react-router-dom";
import SettingsTable from "./SettingsTable";
import SettingsSbpTable from "./SettingsSbpTable";

const SettingsPage = () => {
    const { section } = useParams();
    const currentSection = section || "test";
    const navigate = useNavigate();

    // Получаем роль пользователя (предположим, что она хранится в localStorage)
    const userRole = localStorage.getItem('userRole'); // Или из API

    // Если секция неправильная, перенаправляем на раздел "test"
    if (!["test", "sbp"].includes(currentSection)) {
        return <Navigate to="/settings/test" replace />;
    }

    // Функция для переключения между секциями
    const handleSwitch = (newSection) => {
        if (newSection !== currentSection) {
            navigate(`/settings/${newSection}`);
        }
    };

    // Если пользователь не админ, скрываем кнопку "SBP"
    const isAdmin = userRole === 'ADMIN';

    return (
        <div className="p-4">
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

                    {isAdmin && (
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
                    )}
                </div>
            </div>

            {currentSection === "test" && <SettingsTable />}
            {currentSection === "sbp" && <SettingsSbpTable />}
        </div>
    );
};

export default SettingsPage;
