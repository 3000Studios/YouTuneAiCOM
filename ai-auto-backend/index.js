// AI Automation Backend: Full Auto Voice-to-Code-to-Test-to-Deploy
import { exec } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import * as fs from 'fs/promises';
import fetch from 'node-fetch';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GH_TOKEN = process.env.GH_TOKEN;
const REPO = '3000Studios/YouTuneAi.COM';
const BRANCH = 'YouTuneAi.COM';

async function callOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2048
        })
    });
    const data = await response.json();
    console.log('OpenAI API response:', JSON.stringify(data, null, 2));
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('OpenAI API error: ' + (data.error ? JSON.stringify(data.error) : JSON.stringify(data)));
    }
    return data.choices[0].message.content;
}

async function runTests() {
    return new Promise((resolve) => {
        exec('npm test', { cwd: process.cwd() }, (err, stdout, stderr) => {
            if (err) return resolve({ passed: false, output: stderr || stdout });
            resolve({ passed: true, output: stdout });
        });
    });
}

async function commitAndPush(file, message) {
    return new Promise((resolve, reject) => {
        exec(`git add ${file} && git commit -m "${message}" && git push origin ${BRANCH}`,
            (err, stdout, stderr) => {
                if (err) return reject(stderr || stdout);
                resolve(stdout);
            });
    });
}

app.post('/voice-command', async (req, res) => {
    const { command, file } = req.body;
    if (!command || !file) return res.status(400).json({ error: 'Missing command or file' });

    let aiChange = await callOpenAI(`You are an expert developer. Given this command, generate the full new content for the file ${file}: ${command}`);
    await fs.writeFile(file, aiChange, 'utf8');

    let testResult = await runTests();
    let attempts = 0;
    while (!testResult.passed && attempts < 3) {
        aiChange = await callOpenAI(`The following code failed tests with this output: ${testResult.output}. Fix the code for ${file} and return the full new content.`);
        await fs.writeFile(file, aiChange, 'utf8');
        testResult = await runTests();
        attempts++;
    }

    if (!testResult.passed) {
        return res.status(500).json({ error: 'Tests failed after 3 attempts', output: testResult.output });
    }

    try {
        await commitAndPush(file, `Voice command: ${command}`);
        res.json({ status: 'success', testOutput: testResult.output });
    } catch (err) {
        res.status(500).json({ error: 'Git push failed', details: err });
    }
});

app.listen(5000, () => {
    console.log('AI automation backend running on http://localhost:5000');
});
