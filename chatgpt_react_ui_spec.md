# ChatGPT-Style AI Chat UI (React) -- Cursor Implementation Spec

## Goal

Build a production-grade ChatGPT-like interface using:

-   React + TypeScript
-   Vite
-   TailwindCSS
-   shadcn/ui
-   Configurable LLM providers
-   Streaming responses
-   Support for text, image, and video responses from LLMs
-   Scalable architecture
-   Clean separation of UI, LLM connectors, and API logic

The system must be extensible, configurable, and maintainable for
production use.

------------------------------------------------------------------------

# 1. Core Requirements

The chat application must support:

## Messaging

-   Text responses
-   Streaming responses (token streaming)
-   Markdown rendering
-   Code blocks
-   Tables
-   Links

## Media Responses

LLM responses may include:

-   Images
-   Videos
-   Audio (future compatible)

The UI must automatically render media responses appropriately.

## Streaming

The UI must support streamed responses such as:

-   token streaming
-   chunked responses
-   progressive rendering

## Multiple Conversations

Users must be able to:

-   create chats
-   switch chats
-   persist chat history
-   delete chats

------------------------------------------------------------------------

# 2. Technology Stack

Frontend

-   React
-   TypeScript
-   Vite
-   TailwindCSS
-   shadcn/ui

State Management

-   Zustand

Async Management

-   TanStack Query

Markdown

-   react-markdown
-   remark-gfm

Networking

-   Axios / Fetch

Icons

-   lucide-react

------------------------------------------------------------------------

# 3. High Level Architecture

UI Layer ↓ Chat State Store ↓ Chat Service Layer ↓ LLM Client Layer ↓
API Client Layer ↓ Backend / LLM Provider

Rules:

-   UI must never talk directly to LLM providers
-   All communication flows through services

------------------------------------------------------------------------

# 4. Folder Structure (Production Grade)

src app ├── App.tsx ├── router.tsx └── providers.tsx

components ├── chat │ ├── ChatContainer.tsx │ ├── ChatMessages.tsx │ ├──
ChatMessage.tsx │ ├── ChatInput.tsx │ ├── TypingIndicator.tsx │ └──
MediaRenderer.tsx │ ├── layout │ ├── Sidebar.tsx │ ├── Header.tsx │ └──
MainLayout.tsx │ └── ui └── shadcn components

features └── chat ├── hooks │ ├── useChat.ts │ ├── useStream.ts │ └──
useConversation.ts │ ├── services │ └── chatService.ts │ ├── store │ └──
chatStore.ts │ └── types └── chatTypes.ts

llm ├── providers │ ├── openaiProvider.ts │ ├── anthropicProvider.ts │
└── customProvider.ts │ ├── llmClient.ts └── llmTypes.ts

api ├── client.ts ├── endpoints.ts └── chatApi.ts

config ├── env.ts └── llmConfig.ts

lib ├── utils.ts ├── markdown.ts └── streamParser.ts

hooks └── useDebounce.ts

styles └── globals.css

types └── globalTypes.ts

------------------------------------------------------------------------

# 5. Message Data Model

Each message must support multiple content types.

type MessageRole = "user" \| "assistant" \| "system"

type MessageContent = \| { type: "text"; text: string } \| { type:
"image"; url: string } \| { type: "video"; url: string } \| { type:
"audio"; url: string }

interface ChatMessage { id: string role: MessageRole content:
MessageContent\[\] createdAt: number status: "sending" \| "sent" \|
"error" }

------------------------------------------------------------------------

# 6. Media Rendering

Create a MediaRenderer component.

Responsibilities:

-   detect content type
-   render correct UI

Example behavior:

Text → MarkdownRenderer\
Image → `<img />`{=html}\
Video → `<video controls />`{=html}\
Audio → `<audio controls />`{=html}

------------------------------------------------------------------------

# 7. Streaming Response Handling

Streaming flow:

User message ↓ chatService.sendMessage() ↓ LLM.streamResponse() ↓
receive token chunks ↓ append tokens to last assistant message ↓ UI
updates in real time

------------------------------------------------------------------------

# 8. LLM Abstraction Layer

interface LLMProvider {

sendMessage(messages: ChatMessage\[\]): Promise`<any>`{=html}

streamMessage(messages: ChatMessage\[\]): AsyncIterable`<any>`{=html}

}

Providers:

-   openaiProvider
-   anthropicProvider
-   customProvider

------------------------------------------------------------------------

# 9. Chat Service Layer

Responsibilities:

-   sendMessage()
-   streamMessage()
-   createConversation()
-   deleteConversation()
-   loadConversation()

------------------------------------------------------------------------

# 10. State Management

Use Zustand.

Store:

-   messages
-   conversations
-   activeConversationId
-   loading
-   error

Actions:

-   addMessage
-   updateMessage
-   setConversation
-   clearConversation

------------------------------------------------------------------------

# 11. Chat UI Layout

Sidebar \| Chat Window

Chats \| User Message \| Assistant Message \| Streaming Response

      | Chat Input

------------------------------------------------------------------------

# 12. Core Components

Sidebar

-   chat history
-   new chat
-   delete chat

ChatMessages

Scrollable container for messages.

ChatMessage

Displays:

-   user bubble
-   assistant bubble
-   markdown
-   media

ChatInput

-   multiline textarea
-   enter to send
-   shift+enter newline

------------------------------------------------------------------------

# 13. Markdown Support

Use:

-   react-markdown
-   remark-gfm

Must support:

-   code blocks
-   tables
-   lists
-   links

------------------------------------------------------------------------

# 14. Configuration System

Example environment configuration:

LLM_PROVIDER=openai API_BASE_URL=/api ENABLE_STREAMING=true

------------------------------------------------------------------------

# 15. Error Handling

Handle:

-   API failure
-   network issues
-   stream interruption

UI states:

-   loading
-   streaming
-   error
-   retry

------------------------------------------------------------------------

# 16. Performance Optimization

Include:

-   message virtualization
-   memoization
-   lazy loading

Use:

-   React.memo
-   useMemo
-   useCallback

------------------------------------------------------------------------

# 17. Security

Never expose LLM API keys in frontend.

Always use backend proxy.

------------------------------------------------------------------------

# 18. Future Extensibility

Architecture must support:

-   tool calling
-   file uploads
-   voice input
-   plugins
-   RAG pipelines

------------------------------------------------------------------------

# 19. Development Order

1.  Layout
2.  Chat messages
3.  Input component
4.  Chat state store
5.  API client
6.  LLM connectors
7.  Streaming responses
8.  Media rendering
9.  Chat history
10. Config system

------------------------------------------------------------------------

# 20. Expected Result

A modern AI chat interface that supports:

-   streamed responses
-   images
-   videos
-   markdown
-   multi-conversation history
-   configurable LLM providers
