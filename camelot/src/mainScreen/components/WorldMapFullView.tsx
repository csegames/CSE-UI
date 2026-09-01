/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData, MapDataType } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { Faction } from '../../projected/core/nativeTypes';
import {
  allContinents,
  allMapDetails,
  allMapRegions,
  ContinentDetails,
  isMapVisibleToFaction,
  MAP_REGION_WORLD
} from '../helpers/mapHelpers';
import { continentHitMasks, HIT_RES } from '../helpers/worldMapHitData';
import { BorderBackground, FactionBorder, BorderType } from './FactionBorder';
import { getFactionData } from '../gameData/factionData';
import { WorldMapContinentLayer } from './WorldMapContinentLayer';

const Root           = 'HUD-WorldMapFullView-Root';
const BaseImage      = 'HUD-WorldMapFullView-BaseImage';
const TooltipWrapper        = 'HUD-WorldMapFullView-TooltipWrapper';
const TooltipWrapperVisible = 'HUD-WorldMapFullView-TooltipWrapper--visible';
const TowerRow        = 'HUD-WorldMapFullView-TowerRow';
const TowerIcon       = 'HUD-WorldMapFullView-TowerIcon';
const TooltipPOIRow   = 'HUD-WorldMapFullView-TooltipPOIRow';
const TooltipDivider  = 'HUD-WorldMapFullView-TooltipDivider';
// Reuse the existing POI tooltip classes from WorldMapIcons for consistent styling.
const POITooltip            = 'HUD-WorldMapIcons-POITooltip';
const POITooltipIcon        = 'HUD-WorldMapIcons-POITooltipIcon';
const TooltipBorder         = 'HUD-TooltipPane-Border';
const TooltipContentWrapper = 'HUD-TooltipPane-ContentWrapper';

// Continent outline colors; fully opaque so the single drop-shadow outline reads as a hard line.
const factionGlow: Record<number, string> = {
  [Faction.Arthurian]: '#e22222',
  [Faction.TDD]:       '#34c734',
  [Faction.Viking]:    '#007edb'
};
const factionNameToGlow: Record<string, string> = {
  Arthurian: factionGlow[Faction.Arthurian],
  TDD:       factionGlow[Faction.TDD],
  Viking:    factionGlow[Faction.Viking]
};

const factionEnumToStringID: Record<number, string> = {
  [Faction.Arthurian]: 'Arthurian',
  [Faction.TDD]:       'TDD',
  [Faction.Viking]:    'Viking'
};
const FACTIONLESS_ID = 'Factionless';
const ALL_FACTIONS: number[] = [Faction.Arthurian, Faction.TDD, Faction.Viking];

// Alpha values at or below this are treated as transparent in the hit mask.
const HIT_MASK_ALPHA_THRESHOLD = 10;

const TOWER_TYPES = [
  MapDataType.KeepTowerArmory,
  MapDataType.KeepTowerBarrack,
  MapDataType.KeepTowerChurch,
  MapDataType.KeepTowerStable,
] as const;

const RESOURCE_TYPES = new Set<MapDataType>([
  MapDataType.ResourceEssence,
  MapDataType.ResourceFishing,
  MapDataType.ResourceHerbs,
  MapDataType.ResourceHunting,
  MapDataType.ResourceLogging,
  MapDataType.ResourceMinerals,
  MapDataType.ResourceMining,
]);

const mapIDToContinentKey: Record<string, string> = {};
for (const c of allContinents) {
  if (c.mapID) mapIDToContinentKey[c.mapID] = c.key;
}

const WORLD_REGION_MAP_IDS = new Set(allMapRegions[MAP_REGION_WORLD]);

interface ReactProps {
  onContinentClick?: (mapID: string) => void;
}

