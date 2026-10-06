import Fastify from "fastify";


import { buildGraph } from "./graph/graph.ts";
import { HumanMessage } from "langchain";

const graph = buildGraph();

export const createServer = () => {
    const app = Fastify({logger: false  });

    app.post("/chat", {
        // Define o esquema de validação para o corpo da requisição usando Fastify
        schema: {
            body: {
                type: "object",
                required: ["question"],
                properties: {
                    question: { type: "string", minLength: 5 }
                }
            }
        }
    }, async (request, reply) => {
        try {

            const { question } = request.body as { question: string };
            const response = await graph.invoke({
                messages: [new HumanMessage(question)],
            });
            reply.send(response.output);

        }catch (error) {
            console.error('Error handling request:', error);
            return reply.status(500);
        }
    }); 
    return app;  
}