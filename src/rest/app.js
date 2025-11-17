const express = require("express");
const { tasks, nextId } = require("../data/tasks");
const { log } = require("../utils/logger");

const app = express();
app.use(express.json());

let _nextId = nextId;

app.get("/tasks", (req, res) => {
  log("GET /tasks");
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title, completed, userId, plannedAt } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Field 'title' is required" });
  }

  if (typeof userId !== "number") {
    return res.status(400).json({ error: "Field 'userId' must be a number" });
  }

  const task = {
    id: _nextId++,
    userId,
    title: title.trim(),
    completed: Boolean(completed),
    createdAt: new Date().toISOString(),
    plannedAt: typeof plannedAt === "string" ? plannedAt : null,
  };

  tasks.push(task);
  log(`POST /tasks — created task ${task.id}`);

  res.status(201).json(task);
});

module.exports = app;
