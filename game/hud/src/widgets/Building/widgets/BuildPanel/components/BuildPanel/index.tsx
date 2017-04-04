/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {events} from 'camelot-unchained';

import TabbedPane from '../TabbedPane';

import Blocks from '../../widgets/Blocks';
import RecentSelections from '../../widgets/RecentSelections';
import DropLight from '../../widgets/DropLight';
import Blueprints from '../../widgets/Blueprints';
import MaterialSelector from '../../widgets/MaterialSelector';

import {BuildingItem} from '../../../../lib/BuildingItem'
import {ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR} from '../../lib/BuildPane'

export interface BuildPanelProps {

}

export interface BuildPanelState {
  minimized: boolean;
  showMaterialSelector: boolean;
}

class BuildPanel extends React.Component<BuildPanelProps, BuildPanelState> {

  private cols = 20;
  private itemWidth = 3;
  private gridHeight = 50;

  constructor(props: BuildPanelProps) {
    super(props);
    let yPos = 0;
    this.state = {
      minimized: false,
      showMaterialSelector: false,
    }
  }

  onMinMax() {
    this.setState((state, props) => ({ minimized: !state.minimized } as BuildPanelState));
  }

  materialSelectorActivated = () => {
    this.setState((state, props) => ({ showMaterialSelector: true } as BuildPanelState));
  }

  materialSelectorDeactivated = () => {
    this.setState((state, props) => ({ showMaterialSelector: true } as BuildPanelState));
  }

  componentDidMount() {
    events.addListener(ACTIVATE_MATERIAL_SELECTOR, this.materialSelectorActivated);
    events.addListener(DEACTIVATE_MATERIAL_SELECTOR, this.materialSelectorDeactivated);
  }

  componentWillUnmount() {
    events.removeListener(this.materialSelectorActivated);
    events.removeListener(this.materialSelectorDeactivated);
  }

  render() {
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
    )
  }
}

export default BuildPanel;
