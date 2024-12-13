const { API_KEY, MT5_URL_TRADE, MT5_URL_POSITION } = require("./constant");
const axios = require("axios");

const apiKey = API_KEY;
const MT5_URL = MT5_URL_TRADE;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "auth-token": apiKey,
};

function openPositionBody(spell, sl, tp) {
  return {
    symbol: "XAUUSDm",
    actionType: spell == "buy" ? "ORDER_TYPE_BUY" : "ORDER_TYPE_SELL",
    volume: 0.01,
    stopLoss: sl,
    takeProfit: tp,
    stopLossUnits: "RELATIVE_CURRENCY",
    takeProfitUnits: "RELATIVE_CURRENCY",
  };
}

function closePositionBody(positionId) {
  return {
    actionType: "POSITION_CLOSE_ID",
    positionId: positionId,
  };
}

function modifyStoplossBody(positionId, stoploss) {
  return {
    actionType: "POSITION_MODIFY",
    positionId: positionId,
    stopLoss: stoploss,
    stopLossUnits: "ABSOLUTE_PRICE",
  };
}

function modifyTakeprofitBody(positionId, takeprofit) {
  return {
    actionType: "POSITION_MODIFY",
    positionId: positionId,
    takeProfit: takeprofit,
    takeProfitUnits: "ABSOLUTE_PRICE",
  };
}

async function openPosition(spell, sl, tp) {
  const response = await axios.post(MT5_URL, openPositionBody(spell, sl, tp), {
    headers: headers,
  });
  console.log(response.data);
  return response;
}

async function closePosition(positionId) {
  const response = await axios.post(MT5_URL, closePositionBody(positionId), {
    headers: headers,
  });
  return response;
}

async function getPosition(positionId) {
  const response = await axios.get(MT5_URL_POSITION(positionId), {
    headers: headers,
  });
  return response;
}

async function modifyStoploss(positionId, stoploss) {
  const response = await axios.post(
    MT5_URL,
    modifyStoplossBody(positionId, stoploss),
    { headers: headers }
  );
  return response;
}

async function modifyTakeprofit(positionId, takeprofit) {
  const response = await axios.post(
    MT5_URL,
    modifyTakeprofitBody(positionId, takeprofit),
    { headers: headers }
  )

  return response;
}

module.exports = {
  openPosition,
  closePosition,
  getPosition,
  modifyStoploss,
  modifyTakeprofit,
};
