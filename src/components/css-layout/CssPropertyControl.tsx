import React from 'react';
import styled from 'styled-components';
import type { CssPropertyDef } from '@data/css-properties';

interface Props {
  property: CssPropertyDef;
  value: string;
  onChange: (value: string) => void;
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textSecondary};
  min-width: 110px;
  flex-shrink: 0;
`;

const Select = styled.select`
  flex: 1;
  padding: 5px 8px;
  border: 1px solid ${(p) => p.theme.colors.selectBorder};
  border-radius: 4px;
  font-size: 12px;
  background: ${(p) => p.theme.colors.selectBg};
  color: ${(p) => p.theme.colors.text};
  outline: none;
  &:focus { border-color: ${(p) => p.theme.colors.selectFocus}; }
`;

const SliderWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  accent-color: #42a5f5;
`;

const SliderValue = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  min-width: 40px;
  text-align: right;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 5px 8px;
  border: 1px solid ${(p) => p.theme.colors.selectBorder};
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Fira Code', monospace;
  background: ${(p) => p.theme.colors.selectBg};
  color: ${(p) => p.theme.colors.text};
  outline: none;
  &:focus { border-color: ${(p) => p.theme.colors.selectFocus}; }
`;

export const CssPropertyControl: React.FC<Props> = ({ property, value, onChange }) => {
  const { type, label, options, min, max, step, unit } = property;

  return (
    <Row>
      <Label>{label}</Label>
      {type === 'select' && (
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          {options!.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
      )}
      {type === 'slider' && (
        <SliderWrap>
          <Slider
            type="range"
            min={min}
            max={max}
            step={step}
            value={value === 'auto' ? min ?? 0 : Number(value)}
            onChange={(e) => onChange(e.target.value)}
          />
          <SliderValue>{value}{unit ?? ''}</SliderValue>
        </SliderWrap>
      )}
      {type === 'text' && (
        <TextInput value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </Row>
  );
};
