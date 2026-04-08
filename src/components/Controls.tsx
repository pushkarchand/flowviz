import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

interface Props {
  onStep: () => void;
  onAutoPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  isPlaying: boolean;
  isFinished: boolean;
  currentStep: number;
  totalSteps: number;
}

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Fab = styled.button<{ $color: string; $disabled?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  flex-shrink: 0;
  background: ${(p) => (p.$disabled ? p.theme.colors.stepInactive : p.$color)};
  color: #fff;
  font-size: 18px;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(p) => p.theme.shadows.fab};
  transition: all 0.2s ease;
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    transform: ${(p) => (p.$disabled ? 'none' : 'scale(1.1)')};
    box-shadow: ${(p) => p.theme.shadows.fabHover};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const PlayingFab = styled(Fab)`
  animation: ${pulse} 1.5s ease infinite;
`;

const ProgressBar = styled.div`
  flex: 1;
  min-width: 80px;
  height: 6px;
  background: ${(p) => p.theme.colors.progressBg};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: linear-gradient(90deg, #42a5f5, #66bb6a);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  font-weight: 500;
  white-space: nowrap;
`;

export const Controls: React.FC<Props> = ({
  onStep,
  onAutoPlay,
  onPause,
  onReset,
  isPlaying,
  isFinished,
  currentStep,
  totalSteps,
}) => {
  const { t } = useTranslation();
  const pct = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <Wrapper>
      <Fab
        $color="#66bb6a"
        $disabled={isPlaying || isFinished}
        disabled={isPlaying || isFinished}
        onClick={onStep}
        title={t('eventLoop.controls.step')}
      >
        ▶
      </Fab>

      {isPlaying ? (
        <PlayingFab $color="#ffa726" onClick={onPause} title={t('eventLoop.controls.pause')}>
          ❚❚
        </PlayingFab>
      ) : (
        <Fab
          $color="#42a5f5"
          $disabled={isFinished}
          disabled={isFinished}
          onClick={onAutoPlay}
          title={t('eventLoop.controls.autoPlay')}
        >
          ⏩
        </Fab>
      )}

      <Fab $color="#ef5350" onClick={onReset} title={t('eventLoop.controls.reset')}>
        ↺
      </Fab>

      <ProgressBar>
        <ProgressFill $pct={pct} />
      </ProgressBar>

      <StepLabel>
        {currentStep} / {totalSteps}
      </StepLabel>
    </Wrapper>
  );
};
