const autocannon = require('autocannon');

function runTest() {
  const url = 'http://localhost:3000/tasks';

  const instance = autocannon(
    {
      url,
      method: 'POST',
      connections: 50, 
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
    },
    (err, result) => {
      if (err) {
        console.error('Error during REST test:', err);
        process.exit(1);
      }
      // тут уже готовый результат с метриками
      autocannon.printResult(result);
    }
  );

  // по желанию: лог, что тест стартовал
  instance.on('start', () => {
    console.log('Starting REST load test on /tasks...');
  });
}

runTest();
