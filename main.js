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

app.get("/", async (req, res) => {
  console.log("ping to keep server alive");
  return res.status(200)
})


// handle signal *************************************************************************************************
app.post("/", async (req, res) => {
  const { signal } = req.body;
  res.sendStatus(200);

  console.log(`signal from tradingview ${signal}`);
  try {
    if (currentPositionId) {
      await closePosition(currentPositionId);
      console.log(`Closed position ${currentPositionId}`);
    }

    isRunning = false;
    currentPositionId = null;

    const openResponse = await openPosition(signal, 0, 0.5);

    if (openResponse.data.orderId) {
      currentPositionId = openResponse.data.orderId;
      isRunning = true;
      console.log(
        `Opened new position ${currentPositionId} with initial stop-loss: -1`
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
