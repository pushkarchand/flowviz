import React from 'react';
import styled from 'styled-components';
import { EXAMPLES } from '@engine/examples';

interface Props {
  selectedIndex: number;
  onChange: (index: number) => void;
}

const Wrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 2px solid ${(p) => p.theme.colors.selectBorder};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background: ${(p) => p.theme.colors.selectBg};
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  outline: none;
  appearance: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${(p) => p.theme.colors.selectFocus};
  }

  &:hover {
    border-color: ${(p) => p.theme.colors.textMuted};
  }
`;

const Arrow = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 12px;
`;

export const ExampleSelector: React.FC<Props> = ({
  selectedIndex,
  onChange,
}) => {
  const categories = Array.from(new Set(EXAMPLES.map((e) => e.category)));

  return (
    <Wrapper>
      <Select
        value={selectedIndex}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {categories.map((cat) => (
          <optgroup key={cat} label={cat}>
            {EXAMPLES.map((ex, i) =>
              ex.category === cat ? (
                <option key={i} value={i}>
                  {ex.name}
                </option>
              ) : null
            )}
          </optgroup>
        ))}
      </Select>
      <Arrow>▼</Arrow>
    </Wrapper>
  );
};
