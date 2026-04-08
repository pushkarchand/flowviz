export interface AppTheme {
  mode: 'light' | 'dark';
  colors: {
    bg: string;
    panelBg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    codeBg: string;
    codeText: string;
    codeLineNum: string;
    codeHighlight: string;
    consoleBg: string;
    consoleHeader: string;
    consoleText: string;
    consoleMuted: string;
    selectBg: string;
    selectBorder: string;
    selectFocus: string;
    progressBg: string;
    tooltipBg: string;
    tooltipText: string;
    tooltipStrong: string;
    infoIconBg: string;
    infoIconHover: string;
    emptyLabel: string;
    eventDescBg: string;
    controlsBg: string;
    stickyBg: string;
    // Navigation
    navBg: string;
    navText: string;
    navActive: string;
    navHover: string;
    navBorder: string;
    // Preview (CSS Layout pages)
    previewBg: string;
    previewBorder: string;
    // Semantic (stay the same in both modes)
    callStackHeader: string;
    webApiHeader: string;
    taskQueueHeader: string;
    microtaskHeader: string;
    eventLoopHeader: string;
    infoHeader: string;
    stepActive: string;
    stepInactive: string;
    stepText: string;
    stepDescText: string;
    stepConnector: string;
  };
  shadows: {
    card: string;
    elevated: string;
    fab: string;
    fabHover: string;
  };
}

const shared = {
  callStackHeader: '#37474f',
  webApiHeader: '#ef6c00',
  taskQueueHeader: '#1565c0',
  microtaskHeader: '#8e24aa',
  eventLoopHeader: '#2e7d32',
  stepActive: '#42a5f5',
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    bg: '#e8edf2',
    panelBg: '#f0f3f7',
    cardBg: '#ffffff',
    text: '#333',
    textSecondary: '#555',
    textMuted: '#777',
    border: '#ddd',
    codeBg: '#fdf6e3',
    codeText: '#586e75',
    codeLineNum: '#93a1a1',
    codeHighlight: '#fff3b0',
    consoleBg: '#263238',
    consoleHeader: '#37474f',
    consoleText: '#a5d6a7',
    consoleMuted: '#616161',
    selectBg: '#fff',
    selectBorder: '#ddd',
    selectFocus: '#42a5f5',
    progressBg: '#ddd',
    tooltipBg: '#263238',
    tooltipText: '#e0e0e0',
    tooltipStrong: '#fff',
    infoIconBg: 'rgba(255,255,255,0.35)',
    infoIconHover: 'rgba(255,255,255,0.6)',
    emptyLabel: '#bbb',
    eventDescBg: '#fff',
    controlsBg: '#fff',
    stickyBg: '#e8edf2',
    navBg: '#ffffff',
    navText: '#555',
    navActive: '#1565c0',
    navHover: '#e3f2fd',
    navBorder: '#ddd',
    previewBg: '#ffffff',
    previewBorder: '#e0e0e0',
    ...shared,
    infoHeader: '#fdd835',
    stepInactive: '#e0e0e0',
    stepText: '#555',
    stepDescText: '#999',
    stepConnector: '#ddd',
  },
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.1)',
    elevated: '0 4px 16px rgba(0,0,0,0.15)',
    fab: '0 3px 8px rgba(0,0,0,0.2)',
    fabHover: '0 4px 12px rgba(0,0,0,0.3)',
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    bg: '#121212',
    panelBg: '#1a1a2e',
    cardBg: '#1e1e2f',
    text: '#e0e0e0',
    textSecondary: '#b0b0b0',
    textMuted: '#888',
    border: '#333',
    codeBg: '#1a1a2e',
    codeText: '#d4d4d4',
    codeLineNum: '#555',
    codeHighlight: '#3a3a00',
    consoleBg: '#0d1117',
    consoleHeader: '#161b22',
    consoleText: '#7ee787',
    consoleMuted: '#484f58',
    selectBg: '#1e1e2f',
    selectBorder: '#444',
    selectFocus: '#42a5f5',
    progressBg: '#333',
    tooltipBg: '#2a2a3e',
    tooltipText: '#d0d0d0',
    tooltipStrong: '#fff',
    infoIconBg: 'rgba(255,255,255,0.2)',
    infoIconHover: 'rgba(255,255,255,0.4)',
    emptyLabel: '#555',
    eventDescBg: '#1e1e2f',
    controlsBg: '#1e1e2f',
    stickyBg: '#121212',
    navBg: '#1a1a2e',
    navText: '#b0b0b0',
    navActive: '#42a5f5',
    navHover: '#2a2a3e',
    navBorder: '#333',
    previewBg: '#1e1e2f',
    previewBorder: '#333',
    ...shared,
    infoHeader: '#2c2c3e',
    stepInactive: '#333',
    stepText: '#b0b0b0',
    stepDescText: '#666',
    stepConnector: '#444',
  },
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.4)',
    elevated: '0 4px 16px rgba(0,0,0,0.5)',
    fab: '0 3px 8px rgba(0,0,0,0.5)',
    fabHover: '0 4px 12px rgba(0,0,0,0.6)',
  },
};
