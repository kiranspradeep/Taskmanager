const User = require("../models/User");
const Task = require("../models/Task");

// @desc Get user info + task summary
// @route GET /api/dashboard
// @access Private
const getDashboard = async (req, res) => {
  try {
    // console.log("hitted dashboard");
    
    console.log("User ID:", req.user._id);
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalTasks = await Task.countDocuments({ user: req.user._id });
    const completedTasks = await Task.countDocuments({ user: req.user._id, completed: true });
    const pendingTasks = totalTasks - completedTasks;
    const latestTasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user,
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks,
        latestTasks,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboard };
