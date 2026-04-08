import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { PropertyPanel } from '@components/css-layout/PropertyPanel';
import { PresetSelector } from '@components/css-layout/PresetSelector';
import { BOX_MODEL_PROPS } from '@data/css-properties';
import { BOX_MODEL_PRESETS } from '@data/box-model-presets';

const PAGE_HEIGHT = 'calc(100vh - 48px)';

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  height: ${PAGE_HEIGHT};
  overflow: hidden;

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-height: 45vh;
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
`;

const Subtitle = styled.span`
  font-size: 11px;
  color: ${(p) => p.theme.colors.textMuted};
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
  max-height: 140px;
  overflow-y: auto;
  white-space: pre;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.bg};
  padding: 24px;
  overflow: auto;
  min-width: 0;
`;

/* ─── Box Model Visualization (Chrome DevTools style) ─── */

const BoxModelViz = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const BoxLabel = styled.div<{ $color: string }>`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${(p) => p.$color};
`;

const MarginBox = styled.div`
  position: relative;
  background: rgba(255, 152, 0, 0.15);
  border: 2px dashed rgba(255, 152, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const BorderBox = styled.div`
  background: rgba(255, 213, 79, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const PaddingBox = styled.div`
  position: relative;
  background: rgba(102, 187, 106, 0.2);
  border: 1px dashed rgba(102, 187, 106, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ContentBox = styled.div`
  background: rgba(66, 165, 245, 0.2);
  border: 1px dashed rgba(66, 165, 245, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
`;

const DimLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const SizeLabel = styled.div`
  font-size: 10px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const EdgeLabel = styled.div<{ $pos: 'top' | 'right' | 'bottom' | 'left' }>`
  position: absolute;
  font-size: 10px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  ${(p) => {
    switch (p.$pos) {
      case 'top': return 'top: 2px; left: 50%; transform: translateX(-50%);';
      case 'bottom': return 'bottom: 2px; left: 50%; transform: translateX(-50%);';
      case 'left': return 'left: 4px; top: 50%; transform: translateY(-50%);';
      case 'right': return 'right: 4px; top: 50%; transform: translateY(-50%);';
    }
  }}
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const LegendSwatch = styled.div<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: ${(p) => p.$color};
`;

const InfoText = styled.div`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  text-align: center;
  max-width: 360px;
  line-height: 1.5;
`;

function getDefaults(): Record<string, string> {
  const vals: Record<string, string> = {};
  for (const p of BOX_MODEL_PROPS) vals[p.name] = p.default;
  return vals;
}

export const BoxModelPage: React.FC = () => {
  const [presetIndex, setPresetIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(BOX_MODEL_PRESETS[0]?.values ?? getDefaults());

  const handlePresetChange = useCallback((index: number) => {
    setPresetIndex(index);
    setValues(BOX_MODEL_PRESETS[index].values);
  }, []);

  const handlePropChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const v = (name: string) => Number(values[name]) || 0;
  const boxSizing = values['box-sizing'] ?? 'content-box';

  const mt = v('margin-top'), mr = v('margin-right'), mb = v('margin-bottom'), ml = v('margin-left');
  const bw = v('border-width');
  const pt = v('padding-top'), pr = v('padding-right'), pb = v('padding-bottom'), pl = v('padding-left');
  const w = v('width'), h = v('height');

  let contentW: number, contentH: number;
  if (boxSizing === 'border-box') {
    contentW = Math.max(0, w - pl - pr - bw * 2);
    contentH = Math.max(0, h - pt - pb - bw * 2);
  } else {
    contentW = w;
    contentH = h;
  }

  const totalW = ml + bw + pl + contentW + pr + bw + mr;
  const totalH = mt + bw + pt + contentH + pb + bw + mb;

  const cssCode = useMemo(() => {
    const lines: string[] = ['.element {'];
    lines.push(`  width: ${w}px;`);
    lines.push(`  height: ${h}px;`);
    lines.push(`  box-sizing: ${boxSizing};`);
    lines.push(`  padding: ${pt}px ${pr}px ${pb}px ${pl}px;`);
    lines.push(`  border: ${bw}px solid #fdd835;`);
    lines.push(`  margin: ${mt}px ${mr}px ${mb}px ${ml}px;`);
    lines.push('}');
    return lines.join('\n');
  }, [w, h, boxSizing, pt, pr, pb, pl, bw, mt, mr, mb, ml]);

  return (
    <PageContainer>
      <LeftPanel>
        <PanelHeader>
          <div>
            <Title>Box Model Visualizer</Title>
            <Subtitle>Explore margin, border, padding, and content</Subtitle>
          </div>
          <PresetSelector presets={BOX_MODEL_PRESETS} selectedIndex={presetIndex} onChange={handlePresetChange} />
        </PanelHeader>
        <PropertyPanel properties={BOX_MODEL_PROPS} values={values} onChange={handlePropChange} />
        <CssOutput>{cssCode}</CssOutput>
      </LeftPanel>

      <RightPanel>
        <BoxModelViz>
          <BoxLabel $color="#ff9800">Total: {totalW}px × {totalH}px</BoxLabel>

          <MarginBox style={{ padding: `${mt}px ${mr}px ${mb}px ${ml}px` }}>
            <EdgeLabel $pos="top">{mt}</EdgeLabel>
            <EdgeLabel $pos="right">{mr}</EdgeLabel>
            <EdgeLabel $pos="bottom">{mb}</EdgeLabel>
            <EdgeLabel $pos="left">{ml}</EdgeLabel>

            <BorderBox style={{
              borderWidth: bw,
              borderStyle: 'solid',
              borderColor: '#fdd835',
              width: bw * 2 + pl + contentW + pr,
              height: bw * 2 + pt + contentH + pb,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <PaddingBox style={{ padding: `${pt}px ${pr}px ${pb}px ${pl}px`, position: 'relative' }}>
                <EdgeLabel $pos="top">{pt}</EdgeLabel>
                <EdgeLabel $pos="right">{pr}</EdgeLabel>
                <EdgeLabel $pos="bottom">{pb}</EdgeLabel>
                <EdgeLabel $pos="left">{pl}</EdgeLabel>

                <ContentBox style={{ width: contentW, height: contentH, minWidth: 40, minHeight: 30 }}>
                  <DimLabel>{contentW} × {contentH}</DimLabel>
                  <SizeLabel>content</SizeLabel>
                </ContentBox>
              </PaddingBox>
            </BorderBox>
          </MarginBox>

          <Legend>
            <LegendItem><LegendSwatch $color="rgba(255,152,0,0.25)" />Margin</LegendItem>
            <LegendItem><LegendSwatch $color="rgba(255,213,79,0.5)" />Border</LegendItem>
            <LegendItem><LegendSwatch $color="rgba(102,187,106,0.3)" />Padding</LegendItem>
            <LegendItem><LegendSwatch $color="rgba(66,165,245,0.3)" />Content</LegendItem>
          </Legend>

          <InfoText>
            {boxSizing === 'border-box'
              ? 'border-box: width/height includes padding + border. Content shrinks to fit.'
              : 'content-box: width/height is content only. Padding + border add to total size.'}
          </InfoText>
        </BoxModelViz>
      </RightPanel>
    </PageContainer>
  );
};
