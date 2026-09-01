/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { MapDataType } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { PartyMember } from '@csegames/library/dist/camelotunchained/game/GameClientModels/PartySnapshot';
import { WarbandSubgroup } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { GroupPOIType } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { Faction } from '../../projected/core/nativeTypes';
import { getFactionData } from '../gameData/factionData';
import { getElementIconSize, getGroupMemberName } from '../helpers/mapHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { MapElementIcon } from './MapElementIcon';
import { mapGroupIconImages } from './WorldMap';
import TooltipSource from './TooltipSource';

const StringIDPrefixMapPOIName = 'MapPOIName_';
const StringIDPrefixMapPOIDescription = 'MapPOIDescription_';
const StringIDPrefixMapPOIOwnership = 'MapPOIOwnership_';

// CSS classes
const WorldMapPoint = 'HUD-WorldMapIcons-Point';
const Icon = 'HUD-WorldMapIcons-Icon';
const Pips = 'HUD-WorldMapIcons-Pips';
const Pip = 'HUD-WorldMapIcons-Pip';

const POITooltip = 'HUD-WorldMapIcons-POITooltip';
const POITooltipIcon = 'HUD-WorldMapIcons-POITooltipIcon';
const POITooltipName = 'HUD-WorldMapIcons-POITooltipName';
const POITooltipDescription = 'HUD-WorldMapIcons-POITooltipDescription';
const POITooltipOwnership = 'HUD-WorldMapIcons-POITooltipOwnership';
const POITooltipPips = 'HUD-WorldMapIcons-POITooltipPips';

interface Props {
  entry: MapElementIcon;
  poisToHide: MapDataType[];
  groupPOIsToHide: GroupPOIType[];
  partyMembers: PartyMember[];
  warbandSubgroups: WarbandSubgroup[];
  stringTable: Record<string, StringTableEntryDef>;
}

export class WorldMapIcon extends React.Component<Props> {
  componentDidMount(): void {
    // Position changes are applied directly to the DOM via entry.bindRef and never trigger a
    // render; only faction/type changes need one, so force it explicitly when that happens.
    this.props.entry.bindDataChanged(() => this.forceUpdate());
  }

  componentWillUnmount(): void {
    this.props.entry.bindDataChanged(null);
    this.props.entry.bindRef(null);
  }

  render(): React.ReactNode {
    const { entry } = this.props;
    if (this.props.poisToHide.includes(entry.type)) {
      return null;
    }

    const isGroupMember = entry.type === MapDataType.Player;
    const groupPOIType = isGroupMember ? this.getGroupPOIType() : null;

    if (groupPOIType && this.props.groupPOIsToHide.includes(groupPOIType)) {
      return null;
    }

    const factionData = getFactionData(Faction[entry.faction]);
    const iconImage = groupPOIType ? mapGroupIconImages[groupPOIType] : factionData.mapIconImages[entry.type];
    if (iconImage === null) {
      console.error(`No icon image for map element of type ${entry.type}`);
      return null;
    }
    const size = getElementIconSize(entry.type);
    // TODO: Pip count should be part of MapElementIcon.
    const numPips = 0;

    return (
      <div
        ref={(r) => this.props.entry.bindRef(r)}
        className={WorldMapPoint}
        style={{
          width: `${size}vmin`,
          height: `${size}vmin`,
          marginLeft: `-${size / 2}vmin`,
          marginBottom: `-${size / 2}vmin`
        }}
      >
        <TooltipSource
          className='absoluteFill'
          tooltipID={entry.id}
          positionType='mouse'
          content={this.renderIconTooltip.bind(this)}
        >
          <img className={Icon} src={iconImage} />
          {numPips > 0 && (
            <div className={Pips}>
              {new Array(numPips).fill(0).map((_, index) => (
                <img className={Pip} key={index} src={factionData.mapPipImage} />
              ))}
            </div>
          )}
        </TooltipSource>
      </div>
    );
  }

  private getGroupPOIType(): GroupPOIType {
    const { entry } = this.props;
    let isWarband = false;
    let isWarbandLeader = false;
    let isWarbandDeputy = false;
    // By using find(), we get automatic early outs, which is all we're after anyway.
    this.props.warbandSubgroups.find((sg) => {
      return !!sg.members.find((wm) => {
        if (wm.entityID === entry.id) {
          isWarband = true;
          isWarbandLeader = wm.isLeader;
          isWarbandDeputy = wm.isDeputy;
          return true;
        }
        return false;
      });
    });

    if (isWarband) {
      if (isWarbandLeader) return GroupPOIType.WarbandLeader;
      if (isWarbandDeputy) return GroupPOIType.WarbandDeputy;
      return GroupPOIType.WarbandMember;
    }

    // We aren't explicitly checking party membership.  For now, you only get POI entries
    // for warband or party, and we already know it's not warband.
    return GroupPOIType.PartyMember;
  }

  private renderIconTooltip(): React.ReactNode {
    if (this.props.entry.type === MapDataType.Player) {
      return this.renderPlayerTooltip();
    } else {
      return this.renderDefaultTooltip();
    }
  }

  private renderDefaultTooltip(): React.ReactNode {
    const { entry } = this.props;
    const factionID = Faction[entry.faction];
    const factionData = getFactionData(factionID);
    const iconImage = factionData.mapIconImages[entry.type];

    // TODO: Pip count should be part of MapElementIcon.
    const numPips = 0;

    const nameText = getStringTableValue(StringIDPrefixMapPOIName + MapDataType[entry.type], this.props.stringTable);
    const descriptionKey = StringIDPrefixMapPOIDescription + MapDataType[entry.type];
    const descriptionLookup = getStringTableValue(descriptionKey, this.props.stringTable);
    const descriptionText = descriptionLookup !== descriptionKey ? descriptionLookup : null;

    return (
      <div className={POITooltip}>
        <img className={POITooltipIcon} src={iconImage} />
        <div className={POITooltipName}>{nameText}</div>
        {descriptionText && <div className={POITooltipDescription}>{descriptionText}</div>}
        <div className={POITooltipOwnership}>
          {getStringTableValue(StringIDPrefixMapPOIOwnership + factionID, this.props.stringTable)}
        </div>
        {numPips > 0 && (
          <div className={POITooltipPips}>
            {new Array(numPips).fill(0).map((_, index) => (
              <img className={Pip} key={index} src={factionData.mapPipImage} />
            ))}
          </div>
        )}
      </div>
    );
  }

  private renderPlayerTooltip(): React.ReactNode {
    const { entry } = this.props;
    const nameText =
      getGroupMemberName(entry.id, this.props.partyMembers, this.props.warbandSubgroups) ??
      getStringTableValue(StringIDPrefixMapPOIName + MapDataType[entry.type], this.props.stringTable);
    // TODO: Include leader/deputy info?
    return (
      <div className={POITooltip}>
        <div className={POITooltipName}>{nameText}</div>
      </div>
    );
  }
}
