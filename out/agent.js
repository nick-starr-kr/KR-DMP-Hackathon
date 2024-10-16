"use strict";
// agent.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatPrompt = handleChatPrompt;
exports.analyzeCodeQuality = analyzeCodeQuality;
exports.explainCode = explainCode;
exports.generateUnitTests = generateUnitTests;
exports.handleGenericChatPrompt = handleGenericChatPrompt;
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
async function generateUnitTests(code) {
    const response = await agent.invoke({ messages: [new messages_1.SystemMessage("You are a digital programming assistant designed to generate valuable unit tests for their code."),
            new messages_1.HumanMessage("Generate unit tests to cover the below code:\n" + code)] }, { configurable: { thread_id: "42" } });
    return response.messages[response.messages.length - 1].content;
}
async function handleGenericChatPrompt(prompt, code, diagnostics, filename) {
    let messages = [new messages_1.SystemMessage("You are a digital programming assistant designed to assist software development.")];
    if (code !== undefined) {
        messages.push(new messages_1.SystemMessage("This is the source code the user has opened in their editor: " + code));
    }
    if (diagnostics !== undefined) {
        messages.push(new messages_1.SystemMessage("This is a JSON array of diagnostic messages related to the source code the user has opened in their editor: " + diagnostics));
    }
    if (filename !== undefined) {
        messages.push(new messages_1.SystemMessage("This is the name of the source code file the user has opened in their editor: " + filename));
    }
    messages.push(new messages_1.HumanMessage(prompt));
    const response = await agent.invoke({ messages: messages }, { configurable: { thread_id: "42" } });
    return response.messages[response.messages.length - 1].content;
}
//# sourceMappingURL=agent.js.map