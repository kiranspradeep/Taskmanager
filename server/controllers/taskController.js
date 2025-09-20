const Task = require("../models/Task");

// @desc Get all tasks
// @route GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
  try {
    
    // console.log("hitted tasks");
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Add new task
// @route POST /api/tasks
// @access Private
const addTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const task = new Task({ user: req.user._id, title, description, dueDate, priority });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
