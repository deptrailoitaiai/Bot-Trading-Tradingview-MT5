const { google } = require('googleapis');
const fs = require('fs');
const {account1Service} = require("../account1/account1Service");

const TOKEN_PATH = './tokenOauth2.json';
let lastMessageId = "null";

function loadAuthFromToken() {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function handlerSignal() {
    const auth = loadAuthFromToken();
    const gmail = google.gmail({ version: 'v1', auth });

    try {


        const res = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ["Label_7408072646925256615"],
            maxResults: 1,
        });

        const messages = res.data.messages || [];
        if (messages.length === 0) {
            console.log('No new messages found.');
            return;
        }

        const messageId = messages[0].id;

        // if (messageId === lastMessageId) {
        //     console.log(`Duplicate message: ${messageId}, skipping...`);
        //     return;
        // }

        const emailRes = await gmail.users.messages.get({
            userId: 'me',
            id: messageId,
        });

        const email = emailRes.data;
        const emailBody = getBody(email.payload).toString();

        console.log(typeof(emailBody))
        console.log(emailBody === "sell" || emailBody === "buy")
        if(emailBody === "sell" || emailBody === "buy") {
            console.log(`New email ID: ${messageId}`);
            console.log(`Email Body: ${emailBody}`);
            await account1Service(emailBody);
        }

        lastMessageId = messageId;
    } catch (err) {
        console.error('Error:', err);
    }
}

function getBody(payload) {
    if (payload.body && payload.body.data) {
        return Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }
    if (payload.parts) {
        for (const part of payload.parts) {
            const body = getBody(part);
            if (body) return body;
        }
    }
    return null;
}

module.exports = { handlerSignal };
