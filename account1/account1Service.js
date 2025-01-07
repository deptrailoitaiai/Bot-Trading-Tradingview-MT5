const { constants } = require("../constant");
const { getPosition, closePosition, openPosition } = require("../request");

let currentPositionId = null;
const API_KEY = constants.account1.API_Config.API_KEY;
const MT5_URL_TRADE = constants.account1.API_Config.MT5_URL_TRADE;
const MT5_URL_POSITION = constants.account1.API_Config.MT5_URL_POSITION;
const TP = constants.account1.TakeProfit;
const TP_AFTER_SL = constants.account1.TakeProfitAfterStopLoss;
const START_HOUR_SESSION1 = constants.account1.TradeTime.START_HOUR_SESSION1;
const END_HOUR_SESSION1 = constants.account1.TradeTime.END_HOUR_SESSION1;
const START_HOUR_SESSION2 = constants.account1.TradeTime.START_HOUR_SESSION2;
const END_HOUR_SESSION2 = constants.account1.TradeTime.END_HOUR_SESSION2;
const START_HOUR_SESSION3 = constants.account1.TradeTime.START_HOUR_SESSION3;
const END_HOUR_SESSION3 = constants.account1.TradeTime.END_HOUR_SESSION3;

const account1Service = async (signal) => {
  const numericCode = await close(currentPositionId);
  console.log("---", numericCode, "---")

  const verifyTradeTime = checkTradeTime();
  if (!verifyTradeTime) return "Out of time for trade";
  const id = await open(signal, numericCode == 4753 ? TP : TP_AFTER_SL);
  currentPositionId = id;
};

const close = async (positionId) => {
  try {
    const closeTrade = await closePosition(positionId, MT5_URL_TRADE, API_KEY);
    return closeTrade.data.numericCode;
  } catch (error) {
    console.log("closed by tp")
  }
};

const checkTradeTime = () => {
  const currentHour = new Date().getHours() + 7;
  const localHour = currentHour >= 24 ? currentHour - 24 : currentHour;

  if (
    !(
      (localHour >= START_HOUR_SESSION1 && localHour <= END_HOUR_SESSION1) ||
      (localHour >= START_HOUR_SESSION2 && localHour <= END_HOUR_SESSION2) ||
      (localHour >= START_HOUR_SESSION3 && localHour <= END_HOUR_SESSION3)
    )
  ) {
    return false;
  }
  return true;
};

const open = async (signal, TP) => {
  const position = await openPosition("XAUUSDm" ,signal, 0, TP, MT5_URL_TRADE, API_KEY);
  if (position.data.orderId) console.log("opened new position");
  return position.data.orderId;
};

module.exports = { account1Service };

/*

{
  "symbol": "XAUUSDm",
  "actionType": "ORDER_TYPE_SELL",    "volume": 0.01,
  "stopLoss": 0,
  "takeProfit": 0,
  "stopLossUnits": "RELATIVE_CURRENCY",
  "takeProfitUnits": "RELATIVE_CURRENCY"
}

{
  "actionType": "POSITION_CLOSE_ID",
  "positionId": "263171588"
}


"numericCode": 10009,
"numericCode": 4753,

*/