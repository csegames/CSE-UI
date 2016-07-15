/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import {GlobalState} from '../../services/session/reducer';
import * as materialService from '../../services/session/materials';
import * as replaceService from '../../services/session/materials-replace';
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

  private blockSelectionListener = (mat: Material, block: Block) => {
    this.onBlockSelect(block);
  }


  constructor(props: MaterialAndShapePaneProps) {
    super(props);
    this.state = { showMatSelect: false };
  }

  onBlockSelect = (block: Block) => {

    if (block != null) {
      const item = {
        name: block.shapeId + ". " + block.shape,
        description: block.materialId + ". " + block.tags,
        element: (<img src={'data:image/png;base64,' + block.icon}/>),
        id: block.id + '-' + BuildingItemType.Block,
        type: BuildingItemType.Block,
        select: () => { this.selectBlock(block) }
      } as BuildingItem;
      this.props.onItemSelect(item);
    } else {
      this.props.onItemSelect(null);
    }
  }


  showMatSelector = (show: boolean) => {
    this.setState({ showMatSelect: show } as any);
  }

  selectBlock(block: Block) {
    materialService.requestBlockChange(block);
  }

  selectMaterial = (mat: Material) => {
    materialService.requestMaterialChange(mat, this.props.materialsState.selectedBlock.id);
    this.setState({ showMatSelect: false } as any);
  }

  componentDidMount() {
    requester.listenForBlockSelectionChange(this.blockSelectionListener);
  }

  componentWillUnmount() {
    requester.unlistenForBlockSelectionChange(this.blockSelectionListener);
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

    const selectedMaterial: Material = this.props.materialsState.selectedMaterial;
    const selectedShape: Block = this.props.materialsState.selectedBlock;

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
