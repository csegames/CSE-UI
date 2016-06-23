/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client } from 'camelot-unchained';
import { store, BuildingState } from '../stores/Building';
import { blueprints, Blueprint } from '../stores/BlueprintStore';
import NameInput from './NameInput';
import Button from '../common/Button';

export interface BlueprintActionsProps {
  blueprint: Blueprint;
  buildingMode: number;
  copied: number;
};
export interface BlueprintActionsState {
};

class BlueprintActions extends React.Component<BlueprintActionsProps, BlueprintActionsState> {
  public name: string = 'BlueprintActions';

  constructor(props: BlueprintActionsProps) {
    super(props);
  }

  copy = (e: React.MouseEvent): void => {
    client.CopyBlueprint();
  }
  paste = (e: React.MouseEvent): void => {
    client.PasteBlueprint();
  }
  save = (e: React.MouseEvent): void => {
    store.dispatch({ type: 'SAVE_BLUEPRINT_MODE', save: true } as any);
  }
  delete = (e: React.MouseEvent): void => {
    client.DeleteLocalBlueprint(this.props.blueprint.name);    // TODO: Add to client interface
    blueprints.remove(this.props.blueprint.id);
  }

  render() {
    const selected: boolean = this.props.blueprint !== undefined;
    const mode: number = this.props.buildingMode;
    const paste: boolean = this.props.copied !== 0;
    return (
      <div>
        <Button onClick={this.copy} disabled={mode !== 8}>Copy</Button>
        <Button onClick={this.paste} disabled={!paste}>Paste</Button>
        <Button onClick={this.save} disabled={mode !== 8}>Save</Button>
        <Button onClick={this.delete} disabled={!selected}>Delete</Button>
      </div>
    );
  }
}

export default BlueprintActions;
