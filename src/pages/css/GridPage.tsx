import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { PropertyPanel } from '@components/css-layout/PropertyPanel';
import { PresetSelector } from '@components/css-layout/PresetSelector';
import { GRID_CONTAINER_PROPS, GRID_ITEM_PROPS } from '@data/css-properties';
import { GRID_PRESETS } from '@data/grid-presets';

const PAGE_HEIGHT = 'calc(100vh - 48px)';

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  height: ${PAGE_HEIGHT};
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    min-height: ${PAGE_HEIGHT};
  }
`;

const LeftPanel = styled.div`
  width: 340px;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.panelBg};
  border-right: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    max-height: 50vh;
    border-right: none;
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }
`;

const PanelHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

const Subtitle = styled.span`
  font-size: 11px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: ${(p) => p.$active ? p.theme.colors.panelBg : 'transparent'};
  color: ${(p) => p.$active ? p.theme.colors.text : p.theme.colors.textMuted};
  border-bottom: 2px solid ${(p) => p.$active ? '#42a5f5' : 'transparent'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`;

const PanelContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const ItemSelector = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const ItemSelectorLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 8px;
`;

const ItemButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const ItemButton = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid ${(p) => p.$active ? '#42a5f5' : p.theme.colors.border};
  background: ${(p) => p.$active ? 'rgba(66, 165, 245, 0.15)' : p.theme.colors.cardBg};
  color: ${(p) => p.$active ? '#42a5f5' : p.theme.colors.text};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #42a5f5;
  }
`;

const CssOutput = styled.div`
  flex-shrink: 0;
  padding: 10px 14px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.codeBg};
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 11px;
  line-height: 1.5;
  color: ${(p) => p.theme.colors.codeText};
  max-height: 160px;
  overflow-y: auto;
  white-space: pre;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.bg};
  overflow: hidden;
  min-width: 0;
`;

const VisualizationArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: auto;
`;

const GridContainer = styled.div<{ $styles: React.CSSProperties }>`
  background: ${(p) => p.theme.colors.cardBg};
  border: 2px dashed ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 8px;
  min-width: 300px;
  min-height: 250px;
  max-width: 90%;
  max-height: 80%;
  ${(p) => ({ ...p.$styles })}
`;

const GridItem = styled.div<{ $isSelected: boolean; $index: number; $styles: React.CSSProperties }>`
  background: ${(p) => {
    const colors = [
      'rgba(66, 165, 245, 0.3)',
      'rgba(102, 187, 106, 0.3)',
      'rgba(255, 167, 38, 0.3)',
      'rgba(171, 71, 188, 0.3)',
      'rgba(239, 83, 80, 0.3)',
      'rgba(38, 198, 218, 0.3)',
    ];
    return colors[p.$index % colors.length];
  }};
  border: 2px solid ${(p) => {
    if (p.$isSelected) return '#42a5f5';
    const colors = [
      'rgba(66, 165, 245, 0.6)',
      'rgba(102, 187, 106, 0.6)',
      'rgba(255, 167, 38, 0.6)',
      'rgba(171, 71, 188, 0.6)',
      'rgba(239, 83, 80, 0.6)',
      'rgba(38, 198, 218, 0.6)',
    ];
    return colors[p.$index % colors.length];
  }};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  min-height: 50px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${(p) => p.$isSelected ? '0 0 0 3px rgba(66, 165, 245, 0.3)' : 'none'};
  ${(p) => ({ ...p.$styles })}

  &:hover {
    transform: scale(1.02);
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px 24px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.panelBg};
  justify-content: center;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const LegendSwatch = styled.div<{ $color: string; $border: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${(p) => p.$color};
  border: 2px solid ${(p) => p.$border};
`;

const ItemCountControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const ItemCountLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const ItemCountButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.cardBg};
  color: ${(p) => p.theme.colors.text};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #42a5f5;
    color: #42a5f5;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ItemCountValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  min-width: 24px;
  text-align: center;
