import React, { useState } from "react";
import { updateSetting } from "../api/settings.jsx";

const SettingsTable = ({ settings }) => {
    const [originalSettings, setOriginalSettings] = useState(settings);

    const handleChange = (id, newValue) => {
        setSettings((prev) =>
            prev.map((s) => (s.id === id ? { ...s, value: newValue } : s))
        );
    };

    const handleSaveAll = () => {
        const requests = settings.map((s) =>
            updateSetting(s.id, { value: s.value })
        );
        Promise.all(requests)
            .then(() => {
                setOriginalSettings(settings);
                alert("Сохранено!");
            })
            .catch(() => alert("Ошибка при сохранении"));
    };

    const handleCancel = () => {
        setSettings(originalSettings);
    };

    return (
        <div>
            <div className="border border-gray-300 rounded-md overflow-hidden">
                <table className="w-full table-fixed border-collapse">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-2 w-2/3 border-b">Параметр</th>
                        <th className="text-left p-2 w-1/3 border-b">Значение</th>
                    </tr>
                    </thead>
                    <tbody>
                    {settings.map((setting) => {
                        const isBool = setting.value === "true" || setting.value === "false";
                        const boolValue = setting.value === "true";

                        return (
                            <tr key={setting.id} className="even:bg-gray-50">
                                <td className="p-2 border-b">{setting.name}</td>
                                <td className="p-2 border-b">
                                    {isBool ? (
                                        <button
                                            onClick={() =>
                                                handleChange(setting.id, (!boolValue).toString())
                                            }
                                            className={`px-3 py-1 rounded text-xs transition ${
                                                boolValue
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-300 text-gray-700"
                                            }`}
                                        >
                                            {boolValue ? "Включено" : "Выключено"}
                                        </button>
                                    ) : (
                                        <input
                                            type="text"
                                            value={setting.value}
                                            onChange={(e) =>
                                                handleChange(setting.id, e.target.value)
                                            }
                                            className="w-full px-2 py-1 border rounded"
                                        />
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                >
                    Отменить
                </button>
                <button
                    onClick={handleSaveAll}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                >
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default SettingsTable;
