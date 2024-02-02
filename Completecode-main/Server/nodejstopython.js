const { spawn } = require('child_process');

const pythonProcess = spawn('python', ['D:\\P2_Lorem_l5x\\Completecode\\Server\\msql.py']);

pythonProcess.stdout.on('data', (data) => {
  console.log(`Python script output: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`Error from Python script: ${data}`);
});

pythonProcess.on('close', (code) => {
  console.log(`Python script process exited with code ${code}`);
});
