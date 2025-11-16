let tasks = [
  {
    id: 1,
    userId: 1,
    title: "Initial task",
    completed: false,
    createdAt: new Date().toISOString(),
    plannedAt: null
  }
];

let nextId = 2;

module.exports = { tasks, nextId };
