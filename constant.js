require("dotenv").config();

const constants = {
  account1: {
    API_Config: {
      API_KEY: process.env.API_KEY_1,
      MT5_URL_TRADE: process.env.MT5_URL_TRADE_1,
      MT5_URL_POSITION: process.env.MT5_URL_POSITION_1,
    },
    TradeTime: {
      START_HOUR_SESSION1: 0,
      END_HOUR_SESSION1: 1, 
      START_HOUR_SESSION2: 13,
      END_HOUR_SESSION2: 17,
      START_HOUR_SESSION3: 19,
      END_HOUR_SESSION3: 23, 
    },
    TakeProfit: 1,
    TakeProfitAfterStopLoss: 1.5,
  },
  account2: {
    API_Config: {
      API_KEY: process.env.API_KEY_2,
      MT5_URL_TRADE: process.env.MT5_URL_TRADE_2,
      MT5_URL_POSITION: process.env.MT5_URL_POSITION_2,
    },
    TakeProfit: 1,
    TakeProfitAfterStopLoss: 1.5,
  }
}

module.exports = { constants };
