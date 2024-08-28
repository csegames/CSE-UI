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
}
