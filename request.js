const axios = require("axios");

const headers = (apiKey) => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "auth-token": apiKey,
  };
};

function openPositionBody(spell, sl, tp, symbol) {
  return {
    symbol: symbol,
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

async function openPosition(symbol, spell, sl, tp, MT5_URL_TRADE, apiKey) {
  const response = await axios.post(
    MT5_URL_TRADE,
    openPositionBody(spell, sl, tp, symbol),
    {
      headers: headers(apiKey),
    }
  );
  // console.log(response.data);
  return response;
}

async function closePosition(positionId, MT5_URL_TRADE, apiKey) {
  const response = await axios.post(
    MT5_URL_TRADE,
    closePositionBody(positionId),
    {
      headers: headers(apiKey),
    }
  );
  return response;
}

async function getPosition(positionId, MT5_URL_POSITION, apiKey) {
  const response = await axios.get(`${MT5_URL_POSITION}/${positionId}`, {
    headers: headers(apiKey),
  });
  return response;
}

module.exports = {
  openPosition,
  closePosition,
  getPosition,
};
