import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { PropertyPanel } from '@components/css-layout/PropertyPanel';
import { PresetSelector } from '@components/css-layout/PresetSelector';
import { POSITIONING_PROPS } from '@data/css-properties';
import { POSITIONING_PRESETS } from '@data/positioning-presets';

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

const PanelContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const ElementSelector = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const ElementLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 8px;
`;

const ElementButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const ElementButton = styled.button<{ $active: boolean; $color: string }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: 2px solid ${(p) => p.$active ? p.$color : p.theme.colors.border};
  background: ${(p) => p.$active ? `${p.$color}20` : p.theme.colors.cardBg};
  color: ${(p) => p.$active ? p.$color : p.theme.colors.text};
  font-size: 11px;
  font-weight: 600;
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

const VisualizationArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: auto;
`;

const PositioningContext = styled.div`
  position: relative;
  width: 500px;
  height: 400px;
  background: ${(p) => p.theme.colors.cardBg};
  border: 2px dashed ${(p) => p.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const ContextLabel = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 10px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textMuted};
  background: ${(p) => p.theme.colors.cardBg};
  padding: 2px 6px;
  border-radius: 4px;
`;

const ELEMENT_COLORS = [
  { bg: 'rgba(66, 165, 245, 0.3)', border: '#42a5f5', name: 'Blue' },
  { bg: 'rgba(102, 187, 106, 0.3)', border: '#66bb6a', name: 'Green' },
  { bg: 'rgba(255, 167, 38, 0.3)', border: '#ffa726', name: 'Orange' },
];

const PositionedElement = styled.div<{ 
  $isSelected: boolean;
  $color: typeof ELEMENT_COLORS[0];
  $position: string;
  $top: string;
  $right: string;
  $bottom: string;
  $left: string;
  $zIndex: string;
  $baseOffset: { top: number; left: number };
}>`
  position: ${(p) => p.$position};
  ${(p) => p.$top !== 'auto' ? `top: ${p.$top};` : ''}
  ${(p) => p.$right !== 'auto' ? `right: ${p.$right};` : ''}
  ${(p) => p.$bottom !== 'auto' ? `bottom: ${p.$bottom};` : ''}
  ${(p) => p.$left !== 'auto' ? `left: ${p.$left};` : ''}
  ${(p) => p.$zIndex !== 'auto' ? `z-index: ${p.$zIndex};` : ''}
  
  ${(p) => p.$position === 'static' ? `
    position: relative;
    top: ${p.$baseOffset.top}px;
    left: ${p.$baseOffset.left}px;
  ` : ''}
  
  width: 100px;
  height: 80px;
  background: ${(p) => p.$color.bg};
  border: 3px solid ${(p) => p.$isSelected ? p.$color.border : `${p.$color.border}80`};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-shadow: ${(p) => p.$isSelected ? `0 0 0 3px ${p.$color.border}40` : 'none'};

  &:hover {
    border-color: ${(p) => p.$color.border};
  }
`;

const ElementName = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const PositionBadge = styled.span<{ $position: string }>`
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  margin-top: 4px;
  background: ${(p) => {
    switch (p.$position) {
      case 'static': return '#9e9e9e';
      case 'relative': return '#42a5f5';
      case 'absolute': return '#ef5350';
      case 'fixed': return '#ab47bc';
      case 'sticky': return '#ffa726';
      default: return '#666';
    }
  }};
  color: white;
`;

const OffsetLabel = styled.div`
  font-size: 8px;
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

const LegendBadge = styled.span<{ $color: string }>`
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  background: ${(p) => p.$color};
  color: white;
`;

const InfoPanel = styled.div`
  padding: 12px 16px;
  background: ${(p) => p.theme.colors.panelBg};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const InfoTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 6px;
