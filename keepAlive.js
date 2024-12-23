const axios = require('axios');

// URL của server trên Vercel
const SERVER_URL = "https://webhook-390k.onrender.com"; 

// Hàm gửi request đến server
function pingServer() {
    axios.get(SERVER_URL);
}


setInterval(pingServer, 10 * 60 * 1000);