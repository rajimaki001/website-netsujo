// HTMLファイルを表示する関数
function doGet() {
    return HtmlService.createTemplateFromFile('form').evaluate();
}

// フォームデータを受け取って処理する関数
function doPost(e) {
    const p = e || {};
    const data = p.parameter || {};
    const params = p.parameters || {};

    const name = data.name;
    const org = data.org || ''; // ★追加
    const email = data.email;
    const message = data.message || '';

    const reasons = params.reason || [];
    const reasonsJoined = Array.isArray(reasons) ? reasons.join(', ') : String(reasons || '');

    const scriptProperties = PropertiesService.getScriptProperties();
    const SPREADSHEET_URL = scriptProperties.getProperty('SPREADSHEET_URL');
    const PDF_FILE_ID = scriptProperties.getProperty('PDF_FILE_ID');

    if (!name || !email) {
        return ContentService.createTextOutput('Error: 必須項目が入力されていません。')
            .setMimeType(ContentService.MimeType.TEXT);
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedOrg = sanitizeInput(org); // ★追加
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedReasons = sanitizeInput(reasonsJoined);

    try {
        const sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getSheetByName('シート1');
        const now = new Date();
        sheet.appendRow([now, sanitizedName, sanitizedOrg, sanitizedEmail, sanitizedReasons, sanitizedMessage, '送信完了']);
    } catch (error) {
        Logger.log('スプレッドシートへの記録に失敗: ' + error.message);
    }

    const subject = '【Netsujo株式会社】お問い合わせをありがとうございます';
    const body =
        `${sanitizedName} 様

この度はお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けました。

---------------------------
お名前: ${sanitizedName}
企業・団体名: ${sanitizedOrg || '（未記入）'}
メール: ${sanitizedEmail}
資料請求の理由: ${sanitizedReasons || '（未選択）'}
お問い合わせ内容:
${sanitizedMessage}
---------------------------

この度は資料をご請求いただき、誠にありがとうございます。
資料は本メールに添付しております。

お困りごとやご相談ごと等ございましたら、お気軽にご連絡くださいませ。
お問い合わせフォームはこちらです。
https://netsujo.jp/contact`;

    const pdfFile = PDF_FILE_ID ? DriveApp.getFileById(PDF_FILE_ID) : null;
    const options = pdfFile ? { attachments: [pdfFile.getBlob()] } : {};

    GmailApp.sendEmail(sanitizedEmail, subject, body, options);

    return ContentService.createTextOutput('Success')
        .setMimeType(ContentService.MimeType.TEXT);
}


// サニタイズ用のヘルパー関数
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return input;
    }
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}