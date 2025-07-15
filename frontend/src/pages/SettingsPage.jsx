import SettingsTable from "../components/SettingsTable";

const SettingsPage = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-center mb-4">Настройки шлюза</h2>
            <SettingsTable />
        </div>
    );
};

export default SettingsPage;
