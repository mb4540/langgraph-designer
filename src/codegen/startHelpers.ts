import { TriggerType } from '../types/nodeTypes';
import { RuntimeType } from '../utils/workflowValidator';

/**
 * Generates boilerplate code for Start operator based on trigger type and runtime
 * @param triggerType The type of trigger for the Start operator
 * @param runtimeType The runtime type (langgraph or autogen)
 * @param resumeCapable Whether the workflow is resume-capable
 * @returns Code snippet as a string
 */
export const emitStartBoilerplate = (
  triggerType: TriggerType,
  runtimeType: RuntimeType,
  resumeCapable: boolean = false
): string => {
  // Handle Autogen runtime
  if (runtimeType === 'autogen') {
    switch (triggerType) {
      case 'human':
        return `// Human-triggered workflow in Autogen
const userProxy = new UserProxyAgent({
  name: "User",
  llm_config: false,
  human_input_mode: "ALWAYS",
});

// Initialize the conversation with a user message
const initialMessage = "Hello, I need help with..."; 
groupChat.initiate_chat(userProxy, message=initialMessage);`;

      case 'system':
        return `// System-triggered workflow in Autogen
// Define a function to run the workflow programmatically
export function runWorkflow(args) {
  const initialState = {
    // Define your initial state here
    task: args.task,
    context: args.context
  };
  
  // Start the workflow with the initial state
  return groupChat.run(initialState);
}`;

      default:
        return `// This trigger type (${triggerType}) is not supported in Autogen runtime`;
    }
  }
  
  // Handle LangGraph runtime
  if (runtimeType === 'langgraph') {
    let codeSnippet = '';
    
    switch (triggerType) {
      case 'human':
        codeSnippet = `// Human-triggered workflow in LangGraph
from langgraph.graph import StateGraph
from typing import TypedDict, Annotated

# Define your state
class State(TypedDict):
    messages: list[dict]
    # Add other state fields here

# Create the graph
graph = StateGraph(State)

# Add nodes and edges
# ...

# Compile the graph
app = graph.compile()

# Run with initial human message
def run_with_user_input(user_message: str):
    initial_state = {"messages": [{"role": "user", "content": user_message}]}
    return app.invoke(initial_state)`;
        break;

      case 'system':
        codeSnippet = `// System-triggered workflow in LangGraph
from langgraph.graph import StateGraph
from typing import TypedDict, Annotated

# Define your state
class State(TypedDict):
    task: str
    context: dict
    # Add other state fields here

# Create the graph
graph = StateGraph(State)

# Add nodes and edges
# ...

# Compile the graph
app = graph.compile()

# Run programmatically
def run_workflow(task: str, context: dict = None):
    initial_state = {"task": task, "context": context or {}}
    return app.invoke(initial_state)`;
        break;

      case 'event':
        codeSnippet = `// Event-triggered workflow in LangGraph
from langgraph.graph import StateGraph
from typing import TypedDict, Annotated
from fastapi import FastAPI, Request

# Define your state
class State(TypedDict):
    event_data: dict
    # Add other state fields here

# Create the graph
graph = StateGraph(State)

# Add nodes and edges
# ...

# Compile the graph
app = graph.compile()

# Create a FastAPI app to handle webhook events
api = FastAPI()

@api.post("/webhook")
async def handle_webhook(request: Request):
    event_data = await request.json()
    initial_state = {"event_data": event_data}
    # Run the workflow asynchronously
    result = await app.ainvoke(initial_state)
    return {"status": "success", "result": result}`;
        break;

      case 'multi':
        codeSnippet = `// Multi-triggered workflow in LangGraph
from langgraph.graph import StateGraph
from typing import TypedDict, Annotated, Literal

# Define your state with a trigger type field
class State(TypedDict):
    trigger_type: Literal["user_message", "scheduled_task", "api_call"]
    data: dict
    # Add other state fields here

# Create the graph
graph = StateGraph(State)

# Define a branch node to handle different trigger types
def branch_on_trigger(state):
    return state["trigger_type"]

# Add the branch node
graph.add_conditional_edges(
    "start",
    branch_on_trigger,
    {
        "user_message": "handle_user_message",
        "scheduled_task": "handle_scheduled_task",
        "api_call": "handle_api_call"
    }
)

# Add handler nodes
# ...

# Compile the graph
app = graph.compile()`;
        break;
    }
    
    // Add checkpoint store configuration if resume-capable
    if (resumeCapable) {
      codeSnippet += `

# Configure checkpoint store for resume capability
from langgraph.checkpoint import MemorySaver

# Create a checkpoint store
checkpoint_store = MemorySaver()

# Compile with checkpoint store
app = graph.compile(checkpointer=checkpoint_store)

# To resume a workflow
def resume_workflow(thread_id: str, new_input: dict = None):
    # Load the checkpoint
    config = app.get_checkpoint(thread_id)
    
    # Resume with new input if provided
    if new_input:
        return app.update(config, new_input)
    else:
        return app.resume(config)`;
    }
    
    return codeSnippet;
  }
  
  return '// Unsupported runtime type';
};
