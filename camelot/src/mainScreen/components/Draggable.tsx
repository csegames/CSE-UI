/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { SimpleRect, reportDraggableRenderData, simpleRectFromDOMRect } from '../redux/dragAndDropSlice';
import { RootState } from '../redux/store';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Must match with the draggableID on a DraggableHandle. */
  draggableID: string;
  /** Used to render the matched Draggable when it is being dragged. If not defined,
   * Draggable's `children` will be rendered directly.
   */
  draggingRender?: (children: React.ReactNode) => React.ReactNode;
}

interface InjectedProps {
  currentDraggableID: string;
  currentDraggableBounds: SimpleRect;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class Draggable extends React.Component<Props> {
  private ref: HTMLDivElement;
  public render(): React.ReactNode {
    const { children, style, ...otherProps } = this.props;

    const finalStyle = {};
    if (style) {
      Object.assign(finalStyle, style);
    }
    // Hide the original only once the drag copy is ready (currentDraggableBounds is set by
    // reportDraggableRenderData in the same dispatch as currentDraggingRender). This ensures the
    // original and its copy swap in the same render cycle with no invisible-widget frame gap.
    const copyReady =
      this.props.draggableID === this.props.currentDraggableID && this.props.currentDraggableBounds !== null;
    const draggingStyle = copyReady ? { opacity: 0 } : {};
    Object.assign(finalStyle, draggingStyle);

    return (
      <div
        {...otherProps}
        id={`Draggable_${this.props.draggableID}`}
        ref={(r) => {
          this.ref = r;
        }}
        style={finalStyle}
      >
        {children}
      </div>
    );
  }

  private draggingRender(): React.ReactNode {
    if (this.props.draggingRender) {
      return this.props.draggingRender(this.props.children);
    } else {
      return this.props.children;
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (
      this.ref &&
      this.props.currentDraggableID !== prevProps.currentDraggableID && // New drag started?
      this.props.draggableID === this.props.currentDraggableID // New drag was THIS draggable?
    ) {
      // This Draggable is currently being dragged, so report its bounds. We need its
      // size and position so that the dragRender output will match.
      const bounds = simpleRectFromDOMRect(this.ref.getBoundingClientRect());
      this.props.dispatch(reportDraggableRenderData({ bounds, render: this.draggingRender.bind(this) }));
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentDraggableID, currentDraggableBounds } = state.dragAndDrop;

  return {
    ...ownProps,
    currentDraggableID,
    currentDraggableBounds
  };
}

export default connect(mapStateToProps)(Draggable);
