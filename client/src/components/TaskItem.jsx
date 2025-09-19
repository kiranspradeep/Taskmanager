

export default function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div className="flex justify-between items-center bg-slate-800 p-2 rounded">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          className="w-4 h-4"
        />
        <span className={task.completed ? 'line-through text-gray-400' : ''}>
          {task.title}
        </span>
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
}

