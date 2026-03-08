# ChatGPT Clone

A production-grade ChatGPT-style AI chat interface built with React, TypeScript, Vite, and TailwindCSS.

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **TailwindCSS** for styling
- **Zustand** for state management
- **TanStack Query** for async state
- **react-markdown** + **remark-gfm** for markdown rendering
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Development Mode

In development, a **mock API** is included so you can use the UI without a backend. It returns placeholder responses for `/api/chat` and `/api/chat/stream`.

## Connecting to LLMs

See **[docs/LLM_CONNECTION_GUIDE.md](docs/LLM_CONNECTION_GUIDE.md)** for step-by-step instructions to connect to:

- **ChatGPT (OpenAI)** – API key setup, Node.js/Python backend examples
- **Claude (Anthropic)** – Backend integration
- **Custom LLMs** – Gemini, Llama, or any compatible API

## Production Backend

Configure your backend via environment variables (see `.env.example`):

- `VITE_API_BASE_URL` – Your API base URL (e.g. `https://api.example.com`)
- `VITE_LLM_PROVIDER` – `openai` | `anthropic` | `custom`
- `VITE_ENABLE_STREAMING` – Enable/disable streaming responses

**Security:** Never expose LLM API keys in the frontend. Use a backend proxy to call LLM providers.

## Project Structure

```
src/
├── app/           # App shell, router, providers
├── api/           # API client, endpoints, chat API
├── components/    # UI components (chat, layout, ui)
├── config/       # Environment and LLM config
├── features/chat/ # Chat hooks, services, store, types
├── llm/           # LLM providers (OpenAI, Anthropic, custom)
├── lib/           # Utilities, markdown, stream parser
├── hooks/         # Shared hooks
├── styles/        # Global CSS
└── types/         # Global types
```

## Features

- ✅ Text and streaming responses
- ✅ Markdown, code blocks, tables, links
- ✅ Image, video, audio media rendering
- ✅ Multiple conversations with sidebar
- ✅ Create, switch, delete chats
- ✅ Persisted chat history (localStorage)
- ✅ Configurable LLM providers
