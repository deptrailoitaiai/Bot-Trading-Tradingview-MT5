const { google } = require('googleapis');
const fs = require('fs');
const { constants } = require("../../constant");

const TOKEN_PATH = './tokenOauth2.json';

const PUBSUB_TOPIC = constants.GoogleCloud_Config.Topic_Name;

function loadAuthFromToken() {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function getLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const response = await gmail.users.labels.list({
            userId: 'me',
        });

        console.log('Labels:');
        response.data.labels.forEach(label => {
            console.log(`- ${label.name} (ID: ${label.id})`);
        });
    } catch (error) {
        console.error('Error fetching labels:', error);
    }
}

(async () => {
    try {
        const auth = loadAuthFromToken();
        await getLabels(auth);
    } catch (error) {
        console.error('Error:', error);
    }
})();
