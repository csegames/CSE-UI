/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client } from 'camelot-unchained';
import { store, BuildingState } from '../stores/Building';
import { blueprints } from '../stores/BlueprintStore';
import NameInput from './NameInput';
import Button from '../common/Button';

export interface SaveBlueprintProps {
};
export interface SaveBlueprintState {
  name: string;
  ok: boolean;
};

class SaveBlueprint extends React.Component<SaveBlueprintProps, SaveBlueprintState> {
  public name: string = 'SaveBlueprint';

  constructor(props: SaveBlueprintProps) {
    super(props);
    this.state = { name: '', ok: false };
  }

  saveOk = (): void => {
    client.SaveBlueprint(this.state.name);
    this.saveCancel();
  }

  saveCancel = (): void => {
    store.dispatch({ type: 'SAVE_BLUEPRINT_MODE', save: false } as any);
  }

  onKeyUp = (e: React.KeyboardEvent): void => {
    const input: HTMLInputElement = e.target as HTMLInputElement;
    const duplicate: number = blueprints.getId(input.value.toLowerCase());
    if (duplicate === undefined && e.which === 13) {   // handle ENTER
      this.saveOk();
      client.ReleaseInputOwnership();
      e.preventDefault();
      return;
    }
    if (e.which === 27) {   // handle ESC
      this.saveCancel();
      client.ReleaseInputOwnership();
      e.preventDefault();
      return;
    }
    this.setState({
      name: input.value,
      ok: input.value && duplicate === undefined
    });
  }

  render() {
    return (
      <div className="save">
        <NameInput ref="name" placeholder="Save Blueprint As..." maxLength={10} onKeyUp={this.onKeyUp} grabFocus={true}/>
        <Button onClick={this.saveOk} disabled={!this.state.ok}>OK</Button>
        <Button onClick={this.saveCancel}>Cancel</Button>
      </div>
    );
  }
}

export default SaveBlueprint;
