/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  ChampionInfo,
  Group,
  Member,
  PerkDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { ProfileModel } from '../../../redux/profileSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import TooltipSource from '../../../../shared/components/TooltipSource';
import { showRightPanel } from '../../../redux/navigationSlice';
import { TeamJoinPanel } from '../../rightPanel/TeamJoinPanel';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../helpers/stringTableHelpers';
import { LobbyCurrencyHeader } from './LobbyCurrencyHeader';
import { InviteFriendsButton } from './Play/InviteFriendsButton';
import { setHasClickedInvite } from '../../../redux/teamJoinSlice';
import { lobbyLocalStore } from '../../../localStorage/lobbyLocalStorage';

const Container = 'Lobby-PartyHeader-Container';
const PlayerPortraitContainer = 'Lobby-PartyHeader-PlayerPortraitContainer';
const PlayerPortrait = 'Lobby-PartyHeader-PlayerPortrait';
const PartyPortraitContainer = 'Lobby-PartyHeader-PartyPortraitContainer';
const InvitePortrait = 'Lobby-PartyHeader-InvitePortrait';

const StringIDPlayDefaultDisplayName = 'PlayDefaultDisplayName';
const StringIDGroupsUnknownMember = 'GroupsUnknownMember';
const StringIDGroupsWaitingMessage = 'GroupsWaitingMessage';

interface ReactProps {}

interface InjectedProps {
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  group: Group;
  displayName: string;
  perksByID: Dictionary<PerkDefGQL>;
  profile: ProfileModel;
  defaultGroupCapacity: number;
  myCharacterId: string;
  stringTable: Dictionary<StringTableEntryDef>;
  hasClickedInvite: boolean;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ALobbyPartyHeader extends React.Component<Props> {
  render(): React.ReactNode {
    let defaultChampion: ChampionGQL = null;
    let defaultChampionCostume: ChampionCostumeInfo = null;
    if (this.props.profile && this.props.profile.defaultChampionID) {
      defaultChampion = this.props.profile.champions.find((c) => c.championID == this.props.profile.defaultChampionID);
      if (defaultChampion) {
        const costumePerk = this.props.perksByID[defaultChampion.costumePerkID];
        if (costumePerk) {
          defaultChampionCostume = this.props.championCostumes.find((costume) => costume.id == costumePerk.costume.id);
        }
      }
    }

    const thumbnailImage = this.getChampionThumbnailURL(defaultChampion?.portraitPerkID, defaultChampionCostume);
    const displayName = this.props.displayName
      ? this.props.displayName
      : getStringTableValue(StringIDPlayDefaultDisplayName, this.props.stringTable);
    // We already put our own portrait somewhere else, so we exclude ourselves from the member list.
    const partyMembers: Member[] =
      this.props.group?.members?.filter((member) => {
        return member.id !== this.props.myCharacterId;
      }) ?? [];
    const includeInviteButton: boolean = !this.props.hasClickedInvite && partyMembers.length === 0;
    return (
      <div className={Container}>
        {this.renderPartyPortraits(partyMembers, includeInviteButton)}
        {includeInviteButton && <InviteFriendsButton onClick={this.onInviteClicked.bind(this)} />}
        <TooltipSource className={PlayerPortraitContainer} tooltipParams={{ id: 'SelfPortrait', content: displayName }}>
          <img className={PlayerPortrait} src={thumbnailImage} />
        </TooltipSource>
        <LobbyCurrencyHeader />
      </div>
    );
  }

  private renderPartyPortraits(partyMembers: Member[], includeInviteButton: boolean): React.ReactNode {
    const portraits: React.ReactNode[] = [];

    const maxCapacity = this.props.group?.capacity ?? this.props.defaultGroupCapacity;
    const lastInvitationIndex = partyMembers.length + (this.props.group?.invitations?.length ?? 0);

    const maxShown = includeInviteButton ? 2 : maxCapacity;

    for (let i = 1; i < maxShown; ++i) {
      let portraitURL: string = '';
      let displayName: string = '';
      if (!!this.props.group && i <= partyMembers.length) {
        const member = partyMembers[i - 1];
        const defaultChampionCostume = this.getCostume(member.defaultChampion?.costumeID);
        portraitURL = this.getChampionThumbnailURL(member.defaultChampion?.portraitID, defaultChampionCostume);
        displayName = member.displayName ?? getStringTableValue(StringIDGroupsUnknownMember, this.props.stringTable);
      }
      const isInvitation = i > partyMembers.length && i <= lastInvitationIndex;
      if (isInvitation) {
        const invitation = this.props.group.invitations[i - partyMembers.length - 1];
        displayName = getTokenizedStringTableValue(StringIDGroupsWaitingMessage, this.props.stringTable, {
          NAME: invitation.to.displayName
        });
      }

      portraits.push(
        <TooltipSource
          className={PartyPortraitContainer}
          onClick={this.onInviteClicked.bind(this)}
          tooltipParams={{ id: 'FriendPortrait', content: displayName }}
        >
          {'+'}
          {portraitURL.length > 0 ? <img className={PlayerPortrait} src={portraitURL} /> : null}
          {isInvitation ? <div className={InvitePortrait} /> : null}
        </TooltipSource>
      );
    }

    return portraits;
  }

  private onInviteClicked(): void {
    this.props.dispatch(showRightPanel(<TeamJoinPanel />));
    this.props.dispatch(setHasClickedInvite());
    lobbyLocalStore.setHasClickedInvite();
  }

  private getCostume(costumeId: string) {
    if (costumeId && costumeId != '') {
      const costume = this.props.championCostumes.find((costume) => costume.id == costumeId);
      if (costume) {
        return costume;
      }
    }

    return this.props.championCostumes[0];
  }

  private getChampionThumbnailURL(portraitID: string, costume: ChampionCostumeInfo): string {
    if (portraitID) {
      const portraitPerk = this.props.perksByID[portraitID];
      if (portraitPerk) {
        return portraitPerk.portraitThumbnailURL;
      }
    }

    return costume ? costume.thumbnailURL : 'images/hud/champions/berserker-profile.png';
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { champions, championCostumes } = state.championInfo;
  const { group, hasClickedInvite } = state.teamJoin;
  const { displayName } = state.user;
  const { perksByID } = state.store;
  const { defaultGroupCapacity } = state.teamJoin;
  const myCharacterId = state.user.id;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    champions,
    championCostumes,
    group,
    hasClickedInvite,
    displayName,
    perksByID,
    profile: state.profile,
    defaultGroupCapacity,
    myCharacterId,
    stringTable
  };
}

export const LobbyPartyHeader = connect(mapStateToProps)(ALobbyPartyHeader);
