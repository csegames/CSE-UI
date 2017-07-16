/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {events} from 'camelot-unchained';

import Blocks from '../../widgets/Blocks';
import RecentSelections from '../../widgets/RecentSelections';
import DropLight from '../../widgets/DropLight';
import Blueprints from '../../widgets/Blueprints';
import MaterialSelector from '../../widgets/MaterialSelector';

import {ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR} from '../../lib/BuildPane';

export interface BuildPanelProps {

}

export interface BuildPanelState {
  minimized: boolean;
  showMaterialSelector: boolean;
}

class BuildPanel extends React.Component<BuildPanelProps, BuildPanelState> {

  constructor(props: BuildPanelProps) {
    super(props);
    this.state = {
      minimized: false,
      showMaterialSelector: false,
    };
  }

  public render() {
    let matSelector: JSX.Element = null;
    if (this.state.showMaterialSelector)
      matSelector = (<MaterialSelector minimized={this.state.minimized} />);

    return (
      <div className={`build-panel ${this.state.minimized ? 'minimized' : ''}`} >
        {matSelector}
        <Blocks minimized={this.state.minimized} />
        <RecentSelections minimized={this.state.minimized} />
        <Blueprints minimized={this.state.minimized} />
        <DropLight minimized={this.state.minimized} />
      </div>
    );
  }

  public componentDidMount() {
    events.addListener(ACTIVATE_MATERIAL_SELECTOR, this.materialSelectorActivated);
    events.addListener(DEACTIVATE_MATERIAL_SELECTOR, this.materialSelectorDeactivated);
  }

  public componentWillUnmount() {
    events.removeListener(this.materialSelectorActivated);
    events.removeListener(this.materialSelectorDeactivated);
  }

  private materialSelectorActivated = () => {
    this.setState((state, props) => ({ showMaterialSelector: true } as BuildPanelState));
  }

  private materialSelectorDeactivated = () => {
    this.setState((state, props) => ({ showMaterialSelector: true } as BuildPanelState));
  }
}

export default BuildPanel;
