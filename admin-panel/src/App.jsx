import { useEffect, useRef, useState } from 'react';
import { API_BASE, pingAI, sendVoiceCommand } from './lib/api';

export default function App() {
  const [status, setStatus] = useState('idle');
  const [aiOnline, setAiOnline] = useState(null);
  const [command, setCommand] = useState('');
  const [file, setFile] = useState('public/index.html');
  const [commit, setCommit] = useState('AI: voice command');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const recRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const j = await pingAI();
        setAiOnline(!!j.ok);
      } catch { setAiOnline(false); }
    })();
  }, []);

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Web Speech API not supported here'); return; }
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = true;
    r.continuous = false;
    recRef.current = r;
    setStatus('listening');
    r.onresult = (e) => {
      const text = Array.from(e.results).map(x => x[0].transcript).join(' ');
      setCommand(text);
    };
    r.onerror = () => setStatus('error');
    r.onend = () => setStatus('idle');
    r.start();
  }

  async function run() {
    setError(''); setResult(null);
    try {
      const j = await sendVoiceCommand({ command, file, commitMessage: commit });
      setResult(j);
    } catch (e) {
      setError(String(e.message || e));
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Admin Command Center</h1>

      <p>
        API: <code>{API_BASE}</code>{' '}
        <span style={{
          padding: '2px 8px', border: '1px solid #ddd', borderRadius: 999, marginLeft: 8,
          color: aiOnline === null ? '#555' : aiOnline ? '#0a0' : '#a00'
        }}>
          {aiOnline === null ? 'checking…' : aiOnline ? 'AI Online' : 'AI Offline'}
        </span>
      </p>

      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <button onClick={startVoice}>🎤 Voice</button>
          <span style={{ marginLeft: 10, opacity: .7 }}>Status: {status}</span>
        </div>

        <label>
          <div><b>Command</b></div>
          <textarea rows={3} value={command} onChange={e => setCommand(e.target.value)}
            placeholder={`e.g., Change the hero headline to "Welcome to YouTuneAI"`} />
        </label>

        <label>
          <div><b>Target file (in repo)</b></div>
          <input value={file} onChange={e => setFile(e.target.value)} />
        </label>

        <label>
          <div><b>Commit message</b></div>
          <input value={commit} onChange={e => setCommit(e.target.value)} />
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={run}>🚀 Propose & Deploy</button>
        </div>

        {error && <pre style={{ color: '#a00', whiteSpace: 'pre-wrap' }}>{error}</pre>}

        {result && (
          <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
            <h3>Result</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
            {result.pull_url && (
              <p><a href={result.pull_url} target="_blank">Open PR</a></p>
            )}
            {result.preview_url && (
              <p><a href={result.preview_url} target="_blank">Preview</a></p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
