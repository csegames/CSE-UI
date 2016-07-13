/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {Material, MaterialType} from '../../lib/Material';

export interface MaterialSelectorProps {
  materials: Material[];
  selectMaterial: (mat: Material) => void;
  selected: Material;
}

export interface MaterialSelectorState {
}

class MaterialSelector extends React.Component<MaterialSelectorProps, MaterialSelectorState> {

  constructor(props: MaterialSelectorProps) {
    super(props);
  }

  generateMaterialIcon = (mat: Material, selectedId: number) => {
    return (
      <img key={mat.id}
        className={mat.id == selectedId ? 'active' : ''}
        src={`data:image/png;base64, ${mat.icon}`}
        onClick={() => this.props.selectMaterial(mat) }
        />
    )
  }

  render() {
    const selectedId: number = this.props.selected ? this.props.selected.id : null;
    const stoneBlocks: Material[] = [];
    const stoneTilesAndSheets: Material[] = [];
    const woodAndOrganic: Material[] = [];
    this.props.materials.forEach((material: Material)=>{
      if(material.type==MaterialType.STONE_BLOCK)
        stoneBlocks.push(material);
      else if(material.type==MaterialType.STONE_TILE ||
              material.type==MaterialType.STONE_SHEET)
        stoneTilesAndSheets.push(material);
      else
        woodAndOrganic.push(material);
    })

    return (
      <div className='material-and-shape__material-selector'>
        <header>Stone Blocks</header>
        {stoneBlocks.map((mat: Material) => this.generateMaterialIcon(mat, selectedId)) }

        <header>Stone Tiles & Sheets</header>
        {stoneTilesAndSheets.map((mat: Material) => this.generateMaterialIcon(mat, selectedId)) }

        <header>Wood & Organic</header>
        {woodAndOrganic.map((mat: Material) => this.generateMaterialIcon(mat, selectedId)) }
      </div>
    )
  }
}

export default MaterialSelector;
