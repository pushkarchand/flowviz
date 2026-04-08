import type { SimEvent, SimState, EventLoopPhase } from './types';

export function buildInitialState(): SimState {
  return {
    callStack: [],
    webApis: [],
    taskQueue: [],
    microtaskQueue: [],
    consoleLogs: [],
    currentPhase: 'idle',
    highlightLine: undefined,
  };
}

function phaseForEvent(type: SimEvent['type']): EventLoopPhase {
  switch (type) {
    case 'call_stack_push':
    case 'call_stack_pop':
      return 'evaluating_script';
    case 'task_queue_enqueue':
    case 'task_queue_dequeue':
      return 'running_task';
    case 'microtask_queue_enqueue':
    case 'microtask_queue_dequeue':
      return 'running_microtasks';
    case 'event_loop_check_stack':
      return 'evaluating_script';
    case 'event_loop_check_task':
      return 'running_task';
    case 'event_loop_check_microtask':
      return 'running_microtasks';
    case 'event_loop_rerender':
      return 'rerendering';
    default:
      return 'evaluating_script';
  }
}

export function applyEvent(state: SimState, event: SimEvent): SimState {
  const next: SimState = {
    callStack: [...state.callStack],
    webApis: [...state.webApis],
    taskQueue: [...state.taskQueue],
    microtaskQueue: [...state.microtaskQueue],
    consoleLogs: [...state.consoleLogs],
    currentPhase: phaseForEvent(event.type),
    highlightLine: event.highlightLine ?? state.highlightLine,
  };

  switch (event.type) {
    case 'call_stack_push':
      next.callStack.push(event.label);
      break;
    case 'call_stack_pop':
      next.callStack.pop();
      break;
    case 'web_api_add':
      next.webApis.push(event.label);
      break;
    case 'web_api_remove':
      next.webApis.splice(next.webApis.indexOf(event.label), 1);
      break;
    case 'task_queue_enqueue':
      next.taskQueue.push(event.label);
      break;
    case 'task_queue_dequeue':
      next.taskQueue.shift();
      break;
    case 'microtask_queue_enqueue':
      next.microtaskQueue.push(event.label);
      break;
    case 'microtask_queue_dequeue':
      next.microtaskQueue.shift();
      break;
    case 'console_log':
      next.consoleLogs.push(event.label);
      break;
    case 'event_loop_rerender':
      next.currentPhase = 'idle';
      break;
  }

  return next;
}

export function buildStateHistory(events: SimEvent[]): SimState[] {
  const states: SimState[] = [buildInitialState()];
  for (const event of events) {
    states.push(applyEvent(states[states.length - 1], event));
  }
  return states;
}
