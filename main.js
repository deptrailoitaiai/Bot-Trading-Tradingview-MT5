const express = require("express");
const {
  closePosition,
  openPosition,
  getPosition,
  modifyStoploss,
} = require("./request");

const app = express();
app.use(express.json());

// setting *******************************************************************************************************
let currentPositionId = null;
let profitableStoplossDistance = 0;
let isRunning = false;
const takeProfit = 1;

const START_HOUR_SESSION1 = 0;
const END_HOUR_SESSION1 = 0; 

const START_HOUR_SESSION2 = 13;
const END_HOUR_SESSION2 = 16;

const START_HOUR_SESSION3 = 19;
const END_HOUR_SESSION3 = 23; 

// monitoring ****************************************************************************************************
app.head("/", async (req, res) => {
  console.log("head method ping to keep server alive");
  return res.status(200).json({ message: "Server is running" })
})

app.get("/", async (req, res) => {
  console.log("get method ping to keep server alive");
  return res.status(200).json({ message: "Server is running" })
})


// handle signal *************************************************************************************************
app.post("/", async (req, res) => {
  let currentTp = takeProfit
  const { signal } = req.body;
  res.sendStatus(200);

  if(signal == "ping") {
    console.log("method post: Server is running")
    return "method post: Server is running"
  }

  console.time("request-time")
  
  const currentHour = new Date().getHours() + 7;
  const localHour = currentHour >= 24 ? currentHour - 24 : currentHour;

  console.log(`signal from tradingview ${signal}`);
  try {
    if (currentPositionId) {

      try {
        await getPosition(currentPositionId);
        currentTp += 0.5;
      } catch (error) {
        // do nothing
      }

      await closePosition(currentPositionId);
      console.log(`Closed position ${currentPositionId}`);
    }

    isRunning = false;
    currentPositionId = null;

    if
    (
      !(
        (localHour >= START_HOUR_SESSION1 && localHour <= END_HOUR_SESSION1) ||
        (localHour >= START_HOUR_SESSION2 && localHour <= END_HOUR_SESSION2) ||
        (localHour >= START_HOUR_SESSION3 && localHour <= END_HOUR_SESSION3)
      )  
    ) {
      return "request for trade not available this time"
    }

    const openResponse = await openPosition(signal, 0, currentTp);
    
    if (openResponse.data.orderId) {
      currentPositionId = openResponse.data.orderId;
      isRunning = true;
      console.log(
        `Opened new position ${currentPositionId}`
      );
    } else {
      console.error("Failed to open a new position");
    }
  } catch (error) {
    console.error("Error during position handling:", error);
  }

  console.endTime("request-time")
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  require("./keepAlive");
});
