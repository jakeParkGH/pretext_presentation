# Pretext Presentation (React + TypeScript)

> **Zero-Reflow Text Layout & Modern Browser Rendering Deep-Dive**  
> An interactive presentation deck built with **React 18**, **TypeScript**, and **Vite**, designed in the warm editorial paper aesthetic of [chenglou.me/pretext](https://chenglou.me/pretext/).

## 🚀 Quick Start

```bash
# Navigate to presentation directory
cd presentation

# Install dependencies (if not already installed)
pnpm install

# Start development server with HMR
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 📁 Architecture & Directory Structure

```
presentation/
├── index.html                     # HTML entry point with Newsreader & Pretendard web fonts
├── package.json                   # Dependencies: React 18, TypeScript, Vite
├── vite.config.ts                 # Path aliases (@chenglou/pretext -> ../dist/layout.js)
├── tsconfig.json                  # Strict TypeScript configuration
└── src/
    ├── main.tsx                   # React root mount
    ├── App.tsx                    # Root presentation layout & slide composition
    ├── index.css                  # Global typography, color tokens, animations
    ├── theme/
    │   └── tokens.ts              # Semantic theme tokens (chenglou.me palette)
    ├── types/
    │   └── presentation.ts        # SlideId types, navigation metadata
    ├── hooks/
    │   └── useSlideNav.ts         # Keyboard controls, scrollspy, smooth slide navigation
    ├── components/
    │   ├── common/                # Reusable presentation design system components
    │   │   ├── TopNav.tsx         # Sticky navigation header with active indicator & controls
    │   │   ├── Slide.tsx          # Full-bleed slide section container
    │   │   ├── Card.tsx           # Panel card variants (default, good, bad, accent)
    │   │   ├── Callout.tsx        # Highlighted callout blocks (warn, good)
    │   │   ├── VsBlock.tsx        # Side-by-side Bad vs Good comparison
    │   │   ├── CodeBlock.tsx      # Syntax-highlighted code container
    │   │   └── HudChip.tsx        # Metric status chips & badges
    │   └── slides/                # 11 Modular slide components in sequence
    │       ├── 01_IntroSlide.tsx
    │       ├── 02_ProblemSlide.tsx
    │       ├── 03_PipelineSlide.tsx
    │       ├── 04_QueuingSlide.tsx
    │       ├── 05_Demo1Slide.tsx  (Integrates 2-Phase Engine & BasicMeasure)
    │       ├── 06_Demo2Slide.tsx
    │       ├── 07_Demo3Slide.tsx
    │       ├── 08_Demo4Slide.tsx
    │       ├── 09_Demo5Slide.tsx
    │       ├── 10_SummarySlide.tsx
    │       └── 11_QASlide.tsx
    └── demos/                     # 5 Interactive Pretext engine demo widgets
        ├── engine.ts              # Pretext engine adapter & geometry calculation
        ├── basic-measure/         # Demo 1: Cold/Hot Path performance test
        ├── accordion/             # Demo 2: Zero-reflow height transition
        ├── streaming/             # Demo 3: LLM token streaming & VSync defense
        ├── grid/                  # Demo 4: 100,000 cells virtualized layout caching
        └── shape-flow/            # Demo 5: Interactive 60fps obstacle text carving
```

## 🎨 Design Tokens

- `--page`: `#f5f1ea` (Warm paper texture background)
- `--panel`: `#fffdf8` (Clean cream panel background)
- `--ink`: `#201b18` (Warm dark ink body text)
- `--muted`: `#6d645d` (Earthy secondary text)
- `--rule`: `#d8cec3` (Soft dividing lines)
- `--accent`: `#955f3b` (Terracotta brown accent)
- `--green`: `#2b7a4b` (Zero-Reflow indicator)
- `--red`: `#b33927` (Forced Synchronous Layout warning)

## ⌨️ Keyboard Shortcuts

- `→` / `PageDown` / `Space`: Move to next slide
- `←` / `PageUp`: Move to previous slide
