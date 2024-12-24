const axios = require("axios");

function keepAlive() {
    axios.post("https://bot-trading-tradingview-mt5.onrender.com", { signal: "ping" })
}

setInterval(keepAlive, 3000);