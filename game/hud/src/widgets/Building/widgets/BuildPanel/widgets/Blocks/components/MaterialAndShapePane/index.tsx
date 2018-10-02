/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';

import { GlobalState } from '../../services/session/reducer';
import { MaterialsState } from '../../services/session/materials';

import blockRequester from '../../../../../../services/session/requester';
import { ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR } from '../../../../lib/BuildPane';

import { BuildingItem, BuildingItemType } from '../../../../../../lib/BuildingItem';
import { fireBuildingItemSelected } from '../../../../../../services/events';

import { building } from '../../../../../../lib/old-library';

import MaterialView from '../MaterialView';
import ShapesView from '../ShapesView';

function select(state: GlobalState): MaterialAndShapePaneStateToPropsInfo {
  return {
    materialsState: state.materials,
  };
}

export interface MaterialAndShapePaneStateToPropsInfo {
  materialsState?: MaterialsState;
}

export interface MaterialAndShapePanePropsInfo {
  minimized?: boolean;
  dispatch: (action: any) => void;
}

export type MaterialAndShapePaneProps = MaterialAndShapePaneStateToPropsInfo & MaterialAndShapePanePropsInfo;

export interface MaterialAndShapePaneState {
  showMatSelect: boolean;
}

class MaterialAndShapePane extends React.Component<MaterialAndShapePaneProps, MaterialAndShapePaneState> {

  private eventHandles: EventHandle[] = [];

  constructor(props: MaterialAndShapePaneProps) {
    super(props);
    this.state = { showMatSelect: false };
  }

  public render() {

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
            selectShape={(block: Block) => { this.selectBlock(block); } }/>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.on(building.BuildingEventTopics.handlesBlockSelect, this.blockSelectionListener));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
    game.trigger(DEACTIVATE_MATERIAL_SELECTOR, {});
  }

  private blockSelectionListener = (info: { material: Material, block: Block }) => {
    this.onBlockSelect(info.material, info.block);
  }

  private onBlockSelect = (material: Material, block: Block) => {
    if (block != null) {
      const item = {
        name: window.shapeIDFromBlock(block) + '. ' + block.shapeTags.join(', '),
        description: window.materialIDFromBlock(block) + '. ' + material.tags.join(', '),
        matElement: (<img src={'data:image/png;base64,' + material.icon}/>),
        element: (<img src={'data:image/png;base64,' + block.icon}/>),
        id: material.id + '-' + BuildingItemType.Block,
        type: BuildingItemType.Block,
        select: () => this.selectMaterial(material),
      } as BuildingItem;
      fireBuildingItemSelected(item);
    } else {
      fireBuildingItemSelected(null);
    }
  }


  private showMatSelector = (show: boolean) => {
    if (show) {
      const selected: Material = this.props.materialsState.selectedMaterial;
      game.trigger(ACTIVATE_MATERIAL_SELECTOR, { selection: selected, onSelect: this.selectMaterial });
    } else {
      game.trigger(DEACTIVATE_MATERIAL_SELECTOR, {});
    }
    this.setState((state, props) => ({ showMatSelect: show } as MaterialAndShapePaneState));
  }

  private selectBlock(block: Block) {
    blockRequester.changeBlockSelection(block);
  }

  private selectMaterial = (mat: Material) => {
    const currentBlock = this.props.materialsState.selectedBlock;
    window.shapeIDFromBlock(currentBlock);
    const requestedBlock: Block = building.getBlockForMaterialAndShapeId(mat, window.shapeIDFromBlock(currentBlock));
    blockRequester.changeBlockSelection(requestedBlock);
    this.setState((state, props) => ({ showMatSelect: false } as any));
    game.trigger(DEACTIVATE_MATERIAL_SELECTOR, {});
  }
}

export default connect(select)(MaterialAndShapePane);
