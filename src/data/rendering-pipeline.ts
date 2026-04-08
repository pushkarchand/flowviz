export interface PipelineStage {
  id: string;
  name: string;
  shortName: string;
  description: string;
  details: string[];
  input: string;
  output: string;
  color: string;
  icon: string;
  performanceTips: string[];
  triggerType: 'reflow' | 'repaint' | 'composite' | 'all';
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'parsing',
    name: 'HTML Parsing',
    shortName: 'Parse',
    description: 'The browser parses HTML and builds the Document Object Model (DOM) tree. Each HTML element becomes a node in the tree.',
    details: [
      'The browser reads raw bytes from the network and converts them to characters based on encoding (UTF-8)',
      'Characters are tokenized into HTML tokens (<html>, <head>, <body>, text, etc.)',
      'Tokens are converted into Node objects with properties and rules',
      'Nodes are linked into a tree structure - the DOM (Document Object Model)',
      'Scripts can block parsing unless marked async/defer',
      'The DOM is an in-memory representation that JavaScript can manipulate',
    ],
    input: 'HTML Document',
    output: 'DOM Tree',
    color: '#42a5f5',
    icon: '📄',
    performanceTips: [
      'Minimize HTML document size',
      'Avoid deeply nested elements',
      'Use async/defer for scripts to avoid blocking',
      'Place scripts at the end of body or use modules',
    ],
    triggerType: 'all',
  },
  {
    id: 'cssom',
    name: 'CSSOM Construction',
    shortName: 'CSSOM',
    description: 'CSS is parsed and the CSS Object Model (CSSOM) tree is built. Styles are computed and inheritance is resolved.',
    details: [
      'Browser fetches CSS from <link> tags, <style> blocks, and inline styles',
      'CSS bytes are converted to characters, then tokenized into CSS tokens',
      'Tokens are parsed into CSS rules with selectors and declarations',
      'Rules are organized into the CSSOM (CSS Object Model) tree structure',
      'Cascade, specificity, and inheritance are resolved to compute final styles',
      'CSSOM construction is render-blocking - browser waits before painting',
    ],
    input: 'CSS Stylesheets',
    output: 'CSSOM Tree',
    color: '#66bb6a',
    icon: '🎨',
    performanceTips: [
      'Minimize CSS file size and complexity',
      'Avoid @import, use <link> instead',
      'Remove unused CSS rules',
      'Use efficient selectors (avoid deep nesting)',
    ],
    triggerType: 'all',
  },
  {
    id: 'render-tree',
    name: 'Render Tree Construction',
    shortName: 'Render',
    description: 'DOM and CSSOM are combined to create the Render Tree. Only visible elements are included (display:none excluded).',
    details: [
      'Browser traverses the DOM tree starting from the root',
      'For each visible node, it finds and applies matching CSSOM rules',
      'Nodes with display:none are excluded (not in render tree at all)',
      'Nodes with visibility:hidden ARE included (they occupy space)',
      'Pseudo-elements (::before, ::after) are added to the render tree',
      'The render tree contains only what\'s needed for visual rendering',
    ],
    input: 'DOM + CSSOM',
    output: 'Render Tree',
    color: '#ffa726',
    icon: '🌳',
    performanceTips: [
      'Reduce DOM size (fewer nodes = faster)',
      'Avoid forced synchronous layouts',
      'Batch DOM reads and writes separately',
      'Use visibility:hidden over display:none for animations',
    ],
    triggerType: 'all',
  },
  {
    id: 'layout',
    name: 'Layout (Reflow)',
    shortName: 'Layout',
    description: 'The browser calculates the exact position and size of each element. Also called "reflow" - this is expensive!',
    details: [
      'Starting from the root, browser calculates geometry of each element',
      'Box model is computed: content, padding, border, margin',
      'Position is determined based on flow, positioning, and ancestors',
      'Width/height calculations consider percentage values, auto, viewport',
      'Flexbox/Grid containers compute child placement',
      'This is the most computationally expensive step - minimize reflows!',
    ],
    input: 'Render Tree',
    output: 'Layout Tree (Box Model)',
    color: '#ef5350',
    icon: '📐',
    performanceTips: [
      'Avoid layout thrashing (read then write)',
      'Use transform instead of top/left',
      'Batch style changes with classList',
      'Use requestAnimationFrame for animations',
      'Avoid table layouts for non-tabular data',
    ],
    triggerType: 'reflow',
  },
  {
    id: 'paint',
    name: 'Paint',
    shortName: 'Paint',
    description: 'The browser fills in pixels - drawing text, colors, images, borders, shadows. Creates paint records.',
    details: [
      'Browser creates a list of draw calls (paint records)',
      'Text is rasterized using font metrics and styling',
      'Colors, gradients, and images are drawn',
      'Borders, shadows, and outlines are rendered',
      'Paint happens on layers - some elements get their own layer',
      'Complex paints (shadows, filters) are more expensive',
    ],
    input: 'Layout Tree',
    output: 'Paint Records',
    color: '#ab47bc',
    icon: '🖌️',
    performanceTips: [
      'Reduce paint areas (use will-change sparingly)',
      'Simplify paint complexity (avoid expensive shadows)',
      'Use opacity and transform for animations',
      'Promote animated elements to own layer',
    ],
    triggerType: 'repaint',
  },
  {
    id: 'compositing',
    name: 'Compositing',
    shortName: 'Composite',
    description: 'Layers are combined in the correct order. GPU-accelerated transforms and opacity happen here - the fastest path!',
    details: [
      'Elements are organized into compositing layers',
      'Layers are uploaded to the GPU as textures',
      'The GPU composites layers together in the correct z-order',
      'Transform and opacity changes happen entirely on the GPU',
      'No reflow or repaint needed - just layer manipulation',
      'This is the "golden path" for smooth 60fps animations',
    ],
    input: 'Paint Records + Layers',
    output: 'Final Pixels on Screen',
    color: '#26a69a',
    icon: '🎬',
    performanceTips: [
      'Use transform and opacity for animations',
      'Promote elements with will-change (use sparingly)',
      'Avoid too many layers (memory cost)',
      'Use compositor-only properties when possible',
    ],
    triggerType: 'composite',
  },
];

