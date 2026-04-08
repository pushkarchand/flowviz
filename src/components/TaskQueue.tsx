import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getColor } from '@engine/types';
import { InfoTooltip } from './InfoTooltip';

interface Props {
  items: string[];
  title: string;
  icon: string;
  headerColor?: string;
  tooltip?: string;
  tooltipAlign?: 'left' | 'right';
}

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Card = styled.div`
  background: ${(p) => p.theme.colors.cardBg};
  border-radius: 8px;
  box-shadow: ${(p) => p.theme.shadows.card};
`;

const Header = styled.div<{ $bg: string }>`
  background: ${(p) => p.$bg};
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

const QueueArea = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  overflow-x: auto;
  min-height: 65px;
  align-items: center;
`;

const Item = styled.div<{ $colorIndex: number }>`
  background: ${(p) => getColor(p.$colorIndex)};
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  animation: ${slideInRight} 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
`;

const EmptyLabel = styled.div`
  color: ${(p) => p.theme.colors.emptyLabel};
  font-size: 13px;
  font-style: italic;
  margin: 0 auto;
`;

export const TaskQueue: React.FC<Props> = ({ items, title, icon, headerColor = '#fdd835', tooltip, tooltipAlign = 'right' }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <Header $bg={headerColor}>
        <HeaderIcon>{icon}</HeaderIcon>
        {title}
        {tooltip && <InfoTooltip text={tooltip} align={tooltipAlign} />}
      </Header>
      <QueueArea>
        {items.length === 0 ? (
          <EmptyLabel>{t('eventLoop.empty')}</EmptyLabel>
        ) : (
          items.map((item, i) => (
            <Item key={`${item}-${i}`} $colorIndex={i}>
              {item}
            </Item>
          ))
        )}
      </QueueArea>
    </Card>
  );
};
