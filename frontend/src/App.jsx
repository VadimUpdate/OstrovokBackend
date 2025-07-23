import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./components/SettingsPage"; // импорт

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Публичные */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Защищённые */}
                <Route element={<ProtectedRoute />}>
                    {/* Роут с параметром section */}
                    <Route path="/settings/:section" element={<SettingsPage />} />
                    {/* Роут по умолчанию, если section не указан */}
                    <Route path="/settings" element={<Navigate to="/settings/test" replace />} />
                </Route>

                {/* Редиректы */}
                <Route
                    path="*"
                    element={
                        localStorage.getItem("token") ? (
                            <Navigate to="/settings/test" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
