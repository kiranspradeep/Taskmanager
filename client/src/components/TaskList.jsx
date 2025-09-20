import TaskItem from './TaskItem';

export default function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <div className="w-full flex flex-col gap-4">
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-center mt-4">Let's get started! Add some tasks.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white/80 shadow-md rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-md transition hover:shadow-lg"
          >
            <div className="flex flex-col gap-1 w-full md:w-3/4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                  className="w-4 h-4"
                />
                <h4 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.title}
                </h4>
              </div>
              {task.description && (
                <p className="text-gray-600 text-sm">{task.description}</p>
              )}
              <p className={`text-sm font-medium mt-1 ${
                task.priority === "High" ? "text-red-500" :
                task.priority === "Medium" ? "text-yellow-500" :
                "text-green-500"
              }`}>
                Priority: {task.priority}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
              </p>
              <p className={`text-sm mt-1 font-medium ${
                task.completed ? "text-green-600" : "text-yellow-600"
              }`}>
                {task.completed ? "Completed ✅" : "Pending ⏳"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-700"
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
