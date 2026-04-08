import React from 'react';
import styled, { css } from 'styled-components';

type Align = 'left' | 'right';

interface Props {
  text: string;
  align?: Align;
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: auto;
`;

const Icon = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.infoIconBg};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  flex-shrink: 0;
  line-height: 1;
  user-select: none;
  transition: background 0.2s;

  &:hover {
    background: ${(p) => p.theme.colors.infoIconHover};
  }
`;

const Bubble = styled.div<{ $align: Align }>`
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  width: 280px;
  padding: 10px 12px;
  background: ${(p) => p.theme.colors.tooltipBg};
  color: ${(p) => p.theme.colors.tooltipText};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.6;
  border-radius: 8px;
  box-shadow: ${(p) => p.theme.shadows.elevated};
  z-index: 1000;
  pointer-events: none;

  ${(p) =>
    p.$align === 'left'
      ? css`left: 0;`
      : css`right: 0;`}

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    ${(p) =>
      p.$align === 'left'
        ? css`left: 6px;`
        : css`right: 6px;`}
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid ${(p) => p.theme.colors.tooltipBg};
  }

  ${Wrapper}:hover & {
    display: block;
  }

  ul {
    margin: 4px 0 4px 16px;
    padding: 0;
  }

  li {
    margin-bottom: 3px;
  }

  strong {
    color: ${(p) => p.theme.colors.tooltipStrong};
    font-weight: 700;
  }

  p {
    margin: 0 0 6px 0;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let key = 0;

  const formatInline = (str: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let k = 0;
    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.slice(lastIndex, match.index));
      }
      parts.push(<strong key={k++}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < str.length) {
      parts.push(str.slice(lastIndex));
    }
    return parts;
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={key++}>{listItems}</ul>);
      listItems = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      listItems.push(<li key={key++}>{formatInline(trimmed.slice(2))}</li>);
    } else {
      flushList();
      if (trimmed === '') continue;
      elements.push(<p key={key++}>{formatInline(trimmed)}</p>);
    }
  }
  flushList();

  return elements;
}

export const InfoTooltip: React.FC<Props> = ({ text, align = 'left' }) => {
  return (
    <Wrapper>
      <Icon>i</Icon>
      <Bubble $align={align}>{renderMarkdown(text)}</Bubble>
    </Wrapper>
  );
};
