const { google } = require('googleapis');
const fs = require('fs');

const TOKEN_PATH = './tokenOauth2.json';

function loadAuthFromToken() {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function checkNewMessages(historyId) {
    const auth = loadAuthFromToken(); // Tạo OAuth2Client từ token
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        // Gọi API để lấy các thay đổi từ historyId đã cho
        const res = await gmail.users.history.list({
            userId: 'me',
            startHistoryId: historyId,  // Kiểm tra các thay đổi kể từ historyId này
        });

        // Nếu có sự thay đổi, xử lý các thay đổi đó
        if (res.data.history && res.data.history.length > 0) {
            res.data.history.forEach(change => {
                console.log("Change detected:", change);
                // Nếu có tin nhắn mới, bạn có thể kiểm tra hoặc xử lý ở đây
                if (change.messagesAdded) {
                    change.messagesAdded.forEach(message => {
                        console.log("New message added:", message);
                        // Xử lý tin nhắn mới (ví dụ: in ra thông tin tin nhắn)
                    });
                }
                if (change.messagesDeleted) {
                    change.messagesDeleted.forEach(message => {
                        console.log("Message deleted:", message);
                        // Xử lý tin nhắn bị xóa
                    });
                }
            });
        } else {
            console.log("No new changes detected.");
        }

        // Cập nhật historyId để theo dõi các thay đổi tiếp theo
        const newHistoryId = res.data.historyId;
        console.log("Updated historyId:", newHistoryId);
        // Bạn có thể lưu lại newHistoryId vào cơ sở dữ liệu hoặc lưu trữ để sử dụng trong lần sau

    } catch (err) {
        console.error('Error:', err);
    }
}

checkNewMessages(127597).catch(console.error);
