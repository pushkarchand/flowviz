import React from 'react';
import styled from 'styled-components';
import type { CssPreset } from '@data/css-properties';

interface Props {
  presets: CssPreset[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const Wrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${(p) => p.theme.colors.selectBorder};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: ${(p) => p.theme.colors.selectBg};
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  outline: none;
  appearance: none;
  &:focus { border-color: ${(p) => p.theme.colors.selectFocus}; }
`;

const Arrow = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 11px;
`;

export const PresetSelector: React.FC<Props> = ({ presets, selectedIndex, onChange }) => {
  const categories = Array.from(new Set(presets.map((p) => p.category)));

  return (
    <Wrapper>
      <Select value={selectedIndex} onChange={(e) => onChange(Number(e.target.value))}>
        {categories.map((cat) => (
          <optgroup key={cat} label={cat}>
            {presets.map((preset, i) =>
              preset.category === cat ? (
                <option key={i} value={i}>{preset.name}</option>
              ) : null
            )}
          </optgroup>
        ))}
      </Select>
      <Arrow>▼</Arrow>
    </Wrapper>
  );
};
