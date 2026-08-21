var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var aiInstance = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiInstance = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiInstance;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  app.post("/api/antigravity", async (req, res) => {
    const { prompt, context } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    try {
      const ai = getGeminiClient();
      const systemPrompt = `You are the Rent Book Pro (RBP) AI Operations Copilot, an advanced operations assistant running in a remote Linux sandbox environment with full tool-calling capabilities (Bash, Python, web browsing, Google Search).
You help equipment rental managers with logistics, customer notifications, stock optimization, financial reports, and general inventory questions.

Here is the current RBP live database state in JSON format:
${JSON.stringify(context, null, 2)}

Your workspace is ready. You can run code using code_execution if needed (e.g. using Python to analyze trends, calculate statistics, or generate custom charts or text files). You can search the web using google_search to look up external market prices, suppliers, or standard business templates.

Analyze the user's request: "${prompt}".
Please provide a thorough, professional, and directly actionable response. Feel free to use your tools to provide highly accurate, verified solutions.`;
      const stream = await ai.interactions.create({
        agent: "antigravity-preview-05-2026",
        input: systemPrompt,
        environment: "remote",
        stream: true
      }, { timeout: 3e5 });
      for await (const event of stream) {
        res.write(`data: ${JSON.stringify(event)}

`);
      }
    } catch (error) {
      console.error("Antigravity Agent error:", error);
      res.write(`data: ${JSON.stringify({ error: error.message || "An error occurred during execution." })}

`);
    } finally {
      res.end();
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
