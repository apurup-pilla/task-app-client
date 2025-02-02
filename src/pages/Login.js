import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../App.css"

const Login = () => {
    const {token,  login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        if (token) {
            navigate("/tasks");
        }
    }, []);

    console.log("process.env.API_URL===" , process.env)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("All fields are required.");
            return;
        }

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
            login(data.token);
            navigate("/tasks");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Try again.");
        }
    };

    return (
        <div className="login-container">
            <img src="https://divsly.com/assets/img/logo/divsly.svg" className="logo"  alt="logo" />
            <div className="login-box">
                <h2>Welcome Back! 👋</h2>
                <p className="login-subtitle">Login to manage your tasks efficiently.</p>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="login-form">
                    <input 
                        type="email" 
                        placeholder="Enter Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    <button type="submit" className="login-btn">Login</button>
                </form>

                <p className="signup-link">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