export interface CSSPropertyImpact {
  property: string;
  triggersLayout: boolean;
  triggersPaint: boolean;
  triggersComposite: boolean;
  examples: string[];
}

export const CSS_PROPERTY_IMPACTS: CSSPropertyImpact[] = [
  // Layout triggers (most expensive)
  { property: 'width', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['width: 100px', 'width: 50%'] },
  { property: 'height', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['height: 200px', 'height: auto'] },
  { property: 'padding', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['padding: 10px', 'padding: 1em 2em'] },
  { property: 'margin', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['margin: 20px', 'margin: auto'] },
  { property: 'display', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['display: flex', 'display: none'] },
  { property: 'position', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['position: absolute', 'position: fixed'] },
  { property: 'top/left/right/bottom', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['top: 10px', 'left: 50%'] },
  { property: 'font-size', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['font-size: 16px', 'font-size: 1.2em'] },
  { property: 'flex', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['flex: 1', 'flex-grow: 2'] },
  { property: 'grid', triggersLayout: true, triggersPaint: true, triggersComposite: true, examples: ['grid-template-columns: 1fr 1fr'] },

  // Paint-only triggers (medium cost)
  { property: 'color', triggersLayout: false, triggersPaint: true, triggersComposite: true, examples: ['color: red', 'color: #333'] },
  { property: 'background', triggersLayout: false, triggersPaint: true, triggersComposite: true, examples: ['background: blue', 'background-image: url()'] },
  { property: 'border-color', triggersLayout: false, triggersPaint: true, triggersComposite: true, examples: ['border-color: green'] },
  { property: 'box-shadow', triggersLayout: false, triggersPaint: true, triggersComposite: true, examples: ['box-shadow: 0 2px 4px rgba(0,0,0,0.2)'] },
  { property: 'border-radius', triggersLayout: false, triggersPaint: true, triggersComposite: true, examples: ['border-radius: 8px'] },
  { property: 'outline', triggersLayout: false, triggersPaint: true, triggersComposite: true, examples: ['outline: 2px solid blue'] },
  { property: 'visibility', triggersLayout: false, triggersPaint: true, triggersComposite: true, examples: ['visibility: hidden'] },

  // Composite-only triggers (cheapest - GPU accelerated)
  { property: 'transform', triggersLayout: false, triggersPaint: false, triggersComposite: true, examples: ['transform: translateX(10px)', 'transform: scale(1.1)'] },
  { property: 'opacity', triggersLayout: false, triggersPaint: false, triggersComposite: true, examples: ['opacity: 0.5', 'opacity: 0'] },
  { property: 'filter', triggersLayout: false, triggersPaint: false, triggersComposite: true, examples: ['filter: blur(5px)', 'filter: grayscale(1)'] },
];

