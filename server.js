const { port } = require("./src/config/env");
const connectDB = require("./src/config/db");
const app = require("./src/app");

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`application running on ${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
