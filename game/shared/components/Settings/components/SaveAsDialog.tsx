/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import * as CONFIG from '../../config';
import { TabbedDialog, DialogTab, DialogButton } from '../../TabbedDialog';
import { Box } from '../../Box';
import { PopupDialog, Container } from './PopupDialog';

const DIALOG_SIZE: React.CSSProperties = {
  width: '400px',
  height: '230px',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  margin: 'auto',
};

const Input = styled.input`
  background-color: transparent;
  width: 100%;
  border: 1px solid #333;
  padding: 5px;
  outline: none;
  &:focus {
    box-shadow: 0 0 2px ${CONFIG.MENU_HIGHLIGHT_BORDER_COLOR};
  }
`;

interface SaveAsProps {
  label: string;
  saveAs: (name: string) => void;
  onClose: () => void;
  style?: any;
}

interface SaveAsState {
  name: string;
}

const SAVE: DialogButton = { label: 'Save' };

export class SaveAsDialog extends React.PureComponent<SaveAsProps, SaveAsState> {
  constructor(props: SaveAsProps) {
    super(props);
    this.state = { name: '' };
  }
  public render() {
    return (
      <PopupDialog style={DIALOG_SIZE}>
        <TabbedDialog title='save as' heading={false} onClose={this.onClose}>
        {(tab: DialogButton) =>
          <DialogTab buttons={[SAVE]} onAction={this.onAction}>
            <Container>
              {this.props.label}:
                <Box padding={false} style={{ margin: 0 }}>
                  <Input value={this.state.name} onChange={this.onChange}/>
                </Box>
            </Container>
          </DialogTab>
        }
        </TabbedDialog>
      </PopupDialog>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: e.currentTarget.value });
  }

  private onAction = (action: DialogButton) => {
    switch (action) {
      case SAVE:
        this.props.saveAs(this.state.name);
        break;
    }
  }

  private onClose = () => {
    this.props.onClose();
  }
}
