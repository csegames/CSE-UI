/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client } from '@csegames/camelot-unchained';
import { TabbedDialog, DialogTab, DialogButton } from 'UI/TabbedDialog';
import { PopupDialog, Container } from './PopupDialog';
import { CheckBoxField } from 'UI/CheckBoxField';
import { getKeybindNames } from '../utils/keyboard';

const DIALOG_SIZE: React.CSSProperties = {
  width: '400px',
  height: '330px',
  top: '150px',
  left: '340px',
};

interface LoadProps {
  load: (name: string) => void;
  remove: (name: string) => void;
  onClose: () => void;
  style?: any;
}

interface LoadState {
  names: string[];
  selected: string;
}

const SAVE: DialogButton = { label: 'Load' };
const DELETE: DialogButton = { label: 'Delete' };

export class Load extends React.PureComponent<LoadProps, LoadState> {
  constructor(props: LoadProps) {
    super(props);
    this.state = { selected: null, names: [] };
  }
  public componentDidMount() {
    this.setState({ names: getKeybindNames() });
    client.RequestInputOwnership();
  }
  public componentWillUnmount() {
    client.ReleaseInputOwnership();
  }
  public render() {
    const { selected } = this.state;
    return (
      <PopupDialog style={DIALOG_SIZE}>
        <TabbedDialog title='load keybinds' heading={false} onClose={this.onClose}>
        {(tab: DialogButton) =>
          <DialogTab buttons={[SAVE, DELETE]} onAction={this.onAction}>
            <Container>
              { this.state.names.map((name: string) => (
                <CheckBoxField
                  key={name}
                  label={name}
                  on={selected === name}
                  onToggle={() => this.setState({ selected: name })}/>
              ))}
            </Container>
          </DialogTab>
        }
        </TabbedDialog>
      </PopupDialog>
    );
  }

  private onAction = (action: DialogButton) => {
    const { selected } = this.state;
    switch (action) {
      case SAVE:
        if (selected) this.props.load(selected);
        break;
      case DELETE:
        if (selected) {
          this.props.remove(selected);
          this.setState({ names: getKeybindNames() });
        }
        break;
    }
  }

  private onClose = () => {
    this.props.onClose();
  }
}

export default Load;
