import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getColor } from '@engine/types';
import { InfoTooltip } from './InfoTooltip';
import { TOOLTIP_KEYS } from '@content/eventloop';

interface Props {
  frames: string[];
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Card = styled.div`
  background: ${(p) => p.theme.colors.cardBg};
  border-radius: 8px;
  box-shadow: ${(p) => p.theme.shadows.card};
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 900px) {
    min-height: 140px;
    height: auto;
  }
`;

const Header = styled.div`
  background: ${(p) => p.theme.colors.callStackHeader};
  color: #fff;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderIcon = styled.span`
  font-size: 16px;
`;

const StackArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  padding: 12px;
  gap: 6px;
  overflow-y: auto;
  min-height: 0;

  @media (max-width: 900px) {
    min-height: 80px;
  }
`;

const Frame = styled.div<{ $colorIndex: number }>`
  background: ${(p) => getColor(p.$colorIndex)};
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: #333;
  animation: ${slideIn} 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyLabel = styled.div`
  color: ${(p) => p.theme.colors.emptyLabel};
  font-size: 13px;
  text-align: center;
  margin: auto;
  font-style: italic;
`;

export const CallStack: React.FC<Props> = ({ frames }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <Header>
        <HeaderIcon>▤</HeaderIcon>
        {t('eventLoop.callStack')}
        <InfoTooltip align="left" text={t(TOOLTIP_KEYS.callStack)} />
      </Header>
      <StackArea>
        {frames.length === 0 ? (
          <EmptyLabel>{t('eventLoop.empty')}</EmptyLabel>
        ) : (
          frames.map((frame, i) => (
            <Frame key={`${frame}-${i}`} $colorIndex={i}>
              {frame}
            </Frame>
          ))
        )}
      </StackArea>
    </Card>
  );
};
