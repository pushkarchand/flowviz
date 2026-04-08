import type { CssPreset } from './css-properties';

export const POSITIONING_PRESETS: CssPreset[] = [
  { name: 'Static (Default)', category: 'Basics', values: { 'position': 'static', 'top': 'auto', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'z-index': 'auto' } },
  { name: 'Relative Offset', category: 'Basics', values: { 'position': 'relative', 'top': '20px', 'right': 'auto', 'bottom': 'auto', 'left': '20px', 'z-index': 'auto' } },
  { name: 'Absolute Top-Right', category: 'Absolute', values: { 'position': 'absolute', 'top': '10px', 'right': '10px', 'bottom': 'auto', 'left': 'auto', 'z-index': '1' } },
  { name: 'Absolute Centered', category: 'Absolute', values: { 'position': 'absolute', 'top': '50%', 'right': 'auto', 'bottom': 'auto', 'left': '50%', 'z-index': '1' } },
  { name: 'Fixed Bottom', category: 'Fixed', values: { 'position': 'fixed', 'top': 'auto', 'right': '0', 'bottom': '0', 'left': '0', 'z-index': '10' } },
  { name: 'Sticky Top', category: 'Sticky', values: { 'position': 'sticky', 'top': '0', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'z-index': '5' } },
  { name: 'Z-Index Stacking', category: 'Stacking', values: { 'position': 'relative', 'top': '0', 'right': 'auto', 'bottom': 'auto', 'left': '0', 'z-index': '5' } },
];
