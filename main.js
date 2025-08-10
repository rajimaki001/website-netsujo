// HTMLファイルを表示する関数
function doGet() {
    return HtmlService.createTemplateFromFile('form').evaluate();
}

// フォームデータを受け取って処理する関数
function doPost(e) {
    const data = e.parameter;
    const name = data.name;
    const email = data.email;
    const message = data.message;

    // スクリプトプロパティから値を取得
    const scriptProperties = PropertiesService.getScriptProperties();
    const SPREADSHEET_URL = scriptProperties.getProperty('SPREADSHEET_URL');
    const PDF_FILE_ID = scriptProperties.getProperty('PDF_FILE_ID');

    // バリデーション（検証）処理
    if (!name || !email || !message) {
        return ContentService.createTextOutput('Error: 必須項目が入力されていません。');
    }

    // サニタイズ（無害化）処理
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    // フォーム送信成功をスプレッドシートに記録
    try {
        const sheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL).getSheetByName('シート1');
        const now = new Date();
        sheet.appendRow([now, sanitizedName, sanitizedEmail, sanitizedMessage, '送信完了']);
    } catch (error) {
        Logger.log('スプレッドシートへの記録に失敗しました: ' + error.message);
    }

    // メール送信
    const subject = 'お問い合わせありがとうございます';
    const body = `
  ${sanitizedName}様

  この度はお問い合わせいただき、誠にありがとうございます。
  以下の内容でお問い合わせを受け付けました。

  ---------------------------
  お名前: ${sanitizedName}
  メールアドレス: ${sanitizedEmail}
  お問い合わせ内容:
  ${sanitizedMessage}
  ---------------------------

  担当者より改めてご連絡いたしますので、今しばらくお待ちください。
  `;

    // PDFファイルを取得
    const pdfFile = DriveApp.getFileById(PDF_FILE_ID);

    // メール送信のオプションを設定
    const options = {
        attachments: [pdfFile.getBlob()] // Blob形式で添付ファイルを追加
    };

    // GmailAppを使用してPDFを添付してメールを送信
    GmailApp.sendEmail(sanitizedEmail, subject, body, options);

    return ContentService.createTextOutput('Success');
}

// サニタイズ用のヘルパー関数
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return input;
    }
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}