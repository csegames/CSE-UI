/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import {
  AnyEntityStateModel,
  PlayerEntityStateModel,
  isEntityItem
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { tagsMatch, getTagFromString } from '../../helpers/tagHelpers';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import PlayerUnitFrame from './PlayerUnitFrame';
import { camelotMocks } from '@csegames/library/dist/camelotunchained/camelotMockData';
import { Dictionary } from '@reduxjs/toolkit';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { ResourceNodeUnitFrame } from './ResourceNodeUnitFrame';
import { GateUnitFrame } from './GateUnitFrame';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import StatusEffects from './StatusEffects';
import { TargetPosition } from './TargetPosition';
import { WarbandSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { PartyState } from '../../redux/partySlice';
import { NameplateStyle } from '@csegames/library/dist/camelotunchained/clientFunctions/HUDFunctions';
import {
  getIsCharacterDeputy,
  getIsCharacterLeader,
  getIsEntityNPC,
  getUnitFrameContextMenuItems
} from '../../helpers/characterHelpers';
import { GuildSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';

// CSS Classes
const Root = 'HUD-TargetUnitFrame-Root';
const Position = 'HUD-TargetUnitFrame-Position';

// Tags
const GateTag = 'Asset.Nameplate.Attack';
const ResourceNodeTag = 'Asset.Nameplate.Gather';

interface ReactProps {
  isDragCopy: boolean;
  isFriendly: boolean;
}

interface InjectedProps {
  target: AnyEntityStateModel | null;
  selectedWidgetID: string | null;
  selectedGroupMemberIDs: string[];
  classesByNumericID: Dictionary<ClassDef>;
  player: PlayerEntityStateModel;
  party: PartyState;
  warband: WarbandSnapshot;
  guild: GuildSnapshot;
  stringTable: Record<string, StringTableEntryDef>;
  tagAffixIDByStringID: Record<string, number>;
  nameplateStyle: NameplateStyle;
}

type Props = ReactProps & InjectedProps;

class ATargetUnitFrame extends React.Component<Props> {
  render(): JSX.Element | null {
    const widgetID = this.props.isFriendly ? WIDGET_ID_FRIENDLY : WIDGET_ID_ENEMY;
    // Show the mock frame while this widget is being edited directly, or while it's a member of the
    // actively-selected HUD Editor group (so the whole Health Bars group can be arranged at once).
    const isEditing =
      this.props.selectedWidgetID === widgetID || this.props.selectedGroupMemberIDs.includes(widgetID);

    if (!this.props.target && !isEditing) {
      return null;
    }

    const target = this.props.target ?? mockData;
    const isItem = isEntityItem(target);
    const isGate = isItem && tagsMatch(target.tags, [getTagFromString(GateTag, this.props.tagAffixIDByStringID)]);
    const isResourceNode =
      isItem && tagsMatch(target.tags, [getTagFromString(ResourceNodeTag, this.props.tagAffixIDByStringID)]);
    const targetAsPlayer = target as PlayerEntityStateModel;

    return (
      <div className={Root}>
        {isGate ? (
          <GateUnitFrame
            entity={target}
            isFriendly={this.props.isFriendly}
            nameplateStyle={this.props.nameplateStyle}
          />
        ) : isResourceNode ? (
          <ResourceNodeUnitFrame
            entity={target}
            isFriendly={this.props.isFriendly}
            nameplateStyle={this.props.nameplateStyle}
          />
        ) : (
          <PlayerUnitFrame
            entityID={target.entityID}
            isAlive={target.isAlive}
            name={target.name}
            faction={target.faction}
            classID={targetAsPlayer?.classID}
            isSimple={this.props.nameplateStyle === 'simple'}
            hasCompass={target.entityID !== this.props.player?.entityID}
            contextMenu={getUnitFrameContextMenuItems(
              this.props.party,
              this.props.warband,
              this.props.stringTable,
              this.props.player?.accountID,
              this.props.player?.characterID,
              this.props.player?.faction,
              this.props.player?.guildID,
              this.props.guild,
              target.entityID,
              targetAsPlayer?.accountID ?? '',
              targetAsPlayer?.characterID,
              targetAsPlayer?.groupID,
              target.faction,
              targetAsPlayer?.guildID ?? ''
            )}
            isLeader={getIsCharacterLeader(targetAsPlayer?.characterID, this.props.party, this.props.warband)}
            isDeputy={getIsCharacterDeputy(targetAsPlayer?.characterID, this.props.party, this.props.warband)}
            isOnline={true}
          >
            <div
              className={`${Position} ${getIsEntityNPC(target) ? 'npc' : ''} ${
                this.props.nameplateStyle === 'simple' ? 'simple' : ''
              }`}
            >
              {target.entityID !== this.props.player?.entityID && (
                <TargetPosition isFriendly={this.props.isFriendly} faction={target.faction} />
              )}
            </div>
            <StatusEffects statuses={target.statuses} entityID={target.entityID} />
          </PlayerUnitFrame>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedWidgetID, selectedGroupMemberIDs } = state.hud.editor;
  const { stringTable } = state.stringTable;
  return {
    ...ownProps,
    target: ownProps.isFriendly ? state.entities.friendlyTarget : state.entities.enemyTarget,
    selectedWidgetID,
    selectedGroupMemberIDs,
    classesByNumericID: state.gameDefs.classesByNumericID,
    player: state.entities.self,
    party: state.party,
    warband: state.warband,
    guild: state.guild,
    stringTable,
    tagAffixIDByStringID: state.gameDefs.tagAffixIDByStringID,
    nameplateStyle: state.hud.nameplateStyle
  };
}

const TargetUnitFrame = connect(mapStateToProps)(ATargetUnitFrame);

const mockData: PlayerEntityStateModel = camelotMocks.createPlayerEntityState();

export const WIDGET_ID_FRIENDLY = 'Friendly Target';
export const friendlyTargetUnitFrameRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_FRIENDLY,
  nameStringID: 'HUDEditorWidgetNameTargetUnitFrameFriendly',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 35
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <TargetUnitFrame isFriendly={true} isDragCopy={isDragCopy} />;
  }
};

export const WIDGET_ID_ENEMY = 'Enemy Target';
export const enemyTargetUnitFrameRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_ENEMY,
  nameStringID: 'HUDEditorWidgetNameTargetUnitFrameEnemy',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Top
  },
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <TargetUnitFrame isFriendly={false} isDragCopy={isDragCopy} />;
  }
};
