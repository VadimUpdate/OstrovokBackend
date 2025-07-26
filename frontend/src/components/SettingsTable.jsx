import React, { useState, useEffect } from 'react';
import { updateSetting } from "../api/settings.jsx";

const SettingsTable = ({ settings, section }) => {
    const [originalSettings, setOriginalSettings] = useState(settings); // серверные данные
    const [editedSettings, setEditedSettings] = useState(settings);     // редактируемые данные

    // Фильтрация по разделу
    const filteredSettings = editedSettings.filter(setting => setting.section === section);

    // Обработка изменений
    const handleChange = (id, newValue) => {
        const updatedSettings = [...editedSettings];
        const index = updatedSettings.findIndex(s => s.id === id);
        if (index !== -1) {
            updatedSettings[index] = { ...updatedSettings[index], value: newValue };
            setEditedSettings(updatedSettings);
        }
    };

    const handleSaveAll = () => {
        const requests = editedSettings
            .filter((s) => s.section === section)
            .filter((s) => s.value !== originalSettings.find((os) => os.id === s.id)?.value)
            .map((s) => {
                let valueToSend = typeof s.value === 'boolean'
                    ? s.value.toString()
                    : s.value?.toString().trim();

                if (!s.id || valueToSend === undefined || valueToSend === '') {
                    console.error("Missing ID or value for setting ID:", s.id);
                    return Promise.reject(new Error("ID and new value are required to update the setting"));
                }

                console.log("Sending ID:", s.id, "Value:", valueToSend);
                return updateSetting(s.id, { section, newValue: valueToSend });
            });

        Promise.all(requests)
            .then(() => {
                console.log("Сохранено:", requests);
                alert("Сохранено!");
                setOriginalSettings(editedSettings); // зафиксировали новые значения как оригинальные
            })
            .catch((error) => {
                console.error("Ошибка при сохранении", error);
                alert("Ошибка при сохранении");
            });
    };

    const handleCancel = () => {
        setEditedSettings(originalSettings); // откат к оригиналу
    };

    useEffect(() => {
        setOriginalSettings(settings);
        setEditedSettings(settings);
    }, [settings]);

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
                    {filteredSettings.map((setting) => {
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
