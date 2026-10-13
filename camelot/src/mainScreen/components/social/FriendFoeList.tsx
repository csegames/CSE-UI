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
  StringIDGeneralCancel,
  StringIDGeneralRemove,
  StringIDGeneralUnknownClass
} from '../../helpers/stringTableHelpers';
import { BorderType, BorderBackground } from '../FactionBorder';
import { getFactionData } from '../../gameData/factionData';
import { FactionScrollArea } from '../FactionScrollArea';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem } from '../../redux/contextMenuSlice';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { callGuildKick } from '../../helpers/rest/guildsRestCalls';
import { hideModal, ModalModel, ModalParams, showModal } from '../../redux/modalsSlice';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { FactionButton } from '../FactionButton';
import { FactionBorderSelectable } from '../FactionBorderSelectable';
import { Chat } from '../chat/Chat';
import { AddFriendFoeDialog } from './AddFriendFoeDialog';
import { AddEditFriendFoeNoteDialog } from './AddEditFriendFoeNoteDialog';
import { ComingSoon } from '../ComingSoon';

// TODO: This is placeholder until we get a backend built.  It covers the fields the UI currently needs.
export interface SocialPlayer {
  accountID: string;
  name: string;
  level: number;
  classID: number;
  note: string;
}

// CSS classes
const Root = 'HUD-FriendFoeList-Root';
const MemberListSection = 'HUD-FriendFoeList-Roster-MemberListSection';
const NavTabs = 'HUD-FriendFoeList-NavTabs';
const NavTab = 'HUD-FriendFoeList-NavTab';
const TabLabel = 'HUD-FriendFoeList-TabLabel';
const TaperBar = 'HUD-FriendFoeList-TaperBar';
const MemberListTabNav = 'HUD-FriendFoeList-Roster-MemberList-TabNav';
const MemberListHeader = 'HUD-FriendFoeList-Roster-MemberList-Header';
const SortButton = 'HUD-FriendFoeList-Roster-MemberList-SortButton';
const MemberIndexCell = 'HUD-FriendFoeList-Roster-MemberList-MemberIndexCell';
const MemberNameCell = 'HUD-FriendFoeList-Roster-MemberList-MemberNameCell';
const MemberLevelCell = 'HUD-FriendFoeList-Roster-MemberList-MemberLevelCell';
const MemberClassCell = 'HUD-FriendFoeList-Roster-MemberList-MemberClassCell';
const MemberNoteCell = 'HUD-FriendFoeList-Roster-MemberList-MemberNoteCell';
const LegendText = 'HUD-FriendFoeList-Roster-MemberList-LegendText';
const SortDirectionIndicator = 'HUD-FriendFoeList-Roster-MemberList-SortDirectionIndicator';
const MemberListScrollRegion = 'HUD-FriendFoeList-Roster-MemberList-ScrollRegion';
const MemberListScrollArea = 'HUD-FriendFoeList-Roster-MemberList-ScrollArea';
const MemberListContent = 'HUD-FriendFoeList-Roster-MemberList-Content';
const MemberListRow = 'HUD-FriendFoeList-Roster-MemberList-Row';
const MemberListDataText = 'HUD-FriendFoeList-Roster-MemberList-DataText';
const AddButton = 'HUD-FriendFoeList-AddButton';

// String IDs
const StringIDFriendFoeFriendList = 'FriendFoeFriendList';
const StringIDFriendFoeFoeList = 'FriendFoeFoeList';
const StringIDFriendFoeLegendMemberName = 'FriendFoeLegendMemberName';
const StringIDFriendFoeLegendMemberLevel = 'FriendFoeLegendMemberLevel';
const StringIDFriendFoeLegendMemberClass = 'FriendFoeLegendMemberClass';
const StringIDFriendFoeLegendMemberNote = 'FriendFoeLegendMemberNote';
const StringIDFriendFoeAddFriend = 'FriendFoeAddFriend';
const StringIDFriendFoeAddFoe = 'FriendFoeAddFoe';
const StringIDFriendFoeAddFriendToList = 'FriendFoeAddFriendToList';
const StringIDFriendFoeAddFoeToList = 'FriendFoeAddFoeToList';
const StringIDFriendFoeRemoveFriend = 'FriendFoeRemoveFriend';
const StringIDFriendFoeRemoveFoe = 'FriendFoeRemoveFoe';
const StringIDFriendFoeAddNote = 'FriendFoeAddNote';
const StringIDChatScopeNameWhisper = 'ChatScopeNameWhisper';