`;

interface ItemProps {
  [key: string]: string;
}

function getContainerDefaults(): Record<string, string> {
  const vals: Record<string, string> = {};
  for (const p of GRID_CONTAINER_PROPS) vals[p.name] = p.default;
  return vals;
}

function getItemDefaults(): Record<string, string> {
  const vals: Record<string, string> = {};
  for (const p of GRID_ITEM_PROPS) vals[p.name] = p.default;
  return vals;
}

export const GridPage: React.FC = () => {
  const [presetIndex, setPresetIndex] = useState(0);
  const [containerValues, setContainerValues] = useState<Record<string, string>>(
    GRID_PRESETS[0]?.values ?? getContainerDefaults()
  );
  const [activeTab, setActiveTab] = useState<'container' | 'items'>('container');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [itemCount, setItemCount] = useState(6);
  const [itemProps, setItemProps] = useState<ItemProps[]>(() =>
    Array.from({ length: 9 }, () => getItemDefaults())
  );

  const handlePresetChange = useCallback((index: number) => {
    setPresetIndex(index);
    setContainerValues(GRID_PRESETS[index].values);
  }, []);

  const handleContainerChange = useCallback((name: string, value: string) => {
    setContainerValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleItemChange = useCallback((name: string, value: string) => {
    if (selectedItem === null) return;
    setItemProps((prev) => {
      const updated = [...prev];
      updated[selectedItem] = { ...updated[selectedItem], [name]: value };
      return updated;
    });
  }, [selectedItem]);

  const handleItemCountChange = useCallback((delta: number) => {
    setItemCount((prev) => {
      const next = Math.max(1, Math.min(12, prev + delta));
      return next;
    });
    setItemProps((prev) => {
      const newProps = [...prev];
      while (newProps.length < 12) {
        newProps.push(getItemDefaults());
      }
      return newProps;
    });
    if (selectedItem !== null && selectedItem >= itemCount + delta) {
      setSelectedItem(null);
    }
  }, [selectedItem, itemCount]);

  const containerStyles: React.CSSProperties = useMemo(() => ({
    display: containerValues['display'] || 'grid',
    gridTemplateColumns: containerValues['grid-template-columns'] || '1fr 1fr 1fr',
    gridTemplateRows: containerValues['grid-template-rows'] || 'auto',
    gap: `${containerValues['gap'] || '8'}px`,
    justifyItems: containerValues['justify-items'] as React.CSSProperties['justifyItems'] || 'stretch',
    alignItems: containerValues['align-items'] as React.CSSProperties['alignItems'] || 'stretch',
    gridAutoFlow: containerValues['grid-auto-flow'] as React.CSSProperties['gridAutoFlow'] || 'row',
  }), [containerValues]);

  const getItemStyles = useCallback((index: number): React.CSSProperties => {
    const props = itemProps[index] || getItemDefaults();
    return {
      gridColumn: props['grid-column'] !== 'auto' ? props['grid-column'] : undefined,
      gridRow: props['grid-row'] !== 'auto' ? props['grid-row'] : undefined,
      justifySelf: props['justify-self'] !== 'auto' ? props['justify-self'] as React.CSSProperties['justifySelf'] : undefined,
      alignSelf: props['align-self'] !== 'auto' ? props['align-self'] as React.CSSProperties['alignSelf'] : undefined,
    };
  }, [itemProps]);

  const cssCode = useMemo(() => {
    const lines: string[] = ['.container {'];
    lines.push(`  display: ${containerValues['display'] || 'grid'};`);
    lines.push(`  grid-template-columns: ${containerValues['grid-template-columns'] || '1fr 1fr 1fr'};`);
    if (containerValues['grid-template-rows'] && containerValues['grid-template-rows'] !== 'auto') {
      lines.push(`  grid-template-rows: ${containerValues['grid-template-rows']};`);
    }
    lines.push(`  gap: ${containerValues['gap'] || '8'}px;`);
    if (containerValues['justify-items'] !== 'stretch') {
      lines.push(`  justify-items: ${containerValues['justify-items']};`);
    }
    if (containerValues['align-items'] !== 'stretch') {
      lines.push(`  align-items: ${containerValues['align-items']};`);
    }
    if (containerValues['grid-auto-flow'] !== 'row') {
      lines.push(`  grid-auto-flow: ${containerValues['grid-auto-flow']};`);
    }
    lines.push('}');

    // Add item-specific styles if any are customized
    itemProps.slice(0, itemCount).forEach((props, index) => {
      const customProps: string[] = [];
      if (props['grid-column'] !== 'auto') customProps.push(`  grid-column: ${props['grid-column']};`);
      if (props['grid-row'] !== 'auto') customProps.push(`  grid-row: ${props['grid-row']};`);
      if (props['justify-self'] !== 'auto') customProps.push(`  justify-self: ${props['justify-self']};`);
      if (props['align-self'] !== 'auto') customProps.push(`  align-self: ${props['align-self']};`);

      if (customProps.length > 0) {
        lines.push('');
        lines.push(`.item-${index + 1} {`);
        lines.push(...customProps);
        lines.push('}');
      }
    });

    return lines.join('\n');
  }, [containerValues, itemProps, itemCount]);

  const currentItemValues = selectedItem !== null ? itemProps[selectedItem] : getItemDefaults();

  return (
    <PageContainer>
      <LeftPanel>
        <PanelHeader>
          <div>
            <Title>CSS Grid Playground</Title>
            <Subtitle>Explore grid layouts interactively</Subtitle>
          </div>
          <PresetSelector presets={GRID_PRESETS} selectedIndex={presetIndex} onChange={handlePresetChange} />
        </PanelHeader>

        <TabBar>
          <Tab $active={activeTab === 'container'} onClick={() => setActiveTab('container')}>
            Container
          </Tab>
          <Tab $active={activeTab === 'items'} onClick={() => { setActiveTab('items'); if (selectedItem === null) setSelectedItem(0); }}>
            Items
          </Tab>
        </TabBar>

        <PanelContent>
          {activeTab === 'container' && (
            <>
              <ItemCountControl>
                <ItemCountLabel>Grid Items:</ItemCountLabel>
                <ItemCountButton onClick={() => handleItemCountChange(-1)} disabled={itemCount <= 1}>−</ItemCountButton>
                <ItemCountValue>{itemCount}</ItemCountValue>
                <ItemCountButton onClick={() => handleItemCountChange(1)} disabled={itemCount >= 12}>+</ItemCountButton>
              </ItemCountControl>
              <PropertyPanel properties={GRID_CONTAINER_PROPS} values={containerValues} onChange={handleContainerChange} />
            </>
          )}
          {activeTab === 'items' && (
            <>
              <ItemSelector>
                <ItemSelectorLabel>Select Item to Edit:</ItemSelectorLabel>
                <ItemButtons>
                  {Array.from({ length: itemCount }, (_, i) => (
                    <ItemButton
                      key={i}
                      $active={selectedItem === i}
                      onClick={() => setSelectedItem(i)}
                    >
                      {i + 1}
                    </ItemButton>
                  ))}
                </ItemButtons>
              </ItemSelector>
              {selectedItem !== null && (
                <PropertyPanel
                  properties={GRID_ITEM_PROPS}
                  values={currentItemValues}
                  onChange={handleItemChange}
                />
              )}
            </>
          )}
        </PanelContent>

        <CssOutput>{cssCode}</CssOutput>
      </LeftPanel>

      <RightPanel>
        <VisualizationArea>
          <GridContainer $styles={containerStyles}>
            {Array.from({ length: itemCount }, (_, i) => (
              <GridItem
                key={i}
                $index={i}
                $isSelected={selectedItem === i}
                $styles={getItemStyles(i)}
                onClick={() => { setSelectedItem(i); setActiveTab('items'); }}
              >
                {i + 1}
              </GridItem>
            ))}
          </GridContainer>
        </VisualizationArea>

        <Legend>
          <LegendItem>
            <LegendSwatch $color="rgba(66, 165, 245, 0.3)" $border="rgba(66, 165, 245, 0.6)" />
            Grid Items (click to edit)
          </LegendItem>
          <LegendItem>
            <LegendSwatch $color="transparent" $border="#42a5f5" />
            Selected Item
          </LegendItem>
        </Legend>
      </RightPanel>
    </PageContainer>
  );
};
