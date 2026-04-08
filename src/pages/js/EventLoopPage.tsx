import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CodeEditor } from '@components/CodeEditor';
import { CallStack } from '@components/CallStack';
import { TaskQueue } from '@components/TaskQueue';
import { WebApis } from '@components/WebApis';
import { FlowArrow } from '@components/FlowArrow';
import { EventLoopIndicator } from '@components/EventLoopIndicator';
import { ConsoleOutput } from '@components/ConsoleOutput';
import { Controls } from '@components/Controls';
import { ExampleSelector } from '@components/ExampleSelector';
import { EXAMPLES } from '@engine/examples';
import { buildStateHistory } from '@engine/simulator';
import type { SimState } from '@engine/types';
import { TOOLTIP_KEYS, HOW_IT_WORKS, ARROW_LEGEND } from '@content/eventloop';

const PAGE_HEIGHT = 'calc(100vh - 48px)';

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  height: ${PAGE_HEIGHT};
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: ${PAGE_HEIGHT};
    overflow: auto;
  }
`;

const LeftPanel = styled.div`
  width: 380px;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
  background: ${(p) => p.theme.colors.panelBg};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 320px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-height: 50vh;
    border-right: none;
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
    overflow-y: auto;
  }
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const Subtitle = styled.span`
  font-size: 11px;
  color: ${(p) => p.theme.colors.textMuted};
  font-weight: 400;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
    overflow: visible;
  }
`;

const StickyControls = styled.div`
  flex-shrink: 0;
  padding: 16px 16px 0 16px;
  background: ${(p) => p.theme.colors.stickyBg};
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 12px 12px 0 12px;
    position: sticky;
    top: 0;
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
`;

const TopRow = styled.div`
  display: flex;
  gap: 0;
  align-items: stretch;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const CallStackCell = styled.div`
  width: 240px;
  flex-shrink: 0;
  @media (max-width: 900px) { width: 100%; }
`;

const HArrowCol = styled.div`
  width: 76px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 900px) { display: none; }
`;

const HArrowSlot = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const QueuesCol = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VArrowRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 0;
  @media (max-width: 900px) { display: none; }
`;

const BottomRow = styled.div`
  display: flex;
  gap: 14px;
  @media (max-width: 900px) { flex-direction: column; }
`;

const EventLoopCol = styled.div`
  width: 300px;
  flex-shrink: 0;
  @media (max-width: 900px) { width: 100%; }
`;

const ConsoleCol = styled.div`
  flex: 1;
  min-width: 0;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatChip = styled.span<{ $color: string; $text: string }>`
  background: ${(p) => p.$color};
  color: ${(p) => p.$text};
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  white-space: nowrap;
`;

const ControlsBar = styled.div`
  padding: 12px 16px;
  background: ${(p) => p.theme.colors.controlsBg};
  border-radius: 8px;
  box-shadow: ${(p) => p.theme.shadows.card};
`;

const EventDescription = styled.div`
  background: ${(p) => p.theme.colors.eventDescBg};
  border-radius: 8px;
  padding: 10px 16px;
  box-shadow: ${(p) => p.theme.shadows.card};
  font-size: 13px;
  color: ${(p) => p.theme.colors.textSecondary};
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const EventBadge = styled.span<{ $type: string }>`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  background: ${(p) => {
    switch (p.$type) {
      case 'call_stack_push': case 'call_stack_pop': return '#e3f2fd';
      case 'task_queue_enqueue': case 'task_queue_dequeue': return '#fff3e0';
      case 'microtask_queue_enqueue': case 'microtask_queue_dequeue': return '#f3e5f5';
      case 'console_log': return '#e8f5e9';
      default: return '#f5f5f5';
    }
  }};
  color: ${(p) => {
    switch (p.$type) {
      case 'call_stack_push': case 'call_stack_pop': return '#1565c0';
      case 'task_queue_enqueue': case 'task_queue_dequeue': return '#e65100';
      case 'microtask_queue_enqueue': case 'microtask_queue_dequeue': return '#7b1fa2';
      case 'console_log': return '#2e7d32';
      default: return '#555';
    }
  }};
`;

const EditedNotice = styled.div`
  background: #fff3e0;
  color: #e65100;
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ResetLink = styled.button`
  background: none;
  border: none;
  color: #1565c0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
`;

const InfoCard = styled.div`
  background: ${(p) => p.theme.colors.cardBg};
  border-radius: 8px;
  box-shadow: ${(p) => p.theme.shadows.card};
  height: 100%;
