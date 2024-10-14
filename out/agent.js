"use strict";
// agent.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatPrompt = handleChatPrompt;
exports.analyzeCodeQuality = analyzeCodeQuality;
exports.explainCode = explainCode;
// IMPORTANT - Add your API keys here. Be careful not to publish them.

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
async function analyzeCodeQuality(diagnostics, code) {
    const response = await agent.invoke({ messages: [new messages_1.SystemMessage("You are a digital programming assistant designed to help engineers improve the quality of their code."),
            new messages_1.SystemMessage("You will be provided a JSON array of diagnostic messages, followed by the source code that generated them. Analyze both the code and the dianogstics and summarize areas of improvement"),
            new messages_1.HumanMessage(diagnostics + "\n" + code)] }, { configurable: { thread_id: "42" } });
    return response.messages[response.messages.length - 1].content;
}
async function explainCode(code) {
    const response = await agent.invoke({ messages: [new messages_1.SystemMessage("You are a digital programming assistant designed to explain functionality of code."),
            new messages_1.HumanMessage("Explain the code below:\n" + code)] }, { configurable: { thread_id: "42" } });
    return response.messages[response.messages.length - 1].content;
}
//# sourceMappingURL=agent.js.map