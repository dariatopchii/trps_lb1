const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { tasks, nextId } = require("../data/tasks");
const { log } = require("../utils/logger");

const PROTO_PATH = path.join(__dirname, "../../proto/tasks.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true
});

const tasksProto = grpc.loadPackageDefinition(packageDefinition).tasks;

let _nextId = nextId;

function CreateTask(call, callback) {
  const { title, completed, user_id, planned_at } = call.request;

  if (typeof title !== "string" || title.trim() === "") {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Field 'title' is required"
    });
  }

  if (typeof user_id !== "number") {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "Field 'user_id' must be a number"
    });
  }

  const task = {
    id: _nextId++,
    userId: user_id,
    title: title.trim(),
    completed: Boolean(completed),
    createdAt: new Date().toISOString(),
    plannedAt: typeof planned_at === "string" ? planned_at : null
  };

  tasks.push(task);
  log(`gRPC CreateTask(${task.id})`);

  callback(null, {
    task: {
      id: task.id,
      user_id: task.userId,
      title: task.title,
      completed: task.completed,
      created_at: task.createdAt,
      planned_at: task.plannedAt || ""
    }
  });
}

function ListTasks(call, callback) {
  log("gRPC ListTasks()");
  const grpcTasks = tasks.map((t) => ({
    id: t.id,
    user_id: t.userId,
    title: t.title,
    completed: t.completed,
    created_at: t.createdAt,
    planned_at: t.plannedAt || ""
  }));

  callback(null, { tasks: grpcTasks });
}

function main() {
  const server = new grpc.Server();

  server.addService(tasksProto.TaskService.service, {
    CreateTask,
    ListTasks
  });

  const ADDRESS = "0.0.0.0:50051";

  server.bindAsync(
    ADDRESS,
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        console.error("Failed to start gRPC server:", err);
        return;
      }
      log(`gRPC Tasks server running on ${ADDRESS}`);
      server.start();
    }
  );
}

main();
