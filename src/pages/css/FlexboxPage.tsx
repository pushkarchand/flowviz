import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { PropertyPanel } from '@components/css-layout/PropertyPanel';
import { PresetSelector } from '@components/css-layout/PresetSelector';
import { FLEXBOX_CONTAINER_PROPS, FLEXBOX_ITEM_PROPS } from '@data/css-properties';
import { FLEXBOX_PRESETS } from '@data/flexbox-presets';

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

const ItemButton = styled.button<{ $active: boolean; $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid ${(p) => p.$active ? p.$color : p.theme.colors.border};
  background: ${(p) => p.$active ? `${p.$color}20` : p.theme.colors.cardBg};
  color: ${(p) => p.$active ? p.$color : p.theme.colors.text};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${(p) => p.$color};
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
  max-height: 180px;
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

const ToolBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.panelBg};
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ToolButton = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${(p) => p.$active ? '#42a5f5' : p.theme.colors.border};
  background: ${(p) => p.$active ? 'rgba(66, 165, 245, 0.15)' : p.theme.colors.cardBg};
  color: ${(p) => p.$active ? '#42a5f5' : p.theme.colors.text};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #42a5f5;
  }
`;

const ItemCountButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.cardBg};
  color: ${(p) => p.theme.colors.text};
  font-size: 14px;
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
  font-size: 13px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  min-width: 20px;
  text-align: center;
`;

const VisualizationArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: auto;
`;

const FlexContainer = styled.div<{ $styles: React.CSSProperties; $showOverlay: boolean }>`
  background: ${(p) => p.theme.colors.cardBg};
  border: 2px dashed ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  min-width: 400px;
  min-height: 300px;
  max-width: 90%;
  max-height: 80%;
  position: relative;
  ${(p) => ({ ...p.$styles })}

  ${(p) => p.$showOverlay && `
    &::before {
      content: 'flex container';
      position: absolute;
      top: -20px;
      left: 8px;
      font-size: 10px;
      font-weight: 600;
      color: #42a5f5;
      background: ${p.theme.colors.cardBg};
      padding: 2px 6px;
      border-radius: 4px;
    }
  `}
`;

const ITEM_COLORS = [
  { bg: 'rgba(66, 165, 245, 0.25)', border: '#42a5f5' },
  { bg: 'rgba(102, 187, 106, 0.25)', border: '#66bb6a' },
  { bg: 'rgba(255, 167, 38, 0.25)', border: '#ffa726' },
  { bg: 'rgba(171, 71, 188, 0.25)', border: '#ab47bc' },
  { bg: 'rgba(239, 83, 80, 0.25)', border: '#ef5350' },
  { bg: 'rgba(38, 198, 218, 0.25)', border: '#26c6da' },
];

const FlexItem = styled.div<{ 
  $isSelected: boolean; 
  $index: number; 
  $styles: React.CSSProperties;
  $showOverlay: boolean;
  $itemValues: Record<string, string>;
}>`
  background: ${(p) => ITEM_COLORS[p.$index % ITEM_COLORS.length].bg};
  border: 2px solid ${(p) => p.$isSelected ? ITEM_COLORS[p.$index % ITEM_COLORS.length].border : `${ITEM_COLORS[p.$index % ITEM_COLORS.length].border}80`};
  border-radius: 6px;
  min-width: 60px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${(p) => p.$isSelected ? `0 0 0 3px ${ITEM_COLORS[p.$index % ITEM_COLORS.length].border}40` : 'none'};
  position: relative;
  ${(p) => ({ ...p.$styles })}

  &:hover {
    transform: scale(1.02);
    border-color: ${(p) => ITEM_COLORS[p.$index % ITEM_COLORS.length].border};
  }

  ${(p) => p.$showOverlay && `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 2px dashed ${ITEM_COLORS[p.$index % ITEM_COLORS.length].border};
      border-radius: 4px;
      pointer-events: none;
    }
  `}
`;

const ItemLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
`;

const ItemMeta = styled.span`
  font-size: 9px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 2px;
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

const LegendSwatch = styled.div<{ $bg: string; $border: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${(p) => p.$bg};
  border: 2px solid ${(p) => p.$border};
`;

