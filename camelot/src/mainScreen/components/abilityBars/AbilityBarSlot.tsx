/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import ContextMenuSource from '../ContextMenuSource';
import DropTarget from '../DropTarget';
import { AbilityButton, DropTypeAbilityButton } from './AbilityButton';
import { NoAbilityId, ButtonLayout } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { KeybindSequencer } from '../input/KeybindSequencer';
import { WIDGET_ID_ABILITY_BOOK } from '../abilityBook/AbilityBook';
import { toggleConditionalWidget } from '../../redux/hudSlice';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { getStringTableValue, StringIDGeneralPlus } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getFactionData } from '../../gameData/factionData';

// CSS classes
const Root = 'HUD-AbilityBarSlot-Root';
const EmptySlot = 'HUD-AbilityBarSlot-EmptySlot';
const GoToAbilityBookButton = 'HUD-AbilityBarSlot-GoToAbilityBookButton';
const AbilityButtonWrapper = 'HUD-AbilityBarSlot-AbilityButtonWrapper';
const DecorationBack = 'HUD-AbilityBarSlot-DecorationBack';
const DecorationFront = 'HUD-AbilityBarSlot-DecorationFront';

// String IDs
const StringIDAbilityBarBindKey = 'AbilityBarBindKey';

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
  uiFactionID: string;
  inEditMode: boolean;
  keybinds: Dictionary<Keybind>;
  activeConditionalWidgetIDs: string[];
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBarSlot extends React.Component<Props> {
  render(): React.ReactNode {
    const showEmptySlot = this.props.inEditMode && this.props.abilityId === NoAbilityId;
    const dropID = `${this.props.groupID}:${this.props.slotIndex}`;
    const dropData: AbilityBarSlotDropTargetData = {
      layoutID: this.props.layoutId,
      groupID: this.props.groupID,
      slotIndex: this.props.slotIndex
    };

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <DropTarget
        // Have to explicitly add a key, or else this doesn't update when the user cycles groups.
        key={dropID}
        dropData={dropData}
        dropType={DropTypeAbilityButton}
        className={Root}
      >
        <img className={DecorationBack} src={factionData.abilityBarCenterBackImage} />
        {showEmptySlot ? (
          <>
            <img className={EmptySlot} draggable={false} src={factionData.abilityBarEmptySlotImage} />
            <div className={GoToAbilityBookButton} onMouseDown={this.navigateToAbilityBook.bind(this)}>
              {getStringTableValue(StringIDGeneralPlus, this.props.stringTable)}
            </div>
          </>
        ) : (
          this.props.abilityId !== NoAbilityId && (
            <ContextMenuSource
              className={AbilityButtonWrapper}
              menuParams={{
                id: `L${this.props.layoutId}:${this.props.slotIndex}`,
                content: [
                  {
                    title: getStringTableValue(StringIDAbilityBarBindKey, this.props.stringTable),
                    onClick: this.onChangeKeybindClick.bind(this)
                  }
                ]
              }}
            >
              <AbilityButton
                layoutID={this.props.layoutId}
                slotIndex={this.props.slotIndex}
                abilityID={this.props.abilityId}
              />
            </ContextMenuSource>
          )
        )}
        <img className={DecorationFront} src={factionData.abilityBarCenterFrontImage} />
      </DropTarget>
    );
  }

  private onChangeKeybindClick(dispatch: Dispatch): void {
    const keybindId = this.props.layout.keybindBegin + this.props.slotIndex;
    const keybind = this.props.keybinds[keybindId];

    const sequencer = new KeybindSequencer(this.props.stringTable);
    sequencer.beginKeybindSequence(this.props.keybinds, keybind, 0, dispatch);
  }

  private navigateToAbilityBook(): void {
    if (!this.props.activeConditionalWidgetIDs.includes(WIDGET_ID_ABILITY_BOOK)) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_WINDOW_CLOSED);
      this.props.dispatch(toggleConditionalWidget(WIDGET_ID_ABILITY_BOOK));
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { keybinds } = state;
  const layout = state.abilities.layouts[ownProps.layoutId];
  // Have to split this off from layout or else we don't re-render (and change the drop target data) when
  // the user cycles between groups.
  const groupID = layout.groupID;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    layout,
    groupID,
    uiFactionID: state.hud.uiFactionID,
    inEditMode: state.abilities.editStatus.canEdit,
    keybinds,
    activeConditionalWidgetIDs: state.hud.activeConditionalWidgetIDs,
    stringTable
  };
}

export const AbilityBarSlot = connect(mapStateToProps)(AAbilityBarSlot);
