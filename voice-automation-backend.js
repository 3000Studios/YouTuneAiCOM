// Voice Command Automation Backend (Node.js/Express)
// This service receives commands, applies changes, and pushes to GitHub
import { exec } from 'child_process';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());

// POST /voice-command: { command: string, aiChange: string, file: string }
app.post('/voice-command', async (req, res) => {
    const { command, aiChange, file } = req.body;
    if (!aiChange || !file) return res.status(400).json({ error: 'Missing aiChange or file' });

    // Write the AI-generated change to the file
    try {
        const fs = await import('fs/promises');
        await fs.writeFile(file, aiChange, 'utf8');
    } catch (err) {
        return res.status(500).json({ error: 'Failed to write file', details: err.message });
    }

    // Commit and push the change
    exec(`git add ${file} && git commit -m "Voice command: ${command}" && git push origin YouTuneAi.COM`, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: 'Git push failed', details: stderr });
        }
        res.json({ status: 'success', stdout });
    });
});

app.listen(5000, () => {
    console.log('Voice automation backend running on http://localhost:5000');
});
