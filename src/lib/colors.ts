export type BubbleColor = 'bubble-pink' | 'bubble-sky' | 'bubble-yellow' | 'bubble-purple' | 'bubble-green';

const PALETTE: BubbleColor[] = [
  'bubble-pink',
  'bubble-sky',
  'bubble-yellow',
  'bubble-purple',
  'bubble-green',
];

// DJB2 hash — same nickname always maps to same color
function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // convert to unsigned 32-bit
}

export function pickBubbleColor(nickname: string): BubbleColor {
  return PALETTE[djb2(nickname) % PALETTE.length];
}

// Tailwind needs full class names present in source for JIT — map to bg- classes
export const BUBBLE_COLOR_CLASS: Record<BubbleColor, string> = {
  'bubble-pink': 'bg-bubble-pink',
  'bubble-sky': 'bg-bubble-sky',
  'bubble-yellow': 'bg-bubble-yellow',
  'bubble-purple': 'bg-bubble-purple',
  'bubble-green': 'bg-bubble-green',
};