`;

const InfoText = styled.div`
  font-size: 11px;
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: 1.5;
`;

interface ElementProps {
  position: string;
  top: string;
  right: string;
  bottom: string;
  left: string;
  zIndex: string;
}

const POSITION_INFO: Record<string, { title: string; description: string }> = {
  static: {
    title: 'Static (Default)',
    description: 'Elements are positioned according to normal document flow. Top, right, bottom, left, and z-index have no effect.',
  },
  relative: {
    title: 'Relative',
    description: 'Element is positioned relative to its normal position. Offsets move it from where it would normally be, but its original space is preserved.',
  },
  absolute: {
    title: 'Absolute',
    description: 'Element is positioned relative to its nearest positioned ancestor (or the viewport if none exists). Removed from normal document flow.',
  },
  fixed: {
    title: 'Fixed',
    description: 'Element is positioned relative to the viewport. It stays in the same place even when scrolling. Removed from normal document flow.',
  },
  sticky: {
    title: 'Sticky',
    description: 'Element is positioned based on scroll position. It toggles between relative and fixed depending on scroll position.',
  },
};

export const PositioningPage: React.FC = () => {
  const [presetIndex, setPresetIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState(0);
  const [elements, setElements] = useState<ElementProps[]>([
    { position: 'static', top: 'auto', right: 'auto', bottom: 'auto', left: 'auto', zIndex: 'auto' },
    { position: 'relative', top: '20px', right: 'auto', bottom: 'auto', left: '20px', zIndex: '1' },
    { position: 'absolute', top: '50px', right: '50px', bottom: 'auto', left: 'auto', zIndex: '2' },
  ]);

  const currentElement = elements[selectedElement];
  const positionInfo = POSITION_INFO[currentElement.position] || POSITION_INFO.static;

  const handlePresetChange = useCallback((index: number) => {
    setPresetIndex(index);
    const presetValues = POSITIONING_PRESETS[index].values;
    setElements((prev) => {
      const updated = [...prev];
      updated[selectedElement] = {
        position: presetValues['position'] || 'static',
        top: presetValues['top'] || 'auto',
        right: presetValues['right'] || 'auto',
        bottom: presetValues['bottom'] || 'auto',
        left: presetValues['left'] || 'auto',
        zIndex: presetValues['z-index'] || 'auto',
      };
      return updated;
    });
  }, [selectedElement]);

  const handlePropChange = useCallback((name: string, value: string) => {
    setElements((prev) => {
      const updated = [...prev];
      const propName = name === 'z-index' ? 'zIndex' : name;
      updated[selectedElement] = { ...updated[selectedElement], [propName]: value };
      return updated;
    });
  }, [selectedElement]);

  const getValues = useCallback((): Record<string, string> => {
    return {
      'position': currentElement.position,
      'top': currentElement.top,
      'right': currentElement.right,
      'bottom': currentElement.bottom,
      'left': currentElement.left,
      'z-index': currentElement.zIndex,
    };
  }, [currentElement]);

  const cssCode = useMemo(() => {
    const lines: string[] = [];
    elements.forEach((el, i) => {
      lines.push(`.element-${i + 1} {`);
      lines.push(`  position: ${el.position};`);
      if (el.top !== 'auto') lines.push(`  top: ${el.top};`);
      if (el.right !== 'auto') lines.push(`  right: ${el.right};`);
      if (el.bottom !== 'auto') lines.push(`  bottom: ${el.bottom};`);
      if (el.left !== 'auto') lines.push(`  left: ${el.left};`);
      if (el.zIndex !== 'auto') lines.push(`  z-index: ${el.zIndex};`);
      lines.push('}');
      if (i < elements.length - 1) lines.push('');
    });
    return lines.join('\n');
  }, [elements]);

  const baseOffsets = [
    { top: 50, left: 50 },
    { top: 150, left: 150 },
    { top: 100, left: 250 },
  ];

  return (
    <PageContainer>
      <LeftPanel>
        <PanelHeader>
          <div>
            <Title>CSS Positioning</Title>
            <Subtitle>Explore position, offsets, and z-index</Subtitle>
          </div>
          <PresetSelector presets={POSITIONING_PRESETS} selectedIndex={presetIndex} onChange={handlePresetChange} />
        </PanelHeader>

        <ElementSelector>
          <ElementLabel>Select Element:</ElementLabel>
          <ElementButtons>
            {elements.map((el, i) => (
              <ElementButton
                key={i}
                $active={selectedElement === i}
                $color={ELEMENT_COLORS[i].border}
                onClick={() => setSelectedElement(i)}
              >
                {ELEMENT_COLORS[i].name} ({el.position})
              </ElementButton>
            ))}
          </ElementButtons>
        </ElementSelector>

        <InfoPanel>
          <InfoTitle>{positionInfo.title}</InfoTitle>
          <InfoText>{positionInfo.description}</InfoText>
        </InfoPanel>

        <PanelContent>
          <PropertyPanel 
            properties={POSITIONING_PROPS} 
            values={getValues()} 
            onChange={handlePropChange} 
          />
        </PanelContent>

        <CssOutput>{cssCode}</CssOutput>
      </LeftPanel>

      <RightPanel>
        <VisualizationArea>
          <PositioningContext>
            <ContextLabel>position: relative (parent container)</ContextLabel>
            {elements.map((el, i) => (
              <PositionedElement
                key={i}
                $isSelected={selectedElement === i}
                $color={ELEMENT_COLORS[i]}
                $position={el.position}
                $top={el.top}
                $right={el.right}
                $bottom={el.bottom}
                $left={el.left}
                $zIndex={el.zIndex}
                $baseOffset={baseOffsets[i]}
                onClick={() => setSelectedElement(i)}
              >
                <ElementName>{ELEMENT_COLORS[i].name}</ElementName>
                <PositionBadge $position={el.position}>{el.position}</PositionBadge>
                {el.zIndex !== 'auto' && (
                  <OffsetLabel>z-index: {el.zIndex}</OffsetLabel>
                )}
              </PositionedElement>
            ))}
          </PositioningContext>
        </VisualizationArea>

        <Legend>
          <LegendItem>
            <LegendBadge $color="#9e9e9e">static</LegendBadge>
            Normal flow
          </LegendItem>
          <LegendItem>
            <LegendBadge $color="#42a5f5">relative</LegendBadge>
            Offset from normal
          </LegendItem>
          <LegendItem>
            <LegendBadge $color="#ef5350">absolute</LegendBadge>
            Relative to ancestor
          </LegendItem>
          <LegendItem>
            <LegendBadge $color="#ab47bc">fixed</LegendBadge>
            Relative to viewport
          </LegendItem>
          <LegendItem>
            <LegendBadge $color="#ffa726">sticky</LegendBadge>
            Scroll-based
          </LegendItem>
        </Legend>
      </RightPanel>
    </PageContainer>
  );
};
