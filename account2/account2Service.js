const { constants } = require("../constant");
const { getPosition, closePosition, openPosition } = require("../request");

let currentPositionId = 1;
const API_KEY = constants.account2.API_Config.API_KEY;
const MT5_URL_TRADE = constants.account2.API_Config.MT5_URL_TRADE;
const MT5_URL_POSITION = constants.account2.API_Config.MT5_URL_POSITION;
const TP = constants.account2.TakeProfit;
const TP_AFTER_SL = constants.account2.TakeProfitAfterStopLoss;

const account2Service = async (signal, symbol) => {
  try {

    const numericCode = await close(currentPositionId);
    
    const id = await open(symbol, signal, numericCode == 4753 ? TP : TP_AFTER_SL);

    currentPositionId = id;
  } catch (error) {
    console.log("Error during position handling:", error)
  }
};


const close = async (positionId) => {
  try {
    const closeTrade = await closePosition(positionId, MT5_URL_TRADE, API_KEY);
    return closeTrade.data.numericCode;
  } catch (error) {
    console.log("closed by tp")
  }
};

// const checkTradeTime = () => {
//   const currentHour = new Date().getHours() + 7;
//   const localHour = currentHour >= 24 ? currentHour - 24 : currentHour;

//   if (
//     !(
//       (localHour >= START_HOUR_SESSION1 && localHour <= END_HOUR_SESSION1) ||
//       (localHour >= START_HOUR_SESSION2 && localHour <= END_HOUR_SESSION2) ||
//       (localHour >= START_HOUR_SESSION3 && localHour <= END_HOUR_SESSION3)
//     )
//   ) {
//     return false;
//   }
//   return true;
// };

const open = async (symbol, signal, TP) => {
  const position = await openPosition(symbol, signal, 0, TP, MT5_URL_TRADE, API_KEY);
  if (position.data.orderId) console.log("opened new position");
  return position.data.orderId;
};

module.exports = { account2Service };
