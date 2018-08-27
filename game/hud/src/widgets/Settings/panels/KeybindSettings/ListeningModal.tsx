/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Modal } from 'UI/Modal';
import { spacify } from '../../components/KeyBind';
import { getButtonNameFromId, Bind } from '../../utils/keyboard';
import {
  ModalContainer,
  ModalButtonContainer,
  ModalButton,
  MODAL_ACCENT,
  MODAL_HIGHLIGHT_STRONG,
  MODAL_HIGHLIGHT_WEAK,
} from './styles';

const ListeningTitle = styled('div')`
  font-size: 24px;
  font-weight: 500;
  color: rgba(255, 234, 194, 1);
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 5px;
  text-align: center;
`;

const ListeningKey = styled('div')`
  text-align: center;
  font-style: italic;
`;

const InstructionsText = styled('div')`
  margin-top: 20px;
  text-align: center;
`;

const ListeningPopup = styled('div')`
  width: 400px;
  height: 250px;
  padding: 20px;
`;

export interface Listening {
  keybind: Bind;
  alias: number;
}

export interface Props {
  listening: Listening;
  clearBind: (button: number, alias: number) => void;
  toggleRebind: (keybind: Bind, alias: number) => void;
}

class ListeningModal extends React.Component<Props> {
  public render() {
    const { listening } = this.props;
    return (
      <ModalContainer>
        <Modal
          accentColor={MODAL_ACCENT}
          highlightColorStrong={MODAL_HIGHLIGHT_STRONG}
          highlightColorWeak={MODAL_HIGHLIGHT_WEAK}>
          <ListeningPopup>
            <ListeningTitle>Press any key</ListeningTitle>
            <ListeningKey>Rebinding: {spacify(getButtonNameFromId(listening.keybind.button))}</ListeningKey>
            <InstructionsText>
              Press the key to bind, or click outside of this window to bind a mouse button.
            </InstructionsText>
            <ModalButtonContainer>
              <ModalButton onClick={this.onUnbindClick}>Unbind</ModalButton>
              <ModalButton onClick={this.onCancelClick}>Cancel</ModalButton>
            </ModalButtonContainer>
          </ListeningPopup>
        </Modal>
      </ModalContainer>
    );
  }

  private onUnbindClick = () => {
    const { listening } = this.props;
    this.props.clearBind(listening.keybind.button, listening.alias);
  }

  private onCancelClick = () => {
    const { listening } = this.props;
    this.props.toggleRebind(listening.keybind, listening.alias);
  }
}

export default ListeningModal;
