import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import Login from "./pages/Login.js";
import Tasks from "./pages/Tasks.js";
import Signup from "./pages/Signup.js";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/tasks" element={<Tasks />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
