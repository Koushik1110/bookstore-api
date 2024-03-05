const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Server is up and running, waiting for a server manager for handling!",
  });
});

const port = 8080;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
