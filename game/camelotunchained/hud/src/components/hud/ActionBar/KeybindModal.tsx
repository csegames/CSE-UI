/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ModalContainer = styled.div`
  width: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  box-shadow: rgba(136, 70, 63, 0.52) 0px 0px 16px;
  flex: 0 0 auto;
  background: radial-gradient(rgba(255, 95, 76, 0.45), rgba(255, 95, 76, 0.0980392) 60%, transparent) 0% -140px /
    cover no-repeat,linear-gradient(to top,black, transparent), url(../images/contextmenu/modal-bg.jpg);
  border: 1px solid #6e6c6c;
  border-width: 1px;
  border-image:linear-gradient(to bottom,rgb(119, 69, 64), transparent) 1;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  -webkit-box-align: center;
  align-items: center;
  width: 400px;
  height: 200px;
  padding: 1em;
  font-family:titillium web;
`;

const ModalTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: rgb(255, 217, 210);
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 5px;
`;

const ModalWarning = styled.div`
  font-size: 1em;
  color: rgb(255, 95, 76);
  font-family: TitilliumWeb;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const ModalButton = styled.div`
  font-size: 14px;
  padding: 10px 15px;
  font-family: Caudex;
  background-color: rgba(17, 17, 17, 0.8);
  color: #ffdfa0;
  cursor: pointer;
  letter-spacing: .2em;
  text-transform: uppercase;
  transition: all ease .2s;
  border: 1px solid #404040;
  border-width: 2px 1px 2px 1px;
  border-image: url(../images/contextmenu/button-border-gold.png);
  border-image-slice: 2 1 2 1;
  margin:3px;

  &:hover {
    -webkit-filter: brightness(130%);
    background-image: url(../images/contextmenu/button-glow.png) ;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: cover;
    background-position: 50%;
  }

  &:focus, &:active {
    outline: -webkit-focus-ring-color auto 0px;
    background-color: rgba(35, 35, 35, 0.8);
  }

  &.red {
    border-image: url(../images/contextmenu/button-border-red.png);
    color: #dc5959;
  }

  &.red:hover {
    background-image: url(../images/contextmenu/button-glow-red.png) ;
  }

  &.grey {
    border-image: url(../images/contextmenu/button-border-grey.png);
    color: #f3f3f3;
  }

  &.grey:hover {
    background-image: url(../images/contextmenu/button-glow-grey.png) ;
  }
`;

export interface Props {
  keybindId: number;
  onConfirmBind: (newBind: Binding) => void;
  onClose: (result: any) => void;
}

export interface State {
  conflictingBind: Binding;
  conflicts: Keybind[];
}

export class KeybindModal extends React.Component<Props, State> {
  private listenPromise: CancellablePromise<Binding>;
  constructor(props: Props) {
    super(props);
    this.state = {
      conflictingBind: null,
      conflicts: [],
    };
  }

  public render() {
    return (
      this.state.conflictingBind === null ?
        <ModalContainer>
          <ModalContent>
            <ModalTitleContainer>
              <ModalTitle>Press any key</ModalTitle>
            </ModalTitleContainer>
            <ButtonContainer>
              <ModalButton className='grey' onClick={this.cancel}>Cancel</ModalButton>
            </ButtonContainer>
          </ModalContent>
        </ModalContainer> :
        <ModalContainer>
          <ModalContent>
            <ModalTitleContainer>
              <ModalTitle>Warning!</ModalTitle>
              <ModalWarning>
                That bind clashes with {this.state.conflicts.map(k => k.description).toString()}. Continue?
              </ModalWarning>
            </ModalTitleContainer>
            <ButtonContainer>
              <ModalButton className='grey' onClick={() => this.onSuccess(this.state.conflictingBind)}>Yes</ModalButton>
              <ModalButton className='grey' onClick={this.cancel}>No</ModalButton>
            </ButtonContainer>
          </ModalContent>
        </ModalContainer>
    );
  }

  public componentDidMount() {
    this.startBind();
  }

  private startBind = () => {
    this.listenPromise = game.listenForKeyBindingAsync();
    this.listenPromise
      .then(this.onConfirmBind)
      .catch((fail) => {
        // TODO: handle failures better
        this.cancel();
        console.error('Key bind failed ' + JSON.stringify(fail));
      });
  }

  private onConfirmBind = (newBind: Binding) => {
    const conflicts = this.getKeybindConflicts(newBind);

    if (conflicts.length > 0) {
      this.setState({ conflictingBind: newBind, conflicts });
      return;
    }

    this.onSuccess(newBind);
  }

  private onSuccess = (newBind: Binding) => {
    this.props.onConfirmBind(newBind);
    this.props.onClose('success');
  }

  private cancel = () => {
    if (this.listenPromise) {
      this.listenPromise.cancel();
      this.listenPromise = null;
    }

    this.props.onClose('cancel');
  }

  private getKeybindConflicts(checkBind: Binding): Keybind[] {
    const sameAs: Keybind[] = [];
    Object.values(game.keybinds).forEach((keybind) => {
      if (this.props.keybindId === keybind.id) {
        return;
      }

      keybind.binds.forEach((bind) => {
        if (bind.value === checkBind.value) {
          sameAs.push(keybind as Keybind);
        }
      });
    });
    return sameAs;
  }
}
