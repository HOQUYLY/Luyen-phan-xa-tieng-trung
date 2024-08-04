let sentences = [];
let currentSentenceIndex = 0;

document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Xử lý dữ liệu từ Excel (câu tiếng Việt, tiếng Trung, và Pinyin)
        sentences = json.slice(1).map(row => ({
            vietnamese: row[0],
            chinese: row[1],
            pinyin: row[2]
        }));

        // Xáo trộn câu hỏi
        sentences = sentences.sort(() => Math.random() - 0.5);

        // Khởi động game với câu đầu tiên
        currentSentenceIndex = 0;
        showSentence();
    };
    reader.readAsArrayBuffer(file);
}

function showSentence() {
    if (sentences.length === 0) return;

    const sentence = sentences[currentSentenceIndex];
    document.getElementById('vietnameseSentence').innerText = sentence.vietnamese;
    document.getElementById('feedback').innerText = '';
}

function showAnswer() {
    if (sentences.length === 0) return;

    const { chinese, pinyin } = sentences[currentSentenceIndex];
    document.getElementById('feedback').innerHTML = `Đáp án: ${chinese}<br>Pinyin: ${pinyin}`;
    document.getElementById('feedback').style.color = 'black';
}

function nextSentence() {
    if (sentences.length === 0) return;

    currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;
    showSentence();
}
