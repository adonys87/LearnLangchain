import { type GraphState } from "../graph.ts";
import { AIMessage } from "langchain";

export function chatResponseNode(state: GraphState): GraphState {
    const responseText = state.output
    //simula a criação de uma mensagem de resposta de IA usando o texto de saída do estado atual do grafo.
    const aiMessage = new AIMessage(responseText) 

    return {...state, 
        //as mensagens existentes no estado são mantidas e a nova mensagem de IA é adicionada ao final da lista de mensagens.
        messages: [...state.messages, aiMessage], 
        }
}