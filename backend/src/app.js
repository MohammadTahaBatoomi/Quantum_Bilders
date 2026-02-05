"use strict";

const express = require("express");
const { apiRouter } = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");
const { AppError } = require("./utils/AppError");

const app = express();

app.use(express.json({ limit: "1mb" }));
// Dev CORS: allow web app to call the API from a different origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  return next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

app.use("/api", apiRouter);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404, "NOT_FOUND"));
});

app.use(errorHandler);

module.exports = { app };
