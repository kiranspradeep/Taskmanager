import TaskItem from './TaskItem';

export default function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <div className="w-full flex flex-col gap-4">
      {tasks.length === 0 ? (
        <p className="text-gray-200 text-center mt-4">Let's get started! Add some tasks.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-opacity-30 backdrop-blur-md shadow-md rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-lg hover:scale-105 transform"
          >
            <div className="flex flex-col gap-1 w-full md:w-3/4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                  className="w-4 h-4"
                />
                <h4 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                  {task.title}
                </h4>
              </div>
              {task.description && (
                <p className="text-white/80 text-sm">{task.description}</p>
              )}
              <p className={`text-sm font-medium mt-1 ${
                task.priority === "High" ? "text-red-400" :
                task.priority === "Medium" ? "text-yellow-300" :
                "text-green-300"
              }`}>
                Priority: {task.priority}
              </p>
              <p className="text-white/70 text-xs mt-1">
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
              </p>
              <p className={`text-sm mt-1 font-medium ${
                task.completed ? "text-green-300" : "text-yellow-300"
              }`}>
                {task.completed ? "Completed ✅" : "Pending ⏳"}
              </p>
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-400 hover:text-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
