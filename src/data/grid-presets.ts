import type { CssPreset } from './css-properties';

export const GRID_PRESETS: CssPreset[] = [
  { name: 'Equal 3 Columns', category: 'Basics', values: { 'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr', 'grid-template-rows': 'auto', 'gap': '8', 'justify-items': 'stretch', 'align-items': 'stretch', 'grid-auto-flow': 'row' } },
  { name: '2 Column Layout', category: 'Basics', values: { 'display': 'grid', 'grid-template-columns': '1fr 1fr', 'grid-template-rows': 'auto', 'gap': '12', 'justify-items': 'stretch', 'align-items': 'stretch', 'grid-auto-flow': 'row' } },
  { name: 'Sidebar Layout', category: 'Layouts', values: { 'display': 'grid', 'grid-template-columns': '200px 1fr', 'grid-template-rows': 'auto', 'gap': '16', 'justify-items': 'stretch', 'align-items': 'start', 'grid-auto-flow': 'row' } },
  { name: 'Holy Grail', category: 'Layouts', values: { 'display': 'grid', 'grid-template-columns': '150px 1fr 150px', 'grid-template-rows': 'auto 1fr auto', 'gap': '8', 'justify-items': 'stretch', 'align-items': 'stretch', 'grid-auto-flow': 'row' } },
  { name: 'Auto-fill', category: 'Responsive', values: { 'display': 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(100px, 1fr))', 'grid-template-rows': 'auto', 'gap': '10', 'justify-items': 'stretch', 'align-items': 'stretch', 'grid-auto-flow': 'row' } },
  { name: 'Dense Packing', category: 'Flow', values: { 'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr', 'grid-template-rows': 'auto', 'gap': '8', 'justify-items': 'stretch', 'align-items': 'stretch', 'grid-auto-flow': 'dense' } },
  { name: 'Centered Items', category: 'Alignment', values: { 'display': 'grid', 'grid-template-columns': '1fr 1fr 1fr', 'grid-template-rows': 'auto', 'gap': '8', 'justify-items': 'center', 'align-items': 'center', 'grid-auto-flow': 'row' } },
];
