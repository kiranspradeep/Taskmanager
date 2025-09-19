import TaskItem from './TaskItem';


export default function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        ))
      )}
    </div>
  );
}
