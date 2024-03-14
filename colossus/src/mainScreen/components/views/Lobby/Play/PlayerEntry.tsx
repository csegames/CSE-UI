/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import {
  ChampionCostumeInfo,
  Group,
  Member,
  Player,
  PerkDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dispatch } from 'redux';
import {
  addNotifications,
  buildOfferId,
  createNotification,
  removeInvitation,
  updateGroupState
} from '../../../../redux/teamJoinSlice';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getAccountID } from '@csegames/library/dist/_baseGame/utils/accountUtils';
import { game } from '@csegames/library/dist/_baseGame';
import { convertServerTimeToLocalTime } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { formatDurationSeconds } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';

// ===== Start PlayerEntry Styles =====
const PlayerEntryContainer = 'StartScreen-Play-PlayerEntry-PlayerEntryContainer';
const PlayerEntryBackground = 'StartScreen-Play-PlayerEntry-PlayerEntryBackground';
const PlayerNameContainer = 'StartScreen-Play-PlayerEntry-PlayerNameContainer';
const PlayerName = 'StartScreen-Play-PlayerEntry-PlayerName';
const PlayerIcon = 'StartScreen-Play-PlayerEntry-PlayerIcon';
const PlayerRole = 'StartScreen-Play-PlayerEntry-PlayerRole';
const PlayerRoleInvited = 'StartScreen-Play-PlayerEntry-PlayerRoleInvited';
const PlayerRoleOffline = 'StartScreen-Play-PlayerEntry-PlayerRoleOffline';
const EntryContextMenuButton = 'StartScreen-Play-PlayerEntry-EntryContextMenuButton';

// ===== End PlayerEntry Styles =====

const StringIDGroupsLeader = 'GroupsLeader';
const StringIDGroupsLeaderOffline = 'GroupsLeaderOffline';
const StringIDGroupsOffline = 'GroupsOffline';
const StringIDGroupsExpiredMessage = 'GroupsExpiredMessage';
const StringIDGroupsWaiting = 'GroupsWaiting';

type PlayerEntryCallback = (player: Player, playerIdx: number) => void;
export type GroupMemberRole = 'Leader' | 'Offline' | 'Leader - Offline' | '';

interface ReactProps {
  groupMember?: Member;
  invitationReceiver?: Player;
  entryRole: GroupMemberRole;
  entryIsLeader: boolean;
  costume: ChampionCostumeInfo;
  playerIdx: number;
  selected: boolean;
  isInvitation: boolean;
  expiration?: string;
  //This is a check if the client that would view the entry is the leader.
  canEditGroup: boolean;
  onMenu: PlayerEntryCallback;
  onSelect: PlayerEntryCallback;
  // Adding this explicitly because the connect() call strips it out of the type exported, even though it's there.
  children?: React.ReactNode;
}

interface InjectedProps {
  group: Group;
  dispatch?: Dispatch;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  serverTimeDeltaMS: number;
}

type Props = ReactProps & InjectedProps;

interface PlayerEntryState {
  expirationTimer: number;
}

