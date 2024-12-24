const axios = require("axios");

function keepAlive() {
    try {
        axios.post("https://bot-trading-tradingview-mt5.onrender.com", { signal: "ping" })
    } catch (error) {
        console.log("method post not responding");
    }
}

setInterval(keepAlive, 3000);