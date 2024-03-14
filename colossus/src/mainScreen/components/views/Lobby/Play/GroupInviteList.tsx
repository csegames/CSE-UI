/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import {
  ChampionCostumeInfo,
  Group,
  Member,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { TeamJoinAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { Dispatch } from 'redux';
import { updateSelectedGroupMember } from '../../../../redux/teamJoinSlice';
import { TeamJoinAPIError } from '../../../../dataSources/teamJoinNetworkingConstants';
import { getAccountID } from '@csegames/library/dist/_baseGame/utils/accountUtils';
import { GroupMemberRole, PlayerEntry } from './PlayerEntry';
import { ContextMenu, MenuActionType } from './ContextMenu';
import { game } from '@csegames/library/dist/_baseGame';
import { webConf } from '../../../../dataSources/networkConfiguration';
import { Dictionary } from '@reduxjs/toolkit';
import { getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';

const GroupInviteListOuter = 'StartScreen-Play-GroupInviteList-GroupInviteListOuter';
const GroupInviteListContainer = 'StartScreen-Play-GroupInviteList-GroupInviteListContainer';
const GroupInviteListClass = 'StartScreen-Play-GroupInviteList';
const GroupInviteHeader = 'StartScreen-Play-GroupInviteList-GroupInviteHeader';
const GroupInviteContextMenuClickHandler = 'StartScreen-Play-GroupInviteList-GroupInviteContextMenuClickHandler';
const GroupInviteScrollArea = 'StartScreen-Play-GroupInviteList-GroupInviteScrollArea';

const GroupInviteContextMenu = 'StartScreen-Play-GroupInviteList-GroupInviteContextMenu';

const StringIDGroupsGroupCount = 'GroupsGroupCount';

interface ReactProps {}

interface InjectedProps {
  group: Group;
  championCostumes: ChampionCostumeInfo[];
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  selectedIdx: number;
  isContextMenuOpen: boolean;
}

class AGroupInviteList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedIdx: -1,
      isContextMenuOpen: false
    };
  }

  private getCostume(costumeid: string) {
    if (costumeid && costumeid != '') {
      const costume = this.props.championCostumes.find((costume) => costume.id == costumeid);
      if (costume) {
        return costume;
      }
    }

    return this.props.championCostumes[0];
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.selectedIdx != prevState.selectedIdx) {
      this.props.dispatch(updateSelectedGroupMember(this.state.selectedIdx));
    }
  }

  private getRole(groupMember: Member): GroupMemberRole {
    if (groupMember.id == this.props.group.leader.id) {
      if (groupMember.isOnline) {
        return 'Leader';
      } else {
        return 'Leader - Offline';
      }
    } else if (groupMember.isOnline) {
      return '';
    } else {
      return 'Offline';
    }
  }

  private getGroupMembers(): JSX.Element[] {
    const members: JSX.Element[] = [];
    let idx = 0;

    if (!this.props.group) {
      return members;
    }

    // Group members that are at or greater than this index should have their context menus grow
    // upwards instead of downwards, so they don't get cut off at the bottom of the list.
    const contextMenuVerticalAlignThreshold =
      this.props.group.members.length >= 6 ? Math.ceil(this.props.group.members.length * 0.5) : -1;

    const canEditGroup = this.props.group.leader.id === getAccountID(game.accessToken);
    for (let entry of this.props.group.members) {
      const isSelected = idx == this.state.selectedIdx;
      let isLeaderString: GroupMemberRole = this.getRole(entry);
      const entryIsLeader = this.props.group.leader.id === entry.id;
      let costume = '';
      if (entry.defaultChampion) {
        costume = entry.defaultChampion.costumeID;
      }

      let contextMenuVerticalAlign = 'top';
      if (contextMenuVerticalAlignThreshold >= 0 && idx >= contextMenuVerticalAlignThreshold) {
        contextMenuVerticalAlign = 'bottom';
      }

      const contextMenu =
        isSelected && this.state.isContextMenuOpen ? (
          <ContextMenu
            player={entry}
            playerIdx={idx}
            extraClassName={`${GroupInviteContextMenu} aligned-${contextMenuVerticalAlign}`}
            isInvitation={false}
            isOnline={entry.isOnline}
            onAction={this.onContextMenuAction.bind(this)}
            onCancel={this.onCancelContextMenu.bind(this)}
          />
        ) : null;

      members.push(
        <PlayerEntry
          groupMember={entry}
          entryRole={isLeaderString}
          entryIsLeader={entryIsLeader}
          costume={this.getCostume(costume)}
          playerIdx={idx}
          selected={isSelected}
          isInvitation={false}
          canEditGroup={canEditGroup}
          onMenu={this.onMenuClicked.bind(this)}
          onSelect={this.onSelectPlayer.bind(this)}
        >
          {contextMenu}
        </PlayerEntry>
      );
      idx += 1;
    }
    for (let invite of this.props.group.invitations) {
      const isSelected = idx == this.state.selectedIdx;
      let costume = '';
      if (invite.to.defaultChampion) {
        costume = invite.to.defaultChampion.costumeID;
      }
      members.push(
        <PlayerEntry
          invitationReceiver={invite.to}
          entryRole={''}
          entryIsLeader={false}
          costume={this.getCostume(costume)}
          playerIdx={idx}
          selected={isSelected}
          isInvitation={true}
          expiration={invite.expires}
          canEditGroup={canEditGroup}
          onMenu={this.onMenuClicked.bind(this)}
          onSelect={this.onSelectPlayer.bind(this)}
        />
      );
      idx += 1;
    }
    return members;
  }

  private async onContextMenuAction(member: Member, playerIdx: number, actionType: MenuActionType) {
    switch (actionType) {
      case MenuActionType.kick: {
        this.onKick(member);
        break;
      }
      case MenuActionType.makeLeader: {
        this.onMakeLeader(member);
        break;
      }
      default: {
        // fallback for unhandled actions - just deselect the selected player
        this.setState({
          selectedIdx: -1,
          isContextMenuOpen: false
        });
      }
    }
  }

  private async onKick(member: Member) {
    const res = await TeamJoinAPI.KickV1(webConf, member.id);
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

    this.setState({
      selectedIdx: -1,
      isContextMenuOpen: false
    });
  }

  private async onMakeLeader(member: Member) {
    const res = await TeamJoinAPI.SetRankV1(webConf, member.id, 'leader');
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

    this.setState({
      selectedIdx: -1,
      isContextMenuOpen: false
    });
  }

  private onCancelContextMenu(member: Member, playerIdx: number) {
    // just close the context menu
    this.setState({
      selectedIdx: -1,
      isContextMenuOpen: false
    });
  }

  private onMenuClicked(player: Member, playerIdx: number) {
    if (playerIdx < 0 || !this.props.group || playerIdx >= this.props.group.size) {
      console.warn('Got an invalid playerIdx.  Should never be possible, so what were you doing?');
      return;
    }

    if (this.state.isContextMenuOpen && this.state.selectedIdx == playerIdx) {
      // menu already open, just close it
      this.setState({
        selectedIdx: -1,
        isContextMenuOpen: false
      });
      return;
    }

    this.setState({
      selectedIdx: playerIdx,
      isContextMenuOpen: true
    });
  }

  private onSelectPlayer(player: Member, playerIdx: number) {
    if (this.state.isContextMenuOpen || !this.props.group || playerIdx < 0 || playerIdx >= this.props.group.size) {
      return;
    }

    this.setState({
      selectedIdx: playerIdx,
      isContextMenuOpen: false
    });
  }

  private onCloseContextMenu(evt: React.MouseEvent<HTMLDivElement>) {
    if (this.state.isContextMenuOpen) {
      this.setState({ isContextMenuOpen: false });
    }
  }

  public render(): JSX.Element {
    if (!this.props.group) {
      return null;
    }
    const maxGroupMembers = this.props.group.capacity;

    let contextMenuCloseHandler: JSX.Element = null;
    if (this.state.isContextMenuOpen) {
      contextMenuCloseHandler = (
        <div className={GroupInviteContextMenuClickHandler} onClick={this.onCloseContextMenu.bind(this)} />
      );
    }
    return (
      <div className={GroupInviteListOuter}>
        <div className={GroupInviteHeader}>
          {getTokenizedStringTableValue(StringIDGroupsGroupCount, this.props.stringTable, {
            COUNT: this.props.group.members.length.toString(),
            MAX: maxGroupMembers.toString()
          })}
        </div>
        <div className={GroupInviteListContainer} id='Fullscreen_Play_GroupInviteList'>
          <div className={GroupInviteListClass}>
            <div className={GroupInviteScrollArea}>{this.getGroupMembers()}</div>
          </div>
        </div>
        {contextMenuCloseHandler}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { group } = state.teamJoin;
  const { championCostumes } = state.championInfo;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    group,
    championCostumes,
    stringTable
  };
}

export const GroupInviteList = connect(mapStateToProps)(AGroupInviteList);
