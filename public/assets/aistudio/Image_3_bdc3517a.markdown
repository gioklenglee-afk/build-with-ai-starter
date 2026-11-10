---
name: Market Flow
colors:
  surface: '#10131c'
  surface-dim: '#10131c'
  surface-bright: '#363943'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181b24'
  surface-container: '#1c1f28'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#e0e2ee'
  on-surface-variant: '#c3c5d8'
  inverse-surface: '#e0e2ee'
  inverse-on-surface: '#2d303a'
  outline: '#8d90a2'
  outline-variant: '#434656'
  surface-tint: '#b6c4ff'
  primary: '#b6c4ff'
  on-primary: '#002780'
  primary-container: '#2962ff'
  on-primary-container: '#f7f5ff'
  inverse-primary: '#004ee8'
  secondary: '#66dabf'
  on-secondary: '#00382e'
  secondary-container: '#20a28a'
  on-secondary-container: '#003027'
  tertiary: '#ffb3b0'
  on-tertiary: '#680010'
  tertiary-container: '#da2237'
  on-tertiary-container: '#fff4f3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001550'
  on-primary-fixed-variant: '#003ab3'
  secondary-fixed: '#84f7db'
  secondary-fixed-dim: '#66dabf'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#005143'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#92001b'
  background: '#10131c'
  on-background: '#e0e2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-tabular-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.02em
  data-tabular-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  data-tabular-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  label-caps:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.06em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.5rem
  gutter-md: 0.75rem
  gutter-lg: 1rem
  margin: 0.5rem
  margin-md: 1rem
  margin-lg: 1.25rem
  space-xxs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for professional market intelligence, institutional trading desks, and precision retail charting. The emotional posture is calculated, immediate, and authoritative—striking a balance between dense data legibility and zero visual friction during high-volatility sessions.

The aesthetic fuses **Precision Utilitarian Minimalism** with **Financial Instrument Tactility**. Rather than treating dark mode as an aesthetic layer, it serves as a high-contrast canvas that reduces retinal fatigue over extended monitoring sessions. Critical market telemetry relies on universally recognized optical green and red signals, balanced by an active electric blue focus state. Structural hairline grids eliminate ambiguity, delivering an uncluttered, mission-critical workspace.

## Colors

The palette uses a calibrated dark tonal ladder engineered specifically to prevent glare while maintaining distinct component boundaries:

- **Canvas & Surface Architecture**:
  - `Base / Canvas`: `#131722` (Deep graphite ground)
  - `Surface Tier 1 (Cards, panels, side rails)`: `#1e222d`
  - `Surface Tier 2 (Hover states, nested containers)`: `#2a2e39`
  - `Border / Hairline Dividers`: `#2a2e39` (default), `#363a45` (elevated / active dividers)
- **Signal & Accent Semantics**:
  - `Primary Interactive / Focus`: `#2962ff` (TradingView electric blue for active tabs, primary actions, focused strokes)
  - `Bullish / Positive Delta`: `#089981` (Signature financial deep teal-green); highlight variant: `#22ab94`
  - `Bearish / Negative Delta`: `#f23645` (Vibrant execution red)
- **Monochrome & Text Hierarchy**:
  - `Primary Text / Maximum Emphasis`: `#ffffff`
  - `Default Data / Standard Reading`: `#d1d4dc`
  - `Muted / Axis Ticks / Timestamps / Inactive Badges`: `#787b86`

## Typography

The type stack is tuned for maximum tabular scanability and information density. 

- **Primary Interface Font**: Inter handles narrative structure, labels, panel headers, and contextual metadata.
- **Tabular & Numerics Font**: JetBrains Mono is strictly enforced for stock prices, percentages, volumes, bid/ask spreads, and chart crosshair readouts. `font-feature-settings: "tnum" 1` must be active across all numeral renderings to prevent layout shifts during tick updates.
- **Micro Scales**: Capitalized micro-labels (`label-caps`) provide clear visual classification for tickers, exchange tags (e.g., NASDAQ, CME), and market phases without consuming vertical canvas space.

## Layout & Spacing

The layout model employs a tightly packed, zero-waste fluid grid system optimized for high-density multi-pane arrangements:

