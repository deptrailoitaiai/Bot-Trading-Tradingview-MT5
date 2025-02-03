const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { constants } = require('../constant');
const { account1Service } = require("../account1/account1Service");

const imapConfig = {
    user: constants.IMAP_Config.email,
    password: constants.IMAP_Config.password,
    host: constants.IMAP_Config.IMAP_host,
    port: constants.IMAP_Config.IMAP_port,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    }
};

let imap;

function initializeImap() {
    imap = new Imap(imapConfig);

    function openInbox(cb) {
        imap.openBox('noti_from_tv', true, cb);
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

            // Giữ kết nối bằng lệnh NOOP hoặc STATUS
            setInterval(() => {
                if (imap.state === 'authenticated') {
                    console.log("Sending NOOP to keep connection alive...");
                    imap.status('INBOX', (err) => {
                        if (err) console.error("Error keeping IMAP connection alive:", err);
                    });
                }
            }, 5 * 60 * 1000); // Gửi mỗi 5 phút

            imap.on('mail', function () {
                const fetch = imap.seq.fetch(box.messages.total + ':*', { bodies: '' });

                fetch.on('message', function (msg, seqno) {
                    msg.on('body', async function (stream, info) {
                        try {
                            console.log("-----------------------------------------------");
                            console.log(((new Date().getUTCHours()) + 7) % 24)
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

                fetch.once('end', function () {});
            });
        });
    });

    // Bắt lỗi và thử kết nối lại
    imap.once('error', function (err) {
        console.error('IMAP Error:', err);
        if (err.code === 'ECONNRESET') {
            console.log("Connection reset detected. Reconnecting...");
            reconnectImap();
        }
    });

    imap.once('end', function () {
        console.log('IMAP connection ended. Reconnecting...');
        reconnectImap();
    });

    imap.connect();
    console.log("Connected to IMAP server");
}

function reconnectImap() {
    setTimeout(() => {
        console.log("Reconnecting to IMAP server...");
        initializeImap();
    }, 5000); // Thử lại sau 5 giây
}

// Khởi động kết nối IMAP
initializeImap();
