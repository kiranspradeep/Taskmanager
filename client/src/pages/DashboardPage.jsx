import { useEffect, useState } from "react";
import axios from "axios";
import { FaHome, FaPlusCircle, FaChartLine, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import TaskList from "../components/TaskList";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium", dueDate: "" });

  // Fetch user and tasks
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);

        // User
        const resUser = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resUser?.data?.user) setUser(resUser.data.user);
        else window.location.href = "/login";

        // Tasks
        const resTasks = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(resTasks?.data || []);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Modal
  const handleAddTask = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTask({ title: "", description: "", priority: "Medium", dueDate: "" });
  };

  const handleTaskChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return alert("Task title is required!");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([res.data, ...tasks]);
      handleModalClose();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const navItems = [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "addTask", label: "Add Task", icon: <FaPlusCircle />, onClick: handleAddTask },
    { id: "progress", label: "Progression", icon: <FaChartLine /> },
    { id: "profile", label: "Profile", icon: <FaUserCircle /> },
    { id: "logout", label: "Logout", icon: <FaSignOutAlt />, onClick: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Navbar */}
      <nav className="bg-indigo-900 bg-opacity-70 text-white px-6 py-4 flex justify-between items-center backdrop-blur-md rounded-b-lg">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <ul className="flex gap-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActiveTab(item.id);
                  item.onClick && item.onClick();
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-indigo-700 transition ${
                  activeTab === item.id ? "bg-indigo-800" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Welcome Section */}
        <div className="col-span-1 bg-white/80 shadow-lg rounded-xl p-6 flex flex-col items-center backdrop-blur-md sticky top-6 h-max">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
          <p className="text-gray-700 text-center">Manage your tasks efficiently.</p>
          <button
            onClick={handleAddTask}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Add Task
          </button>
        </div>

        {/* Right Task Section */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 shadow-lg rounded-xl p-4 text-center backdrop-blur-md">
              <h3 className="font-semibold text-gray-700">Pending Tasks</h3>
              <p className="text-2xl font-bold text-yellow-500">{pendingTasks}</p>
            </div>
            <div className="bg-white/80 shadow-lg rounded-xl p-4 text-center backdrop-blur-md">
              <h3 className="font-semibold text-gray-700">Completed Tasks</h3>
              <p className="text-2xl font-bold text-green-500">{completedTasks}</p>
            </div>
          </div>

          {/* Task Grid */}
          <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleTaskChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                ></textarea>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleTaskChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleTaskChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
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