interface InjectedProps {
  zones: Record<string, ZoneInfo>;
  currentZoneID: string;
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps;

interface State {
  hoveredContinentKey: string | null;
  displayedContinentKey: string | null; // last hovered continent, held for PANEL_HIDE_DELAY_MS after hover ends
  keepOwners: Record<string, number>; // continent key → owner faction
  towerOwners: Record<string, Partial<Record<MapDataType, number>>>; // continent key → tower type → owner faction
  resourceCounts: Record<string, Record<number, number>>; // continent key → faction → resource count
  currentContinentKey: string | null;
}

const PANEL_HIDE_DELAY_MS = 500;

// Ownership/resource data only changes on capture events, so the ~60Hz animation callback
// is only processed once per this interval (first run is immediate).
const MAP_DATA_REFRESH_MS = 1000;

// The container rect goes stale when the widget is moved, and Coherent doesn't reliably fire
// mouseenter after the container moves under the cursor, so re-measure on this throttle instead.
const RECT_REFRESH_MS = 250;

class AWorldMapFullView extends React.Component<Props, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private animHandle: ListenerHandle | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private lastMapDataMs = 0;
  // Last hit-grid cell processed; mousemove events that stay within the same cell are skipped (-1 = none).
  private lastHitIdx = -1;
  // Cache of ZoneInfo keyed by decimal ID; rebuilt only when the zones prop reference changes.
  private zonesRef: Record<string, ZoneInfo> | null = null;
  private decimalToZone: Record<string, ZoneInfo> = {};
  private interactiveFactionRef: string | null = null;
  private interactiveKeys: Set<string> = new Set();
  // Cached bounding rect of the map container (live reads force a synchronous layout);
  // measured on mount and re-measured at most once per RECT_REFRESH_MS during mouse movement.
  private containerRect: DOMRect | null = null;
  private lastRectRefreshMs = 0;

  constructor(props: Props) {
    super(props);
    this.state = { hoveredContinentKey: null, displayedContinentKey: null, keepOwners: {}, towerOwners: {}, resourceCounts: {}, currentContinentKey: null };
  }

  componentDidMount(): void {
    this.animHandle = clientAPI.startAnimation(this.onAnimation.bind(this));
    this.updateCurrentContinent(this.props);
    this.refreshContainerRect();
  }

