const net = require('net');

const PORT = 3000;

function checkPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `🚫 Port ${PORT} is already in use. Please stop the process using it and retry.`
        );
        reject(new Error(`Port ${PORT} busy`));
      } else {
        reject(err);
      }
    });

    server.once('listening', () => {
      server.close(() => {
        console.log(`✅ Dev server will run at http://localhost:${PORT}`);
        console.log(`   - Welcome page: http://localhost:${PORT}/welcome`);
        console.log(`   - Demo page: http://localhost:${PORT}/lesson/demo`);
        console.log(`   - Health check: http://localhost:${PORT}/healthz`);
        resolve();
      });
    });

    server.listen(PORT);
  });
}

checkPort().catch((err) => {
  console.error('Failed to start dev server:', err.message);
  process.exit(1);
});
