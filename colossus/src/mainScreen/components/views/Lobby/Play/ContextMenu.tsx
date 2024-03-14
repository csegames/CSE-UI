/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Member, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import {
  StringIDGeneralNo,
  StringIDGeneralYes,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../../helpers/stringTableHelpers';

// ===== Start ContextMenu Styles =====
const ContextMenuContainer = 'StartScreen-Play-ContextMenu-ContextMenuContainer';
const ContextMenuEntry = 'StartScreen-Play-ContextMenu-ContextMenuEntry';
const ContextMenuLabel = 'StartScreen-Play-ContextMenu-ContextMenuLabel';
const ContextMenuArrow = 'StartScreen-Play-ContextMenu-ContextMenuArrow';
const ContextMenuConfirmButtonsContainer = 'StartScreen-Play-ContextMenu-ContextMenuConfirmButtonsContainer';
const ContextMenuConfirmButton = 'StartScreen-Play-ContextMenu-ContextMenuConfirmButton';

// ===== End ContextMenu Styles =====

const StringIDGroupsKick = 'GroupsKick';
const StringIDGroupsChangeLeader = 'GroupsChangeLeader';

// Context menu actions
//NB. To add a new context menu action, just add an enum value here, add a switch case in makeMenuActionLabel,

// add the action type to CONTEXT_MENU_ACTION_TYPES, then implement the action in GroupInviteList.onContextMenuAction()

export enum MenuActionType {
  none,
  kick,
  makeLeader
}

const CONTEXT_MENU_ACTION_TYPES: MenuActionType[] = [MenuActionType.kick, MenuActionType.makeLeader];

function makeMenuActionLabel(actionType: MenuActionType, playerName: string) {
  switch (actionType) {
    case MenuActionType.kick:
      return getTokenizedStringTableValue(StringIDGroupsKick, this.props.stringTable, { NAME: playerName });
    case MenuActionType.makeLeader:
      return getTokenizedStringTableValue(StringIDGroupsChangeLeader, this.props.stringTable, { NAME: playerName });
    default:
      console.error(`Menu action type ${actionType} missing string key`);
      return MenuActionType[actionType];
  }
}

interface ReactProps {
  extraClassName?: string;
  extraStyles?: React.CSSProperties;
  player: Member;
  playerIdx: number;
  isInvitation: boolean;
  isOnline: boolean;
  onAction: (player: Member, playerIdx: number, actionType: MenuActionType) => void;
  onCancel: (player: Member, playerIdx: number) => void;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = InjectedProps & ReactProps;

interface ContextMenuState {
  actionType: MenuActionType;
  confirmAction: boolean;
}

export class AContextMenu extends React.Component<Props, ContextMenuState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      actionType: MenuActionType.none,
      confirmAction: false
    };
  }

  private onStartAction(action: MenuActionType) {
    if (this.state.confirmAction && this.state.actionType === action) {
      // no state to change
      return;
    }

    this.setState({
      actionType: action,
      confirmAction: true
    });
  }

  private onConfirm(actionType: MenuActionType, hitYes: boolean) {
    if (hitYes) {
      this.props.onAction(this.props.player, this.props.playerIdx, actionType);
    } else {
      this.props.onCancel(this.props.player, this.props.playerIdx);
    }
  }

  private getConfirmButtons(actionType: MenuActionType): JSX.Element {
    if (this.state.confirmAction && this.state.actionType == actionType) {
      return (
        <div className={ContextMenuConfirmButtonsContainer}>
          <button className={`${ContextMenuConfirmButton} yes`} onClick={() => this.onConfirm(actionType, true)}>
            {getStringTableValue(StringIDGeneralYes, this.props.stringTable)}
          </button>
          <button className={`${ContextMenuConfirmButton} no`} onClick={() => this.onConfirm(actionType, false)}>
            {getStringTableValue(StringIDGeneralNo, this.props.stringTable)}
          </button>
        </div>
      );
    }
    return null;
  }

  private makeContextMenuEntry(actionType: MenuActionType): JSX.Element {
    const confirmClass = this.state.confirmAction && this.state.actionType === actionType ? 'confirm' : '';
    return (
      <div className={`${ContextMenuEntry} ${confirmClass}`} onClick={() => this.onStartAction(actionType)}>
        <div className={ContextMenuLabel}>{makeMenuActionLabel(actionType, this.props.player.displayName)}</div>
        {this.getConfirmButtons(actionType)}
      </div>
    );
  }

  public getContextMenuEntries(): JSX.Element[] {
    let entries: JSX.Element[] = [];
    for (let actionType of CONTEXT_MENU_ACTION_TYPES) {
      //This is a check for invitations to hide the promote to leader option from the context menu
      if (this.props.isInvitation && actionType == MenuActionType.makeLeader) {
        continue;
      }
      if (!this.props.isOnline && actionType == MenuActionType.makeLeader) {
        continue;
      }
      entries.push(this.makeContextMenuEntry(actionType));
    }
    return entries;
  }

  public render(): JSX.Element {
    const confirmClass = this.state.confirmAction ? 'confirm' : '';
    const extraClass = this.props.extraClassName ? this.props.extraClassName : '';

    // When a context menu is open, the blocker div handles click events so that clicking "outside" the context menu closes
    // the menu. That blocker also prevents scrolling the list. However, scroll events _inside_ the context menu still cause
    // the whole group list to scroll, which makes the whole thing feel wonky.
    // As per Koo's advice that we should not allow scrolling while the context menu is open, this blocks those scroll events.
    const preventScrollEventHandler = (e: React.MouseEvent<HTMLDivElement>) => e.preventDefault();

    return (
      <div
        className={`${ContextMenuContainer} ${extraClass} ${confirmClass}`}
        style={this.props.extraStyles}
        onWheel={preventScrollEventHandler}
      >
        {this.getContextMenuEntries()}
        <svg width='16' height='16' className={ContextMenuArrow}>
          <polygon points='0,0 16,8 0,16' />
        </svg>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const ContextMenu = connect(mapStateToProps)(AContextMenu);
