/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';

// Styles.
const Root = 'HUD-DragAndDrop-Root';
const Dragging = 'dragging';

interface ReactProps {}

interface InjectedProps {
  currentDraggableID: string;
  currentDraggableBounds: DOMRect;
  currentDraggingRender: () => JSX.Element;
  dragDelta: [number, number];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class DragAndDropPane extends React.Component<Props> {
  public render(): React.ReactNode {
    const dragClass = this.props.currentDraggableID?.length > 0 ? Dragging : '';
    return <div className={`${Root} ${dragClass}`}>{this.renderDraggable()}</div>;
  }

  private renderDraggable(): JSX.Element {
    if (
      this.props.currentDraggableID?.length > 0 &&
      this.props.currentDraggingRender &&
      this.props.currentDraggableBounds
    ) {
      // We explicitly force the size to match the original Draggable in case that Draggable's layout was
      // dependent on its parent or siblings (since our draggingRender here won't match those).
      const { x, y, width, height } = this.props.currentDraggableBounds;
      const draggableStyle: React.CSSProperties = {
        position: 'absolute',
        top: `${y + this.props.dragDelta[1]}px`,
        left: `${x + this.props.dragDelta[0]}px`,
        width: `${width}px`,
        height: `${height}px`
      };
      return <div style={draggableStyle}>{this.props.currentDraggingRender()}</div>;
    } else {
      return null;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentDraggableID, currentDraggableBounds, currentDraggingRender, dragDelta } = state.dragAndDrop;

  return {
    ...ownProps,
    currentDraggableID,
    currentDraggableBounds,
    currentDraggingRender,
    dragDelta
  };
}

export default connect(mapStateToProps)(DragAndDropPane);
