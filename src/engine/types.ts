export type EventType =
  | 'call_stack_push'
  | 'call_stack_pop'
  | 'task_queue_enqueue'
  | 'task_queue_dequeue'
  | 'microtask_queue_enqueue'
  | 'microtask_queue_dequeue'
  | 'web_api_add'
  | 'web_api_remove'
  | 'event_loop_check_stack'
  | 'event_loop_check_task'
  | 'event_loop_check_microtask'
  | 'event_loop_rerender'
  | 'console_log';

export interface SimEvent {
  type: EventType;
  label: string;
  detail?: string;
  highlightLine?: number;
  color?: string;
}

export interface SimState {
  callStack: string[];
  webApis: string[];
  taskQueue: string[];
  microtaskQueue: string[];
  consoleLogs: string[];
  currentPhase: EventLoopPhase;
  highlightLine?: number;
}

export type EventLoopPhase =
  | 'idle'
  | 'evaluating_script'
  | 'running_task'
  | 'running_microtasks'
  | 'rerendering';

export interface Example {
  name: string;
  category: string;
  code: string;
  events: SimEvent[];
}

export const PASTEL_COLORS = [
  '#AFF8D8',
  '#FFCBC1',
  '#FBE4FF',
  '#D8FFD8',
  '#C4FAF8',
  '#E7FFAC',
  '#ACE7FF',
  '#FFABAB',
  '#FFB5E8',
];

export function getColor(index: number): string {
  return PASTEL_COLORS[index % PASTEL_COLORS.length];
}
