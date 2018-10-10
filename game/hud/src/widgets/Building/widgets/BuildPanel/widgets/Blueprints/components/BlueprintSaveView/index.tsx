/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import NameInput from './NameInput';

export interface BlueprintSaveViewProps {
  onSave: (name: string) => void;
  onCancel: () => void;
  reservedNames: string[];
}

export interface BlueprintSaveViewState {
  saveable: boolean;
  name: string;
}

class BlueprintSaveView extends React.Component<BlueprintSaveViewProps, BlueprintSaveViewState> {

  constructor(props: BlueprintSaveViewProps) {
    super(props);
    this.state = { saveable: false, name: '' };
  }

  public render() {
    return (
      <div className='blueprint-save-panel'>
        <NameInput ref='name' placeholder='Save Blueprint As...'
          maxLength={20}
          onKeyUp={this.onKeyUp}
          grabFocus={true}/>

        <button onClick={() => this.triggerSave() } disabled={!this.state.saveable}>Ok</button>
        <button onClick={() => this.triggerCancel() } >Cancel</button>
      </div>
    );
  }

  private triggerSave() {
    this.props.onSave(this.state.name);
  }

  private triggerCancel() {
    this.props.onCancel();
  }

  private onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const input: HTMLInputElement = e.target as HTMLInputElement;
    const compareValue: string = input.value.toLowerCase();
    const duplicate: boolean = this.props.reservedNames.filter((name: string) => {
      return name.toLowerCase() === compareValue;
    }).length > 0;

    if (!duplicate && e.which === 13) {   // handle ENTER
      this.triggerSave();
      e.preventDefault();
      return;
    }

    if (e.which === 27) {   // handle ESC
      this.triggerCancel();
      e.preventDefault();
      return;
    }

    this.setState((state, props) => ({
      name: input.value,
      saveable: input.value && !duplicate,
    }));
  }
}

export default BlueprintSaveView;
