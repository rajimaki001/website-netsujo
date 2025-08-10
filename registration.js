// スクリプトプロパティをセットアップするための関数（初回のみ実行）
function setupScriptProperties() {
    const scriptProperties = PropertiesService.getScriptProperties();

    // スプレッドシートのURLとPDFのIDをここに設定
    const SPREADSHEET_URL = 'ここにスプレッドシートのURLを貼り付けてください';
    const PDF_FILE_ID = 'ここにPDFファイルのIDを貼り付けてください';

    scriptProperties.setProperties({
        'SPREADSHEET_URL': SPREADSHEET_URL,
        'PDF_FILE_ID': PDF_FILE_ID
    });

    Logger.log('スクリプトプロパティの設定が完了しました。');
}