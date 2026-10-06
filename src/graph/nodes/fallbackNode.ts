import { AIMessage } from "@langchain/core/messages";
import { type GraphState } from "../graph.ts";


export function fallbackNode(state: GraphState): GraphState {
    const message = "Unknown command. Please use 'uppercase' or 'lowercase'.";
    const fallbackMessage = new AIMessage(message);

    return {
        ...state,
        output: message,
        messages: [...state.messages, fallbackMessage],
    }
}