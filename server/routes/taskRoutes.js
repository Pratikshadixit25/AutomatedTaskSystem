const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const sendMail = require("../services/emailService");

const router = express.Router();


router.post("/add", async (req, res) => {
  try {
    const { title, description, deadline, assignedTo, role } = req.body;

    
    const user =
      role === "Student"
        ? await User.findOne({ rollNo: assignedTo })
        : await User.findOne({ staffId: assignedTo });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTask = new Task({
      title,
      description,
      deadline,
      assignedTo: user._id,
      status: "Pending",
    });

    await newTask.save();

    
    await sendMail(
      user.email,
      "New Task Assigned",
      `Dear ${user.name},\n\nA new task has been assigned to you.\n\nTask Title: ${title}\nDeadline: ${deadline}\n\nPlease complete it on time.\n\nBest regards,\nHead of Department`
    );

    res.status(201).json({ message: "Task assigned successfully" });
  } catch (error) {
    console.error("Task assignment error:", error);
    res
      .status(500)
      .json({ message: "Task assignment failed", error: error.message });
  }
});


router.get("/all", async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "assignedTo",
      "name role rollNo staffId email"
    );
    res.json(tasks);
  } catch (error) {
    console.error("Fetch all tasks error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
});


router.get("/byUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    
    const user = await User.findOne({
      $or: [{ rollNo: id }, { staffId: id }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasks = await Task.find({ assignedTo: user._id });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log("Update task request for:", id, "status:", status);

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Task update error:", error);
    res
      .status(500)
      .json({ message: "Failed to update task", error: error.message });
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Delete task request for:", id);

    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Task delete error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
});

module.exports = router;



