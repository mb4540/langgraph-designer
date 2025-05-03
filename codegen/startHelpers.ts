import { WorkflowNode } from '../src/types/nodeTypes';

// Define the StartNode interface that extends WorkflowNode
interface StartNode extends WorkflowNode {
  operatorType: 'START';
  triggerType: 'human' | 'system' | 'event' | 'multi';
  resumeCapable?: boolean;
}

/**
 * Generates boilerplate code for different Start node trigger types
 * based on the target runtime (autogen or langgraph)
 * 
 * @param start The Start node configuration
 * @param runtime The target runtime ("autogen" or "langgraph")
 * @returns Generated code snippet for the specific trigger type and runtime
 */
export function emitStartBoilerplate(start: StartNode, runtime: "autogen" | "langgraph") {
  switch (start.triggerType) {
    case "human":
      return runtime === "autogen"
        ? `const user = new UserProxyAgent({ ... }); groupChat.initiate_chat(userMessage);`
        : `initialState.messages = [ userMessage ];`;
    case "system":
      return `export function run_workflow(args) { compiledGraph.invoke(args); }`;
    case "event":
      return `export const handler = async (req) => compiledGraph.invoke(JSON.parse(req.body));`;
    case "multi":
      return `// edges from implicit START are emitted by graph builder automatically`;
  }
}
