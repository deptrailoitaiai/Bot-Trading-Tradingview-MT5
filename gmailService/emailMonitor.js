const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { constants } = require('../constant');
const { account1Service } = require("../account1/account1Service");

const imapConfig = {
    user: constants.emailGetSignal.email,
    password: constants.emailGetSignal.password,
    host: constants.emailGetSignal.IMAP_host,
    port: constants.emailGetSignal.IMAP_port,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    }
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

function isValidJSON(body) {
    try {
        const parsedJSON = JSON.parse(body);
        return { isValid: true, body: parsedJSON };
    } catch (e) {
        return { isValid: false, body: false };
    }
}

imap.once('ready', function () {
    openInbox(function (err, box) {
        if (err) throw err;

        imap.on('mail', function () {
            const fetch = imap.seq.fetch(box.messages.total + ':*', { bodies: '' });

            fetch.on('message', function (msg, seqno) {
                msg.on('body', async function (stream, info) {
                    try {
                        console.log("-----------------------------------------------");
                        console.log("started new transaction");

                        const parsed = await simpleParser(stream);

                        const emailBody = parsed.text || parsed.html;

                        const verifyAndGetSignal = isValidJSON(emailBody);
                        if (verifyAndGetSignal.isValid) {
                            console.log(`phase-1: verify JSON: ${true}`);
                            const signalFromEmail = verifyAndGetSignal.body.signal;
                            console.log(`phase-1: signal: ${signalFromEmail}`);

                            await account1Service(signalFromEmail);
                        } else {
                            console.log(`phase-1: verify JSON: ${false}`);
                            console.log('transaction rolled-back');
                        }
                    } catch (err) {
                        console.error('Error processing email:', err);
                    }
                });
            });

            fetch.once('end', function () {
            });
        });
    });
});

imap.once('error', function (err) {
    console.log(err);
});

imap.once('end', function () {
    console.log('end.');
});

imap.connect();
