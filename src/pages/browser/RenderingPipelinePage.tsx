import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import {
  PIPELINE_STAGES,
  getPropertiesForStage,
  getExamplesForStage,
  STAGE_SPECIFIC_CONTENT,
} from "@data/rendering-pipeline";

const PAGE_HEIGHT = "calc(100vh - 48px)";

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
  width: 320px;
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
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }
`;

const PanelHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
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
  display: block;
  margin-top: 4px;
`;

const StageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const StageItem = styled.button<{ $active: boolean; $color: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid ${(p) => (p.$active ? p.$color : "transparent")};
  background: ${(p) => (p.$active ? `${p.$color}15` : "transparent")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  margin-bottom: 4px;

  &:hover {
    background: ${(p) => `${p.$color}10`};
  }
`;

const StageIcon = styled.span`
  font-size: 20px;
`;

const StageInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StageName = styled.div<{ $color: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.$color};
`;

const StageIO = styled.div`
  font-size: 10px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 2px;
`;

const StageArrow = styled.div`
  text-align: center;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 12px;
  padding: 2px 0;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.bg};
  overflow: hidden;
  min-width: 0;
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.panelBg};
  flex-shrink: 0;
  overflow-x: auto;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: ${(p) => (p.$active ? p.theme.colors.text : p.theme.colors.textMuted)};
  border-bottom: 2px solid ${(p) => (p.$active ? "#42a5f5" : "transparent")};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: ${(p) => p.theme.colors.text};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

// Pipeline Visualization
const PipelineViz = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StageCard = styled.div<{ $color: string; $active: boolean }>`
  background: ${(p) => p.theme.colors.cardBg};
  border: 2px solid ${(p) => (p.$active ? p.$color : p.theme.colors.border)};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${(p) => (p.$active ? `0 4px 20px ${p.$color}30` : p.theme.shadows.card)};
  transition: all 0.2s ease;
`;

const StageCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const StageCardIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(p) => `${p.$color}20`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const StageCardTitle = styled.div`
  flex: 1;
`;

const StageCardName = styled.h3<{ $color: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => p.$color};
  margin: 0;
`;

const StageCardFlow = styled.div`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 4px;
`;

const TriggerBadge = styled.span<{ $type: string }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${(p) => {
    switch (p.$type) {
      case "reflow":
        return "#ef535020";
      case "repaint":
        return "#ab47bc20";
      case "composite":
        return "#26a69a20";
      default:
        return "#42a5f520";
    }
  }};
  color: ${(p) => {
    switch (p.$type) {
      case "reflow":
        return "#ef5350";
      case "repaint":
        return "#ab47bc";
      case "composite":
        return "#26a69a";
      default:
        return "#42a5f5";
    }
  }};
`;

const StageDescription = styled.p`
  font-size: 14px;
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 16px 0;
`;

const TipsSection = styled.div`
  background: ${(p) => p.theme.colors.panelBg};
  border-radius: 8px;
  padding: 14px;
`;

const TipsTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TipsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: 1.8;
`;

const FlowArrowDown = styled.div`
  display: flex;
  justify-content: center;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 20px;
`;

// Property Impact Table
const ImpactTable = styled.div`
  background: ${(p) => p.theme.colors.cardBg};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.colors.border};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 80px 80px;
  gap: 8px;
  padding: 12px 16px;
  background: ${(p) => p.theme.colors.panelBg};
  font-size: 11px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled.div<{ $highlight?: string }>`
  display: grid;
  grid-template-columns: 1fr 80px 80px 80px;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => (p.$highlight ? `${p.$highlight}08` : "transparent")};
  font-size: 13px;
  align-items: center;
`;

const PropertyCell = styled.div`
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const ImpactCell = styled.div<{ $active: boolean }>`
  display: flex;
  justify-content: center;
`;

const ImpactDot = styled.div<{ $active: boolean; $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? p.$color : p.theme.colors.border)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
`;

const TableLegend = styled.div`
  display: flex;
  gap: 20px;
  padding: 12px 16px;
  background: ${(p) => p.theme.colors.panelBg};
  border-top: 1px solid ${(p) => p.theme.colors.border};
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: ${(p) => p.theme.colors.textSecondary};
`;

// Example Cards
const ExampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const ExampleCard = styled.div`
  background: ${(p) => p.theme.colors.cardBg};
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

const ExampleHeader = styled.div<{ $category: string }>`
  padding: 14px 16px;
  background: ${(p) => {
    switch (p.$category) {
      case "Reflow":
        return "#ef535015";
      case "Repaint":
        return "#ab47bc15";
      case "Composite":
        return "#26a69a15";
      default:
        return p.theme.colors.panelBg;
    }
  }};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const ExampleName = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

const ExampleCategory = styled.span<{ $category: string }>`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 8px;
  background: ${(p) => {
    switch (p.$category) {
      case "Reflow":
        return "#ef5350";
      case "Repaint":
        return "#ab47bc";
      case "Composite":
        return "#26a69a";
      default:
        return "#666";
    }
  }};
  color: white;
`;

const ExampleBody = styled.div`
  padding: 16px;
`;

const ExampleDesc = styled.p`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textSecondary};
  margin: 0 0 12px 0;
