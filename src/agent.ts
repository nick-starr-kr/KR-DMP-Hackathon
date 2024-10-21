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

  export async function createTicket(code: string) {
    const response = await agent.invoke(
      { messages: [new SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
        new HumanMessage("Respond with only the name of the function:\n" + code)] },
      { configurable: { thread_id: "42" } });
    const name = response.messages[response.messages.length - 1].content;
    
    const response2 = await agent.invoke(
      { messages: [new SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
        new HumanMessage("Respond with only the a description of the code:\n" + code)] },
      { configurable: { thread_id: "42" } });
    const description = response2.messages[response2.messages.length - 1].content;

    const response3 = await agent.invoke(
      { messages: [new SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
        new HumanMessage("Respond with only the a defect in the code:\n" + code)] },
      { configurable: { thread_id: "42" } });
    const defect = response3.messages[response3.messages.length - 1].content;

    const response4 = await agent.invoke(
      { messages: [new SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
        new HumanMessage("Propose a fix for this code:\n" + code + "\n to solve the following defect: " + defect)] },
      { configurable: { thread_id: "42" } });
    const fix = response4.messages[response4.messages.length - 1].content;

    const response5 = await agent.invoke({ messages: [new SystemMessage("You are a digital programming assistant designed to analyze code. Your outputs must be as short and direct as possible."),
      new HumanMessage("Convert these strings into a cohesive paragraph: \n" + description + " " + defect + " " + fix)] },
    { configurable: { thread_id: "42" } });
    const output = response5.messages[response5.messages.length - 1].content;
    return [name, output];
  }

  export async function confirmJiraTicket(prompt: string) {
    console.log(prompt);
    return "Done";
}