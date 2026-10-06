import { type GraphState } from "../graph.ts";

export function indentifyIntent(state: GraphState): GraphState {
    const input = state.messages.at(-1)?.text ?? ""
    const inputLower = input.toLowerCase()

    let command: GraphState['command'] = 'unknown'
    if (inputLower.includes('uppercase')) {
        command = 'uppercase'
    } else if (inputLower.includes('lowercase')) {
        command = 'lowercase'
    } else {
        command = 'unknown'
    }

    return {
        ...state,
        output: input,
        command
    }
}