import type { Example, SimEvent } from './types';

// Helper to build event sequences
const push = (label: string, line?: number): SimEvent => ({
  type: 'call_stack_push',
  label,
  highlightLine: line,
});
const pop = (label: string): SimEvent => ({
  type: 'call_stack_pop',
  label,
});
const enqueueTask = (label: string): SimEvent => ({
  type: 'task_queue_enqueue',
  label,
});
const dequeueTask = (label: string): SimEvent => ({
  type: 'task_queue_dequeue',
  label,
});
const enqueueMicro = (label: string): SimEvent => ({
  type: 'microtask_queue_enqueue',
  label,
});
const dequeueMicro = (label: string): SimEvent => ({
  type: 'microtask_queue_dequeue',
  label,
});
const webApiAdd = (label: string): SimEvent => ({
  type: 'web_api_add',
  label,
});
const webApiRemove = (label: string): SimEvent => ({
  type: 'web_api_remove',
  label,
});
const checkStack: SimEvent = {
  type: 'event_loop_check_stack',
  label: 'Check call stack',
};
const checkTask: SimEvent = {
  type: 'event_loop_check_task',
  label: 'Check task queue',
};
const checkMicro: SimEvent = {
  type: 'event_loop_check_microtask',
  label: 'Check microtask queue',
};
const rerender: SimEvent = {
  type: 'event_loop_rerender',
  label: 'Rerender',
};
const log = (msg: string): SimEvent => ({
  type: 'console_log',
  label: msg,
});

// ─────────────────────────────────────────────────────────────
// Event Loop cycle (always in this order after stack empties):
//   1. checkStack   — is the call stack empty?
//   2. checkMicro   — drain ALL microtasks
//   3. checkTask    — pick ONE macrotask (if any)
//   4. rerender     — update UI, then loop back to step 2
// ─────────────────────────────────────────────────────────────