`;

const InfoHeader = styled.div`
  background: ${(p) => p.theme.colors.infoHeader};
  color: ${(p) => p.theme.colors.text};
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
`;

const InfoBody = styled.div`
  padding: 14px 16px;
  font-size: 12px;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.textSecondary};
  p { margin-bottom: 8px; }
  strong { color: ${(p) => p.theme.colors.text}; }
  em { color: #7b1fa2; }
`;

const ArrowLegend = styled.div`
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LegendTitle = styled.div`
  font-weight: 700;
  font-size: 12px;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 2px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  line-height: 1.4;
`;

const LegendLine = styled.div<{ $color: string; $dashed?: boolean }>`
  width: 28px;
  height: 3px;
  flex-shrink: 0;
  border-radius: 2px;
  background: ${(p) =>
    p.$dashed
      ? `repeating-linear-gradient(90deg, ${p.$color} 0px, ${p.$color} 6px, transparent 6px, transparent 10px)`
      : p.$color};
`;

const ColorLabel = styled.span<{ $color: string }>`
  font-weight: 700;
  color: ${(p) => p.$color};
`;

const ArrowHint = styled.span<{ $color: string }>`
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  color: ${(p) => p.$color};
  margin-left: 4px;
`;

function formatEventType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const AUTO_PLAY_INTERVAL = 800;

export const EventLoopPage: React.FC = () => {
  const { t } = useTranslation();
  const [exampleIndex, setExampleIndex] = useState(0);
  const [customCode, setCustomCode] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const example = EXAMPLES[exampleIndex];
  const isEdited = customCode !== null && customCode !== example.code;
  const displayCode = customCode ?? example.code;
  const events = example.events;
  const states: SimState[] = buildStateHistory(events);
  const currentState = states[stepIndex];
  const currentEvent = stepIndex > 0 ? events[stepIndex - 1] : null;
  const isFinished = stepIndex >= events.length;

  const eventType = currentEvent?.type;
  const activeFlows = {
    stackToWebApi: eventType === 'web_api_add',
    webApiToTaskQueue: eventType === 'task_queue_enqueue' &&
      stepIndex >= 2 && events[stepIndex - 2]?.type === 'web_api_remove',
    webApiToMicrotaskQueue: eventType === 'microtask_queue_enqueue' &&
      stepIndex >= 2 && events[stepIndex - 2]?.type === 'web_api_remove',
    stackToMicrotaskQueue: eventType === 'microtask_queue_enqueue' &&
      !(stepIndex >= 2 && events[stepIndex - 2]?.type === 'web_api_remove'),
    taskQueueToStack: eventType === 'call_stack_push' &&
      stepIndex >= 2 && events[stepIndex - 2]?.type === 'task_queue_dequeue',
    microtaskQueueToStack: eventType === 'call_stack_push' &&
      stepIndex >= 2 && events[stepIndex - 2]?.type === 'microtask_queue_dequeue',
  };

  const sizes = {
    callStack: currentState.callStack.length,
    webApis: currentState.webApis.length,
    tasks: currentState.taskQueue.length,
    microtasks: currentState.microtaskQueue.length,
  };

  const stopAutoPlay = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const handleStep = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, events.length));
  }, [events.length]);

  const handleAutoPlay = useCallback(() => { setIsPlaying(true); }, []);

  const handleReset = useCallback(() => { stopAutoPlay(); setStepIndex(0); }, [stopAutoPlay]);

  const handleExampleChange = useCallback((index: number) => {
    stopAutoPlay(); setExampleIndex(index); setCustomCode(null); setStepIndex(0);
  }, [stopAutoPlay]);

  const handleCodeChange = useCallback((code: string) => {
    setCustomCode(code); stopAutoPlay(); setStepIndex(0);
  }, [stopAutoPlay]);

  useEffect(() => {
    if (isPlaying && !isFinished) {
      intervalRef.current = setInterval(() => {
        setStepIndex((prev) => {
          const next = prev + 1;
          if (next >= events.length) { stopAutoPlay(); return events.length; }
          return next;
        });
      }, AUTO_PLAY_INTERVAL);
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [isPlaying, isFinished, events.length, stopAutoPlay]);

  return (
    <PageContainer>
      <LeftPanel>
        <PageTitle>
          <div>
            <Title>Event Loop Visualizer</Title>
            <Subtitle>with async/await support</Subtitle>
          </div>
        </PageTitle>

        <ExampleSelector selectedIndex={exampleIndex} onChange={handleExampleChange} />
        <CodeEditor code={displayCode} highlightLine={isEdited ? undefined : currentState.highlightLine} onChange={handleCodeChange} />

        {isEdited && (
          <EditedNotice>
            Code edited — visualization shows the original example.
            <ResetLink onClick={() => { setCustomCode(null); setStepIndex(0); }}>Reset code</ResetLink>
          </EditedNotice>
        )}

        <ConsoleOutput logs={currentState.consoleLogs} />
      </LeftPanel>

      <RightPanel>
        <StickyControls>
          <ControlsBar>
            <Controls onStep={handleStep} onAutoPlay={handleAutoPlay} onPause={stopAutoPlay} onReset={handleReset} isPlaying={isPlaying} isFinished={isFinished} currentStep={stepIndex} totalSteps={events.length} />
          </ControlsBar>

          {currentEvent && (
            <EventDescription>
              <EventBadge $type={currentEvent.type}>{formatEventType(currentEvent.type)}</EventBadge>
              <span>{currentEvent.label}</span>
            </EventDescription>
          )}

          <StatsRow>
            <StatChip $color="#e3f2fd" $text="#1565c0">{t('eventLoop.stats.callStack')}: {sizes.callStack}</StatChip>
            <StatChip $color="#e0f7fa" $text="#00695c">{t('eventLoop.stats.webApis')}: {sizes.webApis}</StatChip>
            <StatChip $color="#fff3e0" $text="#e65100">{t('eventLoop.stats.tasks')}: {sizes.tasks}</StatChip>
            <StatChip $color="#f3e5f5" $text="#7b1fa2">{t('eventLoop.stats.microtasks')}: {sizes.microtasks}</StatChip>
            <StatChip $color="#e8f5e9" $text="#2e7d32">{t('eventLoop.stats.step')}: {stepIndex} / {events.length}</StatChip>
          </StatsRow>
        </StickyControls>

        <ScrollArea>
          <TopRow>
            <CallStackCell>
              <CallStack frames={currentState.callStack} />
            </CallStackCell>
            <HArrowCol>
              <HArrowSlot>
                <FlowArrow direction="right" label="register" active={activeFlows.stackToWebApi} color="#ef6c00" />
              </HArrowSlot>
              <HArrowSlot>
                <FlowArrow direction="left" label="task cb" active={activeFlows.taskQueueToStack} color="#1565c0" />
              </HArrowSlot>
              <HArrowSlot>
                <FlowArrow direction="right" label="resolve" active={activeFlows.stackToMicrotaskQueue || activeFlows.webApiToMicrotaskQueue} color="#8e24aa" dashed />
                <FlowArrow direction="left" label="micro cb" active={activeFlows.microtaskQueueToStack} color="#8e24aa" />
              </HArrowSlot>
            </HArrowCol>
            <QueuesCol>
              <WebApis items={currentState.webApis} />
              <VArrowRow>
                <FlowArrow direction="down" label="timer done → task" active={activeFlows.webApiToTaskQueue} color="#1565c0" dashed />
              </VArrowRow>
              <TaskQueue items={currentState.taskQueue} title={t('eventLoop.taskQueue')} icon="☰" headerColor="#1565c0" tooltip={t(TOOLTIP_KEYS.taskQueue)} />
              <TaskQueue items={currentState.microtaskQueue} title={t('eventLoop.microTaskQueue')} icon="⚡" headerColor="#8e24aa" tooltip={t(TOOLTIP_KEYS.microtaskQueue)} />
            </QueuesCol>
          </TopRow>

          <BottomRow>
            <EventLoopCol>
              <EventLoopIndicator currentPhase={currentState.currentPhase} />
            </EventLoopCol>
            <ConsoleCol>
              <InfoCard>
                <InfoHeader>{t('eventLoop.howItWorks.title')}</InfoHeader>
                <InfoBody>
                  {HOW_IT_WORKS.map((item) => (
                    <p key={item.key}>
                      <ColorLabel $color={item.color}>{t(`eventLoop.howItWorks.${item.key}.label`)}</ColorLabel> — {t(`eventLoop.howItWorks.${item.key}.description`)}
                      {t(`eventLoop.howItWorks.${item.key}.arrowHint`, { defaultValue: '' }) && (
                        <ArrowHint $color={item.color}>{t(`eventLoop.howItWorks.${item.key}.arrowHint`)}</ArrowHint>
                      )}
                    </p>
                  ))}
                  <ArrowLegend>
                    <LegendTitle>{t('eventLoop.arrowLegend.title')}</LegendTitle>
                    {ARROW_LEGEND.map((arrow) => (
                      <LegendItem key={arrow.key}>
                        <LegendLine $color={arrow.color} $dashed={arrow.dashed} />
                        <span><ColorLabel $color={arrow.color}>{t(`eventLoop.arrowLegend.${arrow.key}.name`)}</ColorLabel> — {t(`eventLoop.arrowLegend.${arrow.key}.description`)}</span>
                      </LegendItem>
                    ))}
                  </ArrowLegend>
                </InfoBody>
              </InfoCard>
            </ConsoleCol>
          </BottomRow>
        </ScrollArea>
      </RightPanel>
    </PageContainer>
  );
};
