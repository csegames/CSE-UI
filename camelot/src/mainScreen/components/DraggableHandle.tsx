/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  DropTargetParams,
  endDrag,
  SimpleRect,
  startDrag,
  updateDragDelta,
  updateForcedDraggableID
} from '../redux/dragAndDropSlice';
import { RootState, store } from '../redux/store';
import { addMouseUpNeededReason, removeMouseUpNeededReason } from '../redux/hudSlice';

// Styles
const Root = 'DraggableHandle-Root';

export const MOUSE_UP_NEEDED_REASON_DRAGGING = 'Dragging';

export interface DropHandlerDraggableData {
  currentDraggableID: string;
  currentDraggableBounds: SimpleRect;
  dragDelta: [number, number];
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Must match with the draggableID on a Draggable. */
  draggableID: string;
  /** Can only trigger drop events on DropTargets with a matching dropType. */
  dropType?: string;
  /** Fired when a drag ends, whether or not it is over a matching DropTarget. */
  dropHandler?: (data: any, draggableData: DropHandlerDraggableData) => void;
  /** Fired when a drag begins (technically on mouseDown). */
  dragStartHandler?: () => void;
  /** Optional hook to transform (e.g. snap/align) the raw drag delta before it is applied. */
  snapDelta?: (rawDelta: [number, number]) => [number, number];
  isDisabled?: boolean;
}

interface InjectedProps {
  currentDraggableBounds: SimpleRect;
  dragDelta: [number, number];
  dropTargets: Dictionary<Dictionary<DropTargetParams>>;
  forcedDraggableID: string | null;
  currentDraggableID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class DraggableHandle extends React.Component<Props & DispatchProp> {
  private element: HTMLDivElement | null = null;
  private isDragStarted: boolean = false;
  // Storing these here since consumers only care about the delta.
  private dragStartX: number = 0;
  private dragStartY: number = 0;

  private mouseMoveHandler: (e: MouseEvent) => void;
  private mouseUpHandler: (e: MouseEvent) => void;

  constructor(props: Props & DispatchProp) {
    super(props);
    // Stashing the function pointers used to register for window events, so we can unregister them later.
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);
  }

  public render(): React.ReactNode {
    const { children, className, onMouseDown, snapDelta, ...otherProps } = this.props;
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
    // When a forcedDraggableID is set, this code will ensure that drag bookkeeping is initialized for it.
    if (this.props.forcedDraggableID === this.props.draggableID) {
      // We unset the forcing because we are about to do a proper init.
      this.props.dispatch(updateForcedDraggableID(null));
      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        // We have to delay the drag start a little, or else it can result in the drag ending on the same frame that it starts due
        // to in-progress mouse handling from other sources.  This can occur when mouse handlers are added and removed in response
        // to mouse events (e.g. a button click).  By waiting a frame, the triggering mouse event will have been cleaned up before
        // altering which NEW mouse events to respond to.
        window.setTimeout(() => {
          // Since the user's mouse could be anywhere, we pretend they started by clicking in the center of this DraggableHandle.
          this.startDrag(rect.x + rect.width / 2, rect.y + rect.height / 2);
        }, 1);
      }
    }
  }

  private handleMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    if (this.props.isDisabled) {
      return;
    }

    if (e.button === 0 && !this.props.currentDraggableID) {
      this.startDrag(e.clientX, e.clientY);
      // Because mouseUp doesn't trigger over transparent UI pixels, we use this to turn on a
      // background capable of ensuring that we will receive the event.
      this.props.dispatch?.(addMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_DRAGGING));
    }

    // Run any passed-in handlers as well.
    this.props.onMouseDown?.(e);
  }

  private startDrag(clientX: number, clientY: number): void {
    if (!this.isDragStarted) {
      this.isDragStarted = true;
      this.props.dragStartHandler?.();

      // Stash the start coordinates so we can calculate deltas.
      this.dragStartX = clientX;
      this.dragStartY = clientY;

      // Register for window-level events, since we aren't moving the original Draggable.
      // Need to be able to catch the mouseUp and mouseMove when the cursor is over other widgets.
      window.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('mouseup', this.mouseUpHandler);
      // Tell Redux what we'll be dragging around.
      this.props.dispatch(startDrag(this.props.draggableID));
    }
  }

  private handleMouseUp(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button === 0) {
      this.isDragStarted = false;

      // Unregister from the window-level events.
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      window.removeEventListener('mouseup', this.mouseUpHandler);

      // I haven't figured out why, but even though the "this" pointer is valid, this.props isn't reliable.
      // Safer to go directly to the Redux store.
      const { currentDraggableID, currentDraggableBounds, dragDelta } = store.getState().dragAndDrop;

      // Report the drop before ending the drag so that the data is all still available.
      this.reportDrop({ currentDraggableID, currentDraggableBounds, dragDelta });

      // Tell Redux we're done dragging.
      this.props.dispatch(endDrag());
      // And that we no longer need the special background that ensures we will receive mouseUp events.
      this.props.dispatch(removeMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_DRAGGING));
    }
  }

  private handleMouseMove(e: React.MouseEvent<HTMLDivElement>): void {
    const rawDelta: [number, number] = [e.clientX - this.dragStartX, e.clientY - this.dragStartY];
    const delta = this.props.snapDelta ? this.props.snapDelta(rawDelta) : rawDelta;
    this.props.dispatch(updateDragDelta(delta));
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

  return {
    ...ownProps,
    currentDraggableBounds,
    dragDelta,
    dropTargets,
    forcedDraggableID,
    currentDraggableID
  };
}

export default connect(mapStateToProps)(DraggableHandle);