export interface RenderingExample {
  name: string;
  category: string;
  description: string;
  html: string;
  css: string;
  changes: {
    description: string;
    property: string;
    oldValue: string;
    newValue: string;
    triggers: ('layout' | 'paint' | 'composite')[];
  }[];
}

export const RENDERING_EXAMPLES: RenderingExample[] = [
  {
    name: 'Layout Change',
    category: 'Reflow',
    description: 'Changing width triggers full pipeline',
    html: '<div class="box">Content</div>',
    css: '.box { width: 100px; height: 100px; background: #42a5f5; }',
    changes: [
      {
        description: 'Changing width requires recalculating layout',
        property: 'width',
        oldValue: '100px',
        newValue: '200px',
        triggers: ['layout', 'paint', 'composite'],
      },
    ],
  },
  {
    name: 'Color Change',
    category: 'Repaint',
    description: 'Changing color skips layout',
    html: '<div class="box">Content</div>',
    css: '.box { width: 100px; height: 100px; background: #42a5f5; }',
    changes: [
      {
        description: 'Changing color only needs repaint',
        property: 'background',
        oldValue: '#42a5f5',
        newValue: '#ef5350',
        triggers: ['paint', 'composite'],
      },
    ],
  },
  {
    name: 'Transform Animation',
    category: 'Composite',
    description: 'Transform only needs compositing',
    html: '<div class="box">Content</div>',
    css: '.box { width: 100px; height: 100px; background: #42a5f5; }',
    changes: [
      {
        description: 'Transform is GPU-accelerated, cheapest option',
        property: 'transform',
        oldValue: 'none',
        newValue: 'translateX(100px)',
        triggers: ['composite'],
      },
    ],
  },
  {
    name: 'Opacity Fade',
    category: 'Composite',
    description: 'Opacity is compositor-only',
    html: '<div class="box">Content</div>',
    css: '.box { width: 100px; height: 100px; background: #42a5f5; opacity: 1; }',
    changes: [
      {
        description: 'Opacity changes happen on the GPU',
        property: 'opacity',
        oldValue: '1',
        newValue: '0.5',
        triggers: ['composite'],
      },
    ],
  },
];

export const DOM_TREE_EXAMPLE = {
  html: `<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header>
      <h1>Welcome</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
    <main>
      <article>
        <h2>Article Title</h2>
        <p>Some content here...</p>
      </article>
    </main>
  </body>
</html>`,
  css: `body {
  font-family: sans-serif;
  margin: 0;
}

header {
  background: #1976d2;
  color: white;
  padding: 20px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

nav a {
  color: white;
  margin-right: 10px;
}

main {
  padding: 20px;
}

article h2 {
  color: #333;
}

p {
  line-height: 1.6;
}`,
};

// Stage-specific content for DOM & CSSOM tab
export interface StageContent {
  title: string;
  description: string;
  codeTitle?: string;
  code?: string;
  secondCodeTitle?: string;
  secondCode?: string;
  visualization?: string;
}

