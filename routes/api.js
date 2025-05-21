import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { prompt, history = [] } = req.body;
  const envKey = process.env.GEMINI_API_KEY?.trim();
  const userKey = req.body.apiKey?.trim();
  const apiKey = envKey || userKey;

  if (!apiKey) {
    return res.status(400).json({
      error: 'No Gemini API key provided. Set one in .env or via the request.',
      helpUrl: 'https://aistudio.google.com/apikey'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Create context from history
    const contextFromHistory = history.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');
    
    // Combine history with current prompt
    const fullPrompt = contextFromHistory 
      ? `${contextFromHistory}\nUser: ${prompt}\nAssistant:`
      : `User: ${prompt}\nAssistant:`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: fullPrompt
    });

    res.json({ result: result.text.trim() });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({
      error: `Gemini API call failed. Check your API key and see the README at https://github.com/linea-analytics/gemini-chat/edit/master/README.md for setup instructions.`,
      message: err.message
    });
  }
});

export default router;
