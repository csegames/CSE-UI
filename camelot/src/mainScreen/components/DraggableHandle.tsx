/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  DropTargetParams,
  endDrag,
  startDrag,
  updateDragDelta,
  updateForcedDraggableID
} from '../redux/dragAndDropSlice';
import { RootState } from '../redux/store';

// Styles
const Root = 'DraggableHandle-Root';

export interface DropHandlerDraggableData {
  currentDraggableID: string;
  currentDraggableBounds: DOMRect;
  dragDelta: [number, number];
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Must match with the draggableID on a Draggable. */
  draggableID: string;
  /** Used to render the matched Draggable when it is being dragged. */
  draggingRender: () => JSX.Element;
  /** Can only trigger drop events on DropTargets with a matching dropType. */
  dropType?: string;
  /** Fired when a drag ends, whether or not it is over a matching DropTarget. */
  dropHandler?: (data: any, draggableData: DropHandlerDraggableData) => void;
  /** Fired when a drag begins (technically on mouseDown). */
  dragStartHandler?: () => void;
}

interface InjectedProps {
  currentDraggableBounds: DOMRect;
  dragDelta: [number, number];
  dropTargets: Dictionary<Dictionary<DropTargetParams>>;
  forcedDraggableID: string | null;
  mouseX: number;
  mouseY: number;
  currentDraggableID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class DraggableHandle extends React.Component<Props> {
  private element: HTMLDivElement | null = null;
  private isDragStarted: boolean = false;
  // Storing these here since consumers only care about the delta.
  private dragStartX: number;
  private dragStartY: number;

  private mouseMoveHandler: (e: MouseEvent) => void;
  private mouseUpHandler: (e: MouseEvent) => void;

  constructor(props: Props) {
    super(props);
    // Stashing the function pointers used to register for window events, so we can unregister them later.
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);
  }

  public render(): React.ReactNode {
    const { children, className, ...otherProps } = this.props;
    return (
      <div
        ref={(element) => {
          this.element = element;
        }}
        {...otherProps}
        className={`${Root} ${className}`}
        id={`DraggableHandle_${this.props.draggableID}`}
        onMouseDown={this.handleMouseDown.bind(this)}
      >
        {children}
      </div>
    );
  }

  public componentDidUpdate(): void {
    if (this.props.forcedDraggableID === this.props.draggableID) {
      this.props.dispatch(updateForcedDraggableID(null));
      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        this.startDrag(rect.x + rect.width / 2, rect.y + rect.height / 2);
      }
    }
  }

  private handleMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button === 0 && !this.props.currentDraggableID) {
      this.startDrag(e.clientX, e.clientY);
    }
  }

  private startDrag(clientX: number, clientY: number): void {
    if (!this.isDragStarted) {
      this.isDragStarted = true;
      this.props.dragStartHandler?.();
    }

    // Stash the start coordinates so we can calculate deltas.
    this.dragStartX = clientX;
    this.dragStartY = clientY;

    // Register for window-level events, since we aren't moving the original Draggable.
    // Need to be able to catch the mouseUp and mouseMove when the cursor is over other widgets.
    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('mouseup', this.mouseUpHandler);
    // Tell Redux what we'll be dragging around.
    this.props.dispatch(startDrag({ draggableID: this.props.draggableID, draggingRender: this.props.draggingRender }));

    const dragDeltaX = this.props.mouseX - this.dragStartX;
    const dragDeltaY = this.props.mouseY - this.dragStartY;
    this.props.dispatch(updateDragDelta([dragDeltaX, dragDeltaY]));
  }

  private handleMouseUp(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button === 0) {
      this.isDragStarted = false;

      // Unregister from the window-level events.
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      window.removeEventListener('mouseup', this.mouseUpHandler);

      const currentDraggableID = this.props.currentDraggableID;
      const currentDraggableBounds = this.props.currentDraggableBounds;
      const dragDelta = this.props.dragDelta;

      // Tell Redux we're done dragging.
      this.props.dispatch(endDrag());

      this.reportDrop({ currentDraggableID, currentDraggableBounds, dragDelta });
    }
  }

  private handleMouseMove(e: React.MouseEvent<HTMLDivElement>): void {
    const dragDeltaX = e.clientX - this.dragStartX;
    const dragDeltaY = e.clientY - this.dragStartY;
    this.props.dispatch(updateDragDelta([dragDeltaX, dragDeltaY]));
  }

  private reportDrop(draggableData: DropHandlerDraggableData): void {
    const { currentDraggableBounds, dragDelta } = draggableData;

    // If no one is listening to drop events, no need to report.
    if (!this.props.dropHandler) {
      return;
    }

    if (currentDraggableBounds === null || currentDraggableBounds.x === null || currentDraggableBounds.y === null) {
      this.props.dropHandler(null, draggableData);
      return;
    }

    // We consider a Draggable to be over a DropTarget if the Draggable's center is within the DropTarget's bounds.
    const dcx = currentDraggableBounds.x + dragDelta[0] + currentDraggableBounds.width / 2;
    const dcy = currentDraggableBounds.y + dragDelta[1] + currentDraggableBounds.height / 2;

    // Iterate all matching DropTargets and see if we are over one.
    let targetFound: boolean = false;
    Object.entries(this.props.dropTargets[this.props.dropType] ?? {}).forEach((entry) => {
      // Only report to the first valid DropTarget.
      if (targetFound) {
        return;
      }

      const dropTarget = entry[1];

      const bounds = dropTarget.element.getBoundingClientRect();

      if (dcx >= bounds.x && dcx <= bounds.right && dcy >= bounds.y && dcy <= bounds.bottom) {
        targetFound = true;
        this.props.dropHandler(dropTarget.data, draggableData);
      }
    });

    // Not all drops require a target.  Sometimes we just care where the item got dragged to.
    if (!targetFound) {
      this.props.dropHandler(null, draggableData);
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentDraggableBounds, dragDelta, dropTargets, forcedDraggableID, currentDraggableID } = state.dragAndDrop;
  const { mouseX, mouseY } = state.hud;

  return {
    ...ownProps,
    currentDraggableBounds,
    dragDelta,
    dropTargets,
    forcedDraggableID,
    mouseX,
    mouseY,
    currentDraggableID
  };
}

export default connect(mapStateToProps)(DraggableHandle);
