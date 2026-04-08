import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getColor } from '@engine/types';
import { InfoTooltip } from './InfoTooltip';
import { TOOLTIP_KEYS } from '@content/eventloop';

interface Props {
  items: string[];
}

const fadeScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Card = styled.div`
  background: ${(p) => p.theme.colors.cardBg};
  border-radius: 8px;
  box-shadow: ${(p) => p.theme.shadows.card};
`;

const Header = styled.div`
  background: ${(p) => p.theme.colors.webApiHeader};
  color: #fff;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ApiArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  min-height: 65px;
  align-items: center;
`;

const Item = styled.div<{ $colorIndex: number }>`
  background: ${(p) => getColor(p.$colorIndex)};
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  animation: ${fadeScale} 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Timer = styled.span`
  font-size: 11px;
  color: #777;
`;

const EmptyLabel = styled.div`
  color: ${(p) => p.theme.colors.emptyLabel};
  font-size: 13px;
  font-style: italic;
  margin: 0 auto;
`;

export const WebApis: React.FC<Props> = ({ items }) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <Header>
        <span>🌐</span>
        {t('eventLoop.webApis')}
        <InfoTooltip align="right" text={t(TOOLTIP_KEYS.webApis)} />
      </Header>
      <ApiArea>
        {items.length === 0 ? (
          <EmptyLabel>{t('eventLoop.noActiveWebApis')}</EmptyLabel>
        ) : (
          items.map((item, i) => (
            <Item key={`${item}-${i}`} $colorIndex={i}>
              {item}
              <Timer>⏱</Timer>
            </Item>
          ))
        )}
      </ApiArea>
    </Card>
  );
};
