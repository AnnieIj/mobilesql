/**
 * MobileSQL — LOCKED Visual Identity & Theme Tokens
 * Design Language: Elegant Dark (Linear / Raycast / Vercel / Stripe Aesthetic)
 */

export const ELEGANT_DARK_THEME = {
  colors: {
    // Surfaces
    background: '#131315',         // Obsidian Zinc Base
    surfaceSecondary: '#1B1B1E',   // Secondary Surface
    surfaceElevated: '#232326',    // Elevated Surface / Floating Cards
    editorBg: '#09090B',           // Deep SQL Canvas
    
    // Borders
    border: '#2D2D31',             // Default Subtle Hairline Border
    borderHover: '#3F3F46',        // Subtle Hover Border
    borderAccent: 'rgba(98, 223, 125, 0.3)', // Accent Highlight Border

    // Accents
    primary: '#62DF7D',            // Matrix Emerald Accent
    primaryHover: '#79F292',       // Matrix Emerald Hover
    primaryGlow: 'rgba(98, 223, 125, 0.15)',

    // Functional Tokens
    success: '#22C55E',            // Success Green
    warning: '#F59E0B',            // Warning Amber
    error: '#EF4444',              // Error Red
    info: '#3B82F6',               // Info Blue

    // Typography
    textPrimary: '#FFFFFF',        // Primary High Contrast Text
    textSecondary: '#C8C8CC',      // Readable Secondary Text
    textMuted: '#8A8A90',          // Subtitle / Muted Label Gray
  },

  typography: {
    fontSans: 'Inter, Geist, -apple-system, BlinkMacSystemFont, sans-serif',
    fontDisplay: 'Geist, Inter, sans-serif',
    fontMono: 'JetBrains Mono, Menlo, monospace',
  },

  glassmorphism: {
    dock: 'backdrop-blur-xl bg-[#131315]/85 border border-[#2D2D31]',
    card: 'backdrop-blur-md bg-[#1B1B1E]/90 border border-[#2D2D31]',
    modal: 'backdrop-blur-2xl bg-[#131315]/95 border border-[#2D2D31]',
    floating: 'backdrop-blur-2xl bg-[#232326]/90 border border-[#2D2D31] shadow-2xl',
  },

  transitions: {
    fast: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
    normal: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

export const THEME = ELEGANT_DARK_THEME;
