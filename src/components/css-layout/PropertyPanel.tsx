import React from 'react';
import styled from 'styled-components';
import type { CssPropertyDef } from '@data/css-properties';
import { CssPropertyControl } from './CssPropertyControl';

interface Props {
  properties: CssPropertyDef[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const Panel = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
`;

const CategoryTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 8px;
  margin-top: 12px;

  &:first-child {
    margin-top: 0;
  }
`;

export const PropertyPanel: React.FC<Props> = ({ properties, values, onChange }) => {
  const categories = Array.from(new Set(properties.map((p) => p.category ?? 'General')));

  return (
    <Panel>
      {categories.map((cat) => (
        <React.Fragment key={cat}>
          <CategoryTitle>{cat}</CategoryTitle>
          {properties
            .filter((p) => (p.category ?? 'General') === cat)
            .map((prop) => (
              <CssPropertyControl
                key={prop.name}
                property={prop}
                value={values[prop.name] ?? prop.default}
                onChange={(val) => onChange(prop.name, val)}
              />
            ))}
        </React.Fragment>
      ))}
    </Panel>
  );
};
