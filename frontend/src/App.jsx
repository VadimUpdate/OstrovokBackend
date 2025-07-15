import {
    BrowserRouter,
    Routes,
    Route,
    Navigate          // ← добавляем здесь
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import SettingsTable from "./components/SettingsTable";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterForm from "./components/RegisterForm";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1️⃣ Публичные */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* 2️⃣ Защищённые */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/settings" element={<SettingsTable />} />
                </Route>

                {/* 3️⃣ Вишлист: всё, чего не поймали выше */}
                <Route
                    path="*"
                    element={
                        localStorage.getItem("token")
                            ? <Navigate to="/settings" />
                            : <Navigate to="/login" />
                    }
                />
            </Routes>
        </BrowserRouter>

    );
}

export default App;
