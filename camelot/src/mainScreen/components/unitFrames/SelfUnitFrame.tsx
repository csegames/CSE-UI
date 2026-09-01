/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import PlayerUnitFrame from './PlayerUnitFrame';
import { camelotMocks } from '@csegames/library/dist/camelotunchained/camelotMockData';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import StatusEffects from './StatusEffects';
import { WarbandSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { PartyState } from '../../redux/partySlice';
import {
  getIsCharacterDeputy,
  getIsCharacterLeader,
  getUnitFrameContextMenuItems
} from '../../helpers/characterHelpers';
import { GuildSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';
import { getTagFromString, tagMatchesAny } from '../../helpers/tagHelpers';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { NameplateStyle } from '@csegames/library/dist/camelotunchained/clientFunctions/HUDFunctions';

// CSS classes
const Root = 'HUD-SelfUnitFrame-Root';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  player: PlayerEntityStateModel;
  party: PartyState;
  warband: WarbandSnapshot;
  guild: GuildSnapshot;
  classesByNumericID: Record<number, ClassDef>;
  stringTable: Record<string, StringTableEntryDef>;
  tagAffixIDByStringID: Record<string, number>;
  nameplateStyle: NameplateStyle;
}

type Props = ReactProps & InjectedProps;

class ASelfUnitFrame extends React.Component<Props> {
  render(): JSX.Element {
    const player: PlayerEntityStateModel = this.props.player ?? mockData;

    const combatTag = getTagFromString('Granted.State.InCombat', this.props.tagAffixIDByStringID);
    const inCombat = tagMatchesAny(player.tags, combatTag);

    return (
      <div className={`${Root}${inCombat ? ' inCombat' : ''}`}>
        <PlayerUnitFrame
          entityID={player.entityID}
          isAlive={player.isAlive}
          name={player.name}
          faction={player.faction}
          classID={player.classID}
          isSimple={this.props.nameplateStyle === 'simple'}
          onTarget={() => {
            clientAPI.requestFriendlyTarget(player.entityID);
          }}
          contextMenu={getUnitFrameContextMenuItems(
            this.props.party,
            this.props.warband,
            this.props.stringTable,
            player.accountID,
            player.characterID,
            player.faction,
            player.guildID,
            this.props.guild,
            player.entityID,
            player.accountID,
            player.characterID,
            player.groupID,
            player.faction,
            player.guildID
          )}
          isLeader={getIsCharacterLeader(player.characterID, this.props.party, this.props.warband)}
          isDeputy={getIsCharacterDeputy(player.characterID, this.props.party, this.props.warband)}
          isOnline={true}
        >
          <StatusEffects statuses={player.statuses} entityID={player.entityID} />
        </PlayerUnitFrame>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { guild, party, warband } = state;
  const { stringTable } = state.stringTable;
  return {
    ...ownProps,
    player: state.entities.self,
    party,
    warband,
    guild,
    classesByNumericID: state.gameDefs.classesByNumericID,
    stringTable,
    tagAffixIDByStringID: state.gameDefs.tagAffixIDByStringID,
    nameplateStyle: state.hud.nameplateStyle
  };
}

const SelfUnitFrame = connect(mapStateToProps)(ASelfUnitFrame);

const mockData: PlayerEntityStateModel = camelotMocks.createPlayerEntityState();

export const WIDGET_ID_SELF = 'Your Health Bar';
export const selfUnitFrameRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_SELF,
  nameStringID: 'HUDEditorWidgetNameSelfUnitFrame',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <SelfUnitFrame isDragCopy={isDragCopy} />;
  }
};
