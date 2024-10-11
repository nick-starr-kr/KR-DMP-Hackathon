"use strict";
// agent.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatPrompt = handleChatPrompt;
// IMPORTANT - Add your API keys here. Be careful not to publish them.
process.env.TAVILY_API_KEY = "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";
const tavily_search_1 = require("@langchain/community/tools/tavily_search");
const openai_1 = require("@langchain/openai");
const langgraph_1 = require("@langchain/langgraph");
const messages_1 = require("@langchain/core/messages");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
// Define the tools for the agent to use
const agentTools = [new tavily_search_1.TavilySearchResults({ maxResults: 3 })];
const agentModel = new openai_1.ChatOpenAI({ model: "gpt-4o", temperature: 0 });
// Initialize memory to persist state between graph runs
const agentCheckpointer = new langgraph_1.MemorySaver();
const agent = (0, prebuilt_1.createReactAgent)({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckpointer,
});
async function handleChatPrompt(prompt) {
    const response = await agent.invoke({ messages: [new messages_1.HumanMessage(prompt)] }, { configurable: { thread_id: "42" } });
    return response.messages[response.messages.length - 1].content;
}
//# sourceMappingURL=agent.js.map