/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, AppDispatch, RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  StringIDGeneralAccept,
  StringIDGeneralCancel,
  StringIDGeneralIgnore,
  StringIDGeneralRemove,
  StringIDGeneralUnknownClass
} from '../../helpers/stringTableHelpers';
import { BorderType, BorderBackground, FactionBorder } from '../FactionBorder';
import { getFactionData } from '../../gameData/factionData';
import { FactionScrollArea } from '../FactionScrollArea';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem } from '../../redux/contextMenuSlice';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { hideModal, ModalModel, ModalParams, showModal } from '../../redux/modalsSlice';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { FactionButton } from '../FactionButton';
import { FactionBorderSelectable } from '../FactionBorderSelectable';
import { Chat } from '../chat/Chat';
import { showAddFriendFoeModal } from './AddFriendFoeDialog';
import { AddEditFriendFoeNoteDialog } from './AddEditFriendFoeNoteDialog';
import {
  Account,
  Character,
  Friend,
  FriendInvite,
  UserOverrides
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { UserInteractions } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import {
  callSocialSetPermissions,
  callSocialSetUserPermissions,
  SocialSetPermissionsParams
} from '../../helpers/rest/socialRestCalls';
import {
  AcceptFriendInviteParams,
  callAcceptFriendInvite,
  callRejectAllFriendInvites,
  callRejectFriendInvite,
  callRemoveFriend,
  RejectFriendInviteParams
} from '../../helpers/rest/friendsRestCalls';
import { FactionCheckbox } from '../FactionCheckbox';
import { splitFriendInvites } from '../../dataSources/socialService';
import { showCallErrorModalIfFailed } from '../../helpers/errorConversionHelpers';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';

interface PlayerDisplayData {
  account: Account;
  character: Character | null;
  note: string;
}

// CSS classes
const Root = 'HUD-FriendFoeList-Root';
const MemberListSection = 'HUD-FriendFoeList-Roster-MemberListSection';
const NavTabs = 'HUD-FriendFoeList-NavTabs';
const NavTab = 'HUD-FriendFoeList-NavTab';
const TabLabel = 'HUD-FriendFoeList-TabLabel';
const TabBadgeContainer = 'HUD-FriendFoeList-TabBadgeContainer';
const TabBadgeLabel = 'HUD-FriendFoeList-TabBadgeLabel';
const TaperBar = 'HUD-FriendFoeList-TaperBar';
const MemberListTabNav = 'HUD-FriendFoeList-Roster-MemberList-TabNav';
const MemberListHeader = 'HUD-FriendFoeList-Roster-MemberList-Header';
const SortButton = 'HUD-FriendFoeList-Roster-MemberList-SortButton';
const MemberIndexCell = 'HUD-FriendFoeList-Roster-MemberList-MemberIndexCell';
const MemberNameCell = 'HUD-FriendFoeList-Roster-MemberList-MemberNameCell';
const MemberNameStack = 'HUD-FriendFoeList-Roster-MemberList-MemberNameStack';
const MemberClassCell = 'HUD-FriendFoeList-Roster-MemberList-MemberClassCell';
const MemberClassIcon = 'HUD-FriendFoeList-Roster-MemberList-MemberClassIcon';
const MemberNoteCell = 'HUD-FriendFoeList-Roster-MemberList-MemberNoteCell';
const LegendText = 'HUD-FriendFoeList-Roster-MemberList-LegendText';
const SortDirectionIndicator = 'HUD-FriendFoeList-Roster-MemberList-SortDirectionIndicator';
const MemberListScrollRegion = 'HUD-FriendFoeList-Roster-MemberList-ScrollRegion';
const MemberListScrollArea = 'HUD-FriendFoeList-Roster-MemberList-ScrollArea';
const MemberListContent = 'HUD-FriendFoeList-Roster-MemberList-Content';
const MemberListRow = 'HUD-FriendFoeList-Roster-MemberList-Row';
const MemberListDataText = 'HUD-FriendFoeList-Roster-MemberList-DataText';
const AddButton = 'HUD-FriendFoeList-AddButton';
const BlockInvitesCheckbox = 'HUD-FriendFoeList-BlockInvitesCheckbox';
const BlockInvitesCheckboxLabel = 'HUD-FriendFoeList-BlockInvitesCheckboxLabel';
const InvitesSectionContainer = 'HUD-FriendFoeList-InvitesSectionContainer';
const ReceivedInvitesSection = 'HUD-FriendFoeList-ReceivedInvitesSection';
const SentInvitesSection = 'HUD-FriendFoeList-SentInvitesSection';
const InvitesSectionContent = 'HUD-FriendFoeList-InvitesSectionContent';
const InvitesSectionTitle = 'HUD-FriendFoeList-InvitesSectionTitle';
const InviteRowContainer = 'HUD-FriendFoeList-InviteRowContainer';
const InviteNumberLabel = 'HUD-FriendFoeList-InviteNumberLabel';
const InviteName = 'HUD-FriendFoeList-InviteName';
const InviteButtonSection = 'HUD-FriendFoeList-InviteButtonSection';
const InviteActionButton = 'HUD-FriendFoeList-InviteActionButton';
const RejectAllButton = 'HUD-FriendFoeList-RejectAllButton';

// String IDs
const StringIDFriendFoeFriendList = 'FriendFoeFriendList';
const StringIDFriendFoeFoeList = 'FriendFoeFoeList';
const StringIDFriendFoeInvitationsList = 'FriendFoeInvitationsList';
const StringIDFriendFoeLegendMemberName = 'FriendFoeLegendMemberName';
const StringIDFriendFoeLegendMemberClass = 'FriendFoeLegendMemberClass';
const StringIDFriendFoeLegendMemberNote = 'FriendFoeLegendMemberNote';
const StringIDFriendFoeAddFriend = 'FriendFoeAddFriend';
const StringIDFriendFoeAddFoe = 'FriendFoeAddFoe';
const StringIDFriendFoeRemoveFriend = 'FriendFoeRemoveFriend';
const StringIDFriendFoeRemoveFoe = 'FriendFoeRemoveFoe';
const StringIDFriendFoeAddNote = 'FriendFoeAddNote';
const StringIDChatScopeNameWhisper = 'ChatScopeNameWhisper';
const StringIDFriendFoeReceivedInvitationsTitle = 'FriendFoeReceivedInvitationsTitle';
const StringIDFriendFoeSentInvitationsTitle = 'FriendFoeSentInvitationsTitle';
const StringIDFriendFoeBlockInvites = 'FriendFoeBlockInvites';
const StringIDFriendFoeRejectAll = 'FriendFoeRejectAll';

enum ListType {
  Friends = 'Friends',
  Foes = 'Foes',
  Invitations = 'Invitations'
}

enum SortCategory {
  Name = 'Name',
  Class = 'Class',
  Note = 'Note'
}

enum SortOrder {
  None = 0,
  Ascending,
  Descending,
  COUNT
}

interface State {
  listType: ListType;
  sort: [SortCategory, SortOrder][];
}

interface ReactProps {}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
  self: PlayerEntityStateModel;
  defs: GameDefsState;
  friends: Friend[];
  friendInvites: FriendInvite[];
  selfAccountID: string;
  userOverrides: UserOverrides[];
  allowedInteractions: UserInteractions;
  blockedInteractions: UserInteractions;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AFriendFoeList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      listType: ListType.Friends,
      sort: []
    };
  }

  render(): React.ReactNode {
    const [invitesSent, invitesReceived] = splitFriendInvites(this.props.friendInvites, this.props.selfAccountID);

    return (
      <div className={Root}>
        <div className={MemberListSection}>
          {this.renderNavTabs(invitesReceived)}
          {this.state.listType === ListType.Friends ? this.renderFriendList() : null}
          {this.state.listType === ListType.Foes ? this.renderBlockList() : null}
          {this.state.listType === ListType.Invitations ? this.renderInvitations(invitesSent, invitesReceived) : null}
        </div>
        <FactionCheckbox
          className={BlockInvitesCheckbox}
          labelClassName={BlockInvitesCheckboxLabel}
          labelOnLeft
          labelText={getStringTableValue(StringIDFriendFoeBlockInvites, this.props.stringTable)}
          isChecked={this.getAreInvitesBlocked()}
          onCheckedChanged={this.onInviteBlockingChanged.bind(this)}
          soundEventClicked={SoundEvents.PLAY_UI_CHAT_CHECKBOX}
        />
      </div>
    );
  }

  private renderNavTabs(invitesReceived: FriendInvite[]): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div className={MemberListTabNav}>
        <div className={NavTabs}>
          {this.renderNavTab(ListType.Friends, StringIDFriendFoeFriendList)}
          {this.renderNavTab(ListType.Foes, StringIDFriendFoeFoeList)}
          {this.renderNavTab(ListType.Invitations, StringIDFriendFoeInvitationsList, invitesReceived.length)}
        </div>
        <img className={TaperBar} src={factionData.taperBarImage} />
      </div>
    );
  }

  private renderNavTab(listType: ListType, labelStringID: string, badgeCount: number = 0): React.ReactNode {
    return (
      <FactionBorderSelectable
        className={NavTab}
        isSelected={this.state.listType === listType}
        onSelected={this.onNavTabSelected.bind(this, listType)}
        background={BorderBackground.PatternSmall}
        includeBottom={false}
      >
        <div className={TabLabel}>{getStringTableValue(labelStringID, this.props.stringTable)}</div>
        {badgeCount > 0 ? (
          <FactionBorder
            className={TabBadgeContainer}
            type={BorderType.Secondary}
            background={BorderBackground.Darken}
            includeBottom={false}
          >
            <div className={TabBadgeLabel} style={{ color: getFactionData(this.props.uiFactionID).targetBorderColor }}>
              {badgeCount}
            </div>
          </FactionBorder>
        ) : null}
      </FactionBorderSelectable>
    );
  }

  private renderFriendList(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <>
        <div className={MemberListHeader}>
          <div className={MemberIndexCell} />
          <div
            className={`${SortButton} ${MemberNameCell}`}
            onClick={this.shiftSortOrder.bind(this, SortCategory.Name)}
          >
            <div className={LegendText}>
              {getStringTableValue(StringIDFriendFoeLegendMemberName, this.props.stringTable)}
            </div>
            <img className={this.getSortClassName(SortCategory.Name)} src={factionData.arrowPointerImage} />
          </div>
          <div
            className={`${SortButton} ${MemberClassCell}`}
            onClick={this.shiftSortOrder.bind(this, SortCategory.Class)}
          >
            <div className={LegendText}>
              {getStringTableValue(StringIDFriendFoeLegendMemberClass, this.props.stringTable)}
            </div>
            <img className={this.getSortClassName(SortCategory.Class)} src={factionData.arrowPointerImage} />
          </div>
          <div
            className={`${SortButton} ${MemberNoteCell}`}
            onClick={this.shiftSortOrder.bind(this, SortCategory.Note)}
          >
            <div className={LegendText}>
              {getStringTableValue(StringIDFriendFoeLegendMemberNote, this.props.stringTable)}
            </div>
            <img className={this.getSortClassName(SortCategory.Note)} src={factionData.arrowPointerImage} />
          </div>
        </div>
        <div className={MemberListScrollRegion}>
          <FactionScrollArea
            className={MemberListScrollArea}
            borderType={BorderType.Primary}
            background={BorderBackground.PatternLarge}
            showEmptyTrack
          >
            <div className={MemberListContent}>{this.getSortedPlayers().map(this.renderFriendRow.bind(this))}</div>
          </FactionScrollArea>
        </div>
        <FactionButton className={AddButton} onClick={this.onAddClicked.bind(this, true)}>
          {getStringTableValue(StringIDFriendFoeAddFriend, this.props.stringTable)}
        </FactionButton>
      </>
    );
  }

  private renderBlockList(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <>
        <div className={MemberListHeader}>
          <div className={MemberIndexCell} />
          <div
            className={`${SortButton} ${MemberNameCell}`}
            onClick={this.shiftSortOrder.bind(this, SortCategory.Name)}
          >
            <div className={LegendText}>
              {getStringTableValue(StringIDFriendFoeLegendMemberName, this.props.stringTable)}
            </div>
            <img className={this.getSortClassName(SortCategory.Name)} src={factionData.arrowPointerImage} />
          </div>
          <div
            className={`${SortButton} ${MemberNoteCell} block`}
            onClick={this.shiftSortOrder.bind(this, SortCategory.Note)}
          >
            <div className={LegendText}>
              {getStringTableValue(StringIDFriendFoeLegendMemberNote, this.props.stringTable)}
            </div>
            <img className={this.getSortClassName(SortCategory.Note)} src={factionData.arrowPointerImage} />
          </div>
        </div>
        <div className={MemberListScrollRegion}>
          <FactionScrollArea
            className={MemberListScrollArea}
            borderType={BorderType.Primary}
            background={BorderBackground.PatternLarge}
            showEmptyTrack
          >
            <div className={MemberListContent}>{this.getSortedPlayers().map(this.renderBlockRow.bind(this))}</div>
          </FactionScrollArea>
        </div>
        <FactionButton className={AddButton} onClick={this.onAddClicked.bind(this, false)}>
          {getStringTableValue(StringIDFriendFoeAddFoe, this.props.stringTable)}
        </FactionButton>
      </>
    );
  }

  private renderInvitations(invitesSent: FriendInvite[], invitesReceived: FriendInvite[]): React.ReactNode {
    const titleStyle: React.CSSProperties = {
      backgroundImage: `url(${getFactionData(this.props.uiFactionID).headerBorderSecondaryImage})`
    };
    return (
      <>
        <div className={InvitesSectionContainer}>
          <FactionScrollArea
            className={ReceivedInvitesSection}
            contentClassName={InvitesSectionContent}
            borderType={BorderType.Primary}
            background={BorderBackground.PatternLarge}
            showEmptyTrack
          >
            {invitesReceived.map(this.renderReceivedInvitationRow.bind(this))}
          </FactionScrollArea>
          <div className={InvitesSectionTitle} style={titleStyle}>
            {getStringTableValue(StringIDFriendFoeReceivedInvitationsTitle, this.props.stringTable)}
          </div>
        </div>
        <FactionButton
          className={RejectAllButton}
          widthOverrideVmin={8.32}
          disabled={invitesReceived.length <= 0}
          onClick={this.onRejectAllClicked.bind(this)}
        >
          {getStringTableValue(StringIDFriendFoeRejectAll, this.props.stringTable)}
        </FactionButton>
        <div className={InvitesSectionContainer}>
          <FactionScrollArea
            className={SentInvitesSection}
            contentClassName={InvitesSectionContent}
            borderType={BorderType.Primary}
            background={BorderBackground.PatternLarge}
            showEmptyTrack
          >
            {invitesSent.map(this.renderSentInvitationRow.bind(this))}
          </FactionScrollArea>
          <div className={InvitesSectionTitle} style={titleStyle}>
            {getStringTableValue(StringIDFriendFoeSentInvitationsTitle, this.props.stringTable)}
          </div>
        </div>
      </>
    );
  }

  private renderSentInvitationRow(invite: FriendInvite, index: number): React.ReactNode {
    return (
      <div className={`${InviteRowContainer}${index % 2 ? ' odd' : ''}`}>
        <div className={InviteNumberLabel}>{index + 1}</div>
        <div className={InviteName}>{invite.to?.displayName}</div>
        <div className={InviteButtonSection}>
          <FactionButton
            className={InviteActionButton}
            size={'m'}
            widthOverrideVmin={8}
            onClick={this.onInviteCancel.bind(this, invite)}
          >
            {getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
          </FactionButton>
        </div>
      </div>
    );
  }

  private renderReceivedInvitationRow(invite: FriendInvite, index: number): React.ReactNode {
    return (
      <div className={`${InviteRowContainer}${index % 2 ? ' odd' : ''}`}>
        <div className={InviteNumberLabel}>{index + 1}</div>
        <div className={InviteName}>{invite.from?.displayName}</div>
        <div className={InviteButtonSection}>
          <FactionButton
            className={InviteActionButton}
            size={'m'}
            widthOverrideVmin={8}
            onClick={this.onInviteAccept.bind(this, invite)}
          >
            {getStringTableValue(StringIDGeneralAccept, this.props.stringTable)}
          </FactionButton>
          <FactionButton
            className={InviteActionButton}
            size={'m'}
            widthOverrideVmin={8}
            onClick={this.onInviteIgnore.bind(this, invite)}
          >
            {getStringTableValue(StringIDGeneralIgnore, this.props.stringTable)}
          </FactionButton>
        </div>
      </div>
    );
  }

  private async onInviteCancel(invite: FriendInvite): Promise<void> {
    // You sent this invite, and you are retracting it.
    const params: RejectFriendInviteParams = {
      inviteID: invite.id,
      inviterID: invite.to!.id!
    };
    const result = await this.props.dispatch(callRejectFriendInvite(params));
    showCallErrorModalIfFailed(this.props.dispatch, this.props.stringTable, result);
  }

  private async onInviteAccept(invite: FriendInvite): Promise<void> {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_SOCIAL_ACCEPT_IGNORE);
    // You received this invite, and you are accepting it.
    const params: AcceptFriendInviteParams = {
      inviteID: invite.id,
      inviterID: invite.from!.id!
    };
    const result = await this.props.dispatch(callAcceptFriendInvite(params));
    showCallErrorModalIfFailed(this.props.dispatch, this.props.stringTable, result);
  }

  private async onInviteIgnore(invite: FriendInvite): Promise<void> {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_SOCIAL_ACCEPT_IGNORE);
    // You received this invite, and you are rejecting it.
    const params: RejectFriendInviteParams = {
      inviteID: invite.id,
      inviterID: invite.from!.id!
    };
    const result = await this.props.dispatch(callRejectFriendInvite(params));
    showCallErrorModalIfFailed(this.props.dispatch, this.props.stringTable, result);
  }

  private onNavTabSelected(listType: ListType): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_CHAT_TAB);
    this.setState({ listType });
  }

  private onAddClicked(isFriend: boolean): void {
    clientAPI.playGameSound(isFriend ? SoundEvents.PLAY_UI_SOCIAL_ADD_FRIEND : SoundEvents.PLAY_UI_SOCIAL_ADD_FOE);
    // A sent invite is listed under Invitations; a new block already shows in the Block List.
    const onAdded = isFriend ? () => this.setState({ listType: ListType.Invitations }) : undefined;
    showAddFriendFoeModal(this.props.dispatch, this.props.stringTable, { isFoe: !isFriend, onAdded });
  }

  private onAddEditNoteClicked(isFriend: boolean, player: PlayerDisplayData): void {
    const model: ModalModel = {
      title: getStringTableValue(StringIDFriendFoeAddNote, this.props.stringTable),
      message: player.character && player.character.name ? player.character.name : player.account.displayName ?? '',
      body: (
        <AddEditFriendFoeNoteDialog
          isFoe={!isFriend}
          account={player.account}
          character={player.character}
          note={player.note ?? ''}
        />
      ),
      buttons: null
    };

    this.props.dispatch(
      showModal({
        id: 'AddEditFriendFoeNote',
        content: model,
        escapable: true
      })
    );
  }

  private renderFriendRow(player: PlayerDisplayData, index: number): React.ReactNode {
    const idString = `Player${player.account.id}`;

    const isOffline = !player.character;

    return (
      <ContextMenuSource
        className={`${MemberListRow}${index % 2 ? ' odd' : ''}${isOffline ? ' offline' : ''}`}
        key={idString}
        menuParams={{ id: idString, content: this.buildPlayerContextMenu(player) }}
      >
        <div className={MemberIndexCell}>
          <div className={MemberListDataText}>{`${index + 1}.`}</div>
        </div>
        <div className={MemberNameCell}>
          <div className={MemberNameStack}>
            <div className={MemberListDataText}>{player.account.displayName}</div>
            {player.character && <div className={MemberListDataText}>{`(${player.character.name})`}</div>}
          </div>
        </div>
        <div className={MemberClassCell}>
          {player.character && (
            <img
              className={MemberClassIcon}
              src={this.props.defs.classesByStringID[player.character!.classID!].unitFrameIconTransparencyImage}
            />
          )}
        </div>
        <div className={MemberNoteCell}>
          <div className={MemberListDataText}>{player.note}</div>
        </div>
      </ContextMenuSource>
    );
  }

  private renderBlockRow(player: PlayerDisplayData, index: number): React.ReactNode {
    const idString = `Player${player.account.id}`;

    return (
      <ContextMenuSource
        className={`${MemberListRow}${index % 2 ? ' odd' : ''}`}
        key={idString}
        menuParams={{ id: idString, content: this.buildPlayerContextMenu(player) }}
      >
        <div className={MemberIndexCell}>
          <div className={MemberListDataText}>{`${index + 1}.`}</div>
        </div>
        <div className={`${MemberNameCell} block`}>
          <div className={MemberListDataText}>{player.account.displayName}</div>
        </div>
        <div className={`${MemberNoteCell} block`}>
          <div className={MemberListDataText}>{player.note}</div>
        </div>
      </ContextMenuSource>
    );
  }

  private buildPlayerContextMenu(player: PlayerDisplayData): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    const isFriend = this.state.listType === ListType.Friends;

    let item: ContextMenuItem;
    if (isFriend) {
      // Send message / whisper.
      item = {
        title: getStringTableValue(StringIDChatScopeNameWhisper, this.props.stringTable),
        onClick: (dispatch: AppDispatch) => {
          Chat.requestWhisper(player.character!.name!);
        }
      };
      items.push(item);
    }

    // Add/Edit note.
    item = {
      title: getStringTableValue(StringIDFriendFoeAddNote, this.props.stringTable),
      onClick: (dispatch: AppDispatch) => {
        this.onAddEditNoteClicked(isFriend, player);
      }
    };
    items.push(item);

    // Remove friend/foe.
    item = {
      title: getStringTableValue(StringIDGeneralRemove, this.props.stringTable),
      onClick: (dispatch: AppDispatch) => {
        const model: ModalModel = {
          title: getStringTableValue(
            isFriend ? StringIDFriendFoeRemoveFriend : StringIDFriendFoeRemoveFoe,
            this.props.stringTable
          ),
          message: player.character?.name ?? player.account.displayName ?? '',
          buttons: [
            {
              text: getStringTableValue(StringIDGeneralRemove, this.props.stringTable),
              onClick: async () => {
                dispatch(hideModal());
                const result = isFriend
                  ? await this.props.dispatch(callRemoveFriend(player.account.id!))
                  : // Remove from Block List. Sending both allowed and blocked resets the player to the defaults.
                    await this.props.dispatch(
                      callSocialSetUserPermissions({
                        allowed: UserInteractions.All,
                        blocked: UserInteractions.All,
                        targetID: player.account.id
                      })
                    );
                showCallErrorModalIfFailed(this.props.dispatch, this.props.stringTable, result);
              }
            },
            {
              text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
              onClick: () => {
                dispatch(hideModal());
              }
            }
          ]
        };

        const params: ModalParams = {
          id: `ConfirmFriendFoeRemove`,
          content: model,
          escapable: true,
          maxWidth: '40vmin'
        };
        dispatch(showModal(params));
      }
    };
    items.push(item);

    return items;
  }

  private getFriendDisplayData(): PlayerDisplayData[] {
    return this.props.friends.map((f) => {
      return { account: f.account!, character: f.character, note: f.note ?? '' };
    });
  }

  private getFoeDisplayData(): PlayerDisplayData[] {
    return this.props.userOverrides
      .filter((uo) => {
        // Only blocked players go in the block list.
        return uo.blocked === UserInteractions.All;
      })
      .map((uo) => {
        return { account: uo.account!, character: null, note: uo.note ?? '' };
      });
  }

  private getSortedPlayers(): PlayerDisplayData[] {
    let sorted: PlayerDisplayData[] = (
      this.state.listType === ListType.Friends ? this.getFriendDisplayData() : this.getFoeDisplayData()
    ).slice();
    sorted.sort((a, b) => {
      const aIsOnline = !!a.character;
      const bIsOnline = !!b.character;

      // Online characters always before offline characters.
      if (aIsOnline !== bIsOnline) {
        return aIsOnline ? -1 : 1;
      }

      for (let i = 0; i < this.state.sort.length; ++i) {
        const [category, order] = this.state.sort[i];
        const inverter = order === SortOrder.Descending ? -1 : 1;

        switch (category) {
          case SortCategory.Name: {
            if (a.character?.name !== b.character?.name) {
              return inverter * a.character!.name!.localeCompare(b.character!.name!);
            }
            break;
          }
          case SortCategory.Class: {
            const aClass = getStringTableValue(
              this.props.defs.classesByStringID[a.character!.classID!]?.name ?? StringIDGeneralUnknownClass,
              this.props.stringTable
            );
            const bClass = getStringTableValue(
              this.props.defs.classesByStringID[a.character!.classID!]?.name ?? StringIDGeneralUnknownClass,
              this.props.stringTable
            );
            if (aClass !== bClass) {
              return inverter * aClass.localeCompare(bClass);
            }
            break;
          }
          case SortCategory.Note: {
            if (a.note !== b.note) {
              return inverter * a.note.localeCompare(b.note);
            }
            break;
          }
        }
      }

      // Any non-ordered categories are treated as equal.
      return 0;
    });
    return sorted;
  }

  private shiftSortOrder(category: SortCategory): void {
    const [_, order] = this.state.sort.find((e) => e[0] === category) ?? [category, SortOrder.None];
    const nextOrder = (order + 1) % SortOrder.COUNT;

    // Remove the old order from the list.
    let newSort = this.state.sort.filter((e) => e[0] !== category);
    // If the order is not None, add it at the front of the list.  That way we prioritize sorts in the order you click.
    if (nextOrder !== SortOrder.None) {
      newSort.unshift([category, nextOrder]);
    }

    this.setState({ sort: newSort });
  }

  private getSortClassName(category: SortCategory): string {
    const [_, order] = this.state.sort.find((e) => e[0] === category) ?? [category, SortOrder.None];

    return `${SortDirectionIndicator}${order === SortOrder.Ascending ? ' up' : ''}${
      order === SortOrder.Descending ? ' down' : ''
    }`;
  }

  private getAreInvitesBlocked(): boolean {
    return !!(this.props.blockedInteractions & UserInteractions.FriendInvite);
  }

  private async onInviteBlockingChanged(isBlocked: boolean): Promise<void> {
    // we're either clearing (by setting both) or blocking the specific friend invite field
    const params: SocialSetPermissionsParams = {
      allowed: isBlocked ? UserInteractions.None : UserInteractions.FriendInvite,
      blocked: UserInteractions.FriendInvite
    };
    const result = await this.props.dispatch(callSocialSetPermissions(params));
    showCallErrorModalIfFailed(this.props.dispatch, this.props.stringTable, result);
  }

  private async onRejectAllClicked(): Promise<void> {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_SOCIAL_REJECT_ALL);
    const result = await this.props.dispatch(callRejectAllFriendInvites());
    showCallErrorModalIfFailed(this.props.dispatch, this.props.stringTable, result);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID,
    self: state.entities.self,
    defs: state.gameDefs,
    friends: (state.social.friends.friends ?? []) as Friend[],
    friendInvites: (state.social.friends.friendInvites ?? []) as FriendInvite[],
    selfAccountID: state.entities.self.accountID,
    userOverrides: (state.social.settings?.overrides ?? []) as UserOverrides[],
    // Only null before the settings load; the server always sends both.
    allowedInteractions: state.social.settings?.defaultAllowed ?? UserInteractions.All,
    blockedInteractions: state.social.settings?.defaultBlocked ?? UserInteractions.None
  };
};

export const FriendFoeList = connect(mapStateToProps)(AFriendFoeList);