const AxisIndicator = styled.div<{ $direction: string }>`
  position: absolute;
  font-size: 10px;
  font-weight: 700;
  color: #42a5f5;
  background: ${(p) => p.theme.colors.cardBg};
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #42a5f5;
  
  ${(p) => {
    if (p.$direction === 'row' || p.$direction === 'row-reverse') {
      return `
        bottom: -24px;
        left: 50%;
        transform: translateX(-50%);
        &::before { content: 'Main Axis →'; }
      `;
    }
    return `
      right: -60px;
      top: 50%;
      transform: translateY(-50%) rotate(90deg);
      &::before { content: 'Main Axis →'; }
    `;
  }}
`;

const CrossAxisIndicator = styled.div<{ $direction: string }>`
  position: absolute;
  font-size: 10px;
  font-weight: 700;
  color: #66bb6a;
  background: ${(p) => p.theme.colors.cardBg};
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #66bb6a;
  
  ${(p) => {
    if (p.$direction === 'row' || p.$direction === 'row-reverse') {
      return `
        left: -60px;
        top: 50%;
        transform: translateY(-50%) rotate(-90deg);
        &::before { content: 'Cross Axis ↓'; }
      `;
    }
    return `
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      &::before { content: 'Cross Axis →'; }
    `;
  }}
`;

interface ItemProps {
  [key: string]: string;
}

function getContainerDefaults(): Record<string, string> {
  const vals: Record<string, string> = {};
  for (const p of FLEXBOX_CONTAINER_PROPS) vals[p.name] = p.default;
  return vals;
}

function getItemDefaults(): Record<string, string> {
  const vals: Record<string, string> = {};
  for (const p of FLEXBOX_ITEM_PROPS) vals[p.name] = p.default;
  return vals;
}

