/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {BuildingBlock} from 'camelot-unchained';

export interface ShapesViewProps {
  minimized: boolean;
  selectShape?: (shape: BuildingBlock) => void;
  shapes: BuildingBlock[];
  selected: BuildingBlock;
}

export interface ShapesViewState {
}

class ShapesView extends React.Component<ShapesViewProps, ShapesViewState> {

  constructor(props: ShapesViewProps) {
    super(props);
  }

  generateShapeIcon = (block: BuildingBlock) => {
    const selectedId = this.props.selected ? this.props.selected.id : -1;
    const selected: boolean = selectedId == block.id;
    return (
      <img key={block.id}
        className={selected ? 'active' : ''}
        src={`data:image/png;base64, ${block.icon}`}
        onClick={() => this.props.selectShape(block) }
        />
    )
  }

  render() {
    return (
      <div className={`shapes-view ${this.props.minimized ? 'minimized' : ''}`}>
        {this.props.shapes.map(this.generateShapeIcon) }
      </div>
    )
  }
}

export default ShapesView;
