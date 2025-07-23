import { useParams, useNavigate, Navigate } from "react-router-dom";
import SettingsTable from "./SettingsTable";
import SettingsSbpTable from "./SettingsSbpTable";

const SettingsPage = () => {
    const { section } = useParams();
    const currentSection = section || "test";
    const navigate = useNavigate();

    if (!["test", "sbp"].includes(currentSection)) {
        return <Navigate to="/settings/test" replace />;
    }

    const handleSwitch = (newSection) => {
        if (newSection !== currentSection) {
            navigate(`/settings/${newSection}`);
        }
    };

    return (
        <div>
            <div className="mb-4">
                <button
                    className={currentSection === "test" ? "active" : ""}
                    onClick={() => handleSwitch("test")}
                >
                    Test
                </button>
                <button
                    className={currentSection === "sbp" ? "active" : ""}
                    onClick={() => handleSwitch("sbp")}
                >
                    SBP
                </button>
            </div>

            <div>Текущий раздел: {currentSection}</div>

            {currentSection === "test" && <SettingsTable />}
            {currentSection === "sbp" && <SettingsSbpTable />}
        </div>
    );
};

export default SettingsPage;