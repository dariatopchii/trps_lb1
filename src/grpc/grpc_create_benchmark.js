const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = path.join(__dirname, "../../proto/tasks.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const tasksProto = grpc.loadPackageDefinition(packageDefinition).tasks;

const client = new tasksProto.TaskService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

function createTask(title, userId, plannedAt) {
  return new Promise((resolve, reject) => {
    client.CreateTask(
      {
        title,
        completed: false,
        user_id: userId,
        planned_at: plannedAt
      },
      (err, response) => {
        if (err) return reject(err);
        resolve(response.task);
      }
    );
  });
}

async function benchmarkCreate(iterations = 5000) {
  console.log(`Starting gRPC CreateTask benchmark x${iterations}`);
  console.time(`gRPC CreateTask x${iterations}`);

  const userId = 1;
  const plannedAt = new Date(Date.now() + 3600 * 1000).toISOString();

  for (let i = 0; i < iterations; i++) {
    await createTask(`Task #${i}`, userId, plannedAt);
  }

  console.timeEnd(`gRPC CreateTask x${iterations}`);
}

benchmarkCreate();
