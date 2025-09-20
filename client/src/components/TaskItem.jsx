export default function TaskItem({ task, toggleTask, deleteTask }) {
  // Optional: color accent based on priority
  const priorityColor =
    task.priority === "High"
      ? "border-red-500"
      : task.priority === "Medium"
      ? "border-yellow-500"
      : "border-green-500";

  return (
    <div
      className={`
        flex justify-between items-center bg-slate-800 p-4 rounded-xl border-l-4 ${priorityColor}
        shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
      `}
    >
      <div className="flex items-center gap-3">
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
      </div>
      <div className="flex items-center gap-2">
        {task.completed && (
          <span className="text-green-400 font-semibold text-sm animate-pulse">
            ✅ Done
          </span>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-500 hover:text-red-700 transition-colors duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
