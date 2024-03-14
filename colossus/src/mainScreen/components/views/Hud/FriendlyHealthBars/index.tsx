/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Dispatch } from 'redux';
import { FriendlyHealthBar } from './FriendlyHealthBar';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { updateFriendsPage } from '../../../../redux/entitiesSlice';
import { KeybindIDs, getActiveBindForKey } from '../../../../redux/keybindsSlice';
import { PlayerEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const Container = 'FriendlyHealthBars-Container';
const PageContainer = 'FriendlyHealthBars-PageContainer';
const CurrentPage = 'FriendlyHealthBars-CurrentPage';
const HealthBarCount = 'FriendlyHealthBars-HealthBarCount';
const PageContainerFiller = 'FriendlyHealthBars-PageContainerFiller';
const InstructionsText = 'FriendlyHealthBars-InstructionsText';
const InstructionsIcon = 'FriendlyHealthBars-InstructionsIcon';

const ChangePagesInstructions = 'FriendlyHealthBars-ChangePagesInstructions';

const StringIDHUDPlayerCount = 'HUDPlayerCount';

interface InjectedProps {
  dispatch?: Dispatch;
  friends?: {
    [entityID: string]: PlayerEntityStateModel;
  };
  friendsPage?: number;
  friendsPerPage?: number;
  pageKeybind?: Keybind;
  usingGamepad?: boolean;
  stringTable: Dictionary<StringTableEntryDef>;
}

interface ComponentProps {}

type Props = InjectedProps & ComponentProps;

class AFriendlyHealthBars extends React.Component<Props, {}> {
  private eventHandlers: ListenerHandle[] = [];

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const sortedPlayers = Object.keys(this.props.friends).sort((a, b) => {
      return this.props.friends[a].name.localeCompare(this.props.friends[b].name);
    });

    const friendsCount = Object.keys(this.props.friends).length;
    const maxPage = Math.max(1, Math.ceil(friendsCount / this.props.friendsPerPage));
    const currentPage = Math.min(this.props.friendsPage, maxPage);

    const startingPlayerIndex = (currentPage - 1) * this.props.friendsPerPage;

    const displayPlayers = sortedPlayers.slice(startingPlayerIndex, startingPlayerIndex + this.props.friendsPerPage);

    return (
      <div id='FriendlyHealthBarsContainer_HUD' className={Container}>
        {this.pageContainer()}
        {displayPlayers.map((playerName, index) => {
          return <FriendlyHealthBar friendName={playerName} key={index} />;
        })}
      </div>
    );
  }

  private pageContainer(): JSX.Element {
    const numFriends = Object.keys(this.props.friends).length;
    if (numFriends <= this.props.friendsPerPage) {
      return;
    }

    const maxPage = Math.max(1, Math.ceil(numFriends / this.props.friendsPerPage));
    const currentPage = Math.min(this.props.friendsPage, maxPage);
    const tokens = {
      NUM_FRIENDS: numFriends.toString()
    };

    return (
      <div className={PageContainer}>
        <div className={CurrentPage}>
          {currentPage}/{maxPage}
        </div>
        <div className={HealthBarCount}>
          {getTokenizedStringTableValue(StringIDHUDPlayerCount, this.props.stringTable, tokens)}
        </div>
        <div className={PageContainerFiller} />{' '}
        {/* Want to remove this explicit spacer  ^.  Elements like this should never be necessary. --DM */}
        {this.pageKeybind()}
      </div>
    );
  }

  private pageKeybind(): JSX.Element {
    if (!this.props.pageKeybind) {
      return;
    }

    return (
      <div className={ChangePagesInstructions}>
        <div className={InstructionsText}>Press</div>
        {this.keyTextOrButtonIcon()}
        <div className={`${InstructionsIcon} fs-icon-misc-chevron-right`} />
      </div>
    );
  }

  private keyTextOrButtonIcon(): JSX.Element {
    const bind = getActiveBindForKey(this.props.usingGamepad, this.props.pageKeybind);
    if (bind) {
      if (bind.iconClass) {
        return <div className={`${InstructionsIcon} ${bind.iconClass}`} />;
      } else {
        return <div className={InstructionsText}>{bind.name}</div>;
      }
    }

    return null;
  }

  public componentDidMount() {
    this.eventHandlers.push(game.on('cycleTeam', this.onCycleTeam));
  }

  public componentWillUnmount() {
    this.eventHandlers.forEach((handle: ListenerHandle) => handle.close());
  }

  private onCycleTeam = () => {
    const friendsCount: number = Object.keys(this.props.friends).length;

    if (friendsCount <= this.props.friendsPerPage) {
      return;
    }

    const maxPage = Math.max(1, Math.ceil(friendsCount / this.props.friendsPerPage));
    const nextPage = this.props.friendsPage >= maxPage ? 1 : this.props.friendsPage + 1;

    this.props.dispatch(updateFriendsPage(nextPage));
  };
}

function mapStateToProps(state: RootState) {
  return {
    friends: state.entities.friends,
    friendsPage: state.entities.friendsPage,
    friendsPerPage: state.entities.friendsPerPage,
    pageKeybind: state.keybinds[KeybindIDs.UICycleTeam],
    usingGamepad: state.baseGame.usingGamepad,
    stringTable: state.stringTable.stringTable
  };
}

export const FriendlyHealthBars = connect(mapStateToProps)(AFriendlyHealthBars);
