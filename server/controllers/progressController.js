const Task = require("../models/Task");

// @desc Get task progression stats
// @route GET /api/progress
// @access Private
const getProgress = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ user: req.user._id });
    const completedTasks = await Task.countDocuments({ user: req.user._id, completed: true });
    const pendingTasks = totalTasks - completedTasks;

    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: `${completionRate}%`,
    });
  } catch (err) {
    console.error("Progress error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProgress };
