/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';

import { spacify } from 'lib/spacify';
import { PopupDialog, Container } from './PopupDialog';
import { TabbedDialog, DialogTab, DialogButton } from 'UI/TabbedDialog';

const DIALOG_SIZE: React.CSSProperties = {
  width: '400px',
  height: '330px',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  margin: 'auto',
};

const InstructionsText = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const ListeningPopup = styled.div`
  padding: 20px;
  z-index: 1;
`;

const ListeningTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: rgba(255, 234, 194, 1);
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 5px;
  text-align: center;
`;

const ListeningKey = styled.div`
  text-align: center;
  font-style: italic;
`;

const REMOVE: DialogButton = { label: 'Remove Bind' };

export interface Props {
  keybind: Keybind;
  onRemoveBind: () => void;
  onClose: () => void;
}

class ListeningDialog extends React.Component<Props> {
  public render() {
    return (
      <PopupDialog style={DIALOG_SIZE}>
        <TabbedDialog title='Listening' heading={false} onClose={this.props.onClose}>
        {(tab: DialogButton) =>
          <DialogTab buttons={[REMOVE]} onAction={this.onAction}>
            <Container>
              <ListeningPopup>
                <ListeningTitle>Press any key</ListeningTitle>
                <ListeningKey>Binding: {spacify(this.props.keybind.description)}</ListeningKey>
                <InstructionsText>
                  Press the key / key combination you wish to bind to {this.props.keybind.description}.
                </InstructionsText>
              </ListeningPopup>
            </Container>
          </DialogTab>
        }
        </TabbedDialog>
      </PopupDialog>
    );
  }

  private onAction = (action: DialogButton) => {
    switch (action) {
      case REMOVE: {
        this.props.onRemoveBind();
        break;
      }
    }
  }
}

export default ListeningDialog;