`;

const CodeBlock = styled.pre`
  background: ${(p) => p.theme.colors.codeBg};
  border-radius: 6px;
  padding: 10px 12px;
  font-family: "Fira Code", monospace;
  font-size: 11px;
  color: ${(p) => p.theme.colors.codeText};
  overflow-x: auto;
  margin: 0 0 12px 0;
`;

const ChangeFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const TriggerChip = styled.span<{ $type: string }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  background: ${(p) => {
    switch (p.$type) {
      case "layout":
        return "#ef5350";
      case "paint":
        return "#ab47bc";
      case "composite":
        return "#26a69a";
      default:
        return "#666";
    }
  }};
  color: white;
`;

// DOM Tree Visualization
const TreeContainer = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const TreePanel = styled.div`
  flex: 1;
  min-width: 0;
`;

const TreeTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TreeCode = styled.pre`
  background: ${(p) => p.theme.colors.codeBg};
  border-radius: 8px;
  padding: 16px;
  font-family: "Fira Code", monospace;
  font-size: 11px;
  color: ${(p) => p.theme.colors.codeText};
  overflow-x: auto;
  max-height: 400px;
  line-height: 1.6;
`;

const InfoBox = styled.div<{ $color: string }>`
  background: ${(p) => `${p.$color}10`};
  border-left: 4px solid ${(p) => p.$color};
  padding: 14px 16px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 20px;
`;

const InfoTitle = styled.div<{ $color: string }>`
  font-size: 13px;
  font-weight: 700;
  color: ${(p) => p.$color};
  margin-bottom: 6px;
`;

const InfoText = styled.div`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textSecondary};
  line-height: 1.6;
`;

type TabType = "overview" | "impact" | "examples" | "dom";

const ROUTE_TO_STAGE: Record<string, number> = {
  "/browser/parsing": 0,
  "/browser/cssom": 1,
  "/browser/render-tree": 2,
  "/browser/layout": 3,
  "/browser/paint": 4,
  "/browser/compositing": 5,
};

