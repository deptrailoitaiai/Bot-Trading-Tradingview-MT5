imap.once('ready', function () {
    // Mở label '[Gmail]/noti_from_tv' thay vì 'INBOX'
    openInbox(function (err, box) {
        if (err) throw err;

        console.log(`Listening for new emails in label: ${box.name}`);

        // Lắng nghe sự kiện mail mới
        imap.on('mail', function () {
            // Fetch email mới nhất
            const fetch = imap.seq.fetch(box.messages.total + ':*', { bodies: '' });

            fetch.on('message', function (msg, seqno) {
                msg.on('body', async function (stream, info) {
                    try {
                        console.log("-----------------------------------------------");
                        console.log("Started new transaction");

                        // Phân tích nội dung email
                        const parsed = await simpleParser(stream);
                        const emailBody = parsed.text || parsed.html;

                        // Kiểm tra xem email có phải là JSON hợp lệ không
                        const verifyAndGetSignal = isValidJSON(emailBody);
                        if (verifyAndGetSignal.isValid) {
                            console.log(`Phase-1: verify JSON: ${true}`);
                            const signalFromEmail = verifyAndGetSignal.body.signal;
                            console.log(`Phase-1: signal: ${signalFromEmail}`);

                            // Thực hiện xử lý thêm với signal từ email
                            await account1Service(signalFromEmail);
                        } else {
                            console.log(`Phase-1: verify JSON: ${false}`);
                            console.log('Transaction rolled back');
                        }
                    } catch (err) {
                        console.error('Error processing email:', err);
                    }
                });
            });

            fetch.once('end', function () {
                console.log('End of email fetch');
            });
        });
    });
});
