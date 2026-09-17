// Pretext layout engine integration for Presentation demos
import {
  prepare as pretextPrepare,
  layout as pretextLayout,
  prepareWithSegments as pretextPrepareWithSegments,
  layoutNextLine as pretextLayoutNextLine,
  type PreparedText,
  type PreparedTextWithSegments,
  type LayoutCursor,
  type LayoutLine,
  type LayoutResult,
} from '@chenglou/pretext';

export {
  pretextPrepare as prepare,
  pretextLayout as layout,
  pretextPrepareWithSegments as prepareWithSegments,
  pretextLayoutNextLine as layoutNextLine,
  type PreparedText,
  type PreparedTextWithSegments,
  type LayoutCursor,
  type LayoutLine,
  type LayoutResult,
};

// Pure client fallback/adapter for slot carving in Demo 5
export interface Slot {
  left: number;
  width: number;
}

export function computeCircleBandSlots(
  areaWidth: number,
  lineTop: number,
  lineHeight: number,
  orbX: number,
  orbY: number,
  orbRadius: number
): Slot[] {
  const bandCenterY = lineTop + lineHeight / 2;
  const dy = Math.abs(bandCenterY - orbY);
  const slots: Slot[] = [];

  if (dy < orbRadius + 4) {
    const dx = Math.sqrt((orbRadius + 10) * (orbRadius + 10) - dy * dy);
    const blockLeft = Math.max(0, orbX - dx);
    const blockRight = Math.min(areaWidth, orbX + dx);

    if (blockLeft > 60) {
      slots.push({ left: 12, width: blockLeft - 20 });
    }
    if (areaWidth - blockRight > 60) {
      slots.push({ left: blockRight + 8, width: areaWidth - blockRight - 20 });
    }
  } else {
    slots.push({ left: 12, width: areaWidth - 24 });
  }

  return slots;
}
