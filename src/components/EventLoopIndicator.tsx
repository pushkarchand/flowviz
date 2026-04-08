import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import type { EventLoopPhase } from '@engine/types';
import { InfoTooltip } from './InfoTooltip';
import { TOOLTIP_KEYS } from '@content/eventloop';

interface Props {
  currentPhase: EventLoopPhase;
}

// Phase keys that map to translation keys
const PHASE_KEYS: { key: EventLoopPhase; translationKey: string }[] = [
  { key: 'evaluating_script', translationKey: 'evaluateScript' },
  { key: 'running_task', translationKey: 'runTask' },
  { key: 'running_microtasks', translationKey: 'runMicrotasks' },
  { key: 'rerendering', translationKey: 'rerender' },
];

const Card = styled.div`
  background: ${(p) => p.theme.colors.cardBg};
  border-radius: 8px;
  box-shadow: ${(p) => p.theme.shadows.card};
`;

const Header = styled.div`
  background: ${(p) => p.theme.colors.eventLoopHeader};
  color: #fff;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StepperArea = styled.div`
  padding: 16px;
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  gap: 12px;
  padding: 10px 0;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 13px;
    top: 38px;
    bottom: -2px;
    width: 2px;
    background: ${(p) =>
      p.$completed || p.$active
        ? p.theme.colors.stepActive
        : p.theme.colors.stepConnector};
  }
`;

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  background: ${(p) =>
    p.$active || p.$completed
      ? p.theme.colors.stepActive
      : p.theme.colors.stepInactive};
  color: ${(p) => (p.$active || p.$completed ? '#fff' : p.theme.colors.textMuted)};
  transition: all 0.3s ease;
  box-shadow: ${(p) =>
    p.$active ? '0 0 0 4px rgba(66, 165, 245, 0.3)' : 'none'};
`;

const StepContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const StepLabel = styled.div<{ $active: boolean }>`
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  font-size: 13px;
  color: ${(p) => (p.$active ? p.theme.colors.stepActive : p.theme.colors.stepText)};
`;

const StepDesc = styled.div`
  font-size: 11px;
  color: ${(p) => p.theme.colors.stepDescText};
  margin-top: 2px;
`;

export const EventLoopIndicator: React.FC<Props> = ({ currentPhase }) => {
  const { t } = useTranslation();
  const activeIndex = PHASE_KEYS.findIndex((p) => p.key === currentPhase);

  return (
    <Card>
      <Header>
        <span>⟳</span>
        {t('eventLoop.phases.title')}
        <InfoTooltip align="left" text={t(TOOLTIP_KEYS.eventLoop)} />
      </Header>
      <StepperArea>
        {PHASE_KEYS.map((phase, i) => {
          const isActive = phase.key === currentPhase;
          const isCompleted = activeIndex > i;
          return (
            <Step key={phase.key} $active={isActive} $completed={isCompleted}>
              <StepDot $active={isActive} $completed={isCompleted}>
                {isCompleted ? '✓' : i + 1}
              </StepDot>
              <StepContent>
                <StepLabel $active={isActive}>
                  {t(`eventLoop.phases.${phase.translationKey}.name`)}
                </StepLabel>
                <StepDesc>
                  {t(`eventLoop.phases.${phase.translationKey}.description`)}
                </StepDesc>
              </StepContent>
            </Step>
          );
        })}
      </StepperArea>
    </Card>
  );
};
