/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';

const Container = 'Settings-Keybinds-ListeningDialog-Container';
const ListeningTitle = 'Settings-Keybinds-ListeningDialog-ListeningTitle';
const ListeningKey = 'Settings-Keybinds-ListeningDialog-ListeningKey';

const InstructionsText = 'Settings-Keybinds-ListeningDialog-InstructionsText';

const StringIDSettingsListeningDialogTitle = 'SettingsListeningDialogTitle';
const StringIDSettingsListeningDialogCurrentBinding = 'SettingsListeningDialogCurrentBinding';
const StringIDSettingsListeningDialogDescription = 'SettingsListeningDialogDescription';

export interface ReactProps {
  keybind: Keybind;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AListeningDialog extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <div className={Container}>
        <div className={ListeningTitle}>
          {getStringTableValue(StringIDSettingsListeningDialogTitle, this.props.stringTable)}
        </div>
        <div className={ListeningKey}>
          {getTokenizedStringTableValue(StringIDSettingsListeningDialogCurrentBinding, this.props.stringTable, {
            KEYBIND_DESCRIPTION: toTitleCase(this.props.keybind.description)
          })}
        </div>
        <div className={InstructionsText}>
          {getTokenizedStringTableValue(StringIDSettingsListeningDialogDescription, this.props.stringTable, {
            KEYBIND_DESCRIPTION: this.props.keybind.description
          })}
        </div>
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

export const ListeningDialog = connect(mapStateToProps)(AListeningDialog);
