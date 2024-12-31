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

const START_HOUR_SESSION1 = 8;
const END_HOUR_SESSION1 = 10; //10h59

const START_HOUR_SESSION2 = 12;
const END_HOUR_SESSION2 = 17; //17h59

const START_HOUR_SESSION3 = 19;
const END_HOUR_SESSION3 = 23; //23h59

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

  const currentHour = new Date().getHours() + 7;
  const localHour = currentHour >= 24 ? currentHour - 24 : currentHour;

  console.log(`signal from tradingview ${signal}`);
  try {
    if (currentPositionId) {
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

    const openResponse = await openPosition(signal, 0, 1);

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
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
  require("./keepAlive");
});


// monitoring position ****************************************************************************************
// const monitorPosition = async () => {
//   if (!isRunning) {
//     setTimeout(monitorPosition, 1000);
//     return;
//   }

//   try {
//     const position = await getPosition(currentPositionId);
//     const currentProfit = position.data.profit;

//     console.log(
//       `spell ${position.data.id} (${position.data.type}) is running with current profit: ${currentProfit}`
//     );

//     // stop-loss strategy
//     // await stopLossSetupStrategy4(position.data);
//   } catch (error) {
//     if (error.response && error.response.status === 404) {
//       console.log(
//         `position not found, may close by stop-loss or by annother spell`
//       );
//     } else {
//       console.error("Error during monitoring:", error.message);
//     }
//   }

//   setTimeout(monitorPosition, 1000);
// };

// monitorPosition();


// strategies ************************************************************************************************

// default stop-loss = -1, profitable stop-loss moving < absolute price 1
async function stopLossSetupStrategy1(positionData) {
  let absoluteStoplossPrice;

  if (
    positionData.profit >= 0 &&
    positionData.profit >= profitableStoplossDistance + 1
  ) {
    absoluteStoplossPrice =
      positionData.type == "POSITION_TYPE_BUY"
        ? positionData.openPrice + profitableStoplossDistance
        : positionData.openPrice - profitableStoplossDistance;

    await modifyStoploss(currentPositionId, absoluteStoplossPrice);

    profitableStoplossDistance += 1;

    console.log("setup stop-loss following strategy 1");
    console.log(
      `stop-loss moved to ${absoluteStoplossPrice}, current stop loss: ${
        position.data.type == "POSITION_TYPE_BUY"
          ? absoluteStoplossPrice - positionData.openPrice
          : positionData.openPrice - absoluteStoplossPrice
      }`
    );
  }
}

// default stop-loss = -1, profitable stop-loss moving = open price, hold until spell close by opposite position
async function stopLossSetupStrategy2(positionData) {
  if (positionData.profit >= 0.5) {
    await modifyStoploss(currentPositionId, positionData.openPrice);
    console.log("setup stop-loss following strategy 2");
    console.log(
      `stop-loss moved to ${positionData.openPrice} (moved to entry)`
    );
  }
}

// default stop-loss = -1, take-profit = 2; stop-loss moved to entry when price hit 0.5u profit
async function stopLossSetupStrategy3(positionData) {
  if (positionData.profit >= 0.5) {
    const response = await modifyStoploss(
      currentPositionId,
      positionData.openPrice
    );

    if (response.data.stringCode == "TRADE_RETCODE_DONE") {
      console.log(response.data);
      console.log("setup stop-loss following strategy 3: moved to entry");
    }
  }
}

// no default stop loss, tp = 2 stop loss move to entry if price move to 1u profit, sl and price keep moving with step = 1u
async function stopLossSetupStrategy4(positionData) {
  if (positionData.profit >= profitableStoplossDistance + 1) {
    const response = await modifyStoploss(
      currentPositionId,
      positionData.type == "POSITION_TYPE_BUY"
        ? positionData.openPrice + profitableStoplossDistance
        : positionData - profitableStoplossDistance
    );

    if(response.data.stringCode == "TRADE_RETCODE_DONE") {
      console.log(
        `stop-loss moved to ${absoluteStoplossPrice}, current stop loss: ${
          position.data.type == "POSITION_TYPE_BUY"
            ? absoluteStoplossPrice - positionData.openPrice
            : positionData.openPrice - absoluteStoplossPrice
        }`
      );
      profitableStoplossDistance += 1;
    }
  }
}
