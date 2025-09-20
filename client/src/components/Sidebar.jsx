import { FaHome, FaTasks, FaPlusCircle, FaUser, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import { useState } from "react";

export default function Sidebar({ onLogout, activeItem, setActiveItem }) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Home", icon: <FaHome /> },
    { id: "tasks", label: "Tasks", icon: <FaTasks /> },
    { id: "addTask", label: "Add Task", icon: <FaPlusCircle /> },
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "progress", label: "Progress", icon: <FaChartLine /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-indigo-600 text-white rounded-lg shadow-md"
        onClick={() => setOpen(!open)}
      >
        {open ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-6 left-6 w-64 rounded-2xl bg-gradient-to-b from-indigo-800 via-indigo-700 to-indigo-900 text-white p-6 flex flex-col justify-between shadow-2xl z-20 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}`}
      >
        {/* Header */}
        <div>
          <div className="mb-10 pt-2 flex justify-center items-center">
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
              Task Manager
            </h2>
          </div>

          {/* Navigation */}
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveItem(item.id);
                    setOpen(false); // auto-close on mobile
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeItem === item.id
                      ? "bg-white/10 text-white shadow-md"
                      : "text-indigo-100 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="pb-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-100 hover:bg-red-500/10 hover:text-white transition-colors duration-200"
          >
            <FaSignOutAlt />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
