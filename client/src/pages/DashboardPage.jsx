
/*dashboard?*/
import { Link } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useState, useEffect } from "react";


export default function DashboardPage() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                // Simulate a fetch call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setLoading(false);
            } catch (err) {
                setError("Failed to load data");
                setLoading(false);
            }
        };
        fetchData();
    }
, []);
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);
    const addTask = (task) => {
        setTasks([...tasks, task]);
    };
    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };
    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };
    if (loading) {
        return <div className="p-4 text-white">Loading...</div>;
    }
    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center">
            <header className="w-full max-w-md mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">TaskManager</h1>
                <nav>
                    <Link to="/logout" className="hover:underline">

                        Logout
                    </Link>
                </nav>
            </header>
            <main className="w-full max-w-md flex flex-col items-center">
                <TaskForm addTask={addTask} />
                <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
            </main>
        </div>
    );
}