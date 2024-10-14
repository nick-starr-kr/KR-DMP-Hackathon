// agent.ts



import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
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

export async function analyzeCodeQuality(diagnostics: string, code: string) {
  const response = await agent.invoke(
    { messages: [new SystemMessage("You are a digital programming assistant designed to help engineers improve the quality of their code."),
      new SystemMessage("You will be provided a JSON array of diagnostic messages, followed by the source code that generated them. Analyze both the code and the dianogstics and summarize areas of improvement"),
      new HumanMessage(diagnostics + "\n" + code)] },
    { configurable: { thread_id: "42" } });
    return response.messages[response.messages.length - 1].content;

}

  export async function explainCode(code: string) {
    const response = await agent.invoke(
      { messages: [new SystemMessage("You are a digital programming assistant designed to explain functionality of code."),
        new HumanMessage("Explain the code below:\n" + code)] },
      { configurable: { thread_id: "42" } });
      return response.messages[response.messages.length - 1].content;
  }