export const EXAMPLES: Example[] = [
  // ═══════════════════ BASICS ═══════════════════

  {
    name: 'Call Stack',
    category: 'Basics',
    code: `function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  const result = square(n);
  console.log(result);
}

printSquare(4);`,
    // Output: 16
    events: [
      push('Script', 1),
      push('printSquare(4)', 14),
      push('square(4)', 10),
      push('multiply(4, 4)', 6),
      pop('multiply(4, 4)'),
      pop('square(4)'),
      push('console.log(16)', 11),
      log('16'),
      pop('console.log(16)'),
      pop('printSquare(4)'),
      pop('Script'),
      // Event loop cycle: stack empty → microtasks (none) → tasks (none) → rerender
      checkStack,
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  {
    name: 'Task Queue (setTimeout)',
    category: 'Basics',
    code: `console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 0);

console.log("End");`,
    // Output: Start, End, Timeout callback
    events: [
      push('Script', 1),
      push('console.log("Start")', 1),
      log('Start'),
      pop('console.log("Start")'),
      push('setTimeout(cb, 0)', 3),
      webApiAdd('setTimeout(0ms)'),
      pop('setTimeout(cb, 0)'),
      push('console.log("End")', 7),
      log('End'),
      pop('console.log("End")'),
      pop('Script'),
      // Timer completes in Web API → moves callback to task queue
      webApiRemove('setTimeout(0ms)'),
      enqueueTask('Timeout callback'),
      // Event loop cycle: stack empty → microtasks (none) → pick task
      checkStack,
      checkMicro,
      checkTask,
      dequeueTask('Timeout callback'),
      push('Timeout callback', 4),
      push('console.log("Timeout callback")', 4),
      log('Timeout callback'),
      pop('console.log("Timeout callback")'),
      pop('Timeout callback'),
      // Event loop cycle: stack empty → microtasks (none) → tasks (none) → rerender
      checkStack,
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  {
    name: 'Microtask Queue (Promise)',
    category: 'Basics',
    code: `console.log("Start");

Promise.resolve().then(() => {
  console.log("Promise then");
});

console.log("End");`,
    // Output: Start, End, Promise then
    events: [
      push('Script', 1),
      push('console.log("Start")', 1),
      log('Start'),
      pop('console.log("Start")'),
      push('Promise.resolve().then(cb)', 3),
      // Already resolved → .then callback goes directly to microtask queue (no Web API)
      enqueueMicro('Promise then'),
      pop('Promise.resolve().then(cb)'),
      push('console.log("End")', 7),
      log('End'),
      pop('console.log("End")'),
      pop('Script'),
      // Event loop cycle: stack empty → drain microtasks
      checkStack,
      checkMicro,
      dequeueMicro('Promise then'),
      push('Promise then cb', 3),
      push('console.log("Promise then")', 4),
      log('Promise then'),
      pop('console.log("Promise then")'),
      pop('Promise then cb'),
      // Microtask drain check (empty now) → tasks (none) → rerender
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  {
    name: 'Tasks vs Microtasks',
    category: 'Basics',
    code: `console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");`,
    // Output: Start, End, Promise, Timeout
    // Key: microtasks ALWAYS run before macrotasks
    events: [
      push('Script', 1),
      push('console.log("Start")', 1),
      log('Start'),
      pop('console.log("Start")'),
      push('setTimeout(cb, 0)', 3),
      webApiAdd('setTimeout(0ms)'),
      pop('setTimeout(cb, 0)'),
      push('Promise.resolve().then(cb)', 7),
      enqueueMicro('Promise'),
      pop('Promise.resolve().then(cb)'),
      push('console.log("End")', 11),
      log('End'),
      pop('console.log("End")'),
      pop('Script'),
      // Timer completes → task queue
      webApiRemove('setTimeout(0ms)'),
      enqueueTask('Timeout'),
      // Event loop: stack empty → drain microtasks FIRST
      checkStack,
      checkMicro,
      dequeueMicro('Promise'),
      push('Promise cb', 7),
      push('console.log("Promise")', 8),
      log('Promise'),
      pop('console.log("Promise")'),
      pop('Promise cb'),
      // Microtask drain check (empty) → now pick task
      checkMicro,
      checkTask,
      dequeueTask('Timeout'),
      push('Timeout cb', 3),
      push('console.log("Timeout")', 4),
      log('Timeout'),
      pop('console.log("Timeout")'),
      pop('Timeout cb'),
      // Event loop: stack empty → microtasks (none) → tasks (none) → rerender
      checkStack,
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  // ═══════════════════ ASYNC/AWAIT ═══════════════════

  {
    name: 'Async / Await Basics',
    category: 'Async/Await',
    code: `async function fetchData() {
  console.log("Fetching...");
  const data = await Promise.resolve("Done");
  console.log(data);
}

console.log("Start");
fetchData();
console.log("End");`,
    // Output: Start, Fetching..., End, Done
    // Code before await runs synchronously; await suspends and
    // schedules the continuation as a microtask
    events: [
      push('Script', 1),
      push('console.log("Start")', 7),
      log('Start'),
      pop('console.log("Start")'),
      push('fetchData()', 8),
      push('console.log("Fetching...")', 2),
      log('Fetching...'),
      pop('console.log("Fetching...")'),
      push('await Promise.resolve("Done")', 3),
      // await suspends fetchData — continuation scheduled as microtask
      enqueueMicro('Resume fetchData'),
      pop('await Promise.resolve("Done")'),
      pop('fetchData()'),
      push('console.log("End")', 9),
      log('End'),
      pop('console.log("End")'),
      pop('Script'),
      // Event loop: stack empty → drain microtasks
      checkStack,
      checkMicro,
      dequeueMicro('Resume fetchData'),
      push('fetchData (resumed)', 3),
      push('console.log("Done")', 4),
      log('Done'),
      pop('console.log("Done")'),
      pop('fetchData (resumed)'),
      // Microtask drain check (empty) → tasks (none) → rerender
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  {
    name: 'Multiple Awaits',
    category: 'Async/Await',
    code: `async function step() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
  await Promise.resolve();
  console.log("C");
}

console.log("1");
step();
console.log("2");`,
    // Output: 1, A, 2, B, C
    // Each await creates a new microtask for the continuation
    events: [
      push('Script', 1),
      push('console.log("1")', 9),
      log('1'),
      pop('console.log("1")'),
      push('step()', 10),
      push('console.log("A")', 2),
      log('A'),
      pop('console.log("A")'),
      push('await Promise.resolve()', 3),
      enqueueMicro('Resume step (1st await)'),
      pop('await Promise.resolve()'),
      pop('step()'),
      push('console.log("2")', 11),
      log('2'),
      pop('console.log("2")'),
      pop('Script'),
      // Event loop: stack empty → drain microtasks
      checkStack,
      checkMicro,
      dequeueMicro('Resume step (1st await)'),
      push('step (resumed @ line 4)', 4),
      push('console.log("B")', 4),
      log('B'),
      pop('console.log("B")'),
      push('await Promise.resolve()', 5),
      // 2nd await schedules another microtask
      enqueueMicro('Resume step (2nd await)'),
      pop('await Promise.resolve()'),
      pop('step (resumed @ line 4)'),
      // Continue draining microtasks
      checkMicro,
      dequeueMicro('Resume step (2nd await)'),
      push('step (resumed @ line 6)', 6),
      push('console.log("C")', 6),
      log('C'),
      pop('console.log("C")'),
      pop('step (resumed @ line 6)'),
      // Drain check (empty) → tasks (none) → rerender
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  {
    name: 'Async + setTimeout',
    category: 'Async/Await',
    code: `async function foo() {
  console.log("foo start");
  await Promise.resolve();
  console.log("foo end");
}

console.log("script start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

foo();

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("script end");`,
    // Output: script start, foo start, script end, foo end, promise, setTimeout
    // Demonstrates: microtasks (await + .then) run before macrotask (setTimeout)
    events: [
      push('Script', 1),
      push('console.log("script start")', 7),
      log('script start'),
      pop('console.log("script start")'),
      push('setTimeout(cb, 0)', 9),
      webApiAdd('setTimeout(0ms)'),
      pop('setTimeout(cb, 0)'),
      push('foo()', 13),
      push('console.log("foo start")', 2),
      log('foo start'),
      pop('console.log("foo start")'),
      push('await Promise.resolve()', 3),
      enqueueMicro('Resume foo'),
      pop('await Promise.resolve()'),
      pop('foo()'),
      push('Promise.resolve().then(cb)', 15),
      enqueueMicro('promise cb'),
      pop('Promise.resolve().then(cb)'),
      push('console.log("script end")', 19),
      log('script end'),
      pop('console.log("script end")'),
      pop('Script'),
      // Timer completes → task queue
      webApiRemove('setTimeout(0ms)'),
      enqueueTask('setTimeout cb'),
      // Event loop: stack empty → drain ALL microtasks first
      checkStack,
      checkMicro,
      dequeueMicro('Resume foo'),
      push('foo (resumed)', 3),
      push('console.log("foo end")', 4),
      log('foo end'),
      pop('console.log("foo end")'),
      pop('foo (resumed)'),
      // Continue draining microtasks
      checkMicro,
      dequeueMicro('promise cb'),
      push('promise cb', 15),
      push('console.log("promise")', 16),
      log('promise'),
      pop('console.log("promise")'),
      pop('promise cb'),
      // Microtasks drained → now pick macrotask
      checkMicro,
      checkTask,
      dequeueTask('setTimeout cb'),
      push('setTimeout cb', 9),
      push('console.log("setTimeout")', 10),
      log('setTimeout'),
      pop('console.log("setTimeout")'),
      pop('setTimeout cb'),
      // Event loop: stack empty → microtasks (none) → tasks (none) → rerender
      checkStack,
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  // ═══════════════════ PROMISES ═══════════════════

  {
    name: 'Promise.all with Async',
    category: 'Promises',
    code: `async function taskA() {
  console.log("A start");
  await Promise.resolve();
  console.log("A end");
}

async function taskB() {
  console.log("B start");
  await Promise.resolve();
  console.log("B end");
}

console.log("Before Promise.all");
Promise.all([taskA(), taskB()]).then(() => {
  console.log("All done");
});
console.log("After Promise.all");`,
    // Output: Before Promise.all, A start, B start, After Promise.all, A end, B end, All done
    events: [
      push('Script', 1),
      push('console.log("Before Promise.all")', 13),
      log('Before Promise.all'),
      pop('console.log("Before Promise.all")'),
      push('Promise.all([taskA(), taskB()])', 14),
      push('taskA()', 14),
      push('console.log("A start")', 2),
      log('A start'),
      pop('console.log("A start")'),
      push('await Promise.resolve()', 3),
      enqueueMicro('Resume taskA'),
      pop('await Promise.resolve()'),
      pop('taskA()'),
      push('taskB()', 14),
      push('console.log("B start")', 8),
      log('B start'),
      pop('console.log("B start")'),
      push('await Promise.resolve()', 9),
      enqueueMicro('Resume taskB'),
      pop('await Promise.resolve()'),
      pop('taskB()'),
      pop('Promise.all([taskA(), taskB()])'),
      push('console.log("After Promise.all")', 17),
      log('After Promise.all'),
      pop('console.log("After Promise.all")'),
      pop('Script'),
      // Event loop: stack empty → drain microtasks
      checkStack,
      checkMicro,
      dequeueMicro('Resume taskA'),
      push('taskA (resumed)', 3),
      push('console.log("A end")', 4),
      log('A end'),
      pop('console.log("A end")'),
      pop('taskA (resumed)'),
      // Continue draining
      checkMicro,
      dequeueMicro('Resume taskB'),
      push('taskB (resumed)', 9),
      push('console.log("B end")', 10),
      log('B end'),
      pop('console.log("B end")'),
      pop('taskB (resumed)'),
      // Both promises resolved → Promise.all resolves → schedules .then as microtask
      enqueueMicro('Promise.all resolved'),
      checkMicro,
      dequeueMicro('Promise.all resolved'),
      push('Promise.all .then cb', 14),
      push('console.log("All done")', 15),
      log('All done'),
      pop('console.log("All done")'),
      pop('Promise.all .then cb'),
      // Drain check → tasks (none) → rerender
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  {
    name: 'Async Error Handling',
    category: 'Async/Await',
    code: `async function riskyOp() {
  console.log("Trying...");
  await Promise.reject("Oops!");
}

async function main() {
  try {
    await riskyOp();
    console.log("Success");
  } catch (e) {
    console.log("Caught:", e);
  }
}

console.log("Start");
main();
console.log("End");`,
    // Output: Start, Trying..., End, Caught: Oops!
    events: [
      push('Script', 1),
      push('console.log("Start")', 15),
      log('Start'),
      pop('console.log("Start")'),
      push('main()', 16),
      push('riskyOp()', 8),
      push('console.log("Trying...")', 2),
      log('Trying...'),
      pop('console.log("Trying...")'),
      push('await Promise.reject("Oops!")', 3),
      // await on rejected promise → continuation receives rejection
      enqueueMicro('Resume riskyOp (rejected)'),
      pop('await Promise.reject("Oops!")'),
      pop('riskyOp()'),
      pop('main()'),
      push('console.log("End")', 17),
      log('End'),
      pop('console.log("End")'),
      pop('Script'),
      // Event loop: stack empty → drain microtasks
      checkStack,
      checkMicro,
      dequeueMicro('Resume riskyOp (rejected)'),
      push('riskyOp (throws "Oops!")', 3),
      pop('riskyOp (throws "Oops!")'),
      // Rejection propagates → main's catch resumes as microtask
      enqueueMicro('Resume main (catch)'),
      checkMicro,
      dequeueMicro('Resume main (catch)'),
      push('main catch block', 10),
      push('console.log("Caught:", "Oops!")', 11),
      log('Caught: Oops!'),
      pop('console.log("Caught:", "Oops!")'),
      pop('main catch block'),
      // Drain check → tasks (none) → rerender
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  // ═══════════════════ ADVANCED ═══════════════════

  {
    name: 'Nested setTimeout',
    category: 'Advanced',
    code: `console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
  setTimeout(() => {
    console.log("Timeout 2");
  }, 0);
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
}).then(() => {
  console.log("Promise 2");
});

console.log("End");`,
    // Output: Start, End, Promise 1, Promise 2, Timeout 1, Timeout 2
    events: [
      push('Script', 1),
      push('console.log("Start")', 1),
      log('Start'),
      pop('console.log("Start")'),
      push('setTimeout(cb, 0)', 3),
      webApiAdd('setTimeout(0ms)'),
      pop('setTimeout(cb, 0)'),
      push('Promise.resolve().then(cb).then(cb)', 10),
      enqueueMicro('Promise 1 cb'),
      pop('Promise.resolve().then(cb).then(cb)'),
      push('console.log("End")', 17),
      log('End'),
      pop('console.log("End")'),
      pop('Script'),
      // Timer completes → task queue
      webApiRemove('setTimeout(0ms)'),
      enqueueTask('Timeout 1'),
      // Event loop: stack empty → drain microtasks FIRST
      checkStack,
      checkMicro,
      dequeueMicro('Promise 1 cb'),
      push('Promise 1 cb', 10),
      push('console.log("Promise 1")', 11),
      log('Promise 1'),
      pop('console.log("Promise 1")'),
      pop('Promise 1 cb'),
      // .then() chain: Promise 1 cb returned → schedules Promise 2 cb
      enqueueMicro('Promise 2 cb'),
      checkMicro,
      dequeueMicro('Promise 2 cb'),
      push('Promise 2 cb', 12),
      push('console.log("Promise 2")', 13),
      log('Promise 2'),
      pop('console.log("Promise 2")'),
      pop('Promise 2 cb'),
      // Microtasks drained → pick macrotask
      checkMicro,
      checkTask,
      dequeueTask('Timeout 1'),
      push('Timeout 1 cb', 3),
      push('console.log("Timeout 1")', 4),
      log('Timeout 1'),
      pop('console.log("Timeout 1")'),
      // Nested setTimeout inside the callback
      push('setTimeout(cb, 0)', 5),
      webApiAdd('setTimeout(0ms)'),
      pop('setTimeout(cb, 0)'),
      pop('Timeout 1 cb'),
      // Nested timer completes → task queue
      webApiRemove('setTimeout(0ms)'),
      enqueueTask('Timeout 2'),
      // Event loop: stack empty → microtasks (none) → pick task
      checkStack,
      checkMicro,
      checkTask,
      dequeueTask('Timeout 2'),
      push('Timeout 2 cb', 5),
      push('console.log("Timeout 2")', 6),
      log('Timeout 2'),
      pop('console.log("Timeout 2")'),
      pop('Timeout 2 cb'),
      // Event loop: stack empty → microtasks (none) → tasks (none) → rerender
      checkStack,
      checkMicro,
      checkTask,
      rerender,
    ],
  },

  {
    name: 'fetch with Web API',
    category: 'Advanced',
    code: `console.log("Start");

setTimeout(() => {
  console.log("Timer done");
}, 1000);

fetch("/api/data").then((res) => {
  console.log("Fetch done");
});

console.log("End");`,
    // Output: Start, End, Fetch done, Timer done
    // fetch response → .then goes to MICROTASK queue (not task queue)
    // setTimeout → callback goes to TASK queue
    events: [
      push('Script', 1),
      push('console.log("Start")', 1),
      log('Start'),
      pop('console.log("Start")'),
      push('setTimeout(cb, 1000)', 3),
      webApiAdd('setTimeout(1000ms)'),
      pop('setTimeout(cb, 1000)'),
      push('fetch("/api/data").then(cb)', 7),
      webApiAdd('fetch(/api/data)'),
      pop('fetch("/api/data").then(cb)'),
      push('console.log("End")', 11),
      log('End'),
      pop('console.log("End")'),
      pop('Script'),
      // Event loop: stack empty
      checkStack,
      // fetch completes (network response arrives) → .then goes to microtask queue
      webApiRemove('fetch(/api/data)'),
      enqueueMicro('Fetch done cb'),
      checkMicro,
      dequeueMicro('Fetch done cb'),
      push('fetch .then cb', 7),
      push('console.log("Fetch done")', 8),
      log('Fetch done'),
      pop('console.log("Fetch done")'),
      pop('fetch .then cb'),
      // Microtask drain check
      checkMicro,
      // setTimeout fires → callback goes to task queue (macrotask)
      webApiRemove('setTimeout(1000ms)'),
      enqueueTask('Timer done cb'),
      checkTask,
      dequeueTask('Timer done cb'),
      push('Timer done cb', 3),
      push('console.log("Timer done")', 4),
      log('Timer done'),
      pop('console.log("Timer done")'),
      pop('Timer done cb'),
      // Event loop: stack empty → microtasks (none) → tasks (none) → rerender
      checkStack,
      checkMicro,
      checkTask,
      rerender,
    ],
  },
];
