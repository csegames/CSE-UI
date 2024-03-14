/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { InputBox } from './InputBox';
import { Binding, Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { CancellablePromise } from '@csegames/library/dist/_baseGame/clientTasks';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { KeybindSequencer } from './KeybindSequencer';

const Container = 'HUD-KeybindInput-Container';
const Values = 'HUD-KeybindInput-Values';
const Description = 'HUD-KeybindInput-Description';

interface ReactProps {
  keybind: Keybind;
}

interface InjectedProps {
  keybinds: Dictionary<Keybind>;
  dispatch?: Dispatch;
}

interface State {
  binding: Binding | null;
  listenForKeyBindingPromise: CancellablePromise<Binding> | null;
  bindIndex: number | null;
}

type Props = ReactProps & InjectedProps;
class AKeybindInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      binding: null,
      listenForKeyBindingPromise: null,
      bindIndex: null
    };
  }

  render(): JSX.Element {
    return (
      <InputBox padded>
        <div className={Container}>
          <div className={Values}>
            {this.props.keybind.binds.map((binding, bindIndex) => {
              return (
                <span onClick={this.openMenu.bind(this, bindIndex)} key={bindIndex}>
                  {binding.name}
                </span>
              );
            })}
          </div>
          <span className={Description}>{this.props.keybind.description}</span>
        </div>
      </InputBox>
    );
  }

  openMenu(bindIndex: number): void {
    const sequencer = new KeybindSequencer();
    sequencer.beginKeybindSequence(this.props.keybinds, this.props.keybind, bindIndex, this.props.dispatch);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    keybinds: state.keybinds
  };
};

export const KeybindInput = connect(mapStateToProps)(AKeybindInput);
