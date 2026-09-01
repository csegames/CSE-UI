/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../redux/store';
import { ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { FactionDef } from '../dataSources/manifest/factionManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData, MapDataType } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { getMapDetails, getMapIconXPercent, getMapIconYPercent, parseZoneBounds } from '../helpers/mapHelpers';
import { PartyMember } from '@csegames/library/dist/camelotunchained/game/GameClientModels/PartySnapshot';
import { WarbandSubgroup } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { getFactionData } from '../gameData/factionData';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { GroupPOIType } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { MapElementIcon } from './MapElementIcon';
import { WorldMapIcon } from './WorldMapIcon';

// CSS classes
const Root = 'HUD-WorldMapIcons-Root';
const WorldMapPoint = 'HUD-WorldMapIcons-Point';
const PingRing = 'HUD-WorldMapIcons-PingRing';
const PingContainer = 'HUD-WorldMapIcons-PingContainer';

interface ReactProps {
  zone: ZoneInfo;
}

interface InjectedProps {
  factions: Record<string, FactionDef>;
  uiFactionID: string;
  poisToHide: MapDataType[];
  groupPOIsToHide: GroupPOIType[];
  isCurrentZone: boolean;
  stringTable: Record<string, StringTableEntryDef>;
  partyMembers: PartyMember[];
  warbandSubgroups: WarbandSubgroup[];
}

interface State {
  animationHandle: ListenerHandle;
  // Roster of currently active element icon ids. Only changes when an icon enters or leaves the
  // zone; position updates for existing icons are applied imperatively and never touch this.
  iconIds: string[];
  hasPlayerPosition: boolean;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AWorldMapIcons extends React.Component<Props, State> {
  // Persistent icon store, kept outside React state since entries are mutated in place every tick.
  private icons: Map<string, MapElementIcon> = new Map();

  private playerPingRef: HTMLDivElement | null = null;
  private playerIconRef: HTMLImageElement | null = null;
  private playerX = 0;
  private playerY = 0;
  private playerRotation = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      animationHandle: clientAPI.startAnimation(this.animate.bind(this)),
      iconIds: [],
      hasPlayerPosition: false
    };
  }

  render(): React.ReactNode {
    const zone = this.props.zone;
    if (!zone) return null;

    return (
      <div className={Root} style={this.buildRootStyle(zone)}>
        {this.state.iconIds.map((id) => (
          <WorldMapIcon
            key={id}
            entry={this.icons.get(id)!}
            poisToHide={this.props.poisToHide}
            groupPOIsToHide={this.props.groupPOIsToHide}
            partyMembers={this.props.partyMembers}
            warbandSubgroups={this.props.warbandSubgroups}
            stringTable={this.props.stringTable}
          />
        ))}
        {this.renderPlayerIcon()}
      </div>
    );
  }

  private buildRootStyle(zone: ZoneInfo): React.CSSProperties {
    const mapBounds = getMapDetails(zone).bounds;
    const zoneBounds = parseZoneBounds(zone.Bounds);

    // POIs use zone coordinates, which don't usually align to map coordinates, so we do a little math
    // so our root aligns to the zone bounds inside the map space.

    let style: React.CSSProperties = {
      left: `${((zoneBounds.x - mapBounds.x) / mapBounds.width) * 100}%`,
      top: `${((zoneBounds.y - mapBounds.y) / mapBounds.height) * 100}%`,
      width: `${(zoneBounds.width / mapBounds.width) * 100}%`,
      height: `${(zoneBounds.height / mapBounds.height) * 100}%`
    };

    return style;
  }

  private renderPlayerIcon(): React.ReactNode {
    if (!this.state.hasPlayerPosition || !this.props.isCurrentZone) {
      return null;
    }

    const factionData = getFactionData(this.props.uiFactionID);
    const size = 3;

    return (
      <>
        <div
          ref={(r) => {
            this.playerPingRef = r;
            this.writePlayerPosition();
          }}
          className={`${WorldMapPoint} ${PingContainer}`}
        >
          <div className={`${PingRing} ring1 ${this.props.uiFactionID}`} />
        </div>
        <img
          ref={(r) => {
            this.playerIconRef = r;
            this.writePlayerPosition();
          }}
          style={{ width: `${size}vmin`, height: `${size}vmin`, transformOrigin: '50% 50%' }}
          className={WorldMapPoint}
          src={factionData.mapIconImages[MapDataType.Self]}
        />
      </>
    );
  }

  private writePlayerPosition(): void {
    if (this.playerPingRef) {
      this.playerPingRef.style.left = `${this.playerX}%`;
      this.playerPingRef.style.bottom = `${this.playerY}%`;
    }
    if (this.playerIconRef) {
      this.playerIconRef.style.left = `${this.playerX}%`;
      this.playerIconRef.style.bottom = `${this.playerY}%`;
      this.playerIconRef.style.transform = `translate(-50%, 50%) rotate(${this.playerRotation}deg)`;
    }
  }

  componentWillUnmount(): void {
    this.state.animationHandle.close();
  }

  private animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    const { playerYaw, playerX, playerY, mapData } = data;
    const zone = this.props.zone;
    const hasValidPlayer = !!zone && !isNaN(playerYaw) && !isNaN(playerX) && !isNaN(playerY);

    if (!hasValidPlayer) {
      if (this.state.hasPlayerPosition) {
        this.setState({ hasPlayerPosition: false });
      }
      return;
    }

    const bounds = parseZoneBounds(zone.Bounds);
    this.playerX = getMapIconXPercent(playerX, bounds);
    this.playerY = getMapIconYPercent(playerY, bounds);
    this.playerRotation = playerYaw ? -playerYaw + 90 : 0;
    this.writePlayerPosition();
    if (!this.state.hasPlayerPosition) {
      this.setState({ hasPlayerPosition: true });
    }

    // ZoneInfo.ID is a decimal string, but AnimationData.MapData.ZoneID is a hex string.
    const hexZoneID = (+zone.ID).toString(16);
    const isCurrentZone = this.props.isCurrentZone;

    const previousIconCount = this.icons.size;
    const seenIds = new Set<string>();
    const length = mapData.id.length;
    for (let i = 0; i < length; i++) {
      const id = mapData.id[i];
      if (!id) break;
      const zoneID = mapData.zoneId[i];

      // Empty zone ID means same zone ID as the player
      if (!((!zoneID && isCurrentZone) || (!!zoneID && zoneID === hexZoneID))) {
        continue;
      }
      seenIds.add(id);

      const faction = mapData.faction[i];
      const type = mapData.type[i];
      const x = getMapIconXPercent(mapData.xpos[i], bounds);
      const y = getMapIconYPercent(mapData.ypos[i], bounds);

      const existing = this.icons.get(id);
      if (existing) {
        existing.update(faction, type, x, y);
      } else {
        this.icons.set(id, new MapElementIcon(id, faction, type, x, y));
      }
    }

    let rosterChanged = this.icons.size !== previousIconCount;
    const staleIds = Array.from(this.icons.keys()).filter((id) => !seenIds.has(id));
    if (staleIds.length > 0) {
      rosterChanged = true;
      for (const id of staleIds) {
        this.icons.delete(id);
      }
    }

    if (rosterChanged) {
      this.setState({ iconIds: Array.from(this.icons.keys()) });
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { factions } = state.gameDefs;
  const { uiFactionID, poisToHide } = state.hud;
  const { members: partyMembers } = state.party;
  const { subgroups: warbandSubgroups } = state.warband;
  const { stringTable } = state.stringTable;
  return {
    ...ownProps,
    factions: factions,
    uiFactionID: uiFactionID,
    poisToHide: poisToHide,
    groupPOIsToHide: state.hud.groupPOIsToHide,
    isCurrentZone: ownProps.zone.ID === state.loading.zoneID,
    stringTable: stringTable,
    partyMembers: partyMembers,
    warbandSubgroups: warbandSubgroups
  };
};

export const WorldMapIcons = connect(mapStateToProps)(AWorldMapIcons);
