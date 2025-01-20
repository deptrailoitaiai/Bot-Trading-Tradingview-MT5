const { google } = require('googleapis');
const fs = require('fs');
const {constants} = require("../../constant");

const TOKEN_PATH = './tokenOauth2.json';

const PUBSUB_TOPIC = constants.GoogleCloud_Config.Topic_Name;

function loadAuthFromToken() {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function watchGmail(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const response = await gmail.users.watch({
            userId: 'me',
            requestBody: {
                labelIds: ['Label_7408072646925256615'],
                labelFilterBehavior: "INCLUDE",
                topicName: PUBSUB_TOPIC,
            },
        });

        console.log('Watch request sent successfully:');
        console.log('Expiration:', new Date(Number(response.data.expiration)).toISOString());
        console.log('History ID:', response.data.historyId);
    } catch (error) {
        console.error('Error sending watch request:', error);
    }
}


async function watchAfterInterval() {
    try {
        // Gửi yêu cầu watch Gmail
        await watchGmail(loadAuthFromToken());
        console.log('Send watch request after 6 days');
    } catch (err) {
        console.log('Error:', err);
    }
    setTimeout(watchAfterInterval, 6 * 24 * 60 * 60 * 1000);
}

setTimeout(watchAfterInterval, 30 * 1000);



