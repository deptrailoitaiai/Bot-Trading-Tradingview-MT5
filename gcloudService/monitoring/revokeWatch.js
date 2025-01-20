const { google } = require('googleapis');
const fs = require('fs');

const TOKEN_PATH = './tokenOauth2.json';

function loadAuthFromToken() {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function stopAllWatch(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        await gmail.users.stop({
            userId: 'me',
        });
        console.log('All watch requests stopped successfully.');
    } catch (error) {
        console.error('Error stopping watch requests:', error);
    }
}

(async () => {
    try {
        const auth = loadAuthFromToken();
        await stopAllWatch(auth);
    } catch (error) {
        console.error('Error:', error);
    }
})();
