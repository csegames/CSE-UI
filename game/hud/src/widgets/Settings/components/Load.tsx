/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { TabbedDialog, DialogTab, DialogButton } from 'UI/TabbedDialog';
import { PopupDialog, Container } from './PopupDialog';
import { CheckBoxField } from 'UI/CheckBoxField';

const DIALOG_SIZE: React.CSSProperties = {
  width: '400px',
  height: '330px',
  top: '150px',
  left: '340px',
};

interface LoadProps {
  names: string[];
  onLoad: (name: string) => void;
  onRemove: (name: string) => void;
  onClose: () => void;
  style?: any;
}

interface LoadState {
  selected: string;
}

const SAVE: DialogButton = { label: 'Load' };
const DELETE: DialogButton = { label: 'Delete' };

export class Load extends React.PureComponent<LoadProps, LoadState> {
  constructor(props: LoadProps) {
    super(props);
    this.state = { selected: '' };
  }
  public render() {
    const { selected } = this.state;
    return (
      <PopupDialog style={DIALOG_SIZE}>
        <TabbedDialog title='load keybinds' heading={false} onClose={this.props.onClose}>
        {(tab: DialogButton) =>
          <DialogTab buttons={[SAVE, DELETE]} onAction={this.onAction}>
            <Container>
              { this.props.names.length === 0 ? <span>No Saved Keybind Sets</span> : null}
              { this.props.names.map((name: string) => (
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
        if (selected) this.props.onLoad(selected);
        break;
      case DELETE:
        if (selected) {
          this.props.onRemove(selected);
        }
        break;
    }
  }
}

export default Load;
