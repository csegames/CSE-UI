/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Theme } from '../../themes/themeConstants';
import ContextMenuSource from '../ContextMenuSource';
import DropTarget from '../DropTarget';
import { AbilityButton, DropTypeAbilityButton } from './AbilityButton';
import { NoAbilityId, ButtonLayout } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { KeybindSequencer } from '../input/KeybindSequencer';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { WIDGET_NAME_ABILITY_BOOK } from '../abilityBook/AbilityBook';
import { toggleMenuWidget } from '../../redux/hudSlice';
import { FactionDef } from '../../dataSources/manifest/factionManifest';

// Styles
const Root = 'HUD-AbilityBarSlot-Root';
const EmptySlot = 'HUD-AbilityBarSlot-EmptySlot';
const GoToAbilityBookButton = 'HUD-AbilityBarSlot-GoToAbilityBookButton';
const AbilityButtonWrapper = 'HUD-AbilityBarSlot-AbilityButtonWrapper';

export interface AbilityBarSlotDropTargetData {
  layoutID: number;
  groupID: number;
  slotIndex: number;
}

interface ReactProps {
  layoutId: number;
  abilityId: number;
  slotIndex: number;
}

interface InjectedProps {
  layout: ButtonLayout;
  groupID: number;
  myFaction: FactionDef;
  currentTheme: Theme;
  inEditMode: boolean;
  keybinds: Dictionary<Keybind>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBarSlot extends React.Component<Props> {
  render(): React.ReactNode {
    const buttonRadius: number = this.props.currentTheme.abilityButtons.display.radius;
    const showEmptySlot = this.props.inEditMode && this.props.abilityId === NoAbilityId;
    const dropID = `${this.props.groupID}:${this.props.slotIndex}`;
    const dropData: AbilityBarSlotDropTargetData = {
      layoutID: this.props.layoutId,
      groupID: this.props.groupID,
      slotIndex: this.props.slotIndex
    };

    return (
      <DropTarget
        // Have to explicitly add a key, or else this doesn't update when the user cycles groups.
        key={dropID}
        dropData={dropData}
        dropType={DropTypeAbilityButton}
        className={Root}
        style={{ width: `${buttonRadius * 2}vmin`, height: `${buttonRadius * 2}vmin` }}
      >
        {showEmptySlot ? (
          <>
            <img className={EmptySlot} draggable={false} src={this.props.myFaction?.abilityBarEmptySlotImage} />
            <div className={GoToAbilityBookButton} onMouseDown={this.navigateToAbilityBook.bind(this)}>
              +
            </div>
          </>
        ) : (
          this.props.abilityId !== NoAbilityId && (
            <ContextMenuSource
              className={AbilityButtonWrapper}
              menuParams={{
                id: `L${this.props.layoutId}:${this.props.slotIndex}`,
                content: [{ title: 'Bind key', onClick: this.onChangeKeybindClick.bind(this) }]
              }}
            >
              <AbilityButton
                layoutId={this.props.layoutId}
                slotIndex={this.props.slotIndex}
                abilityId={this.props.abilityId}
              />
            </ContextMenuSource>
          )
        )}
      </DropTarget>
    );
  }

  private onChangeKeybindClick(dispatch: Dispatch): void {
    const keybindId = this.props.layout.keybindBegin + this.props.slotIndex;
    const keybind = this.props.keybinds[keybindId];

    const sequencer = new KeybindSequencer();
    sequencer.beginKeybindSequence(this.props.keybinds, keybind, 0, dispatch);
  }

  private navigateToAbilityBook(): void {
    this.props.dispatch(
      toggleMenuWidget({ widgetId: WIDGET_NAME_ABILITY_BOOK, escapableId: WIDGET_NAME_ABILITY_BOOK })
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentTheme } = state.themes;
  const { keybinds } = state;
  const layout = state.abilities.layouts[ownProps.layoutId];
  // Have to split this off from layout or else we don't re-render (and change the drop target data) when
  // the user cycles between groups.
  const groupID = layout.groupID;
  const myFaction = state.gameDefs.factions[Faction[state.player.faction]];

  return {
    ...ownProps,
    layout,
    groupID,
    myFaction,
    currentTheme,
    inEditMode: state.abilities.editStatus.canEdit,
    keybinds
  };
}

export const AbilityBarSlot = connect(mapStateToProps)(AAbilityBarSlot);
