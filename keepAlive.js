const axios = require("axios");

function keepAlive() {
    axios
    .post("https://bot-trading-tradingview-mt5.onrender.com", { signal: "ping" })
    .catch(() =>{
        console.log("method post not responding");
    }) 
}

setInterval(keepAlive, 10 * 60 * 1000);