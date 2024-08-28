/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  Group,
  Member,
  PerkDefGQL,
  Player
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Input } from '../Input';
import { hideRightPanel } from '../../redux/navigationSlice';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { game } from '@csegames/library/dist/_baseGame';
import { Button } from '../shared/Button';
import { TeamJoinAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { TeamJoinAPIError } from '../../dataSources/teamJoinNetworkingConstants';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getAccountID } from '@csegames/library/dist/_baseGame/utils/accountUtils';
import { CSETransition } from '../../../shared/components/CSETransition';
import { getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { formatDurationSeconds } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import {
  StringIDGeneralCancel,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../helpers/stringTableHelpers';
import { webConf } from '../../dataSources/networkConfiguration';

const Container = 'TeamJoinPanel-Container';
const Title = 'TeamJoinPanel-Title';
const TitleUnderline = 'TeamJoinPanel-TitleUnderline';
const TitleUnderlineLeft = 'TeamJoinPanel-TitleUnderline-Left';
const TitleUnderlineRight = 'TeamJoinPanel-TitleUnderline-Right';
const InviteContainer = 'TeamJoinPanel-InviteContainer';
const InputStyles = 'TeamJoinPanel-InputStyles';
const ResultMessage = 'TeamJoinPanel-ResultMessage';
const ModalButtonStyles = 'TeamJoinPanel-ModalButtonStyles';
const ButtonsContainer = 'TeamJoinPanel-ButtonsContainer';
const GroupHeader = 'TeamJoinPanel-GroupHeader';
const GroupHeaderText = 'TeamJoinPanel-GroupHeader-Text';
const PartyContainer = 'TeamJoinPanel-PartyContainer';
const PartyMemberContainer = 'TeamJoinPanel-PartyMember-Container';
const PartyMemberIcon = 'TeamJoinPanel-PartyMember-Icon';
const PartyMemberTextContainer = 'TeamJoinPanel-PartyMember-TextContainer';
const PartyMemberDisplayName = 'TeamJoinPanel-PartyMember-DisplayName';
const PartyMemberRoleTag = 'TeamJoinPanel-PartyMember-RoleTag';
const PartyMemberMenuButton = 'TeamJoinPanel-PartyMember-MenuButton';
const AccordianMenu = 'TeamJoinPanel-PartyMember-AccordianMenu';
const AccordianRow = 'TeamJoinPanel-PartyMember-AccordianRow';

const StringIDTeamJoinPanelSent = 'TeamJoinPanelSent';
const StringIDTeamJoinPanelSend = 'TeamJoinPanelSend';
const StringIDTeamJoinPanelTitle = 'TeamJoinPanelTitle';
const StringIDTeamJoinPanelEnterNamePlaceholder = 'TeamJoinPanelEnterNamePlaceholder';
const StringIDTeamJoinPanelGroup = 'TeamJoinPanelGroup';
const StringIDTeamJoinPanelPromote = 'TeamJoinPanelPromote';
const StringIDTeamJoinPanelEnterNameTitle = 'TeamJoinPanelEnterNameTitle';
const StringIDTeamJoinPanelInviteSuccess = 'TeamJoinPanelInviteSuccess';
const StringIDTeamJoinPanelInvalidTeamData = 'TeamJoinPanelInvalidTeamData';
const StringIDTeamJoinPanelUnknownError = 'TeamJoinPanelUnknownError';
const StringIDTeamJoinPanelInviteOffline = 'TeamJoinPanelInviteOffline';
const StringIDTeamJoinPanelInviteAlreadyInGroup = 'TeamJoinPanelInviteAlreadyInGroup';
const StringIDTeamJoinPanelGenericError = 'TeamJoinPanelGenericError';
const StringIDTeamJoinPanelWaitingSeconds = 'TeamJoinPanelWaitingSeconds';
const StringIDTeamJoinPanelWaiting = 'TeamJoinPanelWaiting';
const StringIDTeamJoinPanelLeader = 'TeamJoinPanelLeader';
const StringIDTeamJoinPanelOfflineLeader = 'TeamJoinPanelOfflineLeader';
const StringIDTeamJoinPanelOffline = 'TeamJoinPanelOffline';

interface GroupMemberDisplayData {
  id: string;
  displayName: string;
  isLeader: boolean;
  isOnline: boolean;
  isInvitation: boolean;
  championThumbnailURL: string;
  roleText: string;
  showMenu: boolean;
}

interface State {
  inviteName: string;
  resultMessage: string;
  resultIsSuccess: boolean;
  openMenuIndex: number;
  clockTick: number;
}

interface ReactProps {}

interface InjectedProps {
  defaultGroupCapacity: number;
  group: Group;
  perksByID: Dictionary<PerkDefGQL>;
  championCostumes: ChampionCostumeInfo[];
  playerDisplayName: string;
  playerCharacterId: string;
  champions: ChampionGQL[];
  defaultChampionID: string;
  stringTable: Dictionary<StringTableEntryDef>;
  serverTimeDeltaMS: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ATeamJoinPanel extends React.Component<Props, State> {
  private invitationClock: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      inviteName: '',
      resultMessage: ' ', // Needs to be non-empty, else the div gets optimized out of existence.
      resultIsSuccess: true,
      openMenuIndex: -1,
      clockTick: 0
    };
  }

  render(): JSX.Element {
    const sendText: string =
      this.state.resultIsSuccess && this.state.resultMessage.length > 1 && this.state.inviteName.length < 1
        ? getStringTableValue(StringIDTeamJoinPanelSent, this.props.stringTable)
        : getStringTableValue(StringIDTeamJoinPanelSend, this.props.stringTable);

    return (
      <div className={Container}>
        <div className={Title}>{getStringTableValue(StringIDTeamJoinPanelTitle, this.props.stringTable)}</div>
        <div className={TitleUnderline}>
          <div className={TitleUnderlineLeft} />
          <div className={TitleUnderlineRight} />
        </div>
        <div className={InviteContainer}>
          <input
            className={`${Input} ${InputStyles} ${!this.state.resultIsSuccess ? 'error' : ''}`}
            type={'text'}
            placeholder={getStringTableValue(StringIDTeamJoinPanelEnterNamePlaceholder, this.props.stringTable)}
            value={this.state.inviteName}
            onChange={this.onInviteNameChange.bind(this)}
          />
          {this.renderResultMessage()}
          <div className={ButtonsContainer}>
            <Button
              text={sendText}
              type={'blue'}
              styles={ModalButtonStyles}
              onClick={this.onSendInviteClick.bind(this)}
            />
            <Button
              text={getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
              type={'blue-outline'}
              styles={ModalButtonStyles}
              onClick={this.onCancelClick.bind(this)}
            />
          </div>
        </div>
        <div className={GroupHeader}>
          <div className={GroupHeaderText}>
            {getStringTableValue(StringIDTeamJoinPanelGroup, this.props.stringTable)}
          </div>
          <div className={GroupHeaderText}>{`(${this.props.group?.members.length ?? 1}/${
            this.props.group?.capacity ?? this.props.defaultGroupCapacity
          })`}</div>
        </div>
        <div className={PartyContainer}>{this.getSortedGroupMemberData().map(this.renderPartyMember.bind(this))}</div>
      </div>
    );
  }

  componentWillUnmount(): void {
    if (this.invitationClock) {
      clearInterval(this.invitationClock);
      this.invitationClock = null;
    }
  }

  private renderResultMessage(): React.ReactNode {
    if (this.state.resultMessage) {
      return (
        <div className={`${ResultMessage} ${!this.state.resultIsSuccess ? 'error' : ''}`}>
          {this.state.resultMessage}
        </div>
      );
    }
    return null;
  }

  private renderPartyMember(data: GroupMemberDisplayData, index: number): React.ReactNode {
    const isOpen = index === this.state.openMenuIndex;
    const openClass = isOpen ? 'open' : '';
    return (
      <div key={index}>
        <div className={`${PartyMemberContainer} ${openClass}`}>
          <img className={PartyMemberIcon} src={data.championThumbnailURL} />
          <div className={PartyMemberTextContainer}>
            <div className={PartyMemberDisplayName}>{data.displayName}</div>
            <div className={PartyMemberRoleTag}>{data.roleText}</div>
          </div>
          {data.showMenu && (
            <img
              className={`${PartyMemberMenuButton} ${openClass}`}
              src={isOpen ? 'images/fullscreen/arrow_right.png' : 'images/fullscreen/startscreen/hamburger-menu.png'}
              onClick={this.onMenuClick.bind(this, index)}
            />
          )}
        </div>
        <CSETransition
          show={isOpen}
          className={AccordianMenu}
          entryAnimation={'accordian'}
          exitAnimation={'accordian'}
          removeWhenHidden={true}
        >
          <div className={AccordianRow} onClick={this.onKickClick.bind(this, data)}>{`> Kick ${data.displayName}`}</div>
          {data.isOnline && !data.isInvitation && (
            <div className={AccordianRow} onClick={this.onPromoteClick.bind(this, data)}>
              {getTokenizedStringTableValue(StringIDTeamJoinPanelPromote, this.props.stringTable, {
                NAME: data.displayName
              })}
            </div>
          )}
        </CSETransition>
      </div>
    );
  }

  private async onKickClick(data: GroupMemberDisplayData): Promise<void> {
    const res = await TeamJoinAPI.KickV1(webConf, data.id);
    const success = res.ok;

    // On success, we should receive a Group subscription update elsewhere, which will update the state.
    // Therefore, not checking it here.
    if (!success) {
      // Failure to kick.
      try {
        const data: TeamJoinAPIError = JSON.parse(res.data);
        console.error({
          msg: 'Kick from Group network call failed.',
          data: data
        });
      } catch (e) {
        console.error({
          msg: 'Kick from Group Error Json Parse Failed',
          data: res.data,
          err: e
        });
      }
    }

    this.setState({ openMenuIndex: -1 });
  }

  private async onPromoteClick(data: GroupMemberDisplayData): Promise<void> {
    const res = await TeamJoinAPI.SetRankV1(webConf, data.id, 'leader');
    const success = res.ok;

    // On success, we should receive a Group subscription update elsewhere, which will update the state.
    // Therefore, not checking it here.
    if (!success) {
      // Failure to makeLeader.
      try {
        const data: TeamJoinAPIError = JSON.parse(res.data);
        console.error({
          msg: 'makeLeader network call failed',
          data: data
        });
      } catch (e) {
        console.error({
          msg: 'makeLeader error JSON failed to parse',
          data: res.data,
          err: e
        });
      }
    }

    this.setState({ openMenuIndex: -1 });
  }

  private onMenuClick(index: number): void {
    this.setState({ openMenuIndex: this.state.openMenuIndex !== index ? index : -1 });
  }

  private onInviteNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ inviteName: e.target.value });
  }

  private onCancelClick(): void {
    this.props.dispatch(hideRightPanel());
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_NO);
  }

  private async onSendInviteClick(): Promise<void> {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES);

    if (!this.state.inviteName || this.state.inviteName.length < 1) {
      this.setState({
        resultMessage: getStringTableValue(StringIDTeamJoinPanelEnterNameTitle, this.props.stringTable),
        resultIsSuccess: false
      });
      return;
    }

    const res = await TeamJoinAPI.CreateInvitationV1(webConf, undefined, this.state.inviteName);
    const success = res.ok;

    if (success) {
      // A successful invite should trigger the GraphQL subscription in teamJoinReducer to update party status.
      // The subscription gives better data, but we do a few updates here just so we don't have to keep track
      // of the source of the subscription changes in order to update TeamJoinPanel's internal state.
      try {
        const newGroup: Group = JSON.parse(res.data);

        const groupIsFull = newGroup.size >= newGroup.capacity;
        if (groupIsFull) {
          // Only close the dialog automatically if the group is at max capacity.
          this.props.dispatch(hideRightPanel());
        }
        this.setState({
          inviteName: '',
          resultMessage: getTokenizedStringTableValue(StringIDTeamJoinPanelInviteSuccess, this.props.stringTable, {
            NAME: this.state.inviteName
          }),
          resultIsSuccess: true
        });
      } catch (e) {
        this.setState({
          resultMessage: getStringTableValue(StringIDTeamJoinPanelInvalidTeamData, this.props.stringTable),
          resultIsSuccess: false
        });
      }
    } else {
      // failed
      game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES_FAILURE);
      try {
        const data: TeamJoinAPIError = JSON.parse(res.data);
        this.setState({ resultMessage: this.buildErrorMessage(data), resultIsSuccess: false });
      } catch (e) {
        this.setState({
          resultMessage: getStringTableValue(StringIDTeamJoinPanelUnknownError, this.props.stringTable),
          resultIsSuccess: false
        });
      }
    }
  }

  private buildErrorMessage(error: TeamJoinAPIError): string {
    switch (error.type) {
      case 'DoNotDisturbEnabled':
      case 'PlayersOffline':
        return getTokenizedStringTableValue(StringIDTeamJoinPanelInviteOffline, this.props.stringTable, {
          NAME: this.state.inviteName
        });
      case 'PlayerJoinedOtherGroup':
        return getTokenizedStringTableValue(StringIDTeamJoinPanelInviteAlreadyInGroup, this.props.stringTable, {
          NAME: this.state.inviteName
        });
      default:
        return getTokenizedStringTableValue(StringIDTeamJoinPanelGenericError, this.props.stringTable, {
          TYPE: error.type
        });
    }
  }

  private getSortedGroupMemberData(): GroupMemberDisplayData[] {
    const data: GroupMemberDisplayData[] = [];

    let hasInvitations: boolean = false;
    if (this.props.group) {
      const isLocalPlayerLeader = this.props.group.leader?.id === getAccountID(game.accessToken);

      this.props.group.members.forEach((member) => {
        const datum: GroupMemberDisplayData = {
          id: member.id,
          displayName: member.displayName,
          isLeader: this.props.group.leader?.id === member.id,
          isOnline: member.isOnline,
          isInvitation: false,
          championThumbnailURL: this.getChampionThumbnailURL(member),
          roleText: this.getRole(member),
          showMenu: member.id !== this.props.group.leader?.id && isLocalPlayerLeader
        };
        data.push(datum);
      });

      this.props.group.invitations.forEach((invitation) => {
        hasInvitations = true;
        const secondsRemaining = Math.max(
          0,
          (new Date(invitation.expires).getTime() - getServerTimeMS(this.props.serverTimeDeltaMS)) / 1000
        );
        const roleText = secondsRemaining
          ? getTokenizedStringTableValue(StringIDTeamJoinPanelWaitingSeconds, this.props.stringTable, {
              SECONDS: formatDurationSeconds(secondsRemaining)
            })
          : getStringTableValue(StringIDTeamJoinPanelWaiting, this.props.stringTable);
        const datum: GroupMemberDisplayData = {
          id: invitation.to.id,
          displayName: invitation.to.displayName,
          isLeader: false,
          isOnline: true, // Value doesn't matter for invitations.
          isInvitation: true,
          championThumbnailURL: this.getChampionThumbnailURL(invitation.to),
          roleText,
          showMenu: isLocalPlayerLeader
        };
        data.push(datum);
      });
    } else {
      // If there is no group, we still show the local player.
      const datum: GroupMemberDisplayData = {
        id: this.props.playerCharacterId,
        displayName: this.props.playerDisplayName,
        isLeader: false,
        isOnline: true,
        isInvitation: false,
        championThumbnailURL: this.getPlayerThumbnailURL(),
        roleText: '',
        showMenu: false
      };
      data.push(datum);
    }

    // If there are active invitations, we want to run a timer that ticks to update the countdown to expiration.
    if (hasInvitations && !this.invitationClock) {
      this.invitationClock = window.setInterval(this.onInvitationClockTick.bind(this), 1000);
    } else if (!hasInvitations && this.invitationClock) {
      clearInterval(this.invitationClock);
      this.invitationClock = null;
    }

    return data;
  }

  private onInvitationClockTick(): void {
    this.setState({ clockTick: this.state.clockTick + 1 });
  }

  private getPlayerThumbnailURL(): string {
    let defaultChampion = this.props.champions.find((c) => c.championID == this.props.defaultChampionID);

    if (defaultChampion?.portraitPerkID) {
      const portraitPerk = this.props.perksByID[defaultChampion.portraitPerkID];
      if (portraitPerk) {
        return portraitPerk.portraitThumbnailURL;
      }
    }

    if (defaultChampion?.costumePerkID != '') {
      const costume = this.props.championCostumes.find((costume) => costume.id == defaultChampion?.costumePerkID);
      if (costume) {
        return costume.thumbnailURL;
      }
    }

    return this.props.championCostumes[0]?.thumbnailURL ?? '';
  }

  private getChampionThumbnailURL(player: Player): string {
    if (player.champion?.portraitID) {
      const portraitPerk = this.props.perksByID[player.champion.portraitID];
      if (portraitPerk) {
        return portraitPerk.portraitThumbnailURL;
      }
    }

    if (player.champion?.costumeID) {
      const costume = this.props.championCostumes.find((costume) => costume.id == player.champion.costumeID);
      if (costume) {
        return costume.thumbnailURL;
      }
    }

    return this.props.championCostumes[0]?.thumbnailURL ?? '';
  }

  private getRole(groupMember: Member): string {
    if (groupMember.id == this.props.group.leader.id) {
      if (groupMember.isOnline) {
        return getStringTableValue(StringIDTeamJoinPanelLeader, this.props.stringTable);
      } else {
        return getStringTableValue(StringIDTeamJoinPanelOfflineLeader, this.props.stringTable);
      }
    } else if (groupMember.isOnline) {
      return '';
    } else {
      return getStringTableValue(StringIDTeamJoinPanelOffline, this.props.stringTable);
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { defaultGroupCapacity, group } = state.teamJoin;
  const { championCostumes } = state.championInfo;
  const { champions, defaultChampionID } = state.profile;
  const { stringTable } = state.stringTable;
  const { serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    defaultGroupCapacity,
    group,
    perksByID: state.store.perksByID,
    championCostumes,
    playerDisplayName: state.user.displayName,
    playerCharacterId: state.user.id,
    champions,
    defaultChampionID,
    stringTable,
    serverTimeDeltaMS
  };
}

export const TeamJoinPanel = connect(mapStateToProps)(ATeamJoinPanel);
