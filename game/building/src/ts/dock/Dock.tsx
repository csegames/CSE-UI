/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client } from 'camelot-unchained';
import * as React from 'react';
import DockTab from './DockTab';
import Blocks from '../blocks/Blocks';
import Blueprints from '../blueprints/Blueprints';
import BuildingToggle from './BuildingToggle';
import { store, BuildingState } from '../stores/Building';

export interface DockProps {
  state: BuildingState
}
export interface DockState {
}

class Dock extends React.Component<DockProps, DockState> {
  public name: string = 'Dock';
  private tabs: string[] = ['BLOCKS', 'BLUEPRINTS' /* , 'FAVORITES' */];

  constructor(props: DockProps) {
    super(props);
  }

  showHide = () => {
    store.dispatch({ type: 'SET_EXPANDED', expanded: !this.props.state.ui.expanded } as any);
  }

  selectTab = (id: string): void => {
    store.dispatch({ type: 'SELECT_TAB', tab: id } as any);
  }

  toggleBuilding = () => {
    client.ToggleBuildingMode();
  }

  getTabs = (): JSX.Element[] => {
    const state: BuildingState = this.props.state;
    const tabs: string[] = this.tabs;
    const tabElements: JSX.Element[] = [];
    for (let i = 0; i < this.tabs.length; i++) {
      tabElements.push(
        <DockTab key={i} id={tabs[i]} selected={state.ui.expanded && state.ui.tab === tabs[i]} select={this.selectTab}/>
      );
    }
    return tabElements;
  }

  render() {
    const state: BuildingState = this.props.state;
    let arrows: string = '<<';
    const classNames: string[] = [ "dock", state.ui.edge ];
    let content: JSX.Element;
    if (state.ui.expanded) {
      arrows = '>>';
      classNames.push('open');
      switch(state.ui.tab) {
        case 'BLUEPRINTS':
          content = <Blueprints state={this.props.state}/>;
          break;
        case 'BLOCKS':
          content = <Blocks state={this.props.state}/>;
          break;
      }
    }
    classNames.push(state.ui.mode ? "on" : "off");
    return (
      <div className={classNames.join(' ')}>
        <div className="tabs">
          <div className="tab toggle" onClick={this.showHide}>{arrows}</div>
          {this.getTabs()}
        </div>
        <div className="content">
          {content}
        </div>
        <BuildingToggle toggle={this.toggleBuilding} />
      </div>
    );
  }
}

export default Dock;
