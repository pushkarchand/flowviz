export interface CssPropertyDef {
  name: string;
  label: string;
  type: 'select' | 'slider' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  default: string;
  category?: string;
}

export interface CssPreset {
  name: string;
  category: string;
  values: Record<string, string>;
}

// ─── FLEXBOX ───

export const FLEXBOX_CONTAINER_PROPS: CssPropertyDef[] = [
  { name: 'display', label: 'Display', type: 'select', options: ['flex', 'inline-flex'], default: 'flex', category: 'Container' },
  { name: 'flex-direction', label: 'Direction', type: 'select', options: ['row', 'row-reverse', 'column', 'column-reverse'], default: 'row', category: 'Container' },
  { name: 'justify-content', label: 'Justify Content', type: 'select', options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'], default: 'flex-start', category: 'Container' },
  { name: 'align-items', label: 'Align Items', type: 'select', options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'], default: 'stretch', category: 'Container' },
  { name: 'flex-wrap', label: 'Wrap', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'], default: 'nowrap', category: 'Container' },
  { name: 'align-content', label: 'Align Content', type: 'select', options: ['normal', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'], default: 'normal', category: 'Container' },
  { name: 'gap', label: 'Gap', type: 'slider', min: 0, max: 40, step: 2, unit: 'px', default: '8', category: 'Container' },
];

export const FLEXBOX_ITEM_PROPS: CssPropertyDef[] = [
  { name: 'flex-grow', label: 'Flex Grow', type: 'slider', min: 0, max: 5, step: 1, default: '0', category: 'Item' },
  { name: 'flex-shrink', label: 'Flex Shrink', type: 'slider', min: 0, max: 5, step: 1, default: '1', category: 'Item' },
  { name: 'flex-basis', label: 'Flex Basis', type: 'text', default: 'auto', category: 'Item' },
  { name: 'align-self', label: 'Align Self', type: 'select', options: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'], default: 'auto', category: 'Item' },
  { name: 'order', label: 'Order', type: 'slider', min: -3, max: 3, step: 1, default: '0', category: 'Item' },
];

// ─── GRID ───

export const GRID_CONTAINER_PROPS: CssPropertyDef[] = [
  { name: 'display', label: 'Display', type: 'select', options: ['grid', 'inline-grid'], default: 'grid', category: 'Container' },
  { name: 'grid-template-columns', label: 'Columns', type: 'text', default: '1fr 1fr 1fr', category: 'Container' },
  { name: 'grid-template-rows', label: 'Rows', type: 'text', default: 'auto', category: 'Container' },
  { name: 'gap', label: 'Gap', type: 'slider', min: 0, max: 40, step: 2, unit: 'px', default: '8', category: 'Container' },
  { name: 'justify-items', label: 'Justify Items', type: 'select', options: ['start', 'end', 'center', 'stretch'], default: 'stretch', category: 'Container' },
  { name: 'align-items', label: 'Align Items', type: 'select', options: ['start', 'end', 'center', 'stretch'], default: 'stretch', category: 'Container' },
  { name: 'grid-auto-flow', label: 'Auto Flow', type: 'select', options: ['row', 'column', 'dense', 'row dense', 'column dense'], default: 'row', category: 'Container' },
];

export const GRID_ITEM_PROPS: CssPropertyDef[] = [
  { name: 'grid-column', label: 'Grid Column', type: 'text', default: 'auto', category: 'Item' },
  { name: 'grid-row', label: 'Grid Row', type: 'text', default: 'auto', category: 'Item' },
  { name: 'justify-self', label: 'Justify Self', type: 'select', options: ['auto', 'start', 'end', 'center', 'stretch'], default: 'auto', category: 'Item' },
  { name: 'align-self', label: 'Align Self', type: 'select', options: ['auto', 'start', 'end', 'center', 'stretch'], default: 'auto', category: 'Item' },
];

// ─── POSITIONING ───

export const POSITIONING_PROPS: CssPropertyDef[] = [
  { name: 'position', label: 'Position', type: 'select', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'], default: 'static', category: 'Position' },
  { name: 'top', label: 'Top', type: 'text', default: 'auto', category: 'Offset' },
  { name: 'right', label: 'Right', type: 'text', default: 'auto', category: 'Offset' },
  { name: 'bottom', label: 'Bottom', type: 'text', default: 'auto', category: 'Offset' },
  { name: 'left', label: 'Left', type: 'text', default: 'auto', category: 'Offset' },
  { name: 'z-index', label: 'Z-Index', type: 'slider', min: -5, max: 10, step: 1, default: 'auto', category: 'Stacking' },
];

// ─── BOX MODEL ───

export const BOX_MODEL_PROPS: CssPropertyDef[] = [
  { name: 'width', label: 'Width', type: 'slider', min: 50, max: 400, step: 10, unit: 'px', default: '200', category: 'Size' },
  { name: 'height', label: 'Height', type: 'slider', min: 50, max: 400, step: 10, unit: 'px', default: '200', category: 'Size' },
  { name: 'box-sizing', label: 'Box Sizing', type: 'select', options: ['content-box', 'border-box'], default: 'content-box', category: 'Size' },
  { name: 'padding-top', label: 'Padding Top', type: 'slider', min: 0, max: 60, step: 2, unit: 'px', default: '20', category: 'Padding' },
  { name: 'padding-right', label: 'Padding Right', type: 'slider', min: 0, max: 60, step: 2, unit: 'px', default: '20', category: 'Padding' },
  { name: 'padding-bottom', label: 'Padding Bottom', type: 'slider', min: 0, max: 60, step: 2, unit: 'px', default: '20', category: 'Padding' },
  { name: 'padding-left', label: 'Padding Left', type: 'slider', min: 0, max: 60, step: 2, unit: 'px', default: '20', category: 'Padding' },
  { name: 'border-width', label: 'Border Width', type: 'slider', min: 0, max: 20, step: 1, unit: 'px', default: '4', category: 'Border' },
  { name: 'margin-top', label: 'Margin Top', type: 'slider', min: 0, max: 60, step: 2, unit: 'px', default: '16', category: 'Margin' },
  { name: 'margin-right', label: 'Margin Right', type: 'slider', min: 0, max: 60, step: 2, unit: 'px', default: '16', category: 'Margin' },
  { name: 'margin-bottom', label: 'Margin Bottom', type: 'slider', min: 0, max: 60, step: 2, unit: 'px', default: '16', category: 'Margin' },
  { name: 'margin-left', label: 'Margin Left', type: 'slider', min: 0, max: 60, step: 2, unit: 'px', default: '16', category: 'Margin' },
];
