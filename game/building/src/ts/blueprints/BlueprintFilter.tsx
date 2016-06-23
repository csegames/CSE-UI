/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { store } from '../stores/Building';
import NameInput from './NameInput';
import { client } from 'camelot-unchained';

export interface BlueprintFilterProps {
};
export interface BlueprintFilterState {
};

class BlueprintFilter extends React.Component<BlueprintFilterProps, BlueprintFilterState> {
  public name: string = 'BlueprintFilter';
  private filterTimer: any;
  private static allowedKeys = [8, 16, 17, 20, 35, 36, 37, 38, 39, 40, 45, 46];

  constructor(props: BlueprintFilterProps) {
    super(props);
  }

  filter = (text: string): void => {
    store.dispatch({ type: 'BLUEPRINT_FILTER', filter: text.toLowerCase() } as any);
  }

  keyUp = (e: React.KeyboardEvent): void => {
    if (e.which === 9 || e.which === 13) {
      this.filter((e.target as HTMLInputElement).value);
      client.ReleaseInputOwnership();
    }
  }

  render() {
    return (
      <div className="blueprint-filter">
        <NameInput placeholder="enter a filter" timeout={500} onTimeout={this.filter} maxLength={10} onKeyUp={this.keyUp}/>
      </div>
    );
  }
}

export default BlueprintFilter;
