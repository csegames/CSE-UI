/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { BuildingMaterial } from '@csegames/camelot-unchained';
import { GlobalState } from '../services/session/reducer';
import { setSelectedMaterial, setHoverMaterial } from '../services/session/materials-by-type';

import MaterialsByType from '../lib/MaterialsByType';

function select(state: GlobalState) {
  return {
    materialsByType: state.materialSelector.materialsByType,
    selectMaterial: state.materialSelector.onMaterialSelected,
    selected: state.materialSelector.selectedMaterial,
  };
}

export interface MaterialSelectorProps {
  dispatch: (action: any) => void;
  materialsByType: MaterialsByType;
  selectMaterial: (mat: BuildingMaterial) => void;
  selected: BuildingMaterial;
}

export interface MaterialSelectorState {
}

class MaterialSelector extends React.Component<MaterialSelectorProps, MaterialSelectorState> {

  constructor(props: MaterialSelectorProps) {
    super(props);
  }

  public render() {
    const selectedId: number = this.props.selected ? this.props.selected.id : null;

    return (
      <div className='materials'>
        <header>Stone Blocks</header>
        {this.props.materialsByType.stoneBlocks.map((mat: BuildingMaterial) => this.generateMaterialIcon(mat, selectedId)) }

        <header>Stone Tiles & Sheets</header>
        {this.props.materialsByType.stoneTilesAndSheets.map((mat: BuildingMaterial) =>
          this.generateMaterialIcon(mat, selectedId))}

        <header>Wood & Organic</header>
        {this.props.materialsByType.woodAndOrganic.map((mat: BuildingMaterial) =>
          this.generateMaterialIcon(mat, selectedId))}
      </div>
    );
  }

  private selectMaterial = (mat: BuildingMaterial) => {
    this.props.selectMaterial(mat);
    this.props.dispatch(setSelectedMaterial(mat));
  }

  private generateMaterialIcon = (mat: BuildingMaterial, selectedId: number) => {
    return (
      <img key={mat.id}
        className={mat.id === selectedId ? 'active' : ''}
        src={`data:image/png;base64, ${mat.icon}`}
        onClick={() => this.selectMaterial(mat) }
        onMouseOver={() => this.onHover(mat) }
        onMouseOut={() => this.onHover(null) }
        />
    );
  }

  private onHover = (material: BuildingMaterial) => {
    this.props.dispatch(setHoverMaterial(material));
  }
}

export default connect(select)(MaterialSelector);
