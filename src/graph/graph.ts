import {
    StateGraph,
    START,
    END,
    MessagesZodMeta //é uma constante que contém metadados para validação de mensagens usando a biblioteca Zod
} from "@langchain/langgraph";
//É uma função que permite integrar o LangGraph com a biblioteca Zod,
//permitindo a validação de dados usando esquemas Zod.
import { withLangGraph } from "@langchain/langgraph/zod";

//É uma classe que representa uma mensagem base no LangChain,
//usada para comunicação entre diferentes componentes do sistema.
import { BaseMessage } from "langchain";
//É uma biblioteca de validação de dados que permite definir esquemas e validar objetos JavaScript
//de forma segura e eficiente.
import { z } from "zod/v3"
import { indentifyIntent } from "./nodes/identifyIntentNode.ts";
import { chatResponseNode } from "./nodes/chatResponseNode.ts";
import { upperCaseNode } from "./nodes/upperCaseNode.ts";
import { lowerCaseNode } from "./nodes/lowerCaseNode.ts";
import { fallbackNode } from "./nodes/fallbackNode.ts";

const GraphState = z.object({
    messages: withLangGraph(
        z.custom<BaseMessage[]>(),
        MessagesZodMeta
    ),
    output: z.string(),
    command: z.enum(['uppercase', 'lowercase', 'unknown'])
})
//É um esquema Zod que define a estrutura do estado do grafo,
//incluindo mensagens, saída e comando, com validação usando LangGraph e Zod.
//exportando o tipo GraphState, que é inferido a partir do esquema Zod GraphState, 
//permitindo que seja usado em outras partes do código para garantir a conformidade com a estrutura definida.
export type GraphState = z.infer<typeof GraphState>

export function buildGraph() {
    const workflow = new StateGraph({
        stateSchema: GraphState
    })
        // .addNode("identifyIntent", (state: GraphState) => {
        //     return {
        //         ...state,
        //         output: "teste"
        //     }
        // })
        .addNode("identifyIntent", indentifyIntent)
        .addNode("chatResponse", chatResponseNode)
        .addNode("uppercase", upperCaseNode)
        .addNode("lowercase", lowerCaseNode)
        //Nó tipo else, que é usado para lidar com casos em que o comando não é reconhecido.
        .addNode("fallback", fallbackNode) 
        //START -> identifyIntent -> Conditional -> chatResponse -> END
        .addEdge(START, "identifyIntent")
        .addConditionalEdges("identifyIntent",
            (state: GraphState) => {
                switch (state.command) {
                    case "uppercase":
                        return "uppercase"
                    case "lowercase":
                        return "lowercase"
                    default:
                        return "fallback"
                }
            },
            { 'uppercase': "uppercase", 'lowercase': "lowercase", 'fallback': "fallback" }
        )

        .addEdge("uppercase", "chatResponse")
        .addEdge("lowercase", "chatResponse")
        .addEdge("fallback", "chatResponse")
        .addEdge("chatResponse", END)

    return workflow.compile();
}