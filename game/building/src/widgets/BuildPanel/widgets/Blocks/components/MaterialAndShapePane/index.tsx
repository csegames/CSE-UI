/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import {GlobalState} from '../../services/session/reducer';
import * as materialService from '../../services/session/materials';
import {MaterialsState} from '../../services/session/materials';
import requester from '../../services/session/requester';

import {BuildingItem, BuildingItemType} from '../../../../../../lib/BuildingItem'

import {Material} from '../../lib/Material';
import {Block} from '../../lib/Block';

import MaterialView from '../MaterialView';
import ShapesView from '../ShapesView';
import MaterialSelector from '../MaterialSelector';

function select(state: GlobalState): MaterialAndShapePaneProps {
  return {
    materialsState: state.materials,
  }
}

export interface MaterialAndShapePaneProps {
  minimized?: boolean;
  dispatch?: (action: any) => void;
  materialsState?: MaterialsState;
  onItemSelect?: (item: BuildingItem) => void;
}

export interface MaterialAndShapePaneState {
  showMatSelect: boolean;
}

class MaterialAndShapePane extends React.Component<MaterialAndShapePaneProps, MaterialAndShapePaneState> {

  constructor(props: MaterialAndShapePaneProps) {
    super(props);
    this.state = { showMatSelect: false };

    requester.listenForBlockSelectionChange((mat: number, shape: number) => {
      let block: Block = materialService.findBlock(mat, shape, this.props.materialsState.materials);
      this.onBlockSelect(block);
    });
  }

  onBlockSelect = (block: Block) => {
    const item = {
      name: block.shape,
      description: block.tags,
      icon: 'data:image/png;base64,' + block.icon,
      type: BuildingItemType.Block
    } as BuildingItem;

    this.props.onItemSelect(item);
  }


  showMatSelector = (show: boolean) => {
    this.setState({ showMatSelect: show } as any);
  }

  selectBlock(block: Block) {
    materialService.requestBlockChange(block);
  }

  selectMaterial = (mat: Material) => {
    materialService.requestMaterialChange(mat, this.props.materialsState.selectedBlock);
    this.showMatSelector(false);
  }

  render() {

    let matSelect: any = null;
    if (this.state.showMatSelect) {
      matSelect = (
        <MaterialSelector
          materials={this.props.materialsState.materials}
          selectMaterial={this.selectMaterial}
          selected={this.props.materialsState.selectedMaterial} />
      )
    }

    let selectedMaterial: Material = this.props.materialsState.selectedMaterial;
    let selectedShape: Block = this.props.materialsState.selectedBlock;

    return (
      <div className='build-panel__material-and-shape'>
        {
          this.props.minimized ? null : (
            <header>
              <span>Material &amp; Shape</span>
              <span className='build-panel__material-and-shape__menu'>...</span>
            </header>
          )
        }

        <div className='content'>
          <MaterialView
            selectedMaterial={selectedMaterial}
            onClick={() => this.showMatSelector(!this.state.showMatSelect) }
            />
          <ShapesView minimized={this.props.minimized}
            shapes={selectedMaterial.blocks}
            selected={selectedShape}
            selectShape={(block: Block) => { this.selectBlock(block) } }/>
          {matSelect}
        </div>
      </div>
    )
  }
}

export default connect(select)(MaterialAndShapePane);