export const RenderingPipelinePage: React.FC = () => {
  const location = useLocation();
  const stageFromRoute = ROUTE_TO_STAGE[location.pathname];
  const [manualStage, setManualStage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Use route-based stage if no manual override, reset manual when route changes
  const activeStage = stageFromRoute !== undefined ? stageFromRoute : (manualStage ?? 0);

  const currentStage = PIPELINE_STAGES[activeStage];

  // Get stage-specific content
  const stageProperties = useMemo(() => getPropertiesForStage(currentStage.id), [currentStage.id]);
  const stageExamples = useMemo(() => getExamplesForStage(currentStage.id), [currentStage.id]);
  const stageContent = STAGE_SPECIFIC_CONTENT[currentStage.id];

  const handleStageClick = useCallback((index: number) => {
    setManualStage(index);
    setActiveTab("overview");
  }, []);

  return (
    <PageContainer>
      <LeftPanel>
        <PanelHeader>
          <Title>Browser Rendering Pipeline</Title>
          <Subtitle>How browsers turn HTML/CSS into pixels</Subtitle>
        </PanelHeader>
        <StageList>
          {PIPELINE_STAGES.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <StageItem $active={activeStage === index} $color={stage.color} onClick={() => handleStageClick(index)}>
                <StageIcon>{stage.icon}</StageIcon>
                <StageInfo>
                  <StageName $color={stage.color}>{stage.name}</StageName>
                  <StageIO>
                    {stage.input} → {stage.output}
                  </StageIO>
                </StageInfo>
              </StageItem>
              {index < PIPELINE_STAGES.length - 1 && <StageArrow>↓</StageArrow>}
            </React.Fragment>
          ))}
        </StageList>
      </LeftPanel>

      <RightPanel>
        <TabBar>
          <Tab $active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            {currentStage.shortName} Details
          </Tab>
          <Tab $active={activeTab === "impact"} onClick={() => setActiveTab("impact")}>
            CSS Properties
          </Tab>
          <Tab $active={activeTab === "examples"} onClick={() => setActiveTab("examples")}>
            Examples
          </Tab>
          <Tab $active={activeTab === "dom"} onClick={() => setActiveTab("dom")}>
            {currentStage.shortName} Visualization
          </Tab>
        </TabBar>

        <ContentArea>
          {activeTab === "overview" && (
            <PipelineViz>
              <InfoBox $color={currentStage.color}>
                <InfoTitle $color={currentStage.color}>
                  {currentStage.icon} {currentStage.name}
                </InfoTitle>
                <InfoText>{currentStage.description}</InfoText>
              </InfoBox>

              <StageCard $color={currentStage.color} $active={true}>
                <StageCardHeader>
                  <StageCardIcon $color={currentStage.color}>{currentStage.icon}</StageCardIcon>
                  <StageCardTitle>
                    <StageCardName $color={currentStage.color}>{currentStage.name}</StageCardName>
                    <StageCardFlow>
                      {currentStage.input} → {currentStage.output}
                    </StageCardFlow>
                  </StageCardTitle>
                  <TriggerBadge $type={currentStage.triggerType}>
                    {currentStage.triggerType === "all" ? "Initial Load" : currentStage.triggerType}
                  </TriggerBadge>
                </StageCardHeader>

                <StageDescription>{currentStage.description}</StageDescription>

                <TipsSection>
                  <TipsTitle>💡 Performance Tips</TipsTitle>
                  <TipsList>
                    {currentStage.performanceTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </TipsList>
                </TipsSection>
              </StageCard>

              {activeStage < PIPELINE_STAGES.length - 1 && (
                <>
                  <FlowArrowDown>⬇️</FlowArrowDown>
                  <StageCard $color={PIPELINE_STAGES[activeStage + 1].color} $active={false}>
                    <StageCardHeader>
                      <StageCardIcon $color={PIPELINE_STAGES[activeStage + 1].color}>
                        {PIPELINE_STAGES[activeStage + 1].icon}
                      </StageCardIcon>
                      <StageCardTitle>
                        <StageCardName $color={PIPELINE_STAGES[activeStage + 1].color}>
                          {PIPELINE_STAGES[activeStage + 1].name}
                        </StageCardName>
                        <StageCardFlow>
                          {PIPELINE_STAGES[activeStage + 1].input} → {PIPELINE_STAGES[activeStage + 1].output}
                        </StageCardFlow>
                      </StageCardTitle>
                    </StageCardHeader>
                  </StageCard>
                </>
              )}
            </PipelineViz>
          )}

          {activeTab === "impact" && (
            <>
              <InfoBox $color={currentStage.color}>
                <InfoTitle $color={currentStage.color}>
                  {currentStage.icon} CSS Properties for {currentStage.name}
                </InfoTitle>
                <InfoText>
                  {currentStage.id === "layout" &&
                    "These properties trigger layout recalculation (most expensive). Avoid changing them during animations."}
                  {currentStage.id === "paint" &&
                    "These properties skip layout but still require repainting. Less expensive than layout changes."}
                  {currentStage.id === "compositing" &&
                    "These properties only trigger compositing (cheapest). Perfect for smooth 60fps animations!"}
                  {!["layout", "paint", "compositing"].includes(currentStage.id) &&
                    "All CSS properties that affect rendering stages are shown below."}
                </InfoText>
              </InfoBox>

              <ImpactTable>
                <TableHeader>
                  <div>CSS Property</div>
                  <div style={{ textAlign: "center" }}>Layout</div>
                  <div style={{ textAlign: "center" }}>Paint</div>
                  <div style={{ textAlign: "center" }}>Composite</div>
                </TableHeader>
                {stageProperties.map((prop) => (
                  <TableRow
                    key={prop.property}
                    $highlight={prop.triggersLayout ? "#ef5350" : prop.triggersPaint ? "#ab47bc" : "#26a69a"}
                  >
                    <PropertyCell>{prop.property}</PropertyCell>
                    <ImpactCell $active={prop.triggersLayout}>
                      <ImpactDot $active={prop.triggersLayout} $color="#ef5350">
                        {prop.triggersLayout ? "✓" : ""}
                      </ImpactDot>
                    </ImpactCell>
                    <ImpactCell $active={prop.triggersPaint}>
                      <ImpactDot $active={prop.triggersPaint} $color="#ab47bc">
                        {prop.triggersPaint ? "✓" : ""}
                      </ImpactDot>
                    </ImpactCell>
                    <ImpactCell $active={prop.triggersComposite}>
                      <ImpactDot $active={prop.triggersComposite} $color="#26a69a">
                        {prop.triggersComposite ? "✓" : ""}
                      </ImpactDot>
                    </ImpactCell>
                  </TableRow>
                ))}
                <TableLegend>
                  <LegendItem>
                    <ImpactDot $active $color="#ef5350">
                      ✓
                    </ImpactDot>
                    Layout (Most Expensive)
                  </LegendItem>
                  <LegendItem>
                    <ImpactDot $active $color="#ab47bc">
                      ✓
                    </ImpactDot>
                    Paint Only
                  </LegendItem>
                  <LegendItem>
                    <ImpactDot $active $color="#26a69a">
                      ✓
                    </ImpactDot>
                    Composite Only (Cheapest)
                  </LegendItem>
                </TableLegend>
              </ImpactTable>
            </>
          )}

          {activeTab === "examples" && (
            <>
              <InfoBox $color={currentStage.color}>
                <InfoTitle $color={currentStage.color}>
                  {currentStage.icon} Examples for {currentStage.name}
                </InfoTitle>
                <InfoText>
                  {currentStage.id === "layout" &&
                    "These examples trigger layout recalculation. Layout changes cascade through paint and composite."}
                  {currentStage.id === "paint" &&
                    "These examples skip layout but trigger repaint. Less expensive than layout changes."}
                  {currentStage.id === "compositing" &&
                    "These examples only trigger compositing. This is the cheapest path - perfect for animations!"}
                  {!["layout", "paint", "compositing"].includes(currentStage.id) &&
                    "See how different CSS changes trigger different parts of the pipeline."}
                </InfoText>
              </InfoBox>

              <ExampleGrid>
                {stageExamples.map((example) => (
                  <ExampleCard key={example.name}>
                    <ExampleHeader $category={example.category}>
                      <ExampleName>
                        {example.name}
                        <ExampleCategory $category={example.category}>{example.category}</ExampleCategory>
                      </ExampleName>
                    </ExampleHeader>
                    <ExampleBody>
                      <ExampleDesc>{example.description}</ExampleDesc>
                      <CodeBlock>{example.css}</CodeBlock>
                      {example.changes.map((change, i) => (
                        <div key={i}>
                          <ExampleDesc>
                            <strong>{change.property}:</strong> {change.oldValue} → {change.newValue}
                          </ExampleDesc>
                          <ChangeFlow>
                            <span style={{ fontSize: 11, color: "#888" }}>Triggers:</span>
                            {change.triggers.map((trigger) => (
                              <TriggerChip key={trigger} $type={trigger}>
                                {trigger}
                              </TriggerChip>
                            ))}
                          </ChangeFlow>
                        </div>
                      ))}
                    </ExampleBody>
                  </ExampleCard>
                ))}
              </ExampleGrid>
            </>
          )}

          {activeTab === "dom" && stageContent && (
            <>
              <InfoBox $color={currentStage.color}>
                <InfoTitle $color={currentStage.color}>
                  {currentStage.icon} {stageContent.title}
                </InfoTitle>
                <InfoText>{stageContent.description}</InfoText>
              </InfoBox>

              <TreeContainer>
                {stageContent.codeTitle && stageContent.code && (
                  <TreePanel>
                    <TreeTitle>{stageContent.codeTitle}</TreeTitle>
                    <TreeCode>{stageContent.code}</TreeCode>
                  </TreePanel>
                )}
                {stageContent.secondCodeTitle && stageContent.secondCode && (
                  <TreePanel>
                    <TreeTitle>
                      <span style={{ color: currentStage.color }}>→</span> {stageContent.secondCodeTitle}
                    </TreeTitle>
                    <TreeCode>{stageContent.secondCode}</TreeCode>
                  </TreePanel>
                )}
              </TreeContainer>
            </>
          )}
        </ContentArea>
      </RightPanel>
    </PageContainer>
  );
};
