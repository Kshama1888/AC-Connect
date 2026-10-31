
let mediaRecorder;
let audioChunks = [];
let audioBlob;

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audioChunks = [];

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            audioBlob = new Blob(audioChunks, {
                type: mediaRecorder.mimeType
            });

            const audioURL = URL.createObjectURL(audioBlob);

            const playback = document.getElementById("audio-playback");

            playback.src = audioURL;
            playback.hidden = false;

            document.getElementById("download-btn").hidden = false;

            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();

        document.getElementById("record-btn").disabled = true;
        document.getElementById("stop-btn").disabled = false;

        document.getElementById("record-status").textContent =
            "🔴 Recording your memory...";

    } catch (error) {
        document.getElementById("record-status").textContent =
            "Microphone access denied or unavailable. Please check permissions.";

        console.error(error);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();

        document.getElementById("record-btn").disabled = false;
        document.getElementById("stop-btn").disabled = true;

        document.getElementById("record-status").textContent =
            "Recording complete! Listen to your memory below.";
    }
}

function downloadRecording() {
    if (!audioBlob) return;

    const url = URL.createObjectURL(audioBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "AC-Connect-Memory.webm";
    link.click();

    URL.revokeObjectURL(url);
}