export const STAGE_SPECIFIC_CONTENT: Record<string, StageContent> = {
  parsing: {
    title: 'HTML Parsing → DOM Tree',
    description: 'The browser reads HTML bytes, converts them to characters, tokenizes them into tags, and builds the DOM tree. Each element becomes a node.',
    codeTitle: '📄 HTML Input',
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <header>
      <h1>Welcome</h1>
    </header>
    <main>
      <p>Hello World</p>
    </main>
  </body>
</html>`,
    secondCodeTitle: '🌳 DOM Tree Output',
    secondCode: `Document
├── html
│   ├── head
│   │   └── title
│   │       └── "My Page"
│   └── body
│       ├── header
│       │   └── h1
│       │       └── "Welcome"
│       └── main
│           └── p
│               └── "Hello World"`,
  },
  cssom: {
    title: 'CSS Parsing → CSSOM Tree',
    description: 'CSS is parsed into the CSS Object Model. The browser computes styles, resolves inheritance, and creates the style rules tree.',
    codeTitle: '🎨 CSS Input',
    code: `body {
  font-family: sans-serif;
  margin: 0;
}

header {
  background: #1976d2;
  padding: 20px;
}

h1 {
  color: white;
  font-size: 24px;
}

p {
  line-height: 1.6;
  color: #333;
}`,
    secondCodeTitle: '🌲 CSSOM Tree Output',
    secondCode: `StyleSheetList
└── CSSStyleSheet
    ├── CSSStyleRule (body)
    │   ├── font-family: sans-serif
    │   └── margin: 0
    ├── CSSStyleRule (header)
    │   ├── background: #1976d2
    │   └── padding: 20px
    ├── CSSStyleRule (h1)
    │   ├── color: white
    │   └── font-size: 24px
    └── CSSStyleRule (p)
        ├── line-height: 1.6
        └── color: #333`,
  },
  'render-tree': {
    title: 'DOM + CSSOM → Render Tree',
    description: 'The DOM and CSSOM are combined to create the Render Tree. Only visible elements are included - elements with display:none are excluded.',
    codeTitle: '🔗 DOM + CSSOM Combined',
    code: `// DOM Node: <header>
// + CSSOM Rule: header { background: #1976d2; padding: 20px; }
// = Render Object with computed styles

// DOM Node: <h1>Welcome</h1>
// + CSSOM Rule: h1 { color: white; font-size: 24px; }
// + Inherited: font-family: sans-serif
// = Render Object with all computed styles`,
    secondCodeTitle: '🌳 Render Tree',
    secondCode: `RenderView
└── RenderBody (font-family: sans-serif)
    ├── RenderBlock <header>
    │   │ background: #1976d2
    │   │ padding: 20px
    │   └── RenderBlock <h1>
    │       │ color: white
    │       │ font-size: 24px
    │       └── RenderText "Welcome"
    └── RenderBlock <main>
        └── RenderBlock <p>
            │ line-height: 1.6
            │ color: #333
            └── RenderText "Hello World"

Note: Elements with display:none are NOT in the Render Tree`,
  },
  layout: {
    title: 'Layout Calculation (Reflow)',
    description: 'The browser calculates exact positions and sizes. This "reflow" process determines where everything goes on the page using the box model.',
    codeTitle: '📐 Layout Input (Render Tree)',
    code: `RenderBlock <header>
  - display: block
  - padding: 20px
  - width: auto (100% of parent)

RenderBlock <h1>
  - display: block
  - font-size: 24px
  - margin: default (user-agent)`,
    secondCodeTitle: '📦 Layout Output (Box Positions)',
    secondCode: `Layout Tree with Geometry:
─────────────────────────────
<header>
  x: 0, y: 0
  width: 1200px, height: 64px
  content-box: 1160 × 24 (after padding)
  
  └── <h1> "Welcome"
      x: 20, y: 20
      width: 1160px, height: 24px
      
<main>
  x: 0, y: 64
  width: 1200px, height: auto
  
  └── <p> "Hello World"
      x: 20, y: 84
      width: 1160px, height: 24px`,
  },
  paint: {
    title: 'Paint Records Creation',
    description: 'The browser creates a list of draw calls (paint records) for each visual element. It figures out what to draw and in what order.',
    codeTitle: '🖌️ Paint Records Generated',
    code: `// Paint order (back to front):
PaintRecord[] = [
  { type: 'background', 
    element: 'header',
    color: '#1976d2', 
    rect: {0, 0, 1200, 64} },
    
  { type: 'text', 
    element: 'h1',
    content: 'Welcome',
    color: 'white',
    font: '24px sans-serif',
    position: {20, 20} },
    
  { type: 'background',
    element: 'main', 
    color: 'transparent',
    rect: {0, 64, 1200, auto} },
    
  { type: 'text',
    element: 'p',
    content: 'Hello World',
    color: '#333',
    font: '16px sans-serif',
    position: {20, 84} }
]`,
    secondCodeTitle: '🎯 Paint Layers',
    secondCode: `Layer Tree:
─────────────────────────────
Root Layer (document)
├── Background Layer
│   └── Paint: body background (white)
│
├── Content Layer (header)
│   ├── Paint: blue background
│   └── Paint: white text "Welcome"
│
└── Content Layer (main)
    └── Paint: gray text "Hello World"

Properties that cause new layers:
- position: fixed
- will-change: transform
- 3D transforms
- opacity < 1 (sometimes)`,
  },
  compositing: {
    title: 'Layer Compositing',
    description: 'Painted layers are combined (composited) in the correct order by the GPU. This is the fastest stage for animations!',
    codeTitle: '🎬 Compositor Input (Layers)',
    code: `// Layers to composite:
Layer 1: Root (z-index: 0)
  - Contains: body background
  
Layer 2: Header (z-index: 0)
  - Contains: header background + text
  - Position: (0, 0)
  
Layer 3: Main Content (z-index: 0)
  - Contains: main content
  - Position: (0, 64)
  
// GPU Operations:
- Rasterize each layer to texture
- Upload textures to GPU memory
- Composite in correct z-order`,
    secondCodeTitle: '✨ GPU-Accelerated Properties',
    secondCode: `Compositor-Only Properties (FAST!):
─────────────────────────────
transform: translateX(100px)
  → GPU moves layer, no repaint!
  
transform: scale(1.5)
  → GPU scales texture, no repaint!
  
transform: rotate(45deg)
  → GPU rotates layer, no repaint!
  
opacity: 0.5
  → GPU changes alpha, no repaint!

These skip Layout AND Paint entirely!
Perfect for 60fps animations.

Example Animation (smooth):
.element {
  transition: transform 0.3s, opacity 0.3s;
}
.element:hover {
  transform: scale(1.1);
  opacity: 0.8;
}`,
  },
};

