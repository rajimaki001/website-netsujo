// �X�N���v�g�v���p�e�B���Z�b�g�A�b�v���邽�߂̊֐��i����̂ݎ��s�j
function setupScriptProperties() {
    const scriptProperties = PropertiesService.getScriptProperties();

    // �X�v���b�h�V�[�g��URL��PDF��ID�������ɐݒ�
    const SPREADSHEET_URL = '�����ɃX�v���b�h�V�[�g��URL��\��t���Ă�������';
    const PDF_FILE_ID = '������PDF�t�@�C����ID��\��t���Ă�������';

    scriptProperties.setProperties({
        'SPREADSHEET_URL': SPREADSHEET_URL,
        'PDF_FILE_ID': PDF_FILE_ID
    });

    Logger.log('�X�N���v�g�v���p�e�B�̐ݒ肪�������܂����B');
}