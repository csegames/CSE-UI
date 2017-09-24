/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {BuildingItem} from '../../lib/BuildingItem';
import SavedDraggable, {Anchor} from '../SavedDraggable';

export interface SelectionViewProps {
  item: BuildingItem;
}

export interface SelectionViewState {
}

class SelectionView extends React.Component<SelectionViewProps, SelectionViewState> {

  constructor(props: SelectionViewProps) {
    super(props);
  }

  public render() {
    if (this.props.item == null) return null;
    return (
     <SavedDraggable saveName='building/selectionview'
        defaultX={[-100, Anchor.TO_CENTER]}
        defaultY={[150, Anchor.TO_END]}
 >
      <div className='building__selection-view dragHandle'>
        <div className='preview'>
          <span className='icon'>{this.props.item.element}</span>
        </div>
        <p>{this.props.item.name}</p>
        <hr />
        <p>{this.props.item.description}</p>
      </div>
      </SavedDraggable>
    );
  }
}

export default SelectionView;
