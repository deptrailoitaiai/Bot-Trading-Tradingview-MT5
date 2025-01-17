const express = require("express");
const account1Controller = require('./account1/account1Controller');
const account2Controller = require('./account2/account2Controller');
require("./gmailService/emailMonitor");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());


// monitoring ****************************************************************************************************
app.head("/", async (req, res) => {
  console.log("head method ping to keep server alive");
  return res.status(200).json({ message: "Server is running" })
})

app.get("/", async (req, res) => {
  console.log("get method ping to keep server alive");
  return res.status(200).json({ message: "Server is running" })
})

app.post("/", async (req, res) => {
  console.log("post method post to keep server alive");
  return res.status(200).json({ message: "Server is running" })
});

// handle signal *************************************************************************************************

// app.use('/account1', account1Controller);
app.use('/account2', account2Controller);


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  require("./keepAlive");
});
