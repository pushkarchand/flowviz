import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

interface Props {
  logs: string[];
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  background: ${(p) => p.theme.colors.consoleBg};
  border-radius: 8px;
  box-shadow: ${(p) => p.theme.shadows.card};
  display: flex;
  flex-direction: column;
  flex: 4;
  min-height: 0;
`;

const Header = styled.div`
  background: ${(p) => p.theme.colors.consoleHeader};
  color: ${(p) => p.theme.colors.consoleText};
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px 8px 0 0;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogArea = styled.div`
  padding: 10px 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

const LogLine = styled.div`
  color: ${(p) => p.theme.colors.consoleText};
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  padding: 2px 0;
  animation: ${fadeIn} 0.2s ease;

  &::before {
    content: '> ';
    color: ${(p) => p.theme.colors.consoleMuted};
  }
`;

const EmptyLabel = styled.div`
  color: ${(p) => p.theme.colors.consoleMuted};
  font-size: 12px;
  font-style: italic;
  padding: 4px 0;
`;

export const ConsoleOutput: React.FC<Props> = ({ logs }) => {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  return (
    <Card>
      <Header>
        <span>⌘</span>
        {t('eventLoop.console')}
      </Header>
      <LogArea>
        {logs.length === 0 ? (
          <EmptyLabel>{t('eventLoop.noOutputYet')}</EmptyLabel>
        ) : (
          logs.map((log, i) => <LogLine key={i}>{log}</LogLine>)
        )}
        <div ref={bottomRef} />
      </LogArea>
    </Card>
  );
};
