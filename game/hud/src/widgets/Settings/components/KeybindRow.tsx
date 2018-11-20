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
import Listening from './Listening';

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

const ConfirmBind = styled('div')`
  padding: 20px;
`;

const ConfirmBindingText = styled('span')`
  text-align: center;
  font-size: 1.2em;
`;

const Clashed = styled('div')`
  width: 400px;
  height: 250px;
  padding: 20px;
  text-align: center;
`;

const ClashContent = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.DONT_GROW}
  ${CSS.HORIZONTALLY_CENTERED}
  min-height: 26px;
  margin-right: 5px;
  line-height: 26px;
  .clash-key {
    align-self: center;
    pointer-events: none;
  }
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

const Buttons = styled('div')`
  display: flex;
  flex: 0;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const ConfirmButton = styled('div')`
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const CancelButton = styled('div')`
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
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
    for (let i = 0; i < nextProps.keybind.binds.length; ++i) {
      if (this.props.keybind.binds[i].value !== nextProps.keybind.binds[i].value) {
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
    let confirm: JSX.Element | string = null;
    let clickConfirm: () => any = null;
    let cancel: JSX.Element | string = 'Cancel';
    switch (this.state.mode) {
      case KeybindMode.Idle: return null;
      case KeybindMode.ListeningForKey: {
        content = (
          <Listening keybind={this.state.keybind} onRemoveBind={this.onRemoveBind} onClose={this.cancel} />
        );
      }
        break;
      case KeybindMode.ConfirmBind: {
        const conflicts = checkForConflicts(this.state.keybind.id, this.state.newBind);
        content = (
          <ConfirmBind>
              <ConfirmBindingText>
                Bind&nbsp;
                <Key className='clash-key'>{this.state.newBind.name}</Key>
                &nbsp;to {this.state.keybind.description}?
              </ConfirmBindingText>
              {
                conflicts.length > 1 ?
                <Clashed>
                <ClashContent>
                  Warning! <Key className='clash-key'>{this.state.newBind.name}</Key> is also bound to
                  <div>
                    {conflicts.map((keybind, index) => (
                      <span key={index}>
                        <Bind>{spacify(keybind.description)}</Bind>
                        {index !== conflicts.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <i>Do you still want to rebind?</i>
                </ClashContent>
                </Clashed> : null
              }
            </ConfirmBind>
        );
        confirm = <p>Yes</p>;
        clickConfirm = () => {
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
        };
        cancel = <p>No</p>;
      }
        break;
    }

    return (
      <DialogContainer>
        <Dialog>
          <Content>
            {content}
          </Content>
          <Buttons>
            {confirm && (
              <ConfirmButton onClick={clickConfirm}>
                {confirm}
              </ConfirmButton>
            )}
            <CancelButton  onClick={this.cancel}>
              {cancel}
            </CancelButton>
          </Buttons>
        </Dialog>
      </DialogContainer>
    );
  }

  private onRemoveBind = () => {
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
    }
    this.setState({
      mode: KeybindMode.Idle,
      index: -1,
      newBind: null,
    });
  }

}

