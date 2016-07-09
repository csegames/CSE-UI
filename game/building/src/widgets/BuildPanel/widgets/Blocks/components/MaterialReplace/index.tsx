/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import {GlobalState} from '../../services/session/reducer';
import {Material} from '../../lib/Material';
import MaterialView from '../..//components/MaterialView';
import MaterialSelector from '../..//components/MaterialSelector';

function select(state: GlobalState): MaterialReplacePaneProps {
  return {
    materials: state.materials.materials,
  }
}

export interface MaterialReplacePaneProps {
  minimized?: boolean;
  materials: Material[];
}

export interface MaterialReplacePaneState {
  showFrom: boolean;
  showTo: boolean;
  from: Material;
  to: Material;
}

class MaterialReplacePane extends React.Component<MaterialReplacePaneProps, MaterialReplacePaneState> {

  constructor(props: MaterialReplacePaneProps) {
    super(props);
    this.state = {
      showFrom: false,
      showTo: false,
      from: props.materials[0],
      to: props.materials[0],
    };
  }

  showMaterialsFrom = (show: boolean) => {
    this.setState({ showFrom: show, showTo: false } as MaterialReplacePaneState);
  }

  showMaterialsTo = (show: boolean) => {
    this.setState({ showFrom: false, showTo: show } as MaterialReplacePaneState);
  }

  selectFrom = (mat: Material) => {
    this.setState({ from: mat, showFrom: false } as MaterialReplacePaneState);
  }

  selectTo = (mat: Material) => {
    this.setState({ to: mat, showTo: false } as MaterialReplacePaneState);
  }

  materialReplace = () => {
    var w: any = window;
    if (w.cuAPI != null) {
      w.cuAPI.ReplaceSelectedSubstance(this.state.from.id, this.state.to.id);
    }
  }

  render() {
    let matSelector: any = null;
    if (this.state.showFrom) {
      matSelector = (
        <MaterialSelector
          materials={this.props.materials}
          selectMaterial={this.selectFrom}
          selected={this.state.from} />
      )
    }
    else if (this.state.showTo) {
      matSelector = (
        <MaterialSelector
          materials={this.props.materials}
          selectMaterial={this.selectTo}
          selected={this.state.to} />
      )
    }

    return (
      <div className='build-panel__material-replace'>
        {
          this.props.minimized ? null : (
            <header>
              <span>Replace Material in selection</span>
            </header>
          )
        }
        <div className='content'>
          <div className={'material-selections' + (this.props.minimized ? ' minimized' : '') }>
            <MaterialView
              selectedMaterial={this.state.from}
              onClick={() => this.showMaterialsFrom(!this.state.showFrom) }
              />

            <div className="divider">
              <div className="arrow"/>
            </div>

            <MaterialView
              selectedMaterial={this.state.to}
              onClick={() => this.showMaterialsTo(!this.state.showTo) }
              />
          </div>

          {this.props.minimized ? '' : '( ' + this.state.from.id + ' )'}
          <button onClick={this.materialReplace} disabled={this.state.from == this.state.to}>Replace</button>
          {this.props.minimized ? '' : '( ' + this.state.to.id + ' )'}

          {matSelector}
        </div>
      </div>
    )
  }
}

export default connect(select)(MaterialReplacePane);