export const FlexboxPage: React.FC = () => {
  const [presetIndex, setPresetIndex] = useState(0);
  const [containerValues, setContainerValues] = useState<Record<string, string>>(
    FLEXBOX_PRESETS[0]?.values ?? getContainerDefaults()
  );
  const [activeTab, setActiveTab] = useState<'container' | 'items'>('container');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [itemCount, setItemCount] = useState(5);
  const [itemProps, setItemProps] = useState<ItemProps[]>(() =>
    Array.from({ length: 12 }, () => getItemDefaults())
  );
  const [showOverlay, setShowOverlay] = useState(true);
  const [showAxes, setShowAxes] = useState(true);

  const handlePresetChange = useCallback((index: number) => {
    setPresetIndex(index);
    setContainerValues(FLEXBOX_PRESETS[index].values);
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
    setItemCount((prev) => Math.max(1, Math.min(12, prev + delta)));
    if (selectedItem !== null && selectedItem >= itemCount + delta) {
      setSelectedItem(null);
    }
  }, [selectedItem, itemCount]);

  const containerStyles: React.CSSProperties = useMemo(() => ({
    display: containerValues['display'] || 'flex',
    flexDirection: containerValues['flex-direction'] as React.CSSProperties['flexDirection'] || 'row',
    justifyContent: containerValues['justify-content'] || 'flex-start',
    alignItems: containerValues['align-items'] || 'stretch',
    flexWrap: containerValues['flex-wrap'] as React.CSSProperties['flexWrap'] || 'nowrap',
    alignContent: containerValues['align-content'] || 'normal',
    gap: `${containerValues['gap'] || '8'}px`,
  }), [containerValues]);

  const getItemStyles = useCallback((index: number): React.CSSProperties => {
    const props = itemProps[index] || getItemDefaults();
    return {
      flexGrow: props['flex-grow'] !== '0' ? Number(props['flex-grow']) : undefined,
      flexShrink: props['flex-shrink'] !== '1' ? Number(props['flex-shrink']) : undefined,
      flexBasis: props['flex-basis'] !== 'auto' ? props['flex-basis'] : undefined,
      alignSelf: props['align-self'] !== 'auto' ? props['align-self'] as React.CSSProperties['alignSelf'] : undefined,
      order: props['order'] !== '0' ? Number(props['order']) : undefined,
    };
  }, [itemProps]);

  const cssCode = useMemo(() => {
    const lines: string[] = ['.container {'];
    lines.push(`  display: ${containerValues['display'] || 'flex'};`);
    lines.push(`  flex-direction: ${containerValues['flex-direction'] || 'row'};`);
    lines.push(`  justify-content: ${containerValues['justify-content'] || 'flex-start'};`);
    lines.push(`  align-items: ${containerValues['align-items'] || 'stretch'};`);
    if (containerValues['flex-wrap'] !== 'nowrap') {
      lines.push(`  flex-wrap: ${containerValues['flex-wrap']};`);
    }
    if (containerValues['align-content'] !== 'normal') {
      lines.push(`  align-content: ${containerValues['align-content']};`);
    }
    lines.push(`  gap: ${containerValues['gap'] || '8'}px;`);
    lines.push('}');

    // Add item-specific styles if any are customized
    itemProps.slice(0, itemCount).forEach((props, index) => {
      const customProps: string[] = [];
      if (props['flex-grow'] !== '0') customProps.push(`  flex-grow: ${props['flex-grow']};`);
      if (props['flex-shrink'] !== '1') customProps.push(`  flex-shrink: ${props['flex-shrink']};`);
      if (props['flex-basis'] !== 'auto') customProps.push(`  flex-basis: ${props['flex-basis']};`);
      if (props['align-self'] !== 'auto') customProps.push(`  align-self: ${props['align-self']};`);
      if (props['order'] !== '0') customProps.push(`  order: ${props['order']};`);

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
  const direction = containerValues['flex-direction'] || 'row';

  return (
    <PageContainer>
      <LeftPanel>
        <PanelHeader>
          <div>
            <Title>Flexbox Playground</Title>
            <Subtitle>Interactive CSS Flexbox visualizer</Subtitle>
          </div>
          <PresetSelector presets={FLEXBOX_PRESETS} selectedIndex={presetIndex} onChange={handlePresetChange} />
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
            <PropertyPanel properties={FLEXBOX_CONTAINER_PROPS} values={containerValues} onChange={handleContainerChange} />
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
                      $color={ITEM_COLORS[i % ITEM_COLORS.length].border}
                      onClick={() => setSelectedItem(i)}
                    >
                      {i + 1}
                    </ItemButton>
                  ))}
                </ItemButtons>
              </ItemSelector>
              {selectedItem !== null && (
                <PropertyPanel
                  properties={FLEXBOX_ITEM_PROPS}
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
        <ToolBar>
          <ToolGroup>
            <ToolLabel>Items:</ToolLabel>
            <ItemCountButton onClick={() => handleItemCountChange(-1)} disabled={itemCount <= 1}>−</ItemCountButton>
            <ItemCountValue>{itemCount}</ItemCountValue>
            <ItemCountButton onClick={() => handleItemCountChange(1)} disabled={itemCount >= 12}>+</ItemCountButton>
          </ToolGroup>
          <ToolGroup>
            <ToolButton $active={showOverlay} onClick={() => setShowOverlay(!showOverlay)}>
              {showOverlay ? '✓' : ''} Overlay
            </ToolButton>
            <ToolButton $active={showAxes} onClick={() => setShowAxes(!showAxes)}>
              {showAxes ? '✓' : ''} Axes
            </ToolButton>
          </ToolGroup>
        </ToolBar>

        <VisualizationArea>
          <FlexContainer $styles={containerStyles} $showOverlay={showOverlay}>
            {showAxes && (
              <>
                <AxisIndicator $direction={direction} />
                <CrossAxisIndicator $direction={direction} />
              </>
            )}
            {Array.from({ length: itemCount }, (_, i) => {
              const itemVals = itemProps[i] || getItemDefaults();
              return (
                <FlexItem
                  key={i}
                  $index={i}
                  $isSelected={selectedItem === i}
                  $styles={getItemStyles(i)}
                  $showOverlay={showOverlay}
                  $itemValues={itemVals}
                  onClick={() => { setSelectedItem(i); setActiveTab('items'); }}
                >
                  <ItemLabel>{i + 1}</ItemLabel>
                  {itemVals['flex-grow'] !== '0' && (
                    <ItemMeta>grow: {itemVals['flex-grow']}</ItemMeta>
                  )}
                  {itemVals['order'] !== '0' && (
                    <ItemMeta>order: {itemVals['order']}</ItemMeta>
                  )}
                </FlexItem>
              );
            })}
          </FlexContainer>
        </VisualizationArea>

        <Legend>
          <LegendItem>
            <LegendSwatch $bg="rgba(66, 165, 245, 0.25)" $border="#42a5f5" />
            Flex Items (click to edit)
          </LegendItem>
          <LegendItem>
            <span style={{ color: '#42a5f5', fontWeight: 700 }}>→</span>
            Main Axis
          </LegendItem>
          <LegendItem>
            <span style={{ color: '#66bb6a', fontWeight: 700 }}>↓</span>
            Cross Axis
          </LegendItem>
        </Legend>
      </RightPanel>
    </PageContainer>
  );
};
