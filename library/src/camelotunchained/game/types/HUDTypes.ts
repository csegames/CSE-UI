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

export enum AbilityBarDecor {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom'
}

export type NameplateAlignment = 'left' | 'right';
export type NameplateDecor = 'background' | 'decor1' | 'decor2';
export type NameplateDecorFlags = Partial<Record<NameplateDecor, boolean>>;

export enum CompassHeadingSource {
  Camera = 'camera',
  Character = 'character'
}

export enum ProgressionInfoPosition {
  Top = 'top',
  Bottom = 'bottom'
}

export interface HUDResizableParams {
  widthVmin: number;
  heightVmin: number;
  minWidthVmin: number;
  minHeightVmin: number;
  isMaximized: boolean;
}

export interface HUDWidgetState {
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
  /** Ability bars only: integer percentage of a slot's width left empty between neighboring slots. */
  abilitySlotSpacing?: number;
  /** Ability bars only: which decorative ornaments are shown. Unset entries use the bar's default. */
  abilityBarDecor?: Partial<Record<AbilityBarDecor, boolean>>;
  /** Health bar widgets only: which side the diamonds sit on. Unset is left. */
  nameplateAlignment?: NameplateAlignment;
  /** Health bar widgets only: which decorations are shown. Unset entries are hidden. */
  nameplateDecor?: NameplateDecorFlags;
  /** Compass-only: integer percentage (25 to 100, default 33) of the compass bar's full width. */
  compassWidth?: number;
  /** Compass-only: whether the compass follows the camera or the character's facing (default camera). */
  compassHeadingSource?: CompassHeadingSource;
  /** Progression bars only: whether the level and XP text stays shown instead of only on hover (default off). */
  progressionInfoAlwaysShown?: boolean;
  /** Progression bars only: whether the level and XP text sits above or below the bar. */
  progressionInfoPosition?: ProgressionInfoPosition;
}

// These are pseudo-MapDataType entries, split off from MapDataType.Player.
export enum GroupPOIType {
  PartyMember = -2,
  WarbandMember = -3,
  WarbandLeader = -4,
  WarbandDeputy = -5
}
