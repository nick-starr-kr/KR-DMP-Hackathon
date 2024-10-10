// agent.ts

// IMPORTANT - Add your API keys here. Be careful not to publish them.
process.env.OPENAI_API_KEY = "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";
process.env.TAVILY_API_KEY = "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";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Define the tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 3 })];
const agentModel = new ChatOpenAI({ model: "gpt-4o",temperature: 0 });

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer,
});

export async function handleChatPrompt(prompt: string) {
    const response = await agent.invoke(
        { messages: [new HumanMessage(prompt)] },
        { configurable: { thread_id: "42" } });
        return response.messages[response.messages.length - 1].content;
}