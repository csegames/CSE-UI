/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { CancellablePromise } from '@csegames/library/dist/_baseGame/clientTasks';
import { Binding, Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import { refetchKeybinds } from '../../dataSources/keybindsService';
import { endIsBindingKey, startIsBindingKey } from '../../redux/hudSlice';
import { hideModal, showModal, updateModalContent } from '../../redux/modalsSlice';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralComma,
  StringIDGeneralNo,
  StringIDGeneralYes
} from '../../helpers/stringTableHelpers';

const ModalID = 'KeybindInput';

// CSS classes
const BindMessage = 'HUD-KeybindInput-BindMessage';

// String IDs
const StringIDKeybindSequencerListening = 'KeybindSequencerListening';
const StringIDKeybindSequencerPress = 'KeybindSequencerPress';
const StringIDKeybindSequencerRemove = 'KeybindSequencerRemove';
const StringIDKeybindSequencerConfirm = 'KeybindSequencerConfirm';
const StringIDKeybindSequencerBind = 'KeybindSequencerBind';
const StringIDKeybindSequencerWarning = 'KeybindSequencerWarning';
const StringIDKeybindSequencerConflict = 'KeybindSequencerConflict';
const StringIDKeybindSequencerRebind = 'KeybindSequencerRebind';

export class KeybindSequencer {
  private keybinds: Dictionary<Keybind>;
  private keybind: Keybind;
  private bindIndex: number;
  private binding: Binding;
  private dispatch: Dispatch;
  private listenForKeyBindingPromise: CancellablePromise<Binding> | null;
  private stringTable: Dictionary<StringTableEntryDef>;

  constructor(stringTable: Dictionary<StringTableEntryDef>) {
    this.stringTable = stringTable;
  }

  public beginKeybindSequence(
    keybinds: Dictionary<Keybind>,
    keybind: Keybind,
    bindIndex: number,
    dispatch: Dispatch
  ): void {
    this.keybinds = keybinds;
    this.keybind = keybind;
    this.bindIndex = bindIndex;
    this.dispatch = dispatch;

    this.listenForKeyBindingPromise = game.listenForKeyBindingAsync();

    this.listenForKeyBindingPromise.then(this.handleBindStart.bind(this));
    this.dispatch(
      showModal({
        id: ModalID,
        content: {
          title: getStringTableValue(StringIDKeybindSequencerListening, this.stringTable),
          message: getTokenizedStringTableValue(StringIDKeybindSequencerPress, this.stringTable, {
            DESCRIPTION: this.keybind.description
          }),
          buttons: [
            {
              text: getStringTableValue(StringIDKeybindSequencerRemove, this.stringTable),
              onClick: this.removeBind.bind(this)
            }
          ]
        },
        onClose: this.handleMenuClose.bind(this),
        escapable: true
      })
    );
    this.dispatch(startIsBindingKey());
  }

  private handleMenuClose(): void {
    this.listenForKeyBindingPromise.cancel();
    this.listenForKeyBindingPromise = null;
  }

  private handleBindStart(binding: Binding): void {
    const conflictingKeybinds = this.getConflictingKeybinds(binding);
    this.dispatch(endIsBindingKey());
    this.binding = binding;
    const messageLines = [
      getTokenizedStringTableValue(StringIDKeybindSequencerBind, this.stringTable, {
        NAME: binding.name,
        DESCRIPTION: this.keybind.description
      })
    ];
    if (conflictingKeybinds.length) {
      const conflicts = conflictingKeybinds
        .map((conflictingKeybind): string => conflictingKeybind.description)
        .join(`${getStringTableValue(StringIDGeneralComma, this.stringTable)} `);
      messageLines.push(
        null,
        getStringTableValue(StringIDKeybindSequencerWarning, this.stringTable),
        getTokenizedStringTableValue(StringIDKeybindSequencerConflict, this.stringTable, {
          NAME: binding.name,
          CONFLICTS: conflicts
        }),
        getStringTableValue(StringIDKeybindSequencerRebind, this.stringTable)
      );
    }
    this.dispatch(
      updateModalContent([
        ModalID,
        {
          title: getStringTableValue(StringIDKeybindSequencerConfirm, this.stringTable),
          body: (
            <div className={BindMessage}>
              {messageLines.map((messagePiece, index) =>
                messagePiece ? <span key={index}>{messagePiece}</span> : <br key={index} />
              )}
            </div>
          ),
          buttons: [
            {
              text: getStringTableValue(StringIDGeneralNo, this.stringTable),
              onClick: this.cancelBind.bind(this)
            },
            {
              text: getStringTableValue(StringIDGeneralYes, this.stringTable),
              onClick: this.confirmBind.bind(this)
            }
          ]
        }
      ])
    );
  }

  private removeBind(): void {
    game.clearKeybind(this.keybind.id, this.bindIndex);
    this.dispatch(hideModal());
    refetchKeybinds(this.dispatch);
  }

  private confirmBind(): void {
    const conflictingKeybinds = this.getConflictingKeybinds(this.binding);
    for (const conflictingKeybind of conflictingKeybinds) {
      conflictingKeybind.binds.forEach((conflictingBind, conflictingBindIndex) => {
        if (conflictingBind.value === this.binding.value) {
          game.clearKeybind(conflictingKeybind.id, conflictingBindIndex);
        }
      });
    }
    game.setKeybind(this.keybind.id, this.bindIndex, this.binding.value);
    this.dispatch(hideModal());
    refetchKeybinds(this.dispatch);
  }

  private cancelBind(): void {
    this.dispatch(hideModal());
  }

  private getConflictingKeybinds(binding: Binding): Keybind[] {
    return Object.values(this.keybinds).filter((keybind) =>
      keybind.binds.some((preexistingBinding) => preexistingBinding.value === binding.value)
    );
  }
}
