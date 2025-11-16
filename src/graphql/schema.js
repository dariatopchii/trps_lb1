const { buildSchema } = require("graphql");
const { tasks, nextId } = require("../data/tasks");

let _nextId = nextId;

const schema = buildSchema(`
  type Task {
    id: Int!
    userId: Int!
    title: String!
    completed: Boolean!
    createdAt: String!
    plannedAt: String
  }

  input CreateTaskInput {
    userId: Int!
    title: String!
    completed: Boolean
    plannedAt: String
  }

  type Query {
    tasks: [Task!]!
    task(id: Int!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
  }
`);

const root = {
  tasks: () => tasks,
  task: ({ id }) => tasks.find((t) => t.id === id) || null,
  createTask: ({ input }) => {
    const { title, userId, completed, plannedAt } = input;

    if (typeof title !== "string" || title.trim() === "") {
      throw new Error("Field 'title' is required");
    }

    if (typeof userId !== "number") {
      throw new Error("Field 'userId' must be a number");
    }

    const task = {
      id: _nextId++,
      userId,
      title: title.trim(),
      completed: Boolean(completed),
      createdAt: new Date().toISOString(),
      plannedAt: typeof plannedAt === "string" ? plannedAt : null
    };

    tasks.push(task);
    return task;
  }
};

module.exports = { schema, root };
