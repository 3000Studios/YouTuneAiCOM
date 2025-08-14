import { useRef, useState } from "react";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Web Speech API not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendCommand = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: transcript })
      });
      const data = await response.json();
      setPreviewUrl(data.previewUrl);
    } catch (err) {
      alert('Failed to contact backend: ' + err.message);
    }
  };

  const approveChange = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      alert(`Approved! Status: ${data.status}, Deployed: ${data.deployed}`);
    } catch (err) {
      alert('Failed to contact backend: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>YouTuneAI Admin Panel</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? "Stop Listening" : "Start Voice Command"}
        </button>
        <input
          type="text"
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
          placeholder="Or type your command here"
          style={{ width: "70%", marginLeft: 8 }}
        />
        <button onClick={sendCommand} disabled={!transcript} style={{ marginLeft: 8 }}>
          Send
        </button>
      </div>
      {previewUrl && (
        <div style={{ margin: "2rem 0" }}>
          <h2>Live Preview</h2>
          <iframe
            src={previewUrl}
            title="Live Preview"
            style={{ width: "100%", height: 400, border: "1px solid #ccc" }}
          />
          <button onClick={approveChange} style={{ marginTop: 16 }}>
            Approve & Deploy
          </button>
        </div>
      )}
    </div>
  );
}
