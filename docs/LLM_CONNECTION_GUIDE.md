# LLM Connection Guide

This guide explains how to connect the ChatGPT Clone frontend to various LLM providers (OpenAI/ChatGPT, Anthropic/Claude, and custom backends).

---

## Architecture Overview

The frontend **never** talks directly to LLM APIs. All requests go through **your backend proxy**:

```
Frontend (React) → Your Backend (Node/Python/etc.) → LLM Provider API
```

**Why?** API keys must stay on the server. Exposing them in the frontend would allow anyone to steal and abuse your keys.

---

## Step 1: Create a Backend Proxy

You need a backend that:

1. Receives chat requests from the frontend
2. Adds your API key to the request
3. Forwards the request to the LLM provider
4. Streams the response back to the frontend

### Option A: Node.js (Express) Backend

Create a new folder `backend/` in your project:

```bash
mkdir backend && cd backend
npm init -y
npm install express cors axios
```

Create `backend/server.js`:

```javascript
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Set in .env

// Non-streaming chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, stream } = req.body;
    if (stream) {
      return res.status(400).json({ error: "Use /api/chat/stream for streaming" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0]?.message?.content ?? "";
    res.json({ message: content });
  } catch (err) {
    console.error(err.response?.data ?? err.message);
    res.status(500).json({ error: err.response?.data?.error?.message ?? "API error" });
  }
});

// Streaming chat
app.post("/api/chat/stream", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      }
    );

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    response.data.on("data", (chunk) => res.write(chunk));
    response.data.on("end", () => res.end());
    response.data.on("error", (err) => {
      console.error(err);
      res.end();
    });
  } catch (err) {
    console.error(err.response?.data ?? err.message);
    res.status(500).json({ error: "Stream failed" });
  }
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
```

Create `backend/.env`:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=3001
```

Run the backend:

```bash
cd backend && node server.js
```

---

### Option B: Python (FastAPI) Backend

```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn openai httpx
```

Create `backend/main.py`:

```python
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    stream: bool = False

@app.post("/api/chat")
async def chat(req: ChatRequest):
    if req.stream:
        return {"error": "Use /api/chat/stream for streaming"}
    r = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": m.role, "content": m.content} for m in req.messages],
    )
    return {"message": r.choices[0].message.content}

@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest):
    stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": m.role, "content": m.content} for m in req.messages],
        stream=True,
    )
    def generate():
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {chunk.model_dump_json()}\n\n"
        yield "data: [DONE]\n\n"
    from fastapi.responses import StreamingResponse
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
```

Run:

```bash
export OPENAI_API_KEY=sk-your-key
uvicorn main:app --reload --port 3001
```

---

## Step 2: Configure the Frontend

Create `.env` in the **project root** (same folder as `package.json`):

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_LLM_PROVIDER=openai
VITE_ENABLE_STREAMING=true
```

**Important:** The base URL must point to your backend. Use `/api` if the frontend and backend share the same origin (e.g. Vite proxy).

### Vite Proxy (Same Origin)

If you run the frontend on `localhost:5173` and backend on `localhost:3001`, add to `vite.config.ts`:

```ts
export default defineConfig({
  // ...existing config
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
```

Then use:

```env
VITE_API_BASE_URL=/api
```

---

## Step 3: Connect to ChatGPT (OpenAI)

1. **Get an API key:** [platform.openai.com](https://platform.openai.com/api-keys)
2. **Set the key** in your backend `.env`: `OPENAI_API_KEY=sk-...`
3. **Set frontend env:** `VITE_LLM_PROVIDER=openai`
4. **Backend format:** Your backend must call OpenAI’s API and return responses in the format the frontend expects:
   - Non-streaming: `{ "message": "..." }`
   - Streaming: SSE with `data: {"choices":[{"delta":{"content":"..."}}]}\n\n`

The Node.js example above already matches this format.

---

## Step 4: Connect to Claude (Anthropic)

1. **Get an API key:** [console.anthropic.com](https://console.anthropic.com/)
2. **Set the key** in your backend: `ANTHROPIC_API_KEY=sk-ant-...`
3. **Set frontend env:** `VITE_LLM_PROVIDER=anthropic`
4. **Update your backend** to support the `provider` field:

```javascript
// In your backend /api/chat and /api/chat/stream
const { provider, messages } = req.body;

if (provider === "anthropic") {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true, // or false for /api/chat
    }),
  });
  // Forward the stream or parse JSON response
}
```

Anthropic’s streaming format differs from OpenAI. Your backend should normalize it to:

```json
data: {"choices":[{"delta":{"content":"word "}}]}
```

or

```json
data: {"delta":{"content":"word "}}
```

---

## Step 5: Connect to Other LLMs (Custom)

For Gemini, Llama, or other providers:

1. **Set frontend env:** `VITE_LLM_PROVIDER=custom`
2. **Implement backend routes** `/api/chat` and `/api/chat/stream` that:
   - Accept `{ provider: "custom", messages: [...] }`
   - Call your chosen LLM API
   - Return `{ message: "..." }` for non-streaming
   - Return SSE for streaming in one of these shapes:
     - `data: {"choices":[{"delta":{"content":"..."}}]}\n\n`
     - `data: {"delta":{"content":"..."}}\n\n`
     - `data: {"content":"..."}\n\n`

---

## Expected API Contract

Your backend must implement:

### POST `/api/chat` (non-streaming)

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi!" }
  ],
  "stream": false,
  "provider": "openai" | "anthropic" | "custom"
}
```

**Response:**
```json
{
  "message": "The assistant's reply text"
}
```

### POST `/api/chat/stream` (streaming)

**Request:** Same as above, with `stream: true`.

**Response:** Server-Sent Events (SSE):

```
data: {"choices":[{"delta":{"content":"Hello"}}]}

data: {"choices":[{"delta":{"content":"!"}}]}

data: [DONE]
```

The frontend parses `choices[0].delta.content`, `delta.content`, or `content` depending on the provider.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Enable CORS on your backend for the frontend origin |
| 401 Unauthorized | Check that the API key is set correctly in the backend |
| Stream not working | Ensure `Content-Type: text/event-stream` and `Connection: keep-alive` |
| Wrong provider | Set `VITE_LLM_PROVIDER` and restart the dev server |

---

## Summary Checklist

- [ ] Backend created (Node or Python)
- [ ] API key stored in backend `.env` (never in frontend)
- [ ] `/api/chat` and `/api/chat/stream` routes implemented
- [ ] Frontend `.env` has `VITE_API_BASE_URL` pointing to backend
- [ ] `VITE_LLM_PROVIDER` set to `openai`, `anthropic`, or `custom`
- [ ] CORS configured if frontend and backend run on different ports
