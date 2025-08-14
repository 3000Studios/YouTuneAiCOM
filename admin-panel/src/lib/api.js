const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function pingAI() {
    const r = await fetch(`${API}/debug/openai`);
    return r.json();
}

export async function sendVoiceCommand({ command, file, commitMessage }) {
    const r = await fetch(`${API}/voice-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, file, commitMessage })
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Request failed');
    return j;
}

export { API as API_BASE };
