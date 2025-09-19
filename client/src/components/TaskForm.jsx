import { useState } from 'react';


export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    addTask({ id: Date.now(), title, completed: false });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4 w-full max-w-md">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a task"
        className="flex-grow p-2 rounded border border-gray-600 bg-slate-800 text-white"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
      >
        Add
      </button>
    </form>
  );
}
