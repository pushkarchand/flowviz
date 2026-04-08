import React, { useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  code: string;
  highlightLine?: number;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

const Container = styled.div`
  position: relative;
  flex: 6;
  min-height: 0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ScrollWrap = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: ${(p) => p.theme.colors.codeBg};
  position: relative;
`;

const Content = styled.div`
  position: relative;
  min-height: 100%;
`;

const GutterLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 44px;
  padding: 12px 0;
  pointer-events: none;
  z-index: 2;
`;

const GutterLine = styled.div<{ $highlighted: boolean }>`
  height: 20.8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: ${(p) => p.$highlighted ? p.theme.colors.text : p.theme.colors.codeLineNum};
  background: ${(p) => (p.$highlighted ? p.theme.colors.codeHighlight : 'transparent')};
  font-weight: ${(p) => (p.$highlighted ? 600 : 400)};
  user-select: none;
`;

const HighlightLayer = styled.div`
  position: absolute;
  top: 0;
  left: 44px;
  right: 0;
  padding: 12px 12px 12px 8px;
  pointer-events: none;
  z-index: 1;
`;

const HighlightRow = styled.div<{ $highlighted: boolean }>`
  height: 20.8px;
  background: ${(p) => (p.$highlighted ? p.theme.colors.codeHighlight : 'transparent')};
  border-radius: 3px;
`;

const Textarea = styled.textarea`
  position: relative;
  z-index: 3;
  display: block;
  width: 100%;
  min-height: 100%;
  padding: 12px 12px 12px 52px;
  margin: 0;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: ${(p) => p.theme.colors.codeText};
  white-space: pre;
  overflow: visible;
  tab-size: 2;
  caret-color: ${(p) => p.theme.colors.codeText};

  &::selection {
    background: rgba(66, 165, 245, 0.25);
  }
`;

export const CodeEditor: React.FC<Props> = ({
  code,
  highlightLine,
  onChange,
  readOnly = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = code.split('\n');

  // Auto-resize textarea to fit content
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }, [code]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const value = ta.value;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange?.(newValue);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [onChange]
  );

  return (
    <Container>
      <ScrollWrap>
        <Content>
          <GutterLayer>
            {lines.map((_, i) => (
              <GutterLine key={i} $highlighted={highlightLine === i + 1}>
                {i + 1}
              </GutterLine>
            ))}
          </GutterLayer>
          <HighlightLayer>
            {lines.map((_, i) => (
              <HighlightRow key={i} $highlighted={highlightLine === i + 1} />
            ))}
          </HighlightLayer>
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </Content>
      </ScrollWrap>
    </Container>
  );
};
