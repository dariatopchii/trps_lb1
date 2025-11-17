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

  const instance = autocannon({
    url,
    method: 'POST',
    connections: 1000,
    duration: 30, 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  instance.on('start', () => {
    console.log('Starting GraphQL load test on /graphql...');
  });

  instance.on('done', (result) => {
    console.log('Finished GraphQL load test on /graphql.');
    console.log('--- GraphQL load test results ---');
    console.log('Duration (s):', result.duration);
    console.log('Connections:', result.connections);

    if (result.requests) {
      console.log('Requests total:', result.requests.total);
      console.log('Requests per second (avg):', result.requests.average);
    }

    if (result.latency) {
      console.log('Latency (avg ms):', result.latency.average);
      console.log('Latency (min/max ms):', result.latency.min, '/', result.latency.max);
    }

    if (result.throughput) {
      console.log('Throughput (avg bytes/sec):', result.throughput.average);
    }

    process.exit(0);
  });

  instance.on('error', (err) => {
    console.error('Autocannon GraphQL error:', err);
    process.exit(1);
  });
}

runTest();
