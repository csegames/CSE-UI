/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {Material} from '../../lib/Material';

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
    let selectedId: number = null;
    if (this.props.selected)
      selectedId = this.props.selected.id;

    return (
      <div className='material-and-shape__material-selector'>
        {this.props.materials.map((mat: Material) => this.generateMaterialIcon(mat, selectedId)) }
      </div>
    )
  }
}

export default MaterialSelector;
