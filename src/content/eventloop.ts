// ─── Tooltip keys for i18n (rendered as markdown) ───
// Use these keys with t('eventLoop.tooltip.{key}')

export const TOOLTIP_KEYS = {
  callStack: 'eventLoop.tooltip.callStack',
  webApis: 'eventLoop.tooltip.webApis',
  taskQueue: 'eventLoop.tooltip.taskQueue',
  microtaskQueue: 'eventLoop.tooltip.microtaskQueue',
  eventLoop: 'eventLoop.tooltip.eventLoop',
} as const;

// ─── "How it works" step keys for i18n ───
// Use with t('eventLoop.howItWorks.steps.{key}.label') etc.

export interface HowItWorksItem {
  key: string;
  color: string;
}

export const HOW_IT_WORKS: HowItWorksItem[] = [
  { key: 'callStack', color: '#333' },
  { key: 'webApis', color: '#ef6c00' },
  { key: 'taskQueue', color: '#1565c0' },
  { key: 'microtaskQueue', color: '#8e24aa' },
  { key: 'asyncAwait', color: '#00897b' },
];

// ─── Flow arrow legend keys for i18n ───
// Use with t('eventLoop.arrowLegend.{key}.name') etc.

export interface ArrowLegendItem {
  key: string;
  color: string;
  dashed: boolean;
}

export const ARROW_LEGEND: ArrowLegendItem[] = [
  { key: 'register', color: '#ef6c00', dashed: false },
  { key: 'timerDone', color: '#1565c0', dashed: true },
  { key: 'taskCb', color: '#1565c0', dashed: false },
  { key: 'resolve', color: '#8e24aa', dashed: true },
  { key: 'microCb', color: '#8e24aa', dashed: false },
];
