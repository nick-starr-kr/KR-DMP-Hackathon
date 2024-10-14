"use strict";
// agent.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatPrompt = handleChatPrompt;
exports.analyzeCodeQuality = analyzeCodeQuality;
exports.explainCode = explainCode;
exports.createTicket = createTicket;
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
async function createTicket(code) {
    const response = await agent.invoke({ messages: [new messages_1.SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
            new messages_1.HumanMessage("Respond with only the name of the function:\n" + code)] }, { configurable: { thread_id: "42" } });
    const name = response.messages[response.messages.length - 1].content;
    const response2 = await agent.invoke({ messages: [new messages_1.SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
            new messages_1.HumanMessage("Respond with only the a description of the code:\n" + code)] }, { configurable: { thread_id: "42" } });
    const description = response2.messages[response2.messages.length - 1].content;
    const response3 = await agent.invoke({ messages: [new messages_1.SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
            new messages_1.HumanMessage("Respond with only the a defect in the code:\n" + code)] }, { configurable: { thread_id: "42" } });
    const defect = response3.messages[response3.messages.length - 1].content;
    const response4 = await agent.invoke({ messages: [new messages_1.SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
            new messages_1.HumanMessage("Propose a fix for this code:\n" + code + "\n to solve the following defect: " + defect)] }, { configurable: { thread_id: "42" } });
    const fix = response4.messages[response4.messages.length - 1].content;
    const response5 = await agent.invoke({ messages: [new messages_1.SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
            new messages_1.HumanMessage("Convert these strings into a cohesive paragraph: \n" + description + " " + defect + " " + fix)] }, { configurable: { thread_id: "42" } });
    const output = response5.messages[response5.messages.length - 1].content;
    return [name, output];
}
//# sourceMappingURL=agent.js.map