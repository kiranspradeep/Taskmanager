import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaUserCircle, FaPlus } from "react-icons/fa";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) return (window.location.href = "/login");

      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);

        setTasks([
          { id: 1, title: "Learn React", completed: false },
          { id: 2, title: "Build Dashboard", completed: true },
          { id: 3, title: "Setup Backend", completed: false },
        ]);
      } catch (err) {
        console.error(err);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleAddTask = () => setIsModalOpen(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTask({ title: "", description: "" });
  };

  const handleTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return alert("Task title is required!");

    // Create a new task and add to state
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      completed: false,
    };
    setTasks([task, ...tasks]);
    handleModalClose();
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddTask}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <FaPlus />
              Add Task
            </button>
            <FaUserCircle className="text-3xl text-gray-700" />
          </div>
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:scale-105 transition">
            <h3 className="text-xl font-semibold text-gray-700">Pending Tasks</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">{pendingTasks}</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:scale-105 transition">
            <h3 className="text-xl font-semibold text-gray-700">Completed Tasks</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">{completedTasks}</p>
          </div>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white shadow-md rounded-xl p-5 flex flex-col justify-between transition hover:shadow-xl hover:scale-105`}
            >
              <h4 className="font-semibold text-lg text-gray-800">{task.title}</h4>
              <p className="mt-2 text-gray-600">{task.description}</p>
              <p className={`mt-2 font-medium ${task.completed ? "text-green-500" : "text-yellow-500"}`}>
                {task.completed ? "Completed ✅" : "Pending ⏳"}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
            <button
              onClick={handleModalClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Task</h2>
            <form className="space-y-4" onSubmit={handleTaskSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleTaskChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Task description"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
