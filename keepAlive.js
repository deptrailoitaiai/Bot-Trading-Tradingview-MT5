const axios = require('axios');

// URL của server trên Vercel
const SERVER_URL = "https://webhook-390k.onrender.com"; 

// Hàm gửi request đến server
async function pingServer() {
    try {
        const response = await axios.get(SERVER_URL);
        console.log(`Pinged server successfully at ${new Date().toISOString()}:`, response.status);
    } catch (error) {
        console.error(`Error pinging server at ${new Date().toISOString()}:`, error.message);
    }
}


setInterval(pingServer, 14 * 60 * 1000);