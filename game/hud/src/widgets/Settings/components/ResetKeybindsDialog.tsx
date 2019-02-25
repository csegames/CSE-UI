/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';

import { PopupDialog, Container } from './PopupDialog';
import { TabbedDialog, DialogTab, DialogButton } from 'UI/TabbedDialog';

const DIALOG_SIZE: React.CSSProperties = {
  width: '400px',
  height: '300px',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  margin: 'auto',
};

const ListeningTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: rgba(255, 234, 194, 1);
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 5px;
  text-align: center;
`;

const InstructionsText = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const ListeningPopup = styled.div`
  width: 100%;
  height: 100%;
`;

const YES: DialogButton = { label: 'Yes' };
const CANCEL: DialogButton = { label: 'Cancel' };

export interface Props {
  onYesClick: () => void;
  onCancelClick: () => void;
}

export class ResetKeybindsDialog extends React.Component<Props> {
  public render() {
    return (
      <PopupDialog style={DIALOG_SIZE}>
        <TabbedDialog title='Confirm Bind' heading={false} onClose={this.props.onCancelClick}>
        {(tab: DialogButton) =>
          <DialogTab buttons={[YES, CANCEL]} onAction={this.onAction}>
            <Container>
              <ListeningPopup>
                <ListeningTitle>Reset Keybinds</ListeningTitle>
                <InstructionsText>
                  Clicking 'Yes' will reset all keybinds to their default values.
                  Are you sure you wish to reset all keybinds?
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
      case YES: {
        this.props.onYesClick();
        break;
      }
      case CANCEL: {
        this.props.onCancelClick();
        break;
      }
    }
  }
}

export default ResetKeybindsDialog;

