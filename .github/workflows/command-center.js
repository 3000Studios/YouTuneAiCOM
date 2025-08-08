// Command Center Backend Logic
import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/command', (req, res) => {
    const { command } = req.body;
    exec(command, (err, stdout, stderr) => {
        if (err) return res.json({ success: false, error: stderr });
        res.json({ success: true, output: stdout });
    });
});

app.listen(5050, () => console.log("📡 Command Center running on port 5050"));
