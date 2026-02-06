const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const port = process.env.RKHS_PORT || 8080;
const isCitrix = process.env.RKHS_CITRIX_MODE === "true";
const isDebug = process.env.RKHS_DEBUG === "true";
const appRoot = path.resolve(__dirname, "..");

// CORS for local access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Serve static files from the app root
app.use(express.static(appRoot));

// API endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.0.0",
    citrix: isCitrix,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/system-info", (req, res) => {
  res.json({
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    citrixMode: isCitrix,
    debugMode: isDebug,
  });
});

const server = app.listen(port, "localhost", () => {
  console.log("Server running on http://localhost:" + port);
  console.log("Application ready");

  const url = "http://localhost:" + port;
  const openCmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
      ? "start"
      : "xdg-open";

  setTimeout(() => {
    exec(openCmd + " \"\" \"" + url + "\"", (error) => {
      if (error && isDebug) {
        console.log("Could not auto-open browser:", error.message);
      }
    });
  }, 1000);
});

process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\nReceived SIGTERM, shutting down...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
