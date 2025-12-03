const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");


const app = express();
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

//  Register user routes
const userRoutes = require("./routes/userRoutes.js");
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const taskRoutes = require("./routes/taskRoutes.js");
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks", require("./routes/taskRoutes"));


