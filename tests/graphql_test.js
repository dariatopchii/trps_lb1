const autocannon = require('autocannon');

function runTest() {
  const url = 'http://localhost:5000/graphql';

  const body = {
    query: `
      mutation CreateTask(
        $title: String!,
        $userId: Int!,
        $completed: Boolean!,
        $plannedAt: String!
      ) {
        createTask(input: {
          userId: $userId,
          title: $title,
          completed: $completed,
          plannedAt: $plannedAt
        }) {
          id
          title
          userId
          completed
          plannedAt
        }
      }
    `,
    variables: {
      title: "Load test task",
      userId: 1,
      completed: false,
      plannedAt: "2025-11-20T18:00:00.000Z"
    }
  };

  const instance = autocannon(
    {
      url,
      method: 'POST',
      connections: 50,
      duration: 30,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    },
    (err, result) => {
      if (err) {
        console.error('Error during GraphQL test:', err);
        process.exit(1);
      }
      autocannon.printResult(result);
    }
  );

  instance.on('start', () => {
    console.log('Starting GraphQL load test on /graphql...');
  });
}

runTest();
