import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css"
import { AuthContext } from "../context/AuthContext";



const Signup = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {
        if (token) {
            navigate("/tasks");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/auth/signup", { email, password });
            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Try again.");
        }
    };

    return (
        <div className="signup-container">
            <img src="https://divsly.com/assets/img/logo/divsly.svg" className="logo"  alt="logo" />
            <div className="signup-box">
                <h2>Create an Account 🎉</h2>
                <p className="signup-subtitle">Sign up to start managing your tasks.</p>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <form onSubmit={handleSubmit} className="signup-form">
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
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="signup-btn">Sign Up</button>
                </form>

                <p className="login-link">
                    Already have an account? <a href="/">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
