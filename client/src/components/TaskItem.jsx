export default function TaskItem({ task, toggleTask, deleteTask }) {
  // Color accent based on priority
  const priorityColor =
    task.priority === "High"
      ? "border-red-400"
      : task.priority === "Medium"
      ? "border-yellow-300"
      : "border-green-300";

  return (
    <div
      className={`
        flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl border-l-4 ${priorityColor}
        bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-opacity-30 backdrop-blur-md
        shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
      `}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-3/4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          className="w-5 h-5 accent-indigo-500"
        />
        <span
          className={`text-white font-medium text-sm md:text-base ${
            task.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </span>
        {task.description && (
          <span className="text-white/80 text-xs md:text-sm mt-1 md:mt-0 md:ml-2">
            {task.description}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-2 md:mt-0">
        {task.completed && (
          <span className="text-green-300 font-semibold text-sm animate-pulse">
            ✅ Done
          </span>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-400 hover:text-red-600 transition-colors duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
