import React from 'react';
import styled, { keyframes, css } from 'styled-components';

export type ArrowDirection = 'right' | 'left' | 'down' | 'up';

interface Props {
  direction: ArrowDirection;
  label?: string;
  active?: boolean;
  color?: string;
  dashed?: boolean;
}

const flowDash = keyframes`
  0% { stroke-dashoffset: 16; }
  100% { stroke-dashoffset: 0; }
`;

const glowPulse = keyframes`
  0%, 100% { filter: drop-shadow(0 0 2px transparent); }
  50% { filter: drop-shadow(0 0 6px currentColor); }
`;

const isHorizontal = (d: ArrowDirection) => d === 'left' || d === 'right';

const Wrapper = styled.div<{ $dir: ArrowDirection; $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${(p) => (isHorizontal(p.$dir) ? 'column' : 'row')};
  gap: 3px;
  flex-shrink: 0;
  opacity: 1;
  transition: opacity 0.3s ease;
`;

const SvgArrow = styled.svg<{ $active: boolean; $color: string }>`
  display: block;
  overflow: visible;
  color: ${(p) => p.$color};
  ${(p) =>
    p.$active &&
    css`
      animation: ${glowPulse} 1.5s ease infinite;
    `}
`;

const ArrowLine = styled.line<{
  $active: boolean;
  $color: string;
  $dashed: boolean;
}>`
  stroke: ${(p) => p.$color};
  stroke-width: 2.5;
  stroke-linecap: round;
  ${(p) =>
    p.$dashed
      ? css`
          stroke-dasharray: 8 5;
          ${p.$active &&
          css`
            animation: ${flowDash} 0.6s linear infinite;
          `}
        `
      : ''}
  transition: stroke 0.3s ease;
`;

const ArrowHeadPath = styled.polygon<{ $active: boolean; $color: string }>`
  fill: ${(p) => p.$color};
  transition: fill 0.3s ease;
`;

const Label = styled.span<{ $active: boolean; $color: string }>`
  font-size: 10px;
  font-weight: 700;
  color: ${(p) => p.$color};
  white-space: nowrap;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: color 0.3s ease;
`;

const CONFIGS: Record<
  ArrowDirection,
  {
    w: number;
    h: number;
    line: [number, number, number, number];
    head: string;
  }
> = {
  right: {
    w: 56,
    h: 18,
    line: [0, 9, 44, 9],
    head: '44,3 56,9 44,15',
  },
  left: {
    w: 56,
    h: 18,
    line: [12, 9, 56, 9],
    head: '12,3 0,9 12,15',
  },
  down: {
    w: 18,
    h: 40,
    line: [9, 0, 9, 28],
    head: '3,28 9,40 15,28',
  },
  up: {
    w: 18,
    h: 40,
    line: [9, 12, 9, 40],
    head: '3,12 9,0 15,12',
  },
};

export const FlowArrow: React.FC<Props> = ({
  direction,
  label,
  active = false,
  color = '#42a5f5',
  dashed = false,
}) => {
  const cfg = CONFIGS[direction];

  return (
    <Wrapper $dir={direction} $active={active}>
      {label && (
        <Label $active={active} $color={color}>
          {label}
        </Label>
      )}
      <SvgArrow
        width={cfg.w}
        height={cfg.h}
        viewBox={`0 0 ${cfg.w} ${cfg.h}`}
        $active={active}
        $color={color}
      >
        <ArrowLine
          x1={cfg.line[0]}
          y1={cfg.line[1]}
          x2={cfg.line[2]}
          y2={cfg.line[3]}
          $active={active}
          $color={color}
          $dashed={dashed}
        />
        <ArrowHeadPath points={cfg.head} $active={active} $color={color} />
      </SvgArrow>
    </Wrapper>
  );
};
