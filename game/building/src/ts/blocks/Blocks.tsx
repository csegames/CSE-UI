/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { blocks, TypeBlock, ShapeBlock } from '../stores/BlockStore';
import { store, BuildingState, SelectionState, FilterState } from '../stores/Building';
import Loading from '../common/Loading';
import BlockFilter from './BlockFilter';
import BlockSection from './BlockSection';
import ShapeIcon from './ShapeIcon';
import TypeIcon from './TypeIcon';

export interface BlocksProps {
  state: BuildingState;
};
export interface BlocksState {
};

class Blocks extends React.Component<BlocksProps, BlocksState> {
  public name: string = 'Blocks';

  constructor(props: BlocksProps) {
    super(props);
  }

  getShapeIcons = (): JSX.Element[] => {
    const icons: JSX.Element[] = [];
    const shapes: ShapeBlock[] = blocks.getShapes();
    const selected: string = this.props.state.selection.shape;
    let i: number = 0;
    shapes.forEach((shape: ShapeBlock): void => {
      icons.push(
        <ShapeIcon
          key={i++}
          id={shape.id}
          shape={shape.shape}
          icon={shape.icon}
          selected={shape.shape === selected}
        />
      );
    });
    return icons;
  }

  getTypeIcons = (): JSX.Element[] => {
    const icons: JSX.Element[] = [];
    const selection: SelectionState = this.props.state.selection;
    const shapeFilter: string = selection.shape;
    const typesFilter: string[] = this.props.state.filter.words;
    const selected: number = selection.block;
    const types: TypeBlock[] = blocks.getTypes(shapeFilter, typesFilter);
    let i: number = 0;
    types.forEach((type: TypeBlock): void => {
      icons.push(
        <TypeIcon
          key={i++}
          id={type.id}
          type={type.type}
          shape={type.shape}
          icon={type.icon}
          selected={type.id === selected}
        />
      );
    });
    return icons;
  }

  onClickIcon = (e: React.MouseEvent, icon: string): void => {
    switch(icon) {
      case 'filtered':
        store.dispatch({ type: 'CLEAR_FILTER' } as any);
        e.preventDefault();
        e.stopPropagation();
        break;
    }
  }

  render() {
    const state: BuildingState = this.props.state;
    const filter: FilterState = state.filter;
    let statusIcon: string;
    if (filter.words.length > 0) {
      statusIcon = 'filtered';
    } else {
      statusIcon = 'filter';
    }
    let content: JSX.Element[];
    if (!state.blocks.blocksLoaded) {
      content = [ <Loading key={0} message="Loading Blocks..."/> ];
    } else {
      if (state.ui.filterOpen) {
        content = [ <BlockFilter key={0} state={state} filter={blocks.getTypeKeywords()}/> ];
      } else {
        content = this.getTypeIcons();
      }
    }
    return (
      <div className="block-sections">
        <BlockSection className="shape" title="Select Shape">
          {this.getShapeIcons()}
        </BlockSection>
        <BlockSection icon={statusIcon} onClickIcon={this.onClickIcon} className="material" title="Select Material">
          {content}
        </BlockSection>
      </div>
    );
  }
}

export default Blocks;
