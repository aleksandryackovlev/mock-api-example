const express = require("express");
const cors = require("cors");
const path = require("path");
const { createMockMiddleware } = require("openapi-mock-express-middleware");
const Chance = require("chance");

const corsConfig = {
  origin: "*",
  maxAge: 31536000,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
};

const port = process.env.APP_PORT || 8004;
const app = express();

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(
  createMockMiddleware({
    spec: path.resolve(__dirname, "../api/petstore.yaml"),
    configure: (jsf) => {
      jsf.extend('chance', () => new Chance());
    },
  })
);

app.use((req, res) => {
  res.status(404).send({ message: "Not found" });
});

app.use((err, req, res) => {
  res.status(500).send({ message: "Internal server error" });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
