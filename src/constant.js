require("dotenv").config();

const API_KEY = process.env.API_KEY
const MT5_URL_TRADE = process.env.MT5_URL_TRADE
const MT5_URL_POSITION = (positionId) => {
  return (process.env.MT5_URL_POSITION + "/" + positionId).toString();
};

module.exports = {
  API_KEY,
  MT5_URL_TRADE,
  MT5_URL_POSITION,
};
