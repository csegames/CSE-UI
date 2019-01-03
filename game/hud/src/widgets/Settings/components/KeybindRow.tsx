/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';

import * as CSS from 'lib/css-helper';
import { spacify } from 'lib/spacify';
import { Box } from 'UI/Box';
import { Key } from 'widgets/Settings/components/Key';
import ListeningDialog from './ListeningDialog';
import ConfirmBindDialog from './ConfirmBindDialog';

const Name = styled('div')`
  ${CSS.EXPAND_TO_FIT}
  position: relative;
`;
const Bind = styled('div')`
  ${CSS.IS_ROW}
  width: 130px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const InnerClass = css`
  display: flex;
  align-items: center;
`;

const DialogContainer = styled('div')`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

const Dialog = styled('div')`
  background-color: #444;
  min-width: 250px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const Content = styled('div')`
  padding: 10px;
  flex: 1;
`;

enum KeybindMode {
  Idle,
  ListeningForKey,
  ConfirmBind,
}

/**
 * Check if there are any conflicts with other Keybinds
 * @param checkID ID of Keybind we are attempting to apply the Binding to
 * @param checkBind Binding value we wish to check against
 * @return {Keybind[]} Any keybinds that share the same Binding value as the ones to check
 */
function checkForConflicts(checkID: number, checkBind: Binding): Keybind[] {
  const sameAs: Keybind[] = [];
  Object.values(game.keybinds).forEach((keybind) => {
    if (keybind.id === checkID) return;

    keybind.binds.forEach((bind) => {
      if (bind.value === checkBind.value) {
        sameAs.push(keybind as Keybind);
      }
    });
  });
  return sameAs;
}

interface Props {
  keybind: Keybind;
  bindingQueue: ObjectMap<{
    keybindID: number;
    index: number;
    value: number;
  }>;
  requestBind?: (keybindID: number, bindIndex: number, bindValue: number) => any;
}

interface State {
  mode: KeybindMode;
  keybind: Keybind;
  index: number;
  newBind: Binding;
}

export class KeybindRow extends React.Component<Props, State> {

  private listenPromise: CancellablePromise<Binding>;

  constructor(props: Props) {
    super(props);
    this.state = {
      mode: KeybindMode.Idle,
      keybind: cloneDeep(props.keybind),
      index: -1,
      newBind: null,
    };
  }

  public render() {
    const { keybind } = this.state;
    return (
      <Box innerClassName={InnerClass} style={{ minHeight: '45px' }}>
        { keybind.binds.map((binding, index) => {
          return (
            <Bind key={index}
              data-input-group='block'
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                this.startBind(index);
                e.stopPropagation();
                e.preventDefault();
              }}
              >
              <Key className={(binding && binding.value) ? 'assigned' : 'unassigned'}>
                { (binding && binding.name) || ' ' }
              </Key>
            </Bind>
          );
        })}
        <Name>{spacify(keybind.description)}</Name>
        {this.renderDialog()}
      </Box>
    );
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    const binds = this.state.keybind.binds;
    const nextBinds = nextState.keybind.binds;
    for (let i = 0; i < nextBinds.length; ++i) {
      if (binds[i] !== nextBinds[i]) return true;
      if (binds[i] && binds[i].value !== nextBinds[i].value) {
        return true;
      }
    }

    if (this.state.mode !== nextState.mode) {
      return true;
    }

    return false;
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setState({
      ...this.state,
      keybind: cloneDeep(nextProps.keybind),
    });
  }

  private renderDialog = () => {
    let content: JSX.Element = null;
    switch (this.state.mode) {
      case KeybindMode.Idle: return null;
      case KeybindMode.ListeningForKey:
        content = (
          <ListeningDialog keybind={this.state.keybind} onRemoveBind={this.onRemoveBind} onClose={this.cancel} />
        );
        break;
      case KeybindMode.ConfirmBind:
        const conflicts = checkForConflicts(this.state.keybind.id, this.state.newBind);
        content = (
          <ConfirmBindDialog
            keybind={this.state.keybind}
            newBind={this.state.newBind}
            conflicts={conflicts}
            onClose={this.cancel}
            onYesClick={this.onYesClick}
            onNoClick={this.cancel}
          />
        );
        break;
    }

    return (
      <DialogContainer>
        <Dialog>
          <Content>
            {content}
          </Content>
        </Dialog>
      </DialogContainer>
    );
  }

  private onYesClick = () => {
    this.setState((state) => {
      const newState = {
        ...state,
        mode: KeybindMode.Idle,
      };
      newState.keybind.binds[state.index] = cloneDeep(state.newBind);
      return newState;
    });
    game.setKeybind(this.state.keybind.id, this.state.index, this.state.newBind.value);
    this.props.requestBind(this.state.keybind.id, this.state.index, this.state.newBind.value);
  }

  private onRemoveBind = () => {
    this.cancel();                  // we were listening, need to cancel
    this.setState((state) => {
      const newState = {
        ...state,
        mode: KeybindMode.Idle,
      };
      newState.keybind.binds[state.index] = null;
      return newState;
    });
    game.clearKeybind(this.state.keybind.id, this.state.index);
  }

  private startBind = (index: number) => {
    this.setState((state) => {
      return {
        ...state,
        mode: KeybindMode.ListeningForKey,
        index,
      };
    });
    this.listenPromise = game.listenForKeyBindingAsync();
    this.listenPromise
      .then(this.confirmBind)
      .catch((fail) => {
        // TODO: handle failures better
        this.cancel();
        console.error('Key bind failed ' + JSON.stringify(fail));
      });
  }

  private confirmBind = (newBind: Binding) => {
    this.setState((state) => {
      return {
        ...state,
        mode: KeybindMode.ConfirmBind,
        newBind,
      };
    });
  }

  private cancel = () => {
    if (this.listenPromise) {
      this.listenPromise.cancel();
      this.listenPromise = null;
    }
    this.setState({
      mode: KeybindMode.Idle,
      index: -1,
      newBind: null,
    });
  }

}