// Get CSS properties relevant to a specific stage
export function getPropertiesForStage(stageId: string): CSSPropertyImpact[] {
  switch (stageId) {
    case 'layout':
      // Show properties that trigger layout
      return CSS_PROPERTY_IMPACTS.filter(p => p.triggersLayout);
    case 'paint':
      // Show properties that trigger paint but NOT layout
      return CSS_PROPERTY_IMPACTS.filter(p => p.triggersPaint && !p.triggersLayout);
    case 'compositing':
      // Show properties that only trigger composite
      return CSS_PROPERTY_IMPACTS.filter(p => !p.triggersLayout && !p.triggersPaint);
    default:
      // For parsing, cssom, render-tree - show all as they're initial stages
      return CSS_PROPERTY_IMPACTS;
  }
}

// Get examples relevant to a specific stage
export function getExamplesForStage(stageId: string): RenderingExample[] {
  switch (stageId) {
    case 'layout':
      return RENDERING_EXAMPLES.filter(e => e.category === 'Reflow');
    case 'paint':
      return RENDERING_EXAMPLES.filter(e => e.category === 'Repaint');
    case 'compositing':
      return RENDERING_EXAMPLES.filter(e => e.category === 'Composite');
    default:
      // For initial stages, show all examples
      return RENDERING_EXAMPLES;
  }
}
