import type { CssPreset } from './css-properties';

export const FLEXBOX_PRESETS: CssPreset[] = [
  { name: 'Default', category: 'Basics', values: { 'display': 'flex', 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'stretch', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '8' } },
  { name: 'Center Everything', category: 'Basics', values: { 'display': 'flex', 'flex-direction': 'row', 'justify-content': 'center', 'align-items': 'center', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '8' } },
  { name: 'Space Between', category: 'Basics', values: { 'display': 'flex', 'flex-direction': 'row', 'justify-content': 'space-between', 'align-items': 'center', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '0' } },
  { name: 'Space Evenly', category: 'Basics', values: { 'display': 'flex', 'flex-direction': 'row', 'justify-content': 'space-evenly', 'align-items': 'center', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '0' } },
  { name: 'Column Layout', category: 'Direction', values: { 'display': 'flex', 'flex-direction': 'column', 'justify-content': 'flex-start', 'align-items': 'stretch', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '8' } },
  { name: 'Column Centered', category: 'Direction', values: { 'display': 'flex', 'flex-direction': 'column', 'justify-content': 'center', 'align-items': 'center', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '12' } },
  { name: 'Wrap with Gap', category: 'Wrapping', values: { 'display': 'flex', 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'flex-start', 'flex-wrap': 'wrap', 'align-content': 'flex-start', 'gap': '12' } },
  { name: 'Reverse Row', category: 'Direction', values: { 'display': 'flex', 'flex-direction': 'row-reverse', 'justify-content': 'flex-start', 'align-items': 'center', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '8' } },
  { name: 'End Aligned', category: 'Alignment', values: { 'display': 'flex', 'flex-direction': 'row', 'justify-content': 'flex-end', 'align-items': 'flex-end', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '8' } },
  { name: 'Baseline Align', category: 'Alignment', values: { 'display': 'flex', 'flex-direction': 'row', 'justify-content': 'center', 'align-items': 'baseline', 'flex-wrap': 'nowrap', 'align-content': 'normal', 'gap': '16' } },
];
