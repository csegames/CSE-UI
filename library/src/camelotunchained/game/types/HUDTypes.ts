export enum HUDVerticalAnchor {
  Top = 'hud-vertical-anchor-top',
  Center = 'hud-vertical-anchor-center',
  Bottom = 'hud-vertical-anchor-bottom'
}

export enum HUDHorizontalAnchor {
  Left = 'hud-horizontal-anchor-left',
  Center = 'hud-horizontal-anchor-center',
  Right = 'hud-horizontal-anchor-right'
}

export interface HUDResizableParams {
  widthVmin: number;
  heightVmin: number;
  minWidthVmin: number;
  minHeightVmin: number;
  isMaximized: boolean;
}

export interface HUDWidgetState {
  visible?: boolean;
  initialized?: boolean;
  xAnchor?: HUDHorizontalAnchor;
  yAnchor?: HUDVerticalAnchor;
  /** Measured in vmin. */
  xOffset?: number;
  /** Measured in vmin. */
  yOffset?: number;
  opacity?: number;
  scale?: number;
  resizable?: HUDResizableParams;
  /** Determines render order.  Higher values are rendered on top of lower values. */
  layerOffset?: number;
  /** Chat-only: integer percentage (50–150, default 100) controlling font size for chat messages and the chat input. */
  chatFontSize?: number;
  /** Notification widgets only: seconds each toast stays on screen (0 hides notifications entirely). */
  toastDurationSeconds?: number;
}

// These are pseudo-MapDataType entries, split off from MapDataType.Player.
export enum GroupPOIType {
  PartyMember = -2,
  WarbandMember = -3,
  WarbandLeader = -4,
  WarbandDeputy = -5
}
