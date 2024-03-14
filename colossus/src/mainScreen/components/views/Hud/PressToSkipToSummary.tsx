/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { KeybindIDs, getActiveBindForKey } from '../../../redux/keybindsSlice';
import { RootState } from '../../../redux/store';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { hordetest } from '@csegames/library/dist/hordetest';
import { game } from '@csegames/library/dist/_baseGame';
import { Dispatch } from 'redux';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const Button = 'PressToSkipToSummary-Button';

const ControllerIcon = 'PressToSkipToSummary-ControllerIcon';

const StringIDHUDSkipEpilogue = 'HUDSkipEpilogue';

export interface InjectedProps {
  keybindToSkip: Keybind;
  usingGamepad: boolean;
  scenarioID: string;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch: Dispatch;
}

export interface ReactProps {
  onLeaveMatch: (scenarioID: string) => void;
}

type Props = ReactProps & InjectedProps;

class APressToSkipToSummary extends React.Component<Props, {}> {
  private controllerSelectEVH: ListenerHandle;

  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    var controllerKeybind = getActiveBindForKey(this.props.usingGamepad, this.props.keybindToSkip);

    return (
      <div className={Button} onClick={this.onLeaveMatch}>
        {this.props.usingGamepad && controllerKeybind && controllerKeybind.iconClass && (
          <span className={`${controllerKeybind.iconClass} ${ControllerIcon}`} />
        )}
        {` ${getStringTableValue(StringIDHUDSkipEpilogue, this.props.stringTable)}`}
      </div>
    );
  }

  public componentDidMount() {
    this.controllerSelectEVH = game.on('skipEpilogue', this.onLeaveMatch);

    if (this.props.usingGamepad) {
      this.setWaitingForSelect(true);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.usingGamepad && this.props.usingGamepad) {
      this.setWaitingForSelect(true);
    }

    if (prevProps.usingGamepad && !this.props.usingGamepad) {
      this.setWaitingForSelect(false);
    }
  }

  public componentWillUnmount() {
    if (this.controllerSelectEVH) {
      this.controllerSelectEVH.close();
    }

    if (this.props.usingGamepad) {
      this.setWaitingForSelect(false);
    }
  }

  private onLeaveMatch = () => {
    this.props.onLeaveMatch(hordetest.game.selfPlayerEntityState.scenarioID);
  };

  private setWaitingForSelect = (isWaitingForSelect: boolean) => {
    game.setWaitingForSelect(isWaitingForSelect);
  };
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  const keybindsState = state.keybinds;

  const keybindToSkip = keybindsState[KeybindIDs.SkipEpilogue];
  const usingGamepad = state.baseGame.usingGamepad;
  const scenarioID = state.player.scenarioID;
  const { stringTable } = state.stringTable;

  return {
    keybindToSkip,
    usingGamepad,
    scenarioID,
    stringTable,
    ...ownProps
  };
}

export const PressToSkipToSummary = connect(mapStateToProps)(APressToSkipToSummary);
