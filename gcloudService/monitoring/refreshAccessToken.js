const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');

const CREDENTIALS_PATH = './credentials.json';
const TOKEN_PATH = './tokenOauth2.json';

function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }
}

function writeJsonFile(filePath, updatedData) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    } catch (error) {
        console.error(`cant write in file ${filePath}:`, error.message);
        throw error;
    }
}

async function refreshAccessToken() {
    const credentials = readJsonFile(CREDENTIALS_PATH);
    const tokenData = readJsonFile(TOKEN_PATH);

    if (!tokenData.refresh_token) {
        throw new Error('cant find refresh token');
    }

    const { client_id, client_secret } = credentials.installed || credentials.web;
    const oAuth2Client = new OAuth2Client(client_id, client_secret);

    oAuth2Client.setCredentials({
        refresh_token: tokenData.refresh_token,
    });

    try {
        const { credentials: updatedCredentials } = await oAuth2Client.refreshAccessToken();

        const updatedTokenData = {
            ...tokenData,
            access_token: updatedCredentials.access_token,
            expiry_date: updatedCredentials.expiry_date,
        };

        writeJsonFile(TOKEN_PATH, updatedTokenData);

        console.log('new access_token:', updatedCredentials.access_token);
        return updatedCredentials.access_token;
    } catch (error) {
        console.error('error while refresh access_token:', error.message);
        throw error;
    }
}

async function refresh() {
    try {
        await refreshAccessToken()
        console.log('refreshed access_token every 50 minutes');
    } catch (err) {
        console.log('Error:', err);
    }
    setTimeout(refresh, 50 * 60 * 1000);
}

// setTimeout(refresh().catch, 30 * 1000);
refresh().catch(console.error);