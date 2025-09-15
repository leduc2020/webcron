const express = require("express");
const bodyParser = require("body-parser");
const cronRoutes = require("./routes/cron");
const cronRunner = require("./runner/cronRunner");

const app = express();
app.use(bodyParser.json());

app.use("/api/cron", cronRoutes);
app.use(express.static("public"));

cronRunner.start();

app.listen(80, () => {
  console.log("Server running at http://localhost (port 80)");
});
