/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { getVoiceChatStyle, updatePlayerToReport } from '../../../redux/voiceChatSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { ChampionInfo, Group, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import {
  VoiceChatMemberSettings,
  VoiceChatMemberStatus
} from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { FriendsList } from '../../../redux/entitiesSlice';
import { PlayerEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { Overlay, showOverlay } from '../../../redux/navigationSlice';
import { CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { IDLookupTable } from '../../../redux/gameSlice';
import { updateAccountIDsToMute } from '../../../redux/localStorageSlice';

const Container = 'MenuModal-RightOptions-Container';
const ScrollableArea = 'MenuModal-RightOptions-ScrollableArea';
const TitleContainer = 'MenuModal-RightOptions-TitleContainer';
const SocialTitleContainer = 'MenuModal-RightOptions-SocialTitleContainer';
const MenuTitle = 'MenuModal-RightOptions-MenuTitle';
const PartyCount = 'MenuModal-RightOptions-PartyCount';
const MuteAllButton = 'MenuModal-RightOptions-MuteAllButton';
const MuteAllButtonMuted = 'MenuModal-RightOptions-MuteAllButtonMuted';
const ItemContainer = 'MenuModal-RightOptions-ItemContainer';
const Item = 'MenuModal-RightOptions-Item';
const NameContainer = 'MenuModal-RightOptions-NameContainer';
const ProfileIcon = 'MenuModal-RightOptions-ProfileIcon';
const PlayerName = 'MenuModal-RightOptions-PlayerName';
const Leader = 'MenuModal-RightOptions-Leader';
const ButtonContainer = 'MenuModal-RightOptions-ButtonContainer';
const TextChatIcon = 'MenuModal-RightOptions-TextChatIcon';
const TextChatIconHidden = 'MenuModal-RightOptions-TextChatIconHidden';
const TextChatIconMuted = 'MenuModal-RightOptions-TextChatIconMuted';
const SubMenuIcon = 'MenuModal-RightOptions-SubMenuIcon';
const SubMenu = 'MenuModal-RightOptions-SubMenu';
const SubMenuItem = 'MenuModal-RightOptions-SubMenuItem';

const StringIDMainMenuRightSocial = 'MainMenuRightSocial';
const StringIDMainMenuRightMuteAll = 'MainMenuRightMuteAll';
const StringIDMainMenuRightUnMuteAll = 'MainMenuRightUnmuteAll';
const StringIDMainMenuLeader = 'GroupsLeader';
const StringIDMainMenuRightReportPlayer = 'MainMenuRightReportPlayer';

interface InjectedProps {
  friends: FriendsList;
  voiceChatMembers: Dictionary<VoiceChatMemberSettings>;
  stringTable: Dictionary<StringTableEntryDef>;
  group: Group;
  champions: ChampionInfo[];
  raceDefs: IDLookupTable<CharacterRaceDef>;
  blockedList: Dictionary<number>;
  dispatch?: Dispatch;
}

interface ComponentProps {}

type Props = InjectedProps & ComponentProps;

interface State {
  selectedPlayer: number;
  mutedAll: boolean;
  hoveredPlayer: number;
}

class ARightOptions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedPlayer: -1,
      hoveredPlayer: -1,
      mutedAll: false
    };
  }

  private onMouseEnter(index: number) {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
    this.setState({ hoveredPlayer: index });
  }

  private onMouseLeave() {
    this.setState({ hoveredPlayer: -1 });
  }

  private toggleSubMenu(index: number) {
    if (this.state.selectedPlayer == index) {
      this.setState({ selectedPlayer: -1 });
    } else {
      this.setState({ selectedPlayer: index });
    }
  }

  private toggleMute(accountID: string) {
    const settings = this.props.voiceChatMembers[accountID];
    if (!settings) {
      console.error(`Tried to toggle mute of a voice chat participant ${accountID}, but there's no such participant.`);
      return;
    }
    const shouldMute = settings.status != VoiceChatMemberStatus.Muted;
    clientAPI.setVoiceChatMemberMuted(accountID, shouldMute);
  }

  private toggleTextChatMute(accountID: string) {
    if (!accountID) {
      return;
    }
    const toBeMuted = this.props.blockedList[accountID] == null;
    this.props.dispatch(updateAccountIDsToMute({ accountIDs: [accountID], toBeMuted }));
  }

  private toggleMuteAll() {
    const accountIDs: string[] = [];
    const toBeMuted = !this.state.mutedAll;
    for (const [accountID] of Object.entries(this.props.voiceChatMembers)) {
      clientAPI.setVoiceChatMemberMuted(accountID, toBeMuted);
      accountIDs.push(accountID);
    }
    // if you have mutedAll, unmute them.
    this.props.dispatch(updateAccountIDsToMute({ accountIDs, toBeMuted }));
    this.setState({
      mutedAll: !this.state.mutedAll
    });
  }

  private getIsAllMutedText(): string {
    if (this.state.mutedAll) {
      return getStringTableValue(StringIDMainMenuRightUnMuteAll, this.props.stringTable);
    }
    return getStringTableValue(StringIDMainMenuRightMuteAll, this.props.stringTable);
  }

  private getSubMenuArrow(isOpen: boolean): string {
    return isOpen ? 'fs-icon-misc-caret-up' : 'fs-icon-misc-caret-down';
  }

  private getIsTextChatMuted(accountID: string) {
    return !!this.props.blockedList[accountID];
  }

  private onClickReportPlayer(friend: PlayerEntityStateModel) {
    this.props.dispatch(updatePlayerToReport(friend));
    this.props.dispatch(showOverlay(Overlay.ReportPlayer));
  }

  private renderInGamePlayerItem(friend: PlayerEntityStateModel, index: number): JSX.Element {
    let settings: VoiceChatMemberSettings = this.props.voiceChatMembers[friend.accountID];
    if (!settings) {
      settings = { status: VoiceChatMemberStatus.Disabled, volume: 0 };
    }

    const raceDef = this.props.raceDefs[friend.race];
    const portraitURL = friend.portraitURL?.length > 0 ? friend.portraitURL : raceDef.thumbnailURL;

    const isOpen: boolean = this.state.selectedPlayer == index;
    const isHovered: boolean = this.state.hoveredPlayer == index;
    const isTalking: boolean = settings.status == VoiceChatMemberStatus.Speaking;
    const isVoiceChatMuted: boolean = settings.status == VoiceChatMemberStatus.Muted;
    const isVoiceChatDisabled: boolean = settings.status == VoiceChatMemberStatus.Disabled;
    const isVoiceChatNotHidden = isHovered || isTalking || isOpen || isVoiceChatMuted || isVoiceChatDisabled;
    const [icon, iconStyle] = getVoiceChatStyle(settings, isVoiceChatNotHidden);

    const subMenuText = getStringTableValue(StringIDMainMenuRightReportPlayer, this.props.stringTable);
    const isTextChatMuted: Boolean = this.getIsTextChatMuted(friend.accountID);
    const textChatIcon = isTextChatMuted ? 'fs-icon-misc-chat-mute' : 'fs-icon-misc-chat';
    const isTextChatIconNotHidden = isHovered || isOpen || isTextChatMuted;
    const textChatStyle = isTextChatMuted
      ? TextChatIconMuted
      : isTextChatIconNotHidden
      ? TextChatIcon
      : TextChatIconHidden;

    const isLeader = this.props?.group?.leader.id == friend.accountID;

    return (
      <div className={ItemContainer}>
        <div className={Item} onMouseEnter={() => this.onMouseEnter(index)} onMouseLeave={() => this.onMouseLeave()}>
          <img className={ProfileIcon} src={portraitURL}></img>
          <div className={NameContainer} onClick={() => this.toggleSubMenu(index)}>
            <span className={PlayerName}>{friend.name}</span>
            {isLeader && (
              <span className={Leader}>{getStringTableValue(StringIDMainMenuLeader, this.props.stringTable)}</span>
            )}
          </div>
          <div className={ButtonContainer}>
            {
              <span
                className={`${textChatStyle} ${textChatIcon}`}
                onClick={this.toggleTextChatMute.bind(this, friend.accountID)}
              ></span>
            }
            <span className={icon} style={iconStyle} onClick={this.toggleMute.bind(this, friend.accountID)} />
            <span
              className={`${SubMenuIcon} ${this.getSubMenuArrow(isOpen)}`}
              onClick={() => this.toggleSubMenu(index)}
            ></span>
          </div>
        </div>
        <div className={`${SubMenu} ${isOpen ? 'open' : 'closed'}`}>
          <a className={SubMenuItem} onClick={() => this.onClickReportPlayer(friend)}>
            {subMenuText}
          </a>
        </div>
      </div>
    );
  }

  public render() {
    if (!this.props.voiceChatMembers) {
      console.error("The voiceChatMembers property isn't set. Can't render.");
      return <div className={MenuTitle} />;
    }

    // Only include voice chat participants that are friends (filters out the current player).
    const membersToDisplay: PlayerEntityStateModel[] = [];
    for (const friend of Object.values(this.props.friends)) {
      membersToDisplay.push(friend);
    }

    // Sort members by alphabetical order.
    membersToDisplay.sort((a, b) => a.name.localeCompare(b.name));

    const mutedAllStyle = this.state.mutedAll ? MuteAllButtonMuted : MuteAllButton;

    return (
      <div className={Container}>
        <div className={TitleContainer}>
          <div className={SocialTitleContainer}>
            <span className={MenuTitle}>
              {getStringTableValue(StringIDMainMenuRightSocial, this.props.stringTable)}
            </span>
            <span className={PartyCount}>{(membersToDisplay.length + 1).toString()}</span>
          </div>
          <span className={mutedAllStyle} onClick={this.toggleMuteAll.bind(this)}>
            {this.getIsAllMutedText()}
          </span>
        </div>
        <div className={ScrollableArea}>
          {membersToDisplay.map((member, index) => this.renderInGamePlayerItem(member, index))}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ComponentProps): Props {
  return {
    friends: state.entities.friends,
    voiceChatMembers: state.voiceChat.members,
    stringTable: state.stringTable.stringTable,
    group: state.teamJoin.group,
    champions: state.championInfo.champions,
    raceDefs: state.game.characterRaceDefs,
    blockedList: state.localStorage.blockedList,
    ...ownProps
  };
}

export const RightOptions = connect(mapStateToProps)(ARightOptions);