enum ListType {
  Friends = 'Friends',
  Foes = 'Foes'
}

enum SortCategory {
  Name = 'Name',
  Level = 'Level',
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
  friends: SocialPlayer[];
  foes: SocialPlayer[];
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
    return (
      <div className={Root}>
        {this.renderList(this.state.listType === ListType.Friends ? this.props.friends : this.props.foes)}
      </div>
    );
  }

  private renderList(members: SocialPlayer[]): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const isFriend = this.state.listType === ListType.Friends;

    return (
      <>
        <div className={MemberListSection}>
          <div className={MemberListTabNav}>
            <div className={NavTabs}>
              <FactionBorderSelectable
                className={NavTab}
                isSelected={isFriend}
                onSelected={() => this.setState({ listType: ListType.Friends })}
              >
                <div className={TabLabel}>
                  {getStringTableValue(StringIDFriendFoeFriendList, this.props.stringTable)}
                </div>
              </FactionBorderSelectable>
              <FactionBorderSelectable
                className={NavTab}
                isSelected={!isFriend}
                onSelected={() => this.setState({ listType: ListType.Foes })}
              >
                <div className={TabLabel}>{getStringTableValue(StringIDFriendFoeFoeList, this.props.stringTable)}</div>
              </FactionBorderSelectable>
            </div>
            <img className={TaperBar} src={factionData.taperBarImage} />
          </div>
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
              className={`${SortButton} ${MemberLevelCell}`}
              onClick={this.shiftSortOrder.bind(this, SortCategory.Level)}
            >
              <div className={LegendText}>
                {getStringTableValue(StringIDFriendFoeLegendMemberLevel, this.props.stringTable)}
              </div>
              <img className={this.getSortClassName(SortCategory.Level)} src={factionData.arrowPointerImage} />
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
            >
              <div className={MemberListContent}>{this.getSortedPlayers().map(this.renderPlayerRow.bind(this))}</div>
            </FactionScrollArea>
          </div>
          <FactionButton className={AddButton} onClick={this.onAddClicked.bind(this, isFriend)}>
            {getStringTableValue(
              isFriend ? StringIDFriendFoeAddFriend : StringIDFriendFoeAddFoe,
              this.props.stringTable
            )}
          </FactionButton>
        </div>
        <ComingSoon />
      </>
    );
  }

  private onAddClicked(isFriend: boolean): void {
    const model: ModalModel = {
      title: getStringTableValue(
        isFriend ? StringIDFriendFoeAddFriendToList : StringIDFriendFoeAddFoeToList,
        this.props.stringTable
      ),
      message: '',
      body: <AddFriendFoeDialog isFoe={!isFriend} />,
      buttons: null
    };

    this.props.dispatch(
      showModal({
        id: 'AddFriendFoe',
        content: model,
        escapable: true
      })
    );
  }

  private onAddEditNoteClicked(isFriend: boolean, player: SocialPlayer): void {
    const model: ModalModel = {
      title: getStringTableValue(StringIDFriendFoeAddNote, this.props.stringTable),
      message: player.name,
      body: <AddEditFriendFoeNoteDialog isFoe={!isFriend} player={player} />,
      buttons: null
    };

    this.props.dispatch(
      showModal({
        id: 'AddFriendFoe',
        content: model,
        escapable: true
      })
    );
  }

  private renderPlayerRow(player: SocialPlayer, index: number): React.ReactNode {
    const idString = `Player${player.accountID}`;

    return (
      <ContextMenuSource
        className={`${MemberListRow}${index % 2 ? ' odd' : ''}`}
        key={idString}
        menuParams={{ id: idString, content: this.buildPlayerContextMenu(player) }}
      >
        <div className={MemberIndexCell}>
          <div className={MemberListDataText}>{`${index + 1}.`}</div>
        </div>
        <div className={MemberNameCell}>
          <div className={MemberListDataText}>{player.name}</div>
        </div>
        <div className={MemberLevelCell}>
          <div className={MemberListDataText}>{player.level + 1}</div>
        </div>
        <div className={MemberClassCell}>
          <div className={MemberListDataText}>
            {getStringTableValue(
              this.props.defs.classesByNumericID[player.classID]?.name ?? StringIDGeneralUnknownClass,
              this.props.stringTable
            )}
          </div>
        </div>
        <div className={MemberNoteCell}>
          <div className={MemberListDataText}>{player.note}</div>
        </div>
      </ContextMenuSource>
    );
  }

  private buildPlayerContextMenu(player: SocialPlayer): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    const isFriend = this.state.listType === ListType.Friends;

    let item: ContextMenuItem;
    if (isFriend) {
      // Send message / whisper.
      item = {
        title: getStringTableValue(StringIDChatScopeNameWhisper, this.props.stringTable),
        onClick: (dispatch: AppDispatch) => {
          Chat.requestWhisper(player.name);
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
          message: player.name,
          buttons: [
            {
              text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
              onClick: () => {
                dispatch(hideModal());
              }
            },
            {
              text: getStringTableValue(StringIDGeneralRemove, this.props.stringTable),
              onClick: () => {
                dispatch(hideModal());
                dispatch(callGuildKick(player.accountID));
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

  private getSortedPlayers(): SocialPlayer[] {
    let sorted: SocialPlayer[] = (
      this.state.listType === ListType.Friends ? this.props.friends : this.props.foes
    ).slice();
    sorted.sort((a, b) => {
      for (let i = 0; i < this.state.sort.length; ++i) {
        const [category, order] = this.state.sort[i];
        const inverter = order === SortOrder.Descending ? -1 : 1;

        switch (category) {
          case SortCategory.Name: {
            if (a.name !== b.name) {
              return inverter * a.name.localeCompare(b.name);
            }
            break;
          }
          case SortCategory.Class: {
            const aClass = getStringTableValue(
              this.props.defs.classesByNumericID[a.classID]?.name ?? StringIDGeneralUnknownClass,
              this.props.stringTable
            );
            const bClass = getStringTableValue(
              this.props.defs.classesByNumericID[a.classID]?.name ?? StringIDGeneralUnknownClass,
              this.props.stringTable
            );
            if (aClass !== bClass) {
              return inverter * aClass.localeCompare(bClass);
            }
            break;
          }
          case SortCategory.Level: {
            if (a.level !== b.level) {
              return inverter * (b.level - a.level);
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
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID,
    self: state.entities.self,
    defs: state.gameDefs,
    // TODO: Get real data from somewhere, once it exists.
    friends: [
      { accountID: '1', name: 'Friend 1', level: 0, classID: 1, note: '' },
      { accountID: '2', name: 'Friend 2', level: 1, classID: 2, note: '' },
      { accountID: '3', name: 'Friend 3', level: 2, classID: 3, note: '' },
      { accountID: '4', name: 'Friend 4', level: 3, classID: 4, note: '' },
      { accountID: '5', name: 'Friend 5', level: 4, classID: 5, note: '' }
    ],
    foes: [
      { accountID: '6', name: 'Foe 1', level: 0, classID: 1, note: '' },
      { accountID: '7', name: 'Foe 2', level: 1, classID: 2, note: '' },
      { accountID: '8', name: 'Foe 3', level: 2, classID: 3, note: '' },
      { accountID: '9', name: 'Foe 4', level: 3, classID: 4, note: '' },
      { accountID: '10', name: 'Foe 5', level: 4, classID: 5, note: '' }
    ]
  };
};

export const FriendFoeList = connect(mapStateToProps)(AFriendFoeList);