  private refreshContainerRect = (): void => {
    this.containerRect = this.containerRef.current?.getBoundingClientRect() ?? null;
    this.lastRectRefreshMs = Date.now();
  };

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.currentZoneID !== this.props.currentZoneID || prevProps.zones !== this.props.zones) {
      this.updateCurrentContinent(this.props);
    }
  }

  private updateCurrentContinent(props: Props): void {
    const zone = Object.values(props.zones).find((z) => z.ID === props.currentZoneID);
    const key = zone ? (mapIDToContinentKey[zone.Name] ?? null) : null;
    if (key !== this.state.currentContinentKey) {
      this.setState({ currentContinentKey: key });
    }
  }

  componentWillUnmount(): void {
    this.animHandle?.close();
    if (this.hideTimer) clearTimeout(this.hideTimer);
  }

  private onAnimation(animData: AnimationData): void {
    const now = Date.now();
    if (now - this.lastMapDataMs < MAP_DATA_REFRESH_MS) return;
    this.lastMapDataMs = now;

    const { mapData } = animData;
    const owners: Record<string, number> = {};
    const towers: Record<string, Partial<Record<MapDataType, number>>> = {};
    const resources: Record<string, Record<number, number>> = {};
    const currentHexZoneID = (+this.props.currentZoneID).toString(16);

    if (this.zonesRef !== this.props.zones) {
      const map: Record<string, ZoneInfo> = {};
      for (const zone of Object.values(this.props.zones)) {
        map[zone.ID] = zone;
      }
      this.decimalToZone = map;
      this.zonesRef = this.props.zones;
    }
    const decimalToZone = this.decimalToZone;

    for (let i = 0; i < mapData.id.length; i++) {
      if (!mapData.id[i]) break;

      const type = mapData.type[i];
      const isKeepMain = type === MapDataType.KeepMain;
      const isTower = (TOWER_TYPES as readonly MapDataType[]).includes(type);
      const isResource = RESOURCE_TYPES.has(type);
      if (!isKeepMain && !isTower && !isResource) continue;

      const hexZoneID = mapData.zoneId[i] || currentHexZoneID;
      const decimalID = parseInt(hexZoneID, 16).toString();
      const zone = decimalToZone[decimalID];
      if (!zone) continue;

      const continentKey = mapIDToContinentKey[zone.Name];
      if (!continentKey) continue;

      if (isKeepMain) {
        owners[continentKey] = +mapData.faction[i];
      } else if (isTower) {
        if (!towers[continentKey]) towers[continentKey] = {} as Partial<Record<MapDataType, number>>;
        towers[continentKey][type] = +mapData.faction[i];
      } else if (isResource) {
        if (!resources[continentKey]) resources[continentKey] = {} as Record<number, number>;
        const faction = +mapData.faction[i];
        resources[continentKey][faction] = (resources[continentKey][faction] ?? 0) + 1;
      }
    }

    const prev = this.state;
    const ownerKeys = Object.keys(owners);
    const ownersChanged =
      ownerKeys.length !== Object.keys(prev.keepOwners).length ||
      ownerKeys.some((k) => owners[k] !== prev.keepOwners[k]);
    const towerKeys = Object.keys(towers);
    const towersChanged =
      towerKeys.length !== Object.keys(prev.towerOwners).length ||
      towerKeys.some((k) => {
        const a = towers[k];
        const b = prev.towerOwners[k];
        if (!b) return true;
        return (TOWER_TYPES as readonly MapDataType[]).some((t) => a[t] !== b[t]);
      });
    const resourceKeys = Object.keys(resources);
    const resourcesChanged =
      resourceKeys.length !== Object.keys(prev.resourceCounts).length ||
      resourceKeys.some((k) => {
        const a = resources[k];
        const b = prev.resourceCounts[k];
        if (!b) return true;
        return Object.keys(a).some((f) => a[+f] !== b[+f]);
      });

    if (ownersChanged || towersChanged || resourcesChanged) {
      this.setState({ keepOwners: owners, towerOwners: towers, resourceCounts: resources });
    }
  }

  private onMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!this.containerRect || Date.now() - this.lastRectRefreshMs > RECT_REFRESH_MS) {
      this.refreshContainerRect();
    }
    const rect = this.containerRect;
    if (!rect) return;

    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    if (xRatio < 0 || xRatio > 1 || yRatio < 0 || yRatio > 1) {
      this.lastHitIdx = -1;
      this.clearHover();
      return;
    }

    const idx = Math.floor(yRatio * HIT_RES) * HIT_RES + Math.floor(xRatio * HIT_RES);
    if (idx === this.lastHitIdx) return;
    this.lastHitIdx = idx;

    const interactiveKeys = this.getInteractiveKeys();
    for (let i = allContinents.length - 1; i >= 0; i--) {
      const continent = allContinents[i];
      if (!interactiveKeys.has(continent.key)) continue;
      const mask = continentHitMasks[continent.key];
      if (mask && mask[idx] > HIT_MASK_ALPHA_THRESHOLD) {
        this.onContinentHovered(continent);
        return;
      }
    }

    this.clearHover();
  };

  private onMouseLeave = (): void => {
    this.lastHitIdx = -1;
    this.clearHover();
  };

  // Home islands highlight and stay clickable but intentionally never open the region info panel.
  private onContinentHovered(continent: ContinentDetails): void {
    if (this.state.hoveredContinentKey !== continent.key) {
      this.setState({ hoveredContinentKey: continent.key });
    }

    const details = continent.mapID ? allMapDetails[continent.mapID] : undefined;
    if (details?.isHomeIsland) {
      this.schedulePanelHide();
      return;
    }

    if (this.hideTimer) { clearTimeout(this.hideTimer); this.hideTimer = null; }
    if (this.state.displayedContinentKey !== continent.key) {
      this.setState({ displayedContinentKey: continent.key });
    }
  }

  private clearHover(): void {
    if (this.state.hoveredContinentKey !== null) this.setState({ hoveredContinentKey: null });
    this.schedulePanelHide();
  }

  private schedulePanelHide(): void {
    if (this.state.displayedContinentKey === null || this.hideTimer !== null) return;
    this.hideTimer = setTimeout(() => {
      this.setState({ displayedContinentKey: null });
      this.hideTimer = null;
    }, PANEL_HIDE_DELAY_MS);
  }

  // Rebuilt only when uiFactionID changes; home islands of other factions are non-interactive.
  private getInteractiveKeys(): Set<string> {
    if (this.interactiveFactionRef !== this.props.uiFactionID) {
      const keys = new Set<string>();
      for (const continent of allContinents) {
        if (!continent.mapID) continue;
        if (!WORLD_REGION_MAP_IDS.has(continent.mapID)) continue;
        if (!isMapVisibleToFaction(continent.mapID, this.props.uiFactionID)) continue;
        keys.add(continent.key);
      }
      this.interactiveKeys = keys;
      this.interactiveFactionRef = this.props.uiFactionID;
    }
    return this.interactiveKeys;
  }

  private onClick = (): void => {
    if (!this.state.hoveredContinentKey) return;
    const continent = allContinents.find((c) => c.key === this.state.hoveredContinentKey);
    if (continent?.mapID) {
      this.props.onContinentClick?.(continent.mapID);
    }
  };

  private renderPanelContent(): React.ReactNode {
    const { displayedContinentKey, keepOwners, towerOwners, resourceCounts } = this.state;
    if (!displayedContinentKey) return null;

    const continent = allContinents.find((c) => c.key === displayedContinentKey);
    if (!continent?.mapID) return null;

    const details = allMapDetails[continent.mapID];
    if (details?.isHomeIsland) return null;

    const ownerFaction = keepOwners[displayedContinentKey];
    const ownerFactionID: string | null = ownerFaction != null ? (factionEnumToStringID[ownerFaction] ?? null) : null;
    const keepIcon = ownerFactionID
      ? getFactionData(ownerFactionID)?.mapIconImages?.[MapDataType.KeepMain]
      : null;

    const zoneTowers = towerOwners[displayedContinentKey] ?? {};
    const zoneCounts = resourceCounts[displayedContinentKey] ?? {};
    const resourceTotal = Object.values(zoneCounts).reduce((sum, n) => sum + n, 0);

    return (
      <div className={POITooltip}>
        {keepIcon && <img className={POITooltipIcon} src={keepIcon} />}
        <div className={TowerRow}>
          {TOWER_TYPES.map((towerType) => {
            const towerFaction = zoneTowers[towerType];
            const towerFactionID = towerFaction != null ? (factionEnumToStringID[towerFaction] ?? FACTIONLESS_ID) : FACTIONLESS_ID;
            const icon = getFactionData(towerFactionID)?.mapIconImages?.[towerType];
            return icon ? <img key={towerType} className={TowerIcon} src={icon} /> : null;
          })}
        </div>
        <div
          className={TooltipDivider}
          style={{ backgroundColor: getFactionData(this.props.uiFactionID).borderColor }}
        />
        {ALL_FACTIONS.map((f) => (
          <div key={f} className={TooltipPOIRow} style={{ color: factionGlow[f] }}>
            {`${zoneCounts[f] ?? 0}/${resourceTotal}`}
          </div>
        ))}
      </div>
    );
  }

  private renderTooltip(): React.ReactNode {
    const { displayedContinentKey } = this.state;
    const wrapperClass = displayedContinentKey ? `${TooltipWrapper} ${TooltipWrapperVisible}` : TooltipWrapper;
    return (
      <div className={wrapperClass}>
        <FactionBorder type={BorderType.Secondary} background={BorderBackground.PatternLarge} className={TooltipBorder}>
          <div className={TooltipContentWrapper}>
            {this.renderPanelContent()}
          </div>
        </FactionBorder>
      </div>
    );
  }

  render(): React.ReactNode {
    const { hoveredContinentKey, currentContinentKey } = this.state;
    const interactiveKeys = this.getInteractiveKeys();
    return (
      <div
        className={Root}
        ref={this.containerRef}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
      >
        <img className={BaseImage} src='/dynamic/zones/assets/world-map-full.jpg' draggable={false} />
        {allContinents.map((continent: ContinentDetails) => {
          const exists = interactiveKeys.has(continent.key);
          const isHovered = exists && hoveredContinentKey === continent.key;
          const isCurrentZone = exists && currentContinentKey === continent.key;
          const ownerFaction = this.state.keepOwners[continent.key];
          const glow = factionGlow[ownerFaction] ?? factionNameToGlow[continent.faction] ?? 'rgb(180, 180, 180)';
          return (
            <WorldMapContinentLayer
              key={continent.key}
              src={`/dynamic/zones/assets/${continent.key}.png`}
              exists={exists}
              isHovered={isHovered}
              isCurrentZone={isCurrentZone}
              glow={glow}
            />
          );
        })}
        {this.renderTooltip()}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): InjectedProps => ({
  zones: state.zones.zones,
  currentZoneID: state.loading.zoneID,
  uiFactionID: state.hud.uiFactionID
});

export const WorldMapFullView = connect(mapStateToProps)(AWorldMapFullView);
