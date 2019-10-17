const express = require("express");

const PORT = 3000;

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
