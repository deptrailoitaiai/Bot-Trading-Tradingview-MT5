const axios = require('axios');

// URL của server trên Vercel
const SERVER_URL = "https://webhook-390k.onrender.com"; 

// Hàm gửi request đến server
function pingServer() {
    axios.post(SERVER_URL, {"signal": "ping"});
}


setInterval(pingServer, 3000);