import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Tasks = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pending");
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");

    const { token, logout } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            fetchTasks();
        }
    }, []);




    const fetchTasks = async () => {


        try {
            const { data } = await axios.get( `${process.env.REACT_APP_API_URL}/api/tasks` , {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(data);
        } catch (err) {
            console.error("Error fetching tasks:", err)
            
            ;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setError("Title and Description are required!");
            return;


        }

        try {
            if (editId) {
                await axios.put( `${process.env.REACT_APP_API_URL}/api/tasks/${editId}`, { title, description, status }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, { title, description, status }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }


            setTitle("");

            setDescription("");
            setStatus("Pending");
            setEditId(null);
            setError("");
            fetchTasks();
        } catch (err) {
            console.error("Error saving task:", err);
        }
    };

    const handleEdit = (task) => {
        setEditId(task._id);
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(  `${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    const handleLogout = () => {
        logout()
        navigate("/");
    };

    return (
        <div className="task-container">
            <div className="task-header">
                <img src="https://divsly.com/assets/img/logo/divsly.svg" className="" alt="logo" />

                <h2>Task Manager ✅</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="task-box">
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="task-form">
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <button type="submit" className="task-btn">
                        {editId ? "Update Task" : "Add Task"}
                    </button>
                </form>
            </div>

            <div className="task-list">
                <h3>Your Tasks 📋</h3>
                {tasks.length === 0 ? (
                    <p className="no-task">No tasks available. Add a new one!</p>
                ) : (
                    tasks.map((task) => (
                        <div key={task._id} className={`task-card ${task.status.toLowerCase().replace(" ", "-")}`}>
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <span className="task-status">{task.status}</span>
                            <div className="task-actions">
                                <button className="edit-btn" onClick={() => handleEdit(task)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(task._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tasks;
