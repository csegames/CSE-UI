/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { spacify } from 'lib/spacify';
import * as CSS from 'lib/css-helper';
import { PopupDialog, Container } from './PopupDialog';
import { TabbedDialog, DialogTab, DialogButton } from 'UI/TabbedDialog';
import { Key } from './Key';

const DIALOG_SIZE: React.CSSProperties = {
  width: '400px',
  height: '400px',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  margin: 'auto',
};

const ConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Bind = styled.div`
  ${CSS.IS_ROW}
  display: flex;
`;

const ConfirmBindingText = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 1.2em;
`;

const Clashed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ClashContent = styled.div`
  ${CSS.IS_COLUMN} ${CSS.DONT_GROW}
  align-items: center;
  min-height: 26px;
  margin-right: 5px;
  line-height: 26px;
  .clash-key {
    align-self: center;
    pointer-events: none;
  }
`;

const ClashesContainer = styled.div`
  display: flex;
`;

const YES: DialogButton = { label: 'Yes' };
const NO: DialogButton = { label: 'No' };

export interface Props {
  keybind: Keybind;
  newBind: Binding;
  conflicts: Keybind[];
  onClose: () => void;
  onYesClick: () => void;
  onNoClick: () => void;
}

class ConfirmBindDialog extends React.Component<Props> {
  public render() {
    return (
      <PopupDialog style={DIALOG_SIZE}>
        <TabbedDialog title='Confirm Bind' heading={false} onClose={this.props.onClose}>
        {(tab: DialogButton) =>
          <DialogTab buttons={[YES, NO]} onAction={this.onAction}>
            <Container>
              <ConfirmContainer>
                <ConfirmBindingText>
                    Bind&nbsp;
                    <Key className='clash-key'>{this.props.newBind.name}</Key>
                    &nbsp;to {this.props.keybind.description}?
                </ConfirmBindingText>
                {
                  this.props.conflicts.length >= 1 ?
                  <Clashed>
                    <ClashContent>
                      Warning! <Key className='clash-key'>{this.props.newBind.name}</Key> is also bound to
                      <ClashesContainer>
                        {this.props.conflicts.map((keybind, index) => (
                          <span key={index}>
                            <Bind>
                              {spacify(keybind.description)}
                              {index !== this.props.conflicts.length - 1 ? ', ' : ''}
                            </Bind>
                          </span>
                        ))}
                      </ClashesContainer>
                      <i>Do you still want to rebind?</i>
                    </ClashContent>
                  </Clashed> : null
                }
              </ConfirmContainer>
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
      case NO: {
        this.props.onNoClick();
        break;
      }
    }
  }
}

export default ConfirmBindDialog;
