/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import {BuildPane} from '../../lib/BuildPane';
import {GlobalState} from '../../services/session/reducer';
import {selectTab, PanesState} from '../../services/session/panes';
import {BuildingItem} from '../../../../lib/BuildingItem'

function select(state: GlobalState): BuildPanelProps {
  return {
    panesState: state.panes,
  }
}

export interface BuildPanelProps {
  dispatch?: (action: any) => void;
  panesState?: PanesState;
  onItemSelect?: (item: BuildingItem)=>void;
}

export interface BuildPanelState {
  minimized: boolean;
}

class BuildPanel extends React.Component<BuildPanelProps, BuildPanelState> {

  constructor(props: BuildPanelProps) {
    super(props);
    this.state = {
      minimized: false,
    }
  }
  
  onMinMax() {
    this.setState({
      minimized: !this.state.minimized,
    });
  }

  render() {
    return (
      <div className={`build-panel ${this.state.minimized ? 'minimized' : ''}`}>
        <header>
          <span className='min-max' onClick={() => this.onMinMax()}>
          {this.state.minimized ? '<<' : '>>'}
          </span>
          <span className='info'>?</span>
        </header>
        {this.props.panesState.panes.map((rowPanes: BuildPane[], row: number) => {
          return (<div className='row' key={row}>
            <div className='tabs'>
              {rowPanes.map((pane: BuildPane, index: number) => {
                return (<div className={this.props.panesState.activeIndices[row] == index ? 'active': ''}
                             onClick={() => this.props.dispatch(selectTab(row, index))}
                             key={`${row}:${index}`}>
                  {this.state.minimized ? pane.minTitle : pane.title}
                </div>)
              })}
            </div>
            <div className='tab-content'>
            {
              React.createElement(rowPanes[this.props.panesState.activeIndices[row]].component,
               {
                 data: rowPanes[this.props.panesState.activeIndices[row]].data, 
                 minimized: this.state.minimized,
                 onItemSelect: this.props.onItemSelect
               })
            }          
            </div>
          </div>
          )})}
      </div>
    )
  }
}

export default connect(select)(BuildPanel);