- **Desktop (1440px+)**: Multi-column modular arrangement. Master ticker tape locked to canvas ceiling; primary quadrant allocated to chart/market visualizer (8-9 cols), right rail allocated to real-time watchlist/order book (3-4 cols), and lower dock reserved for tabular screener data.
- **Tablet (768px - 1439px)**: Split-pane collapsible views with horizontal overflow carousels for metrics ribbons.
- **Mobile (< 768px)**: Single-column vertical stack with fixed bottom quick-navigation and edge-to-edge tabular data feeds.
- **Rhythm**: All inner container paddings conform to a 4px sub-grid baseline. Gaps between trading widgets are intentionally compressed to `0.5rem` to keep maximum market context visible above the fold.

## Elevation & Depth

Visual hierarchy is communicated through **structural tonal layering** and **crisp 1px boundary rules**, entirely bypassing conventional fuzzy shadows:

- **Layer 0 (Canvas)**: `#131722` serves as the global backdrop.
- **Layer 1 (Card/Panel Surface)**: `#1e222d` encased in a crisp `1px solid #2a2e39` border.
- **Layer 2 (Header, Inset Rows, Hover Containers)**: `#2a2e39` with high-contrast dividing strokes.
- **Floating Overlays (Flyout Menus, Crosshair Tooltips, Order Tickets)**: `#1e222d` reinforced by a dual border treatment: `1px solid #363a45` paired with a directional ambient drop shadow: `0 8px 24px rgba(0, 0, 0, 0.6)`. No colored glow effects are permitted except on active focused inputs (`box-shadow: 0 0 0 1px #2962ff`).

## Shapes

The design system maintains an intentional geometric discipline:
- **Base Components (Cards, Inputs, Data Tables)**: Set to `soft` (`4px` / `0.25rem`), preserving a structural, instrument-grade silhouette.
- **Pill Navigation & Market Status Badges**: Exceptionally set to `9999px` fully rounded pills to contrast against hard rectilinear chart panels and tabular data grids.
- **Action Buttons & Dropdown Controls**: Consistent `4px` radius to optimize available click area in dense toolbars.

## Components

### Ticker Tape Ribbon
- **Structure**: Continuous horizontal marquee strip at screen top (height: `36px`). Background `#131722`, border-bottom `1px solid #2a2e39`.
- **Items**: Symbol (`#ffffff`, bold), price (`#d1d4dc`, JetBrains Mono), percentage badge (`#089981` or `#f23645`). Hover pauses auto-scroll and triggers surface fill `#1e222d`.

### Quotes Table & Tabbed Screener
- **Row Styling**: Alternating hover fill `#2a2e39` over base `#1e222d`; padding `6px 12px`; bottom divider `1px solid #2a2e39`.
- **Columns**: Symbol + Icon left-aligned; Open, High, Low, Volume, Change right-aligned using tabular figures (`JetBrains Mono`).
- **Flash Animation**: On tick update, background flashes momentarily with `rgba(8, 153, 129, 0.15)` for uptick or `rgba(242, 54, 69, 0.15)` for downtick.

### Buttons & Pill Navigation Badges
- **Pill Badges**: Height `24px`, radius `9999px`, padding `0 10px`. Inactive: background `transparent`, text `#787b86`, border `1px solid #363a45`. Active: background `#2962ff`, text `#ffffff`, border `1px solid #2962ff`.
- **Action Buttons**: Primary action fill `#2962ff`, hover `#1e53e5`, active `#1848cc`. Danger/Sell fill `#f23645`. Success/Buy fill `#089981`. Heights: `28px` (compact) and `34px` (standard).

### Candlestick Charts & Sparklines
- **Candlesticks**: Up-candle `#089981` (body + wick); Down-candle `#f23645` (body + wick). Chart background strictly `#131722` with grid lines `rgba(42, 46, 57, 0.5)`.
- **Sparklines**: Embedded table mini-charts (width `64px`, height `20px`). Unfilled single-line stroke `1.5px` colored green or red mapped to period delta.

### Market Status Indicator
- **Badge**: Status pill displaying live exchange connectivity (e.g., "MARKET OPEN"). Includes an animated 6px circular pulse dot (`#089981` with ring animation) or dormant static dot (`#787b86` for closed markets).

### Input Fields & Controls
- **Inputs**: Background `#131722`, border `1px solid #363a45`, text `#ffffff`, placeholder `#787b86`. On focus: border `#2962ff` with no default browser outline.
- **Segmented Timeframe Selectors (1D, 5D, 1M, 1Y, ALL)**: Unified segmented group wrapped in `#131722`; active item `#2a2e39` with text `#ffffff` and `4px` corner radius.