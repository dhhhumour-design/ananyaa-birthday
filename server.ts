import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Photo Memory Understanding Endpoint
app.post('/api/analyze-memory', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', photoTitle = 'Birthday Memory' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64 data in request body.' });
    }

    // Use gemini-3.8-flash for instant, reliable multimodal image understanding
    const modelName = 'gemini-3.8-flash';
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
          {
            text: `You are generating a heartwarming, poetic birthday compliment for Ananya, celebrating her birthday on 15 October.
This memory is titled: "${photoTitle}".
Analyze the photo and generate:
1. "aura": A 2-4 word poetic aura title (e.g. "Luminous Sunshine & Pure Joy", "Gentle Grace & Radiance")
2. "compliment": A deeply genuine, poetic 2-sentence birthday appreciation highlighting her warmth, radiant smile, and infectious positive energy.
3. "sweetWish": A 1-sentence lovely wish tailored specifically to this picture.

Return in JSON format:
{
  "aura": "...",
  "compliment": "...",
  "sweetWish": "..."
}`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = {
        aura: 'Pure Joy & Radiance ✨',
        compliment: text,
        sweetWish: 'May this year bring endless reasons to smile! 💗',
      };
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: unknown) {
    console.error('Error analyzing image:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to analyze memory';
    return res.status(500).json({ error: errMessage });
  }
});

// Static uploads directory
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const uploadsDir = path.join(publicDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadsDir));

// Media Upload API Endpoint
app.post('/api/media/upload', (req, res) => {
  try {
    const { filename, base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'Missing base64Data' });
    }

    const safeName = (filename || `upload_${Date.now()}.jpg`).replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filePath = path.join(uploadsDir, safeName);
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    return res.json({ success: true, url: publicUrl, name: safeName });
  } catch (err: unknown) {
    console.error('Failed to save uploaded media:', err);
    return res.status(500).json({ error: 'Failed to save media file' });
  }
});

// List Uploaded Media API
app.get('/api/media/list', (_req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const media = files.map((file) => ({
      name: file,
      url: `/uploads/${file}`,
      type: file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov') ? 'video' : 'image',
    }));
    return res.json({ success: true, media });
  } catch (err) {
    return res.json({ success: true, media: [] });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
