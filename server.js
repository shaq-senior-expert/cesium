const restify = require("restify");
const corsMiddleware = require('restify-cors-middleware');
const materialsRoutes = require("./src/routes/materialsRoute");
const client = require("./src/services/dbService");

const server = restify.createServer();
server.pre(restify.pre.sanitizePath());
server.pre(restify.pre.userAgentConnection());

const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization']
});
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

materialsRoutes(server);

server.listen(8080, () => {
  console.log("%s listening at %s", server.name, server.url);
});

let shuttingDown = false;
function shutdown() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  const shutdownTimeout = setTimeout(function () {
    console.log("Shutdown failed, terminating process.");
    process.exit(0);
  }, 5000);

  console.log("Closing server connections...");
  server.close(() => {
    console.log("Closing database connections...");
    client.destroy()
        .then(() => {
          clearTimeout(shutdownTimeout);
          console.log("Shutdown successful.");
        })
        .catch(err => {
          console.error("Error during shutdown:", err);
          clearTimeout(shutdownTimeout);
          process.exit(1);
        });
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