class APlayerEntry extends React.Component<Props, PlayerEntryState> {
  private invitationInterval: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      expirationTimer: 0
    };
  }

  private onClickMenuButton(e: React.MouseEvent<HTMLButtonElement>) {
    this.props.onMenu(this.props.groupMember, this.props.playerIdx);

    // stop propagation here so that this doesn't also trigger onClickPlayerEntry
    // (which is bound to the parent div of this button)
    e.stopPropagation();
  }

  private onClickPlayerEntry(e: React.MouseEvent<HTMLDivElement>) {
    if (this.props.groupMember) {
      this.props.onSelect(this.props.groupMember, this.props.playerIdx);
    } else {
      this.props.onSelect(this.props.invitationReceiver, this.props.playerIdx);
    }
  }

  private getMenuButton() {
    //First conditional is to check if this playerEntry is for the leader as they should never have a context menu
    //Second conditional is to check if this is an invite and therefore no actions can be made on it
    //Third conditional checks to see if the client viewing the entries is the leader and if they should be able to see the context menus or not
    if (this.props.entryIsLeader || this.props.isInvitation || !this.props.canEditGroup) {
      return null;
    }

    return <button className={EntryContextMenuButton} onClick={this.onClickMenuButton.bind(this)} />;
  }

  private getTimer(expiration: string) {
    const endDate = convertServerTimeToLocalTime(new Date(expiration).getTime(), this.props.serverTimeDeltaMS);
    this.invitationInterval = window.setInterval(() => {
      const currentDate = new Date().getTime();
      const difference = endDate - currentDate;
      if (difference < 0) {
        window.clearInterval(this.invitationInterval);
        this.handleExpiredInvite(this.props.groupMember ? this.props.groupMember.id : this.props.invitationReceiver.id);
      } else {
        this.setState({
          expirationTimer: Math.floor(difference / 1000)
        });
      }
    }, 1000);
  }

  private handleExpiredInvite(inviteeId: string): void {
    if (!this.props.group) {
      return;
    }

    // Remove matching expired invitation.
    const expiredInvitation = this.props.group.invitations.find((invite) => invite.to.id == inviteeId);
    if (!expiredInvitation) {
      // Should be one, but just in case.
      return;
    }
    if (this.props.group.size === 2) {
      this.props.dispatch(updateGroupState(null));
    } else {
      this.props.dispatch(removeInvitation(buildOfferId(expiredInvitation)));
    }

    // If necessary, queue a notif for the expiry.
    if (expiredInvitation.from.id === getAccountID(game.accessToken)) {
      this.props.dispatch(
        addNotifications([
          createNotification({
            createText: (stringTable) =>
              getTokenizedStringTableValue(StringIDGroupsExpiredMessage, stringTable, {
                NAME: expiredInvitation.to.displayName
              })
          })
        ])
      );
    }
  }

  private getOfflineStyle(isOnline: boolean) {
    if (isOnline) {
      return {};
    } else {
      return { backgroundColor: 'rgba(0,0,0,0.66)' };
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.invitationInterval);
    this.invitationInterval = null;
  }

  public render(): JSX.Element {
    if (this.props.isInvitation) {
      if (this.invitationInterval) {
        window.clearInterval(this.invitationInterval);
        this.invitationInterval = null;
      }
      this.getTimer(this.props.expiration);
    }
    const selectedClass = this.props.selected ? 'selected' : '';
    const roleStyle = this.getRoleStyle();
    const roleMessage = this.props.isInvitation
      ? getTokenizedStringTableValue(StringIDGroupsWaiting, this.props.stringTable, {
          TIME: formatDurationSeconds(this.state.expirationTimer)
        })
      : this.getEntryRoleString();
    const playerName = this.props.groupMember
      ? this.props.groupMember.displayName
      : this.props.invitationReceiver.displayName;
    const leaderBorder =
      this.props.entryRole === 'Leader' || this.props.entryRole === 'Leader - Offline'
        ? { border: '2px solid #ddb100' }
        : null;
    const costumeThumbnailURL = this.getChampionThumbnailURL();
    const championSelectImageURL = this.getChampionSelectURL();

    return (
      <div
        className={`${PlayerEntryContainer} ${selectedClass}`}
        onClick={this.onClickPlayerEntry.bind(this)}
        onContextMenu={this.onClickMenuButton.bind(this)}
        style={this.getOfflineStyle(this.props.groupMember ? this.props.groupMember.isOnline : true)}
      >
        <img src={costumeThumbnailURL} className={PlayerIcon} style={leaderBorder} />
        <div className={PlayerNameContainer}>
          <div className={PlayerName}>{playerName}</div>
          <div className={roleStyle}>{roleMessage}</div>
        </div>
        {this.getMenuButton()}
        {this.props.children}
        <img src={championSelectImageURL} className={PlayerEntryBackground} />
      </div>
    );
  }

  private getEntryRoleString(): string {
    switch (this.props.entryRole) {
      case 'Leader':
        return getStringTableValue(StringIDGroupsLeader, this.props.stringTable);
      case 'Leader - Offline':
        return getStringTableValue(StringIDGroupsLeaderOffline, this.props.stringTable);
      case 'Offline':
        return getStringTableValue(StringIDGroupsOffline, this.props.stringTable);
      default:
        return '';
    }
  }

  private getRoleStyle() {
    if (this.props.isInvitation) {
      return PlayerRoleInvited;
    } else if (this.props.groupMember && this.props.groupMember.isOnline) {
      return PlayerRole;
    } else {
      return PlayerRoleOffline;
    }
  }

  private getChampionThumbnailURL(): string {
    if (this.props.groupMember?.defaultChampion?.portraitID) {
      const portraitPerk = this.props.perksByID[this.props.groupMember.defaultChampion.portraitID];
      if (portraitPerk) {
        return portraitPerk.portraitThumbnailURL;
      }
    }

    return this.props.costume ? this.props.costume.thumbnailURL : '';
  }

  private getChampionSelectURL(): string {
    if (this.props.groupMember?.defaultChampion?.portraitID) {
      const portraitPerk = this.props.perksByID[this.props.groupMember.defaultChampion.portraitID];
      if (portraitPerk) {
        return portraitPerk.portraitChampionSelectImageUrl;
      }
    }

    return this.props.costume ? this.props.costume.championSelectImageURL : '';
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID } = state.store;
  const { stringTable } = state.stringTable;
  const { serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    group: state.teamJoin.group,
    perksByID,
    stringTable,
    serverTimeDeltaMS
  };
}

export const PlayerEntry = connect(mapStateToProps)(APlayerEntry);
