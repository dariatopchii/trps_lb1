const autocannon = require('autocannon');

function runTest() {
  const url = 'http://localhost:3000/tasks';

  const instance = autocannon({
    url,
    method: 'POST',
    connections: 1000,
    duration: 30, 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: "Load test task",
      completed: false,
      userId: 1,
      plannedAt: "2025-11-20T18:00:00.000Z"
    })
  });

  instance.on('start', () => {
    console.log('Starting REST load test on /tasks...');
  });

  instance.on('done', (result) => {
    console.log('--- REST load test results ---');
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
    console.error('Autocannon error:', err);
    process.exit(1);
  });
}

runTest();
