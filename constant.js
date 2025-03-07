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
      END_HOUR_SESSION1: 0, 
      START_HOUR_SESSION2: 13,
      END_HOUR_SESSION2: 16,
      START_HOUR_SESSION3: 19,
      END_HOUR_SESSION3: 23, 
    },
    TakeProfit: 1.5,
    TakeProfitAfterStopLoss: 2,
  },
  account2: {
    API_Config: {
      API_KEY: process.env.API_KEY_2,
      MT5_URL_TRADE: process.env.MT5_URL_TRADE_2,
      MT5_URL_POSITION: process.env.MT5_URL_POSITION_2,
    },
    TakeProfit: 3,
    TakeProfitAfterStopLoss: 3,
  },
  IMAP_Config: {
    email: process.env.EMAIL,
    password: process.env.GOOGLE_APP_PASSWORD,
    IMAP_host: process.env.IMAP_HOST,
    IMAP_port: process.env.IMAP_PORT
  },
  GoogleCloud_Config: {
    Subscription_Name: process.env.SUBSCRIPTION_NAME,
    Topic_Name: process.env.TOPIC_NAME,
  }
}

module.exports = { constants };
