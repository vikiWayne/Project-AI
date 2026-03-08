import type { Plugin } from "vite";

export function mockChatApi(): Plugin {
  return {
    name: "mock-chat-api",
    configureServer(server) {
      server.middlewares.use("/api/chat/stream", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          const reply = "This is a mock streamed response. Configure VITE_API_BASE_URL to use a real LLM backend.";
          for (const word of reply.split(" ")) {
            res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: word + " " } }] })}\n\n`);
          }
          res.write("data: [DONE]\n\n");
          res.end();
        });
      });
      server.middlewares.use("/api/chat", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", () => {
          res.setHeader("Content-Type", "application/json");
          const reply = "This is a mock response. Configure VITE_API_BASE_URL to use a real LLM backend.";
          res.end(JSON.stringify({ message: reply }));
        });
      });
    },
  };
}
