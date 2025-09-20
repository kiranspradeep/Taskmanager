import { useEffect, useState } from "react";
import { FaHome, FaPlusCircle, FaChartLine, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import TaskList from "../components/TaskList";
import Progression from "../components/Progression";
import Profile from "../components/Profile";
import api from "../utils/api"; // <- import api

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium", dueDate: "" });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const resUser = await api.get("/dashboard");
        if (resUser?.data?.user) setUser(resUser.data.user);
        else window.location.href = "/login";

        const resTasks = await api.get("/tasks");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

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
      const res = await api.post("/tasks", newTask);
      setTasks([res.data, ...tasks]);
      handleModalClose();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    try {
      const res = await api.put(`/tasks/${id}`, { completed: !task.completed });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-100">Loading...</div>;

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "high") return task.priority === "High";
    if (filter === "medium") return task.priority === "Medium";
    if (filter === "low") return task.priority === "Low";
    return true;
  });

  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  const filteredAndSortedTasks = filteredTasks.sort(
    (a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99)
  );

  const navItems = [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "addTask", label: "Add Task", icon: <FaPlusCircle />, onClick: handleAddTask },
    { id: "progress", label: "Progression", icon: <FaChartLine /> },
    { id: "profile", label: "Profile", icon: <FaUserCircle /> },
    { id: "logout", label: "Logout", icon: <FaSignOutAlt />, onClick: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navbar */}
        <nav className="bg-white/20 backdrop-blur-lg text-white px-4 py-4 flex flex-wrap justify-between items-center rounded-b-xl shadow-lg">
          <h1 className="text-2xl font-bold tracking-wide">Task Manager</h1>
          <ul className="flex flex-wrap gap-2 mt-2 md:mt-0">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    item.onClick && item.onClick();
                  }}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md transition transform hover:scale-105 ${
                    activeTab === item.id ? "bg-white/30" : "hover:bg-white/20"
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <main className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {/* Left Section */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl flex flex-col items-center hover:scale-105 transition transform">
              <h2 className="text-2xl font-extrabold mb-2 text-gray-900">Welcome, {user?.name}!</h2>
              <p className="text-gray-700 text-center mb-4">Manage your tasks efficiently.</p>
              <button
                onClick={handleAddTask}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold tracking-wide hover:bg-indigo-700 hover:scale-105 transition transform"
              >
                Add Task
              </button>
            </div>

            {/* Profile card for quick stats */}
            {/* <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:scale-105 transition transform">
              <h3 className="font-semibold text-gray-800 mb-2">Profile Info</h3>
              <p className="text-gray-700 text-sm">Email: {user?.email}</p>
              <p className="text-gray-700 text-sm">Total Tasks: {tasks.length}</p>
            </div> */}
          </div>

          {/* Right Section */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg hover:scale-105 transition transform">
                <h3 className="font-semibold text-gray-700">Pending Tasks</h3>
                <p className="text-2xl font-bold text-yellow-500">{pendingTasks}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center shadow-lg hover:scale-105 transition transform">
                <h3 className="font-semibold text-gray-700">Completed Tasks</h3>
                <p className="text-2xl font-bold text-green-500">{completedTasks}</p>
              </div>
            </div>

            {/* Main Tab */}
            {activeTab === "progress" ? (
              <Progression tasks={tasks} />
            ) : activeTab === "profile" ? (
              <Profile user={user} tasks={tasks} />
            ) : (
              <>
                {/* Filter Dropdown */}
                <div className="my-4 flex items-center gap-2">
                  <label className="text-white font-medium">Sort/Filter:</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1 rounded-lg text-gray-800 focus:outline-none"
                  >
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                {/* Task List */}
                <TaskList
                  tasks={filteredAndSortedTasks}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                />
              </>
            )}
          </div>
        </main>

        {/* Add Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl w-full max-w-md p-6 sm:p-8 shadow-2xl transform transition-all scale-95 animate-scale-up">
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
    </div>
  );
}
