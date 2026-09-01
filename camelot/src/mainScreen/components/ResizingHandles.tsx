/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { addMouseUpNeededReason, removeMouseUpNeededReason } from '../redux/hudSlice';

enum SizingAnchor {
  Invalid = 0,
  Top,
  Left,
  Bottom,
  Right,
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight
}

// Styles
const Root = 'ResizingHandles-Root';
const BottomHandle = 'ResizingHandles-BottomHandle';
const TopHandle = 'ResizingHandles-TopHandle';
const LeftHandle = 'ResizingHandles-LeftHandle';
const RightHandle = 'ResizingHandles-RightHandle';
const BottomRightHandle = 'ResizingHandles-BottomRightHandle';
const BottomLeftHandle = 'ResizingHandles-BottomLeftHandle';
const TopRightHandle = 'ResizingHandles-TopRightHandle';
const TopLeftHandle = 'ResizingHandles-TopLeftHandle';

const MOUSE_UP_NEEDED_REASON_RESIZING = 'Resizing';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  // If this is applied to a widget with a standard FactionBorder, the BorderType plus faction will determine
  // where those buttons live, and the button count matters for width... what a mess.

  // Can we add resizable handles directly to FactionBorder?  Is that possible?

  // How much of the top-right corner's edges shouldn't be drag-sizeable because
  // the close and maximize buttons live there?
  cornerButtonWidthVmin: number;
  cornerButtonHeightVmin: number;
  /** Fires every time the mouse moves while dragging a handle. */
  onSizeChanged: (deltaTop: number, deltaRight: number, deltaBottom: number, deltaLeft: number) => void;
  /** Fires when the mouse button is released to end a resize action. */
  onSizeFinalized: (deltaTop: number, deltaRight: number, deltaBottom: number, deltaLeft: number) => void;
}

interface InjectedProps {
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class AResizingHandles extends React.Component<Props> {
  private startX: number = 0;
  private startY: number = 0;
  private activeAnchor: SizingAnchor = SizingAnchor.Invalid;
  private mouseMoveHandler: (e: MouseEvent) => void;
  private mouseUpHandler: (e: MouseEvent) => void;

  constructor(props: Props) {
    super(props);
    // Stashing the function pointers used to register for window events, so we can unregister them later.
    this.mouseMoveHandler = this.onMouseMove.bind(this);
    this.mouseUpHandler = this.onMouseUp.bind(this);
  }

  public render(): React.ReactNode {
    const { children, className, ...otherProps } = this.props;

    const hasCornerButtons = this.props.cornerButtonWidthVmin > 0;

    return (
      <div {...otherProps} className={`${Root} ${className}`}>
        <div className={BottomHandle} onMouseDown={this.handleMouseDown.bind(this, SizingAnchor.Bottom)} />
        <div
          className={TopHandle}
          style={{ right: `${this.props.cornerButtonWidthVmin}vmin` }}
          onMouseDown={this.handleMouseDown.bind(this, SizingAnchor.Top)}
        />
        <div className={LeftHandle} onMouseDown={this.handleMouseDown.bind(this, SizingAnchor.Left)} />
        <div
          className={RightHandle}
          style={{ top: `${this.props.cornerButtonHeightVmin}vmin` }}
          onMouseDown={this.handleMouseDown.bind(this, SizingAnchor.Right)}
        />
        <div className={BottomLeftHandle} onMouseDown={this.handleMouseDown.bind(this, SizingAnchor.BottomLeft)} />
        <div className={BottomRightHandle} onMouseDown={this.handleMouseDown.bind(this, SizingAnchor.BottomRight)} />
        <div className={TopLeftHandle} onMouseDown={this.handleMouseDown.bind(this, SizingAnchor.TopLeft)} />
        {!hasCornerButtons && (
          <div className={TopRightHandle} onMouseDown={this.handleMouseDown.bind(this, SizingAnchor.TopRight)} />
        )}
      </div>
    );
  }

  private handleMouseDown(anchor: SizingAnchor, e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button === 0) {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.activeAnchor = anchor;

      // Register for window-level events, since the cursor will almost definitely jump out of the handle
      // during drag-to-resize.
      window.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('mouseup', this.mouseUpHandler);

      // Because mouseUp doesn't trigger over transparent UI pixels, we use this to turn on a
      // background capable of ensuring that we will receive the event.
      this.props.dispatch?.(addMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_RESIZING));
    }
  }

  private onMouseUp(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button === 0) {
      // Unregister from the window-level events.
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      window.removeEventListener('mouseup', this.mouseUpHandler);
      // And tell Redux we no longer need the special background that ensures we will receive mouseUp events.
      this.props.dispatch(removeMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_RESIZING));

      this.props.onSizeFinalized(...this.calculateDeltas(e.clientX, e.clientY));
    }
  }

  private onMouseMove(e: React.MouseEvent<HTMLDivElement>): void {
    this.props.onSizeChanged(...this.calculateDeltas(e.clientX, e.clientY));
  }

  private calculateDeltas(mouseX: number, mouseY: number): [number, number, number, number] {
    const deltaX = mouseX - this.startX;
    const deltaY = mouseY - this.startY;

    // Based on the active filter, decide which deltas are relevant.
    switch (this.activeAnchor) {
      case SizingAnchor.Bottom:
        return [0, 0, deltaY, 0];
      case SizingAnchor.Top:
        return [deltaY, 0, 0, 0];
      case SizingAnchor.Left:
        return [0, 0, 0, deltaX];
      case SizingAnchor.Right:
        return [0, deltaX, 0, 0];
      case SizingAnchor.BottomLeft:
        return [0, 0, deltaY, deltaX];
      case SizingAnchor.BottomRight:
        return [0, deltaX, deltaY, 0];
      case SizingAnchor.TopLeft:
        return [deltaY, 0, 0, deltaX];
      case SizingAnchor.TopRight:
        return [deltaY, deltaX, 0, 0];
      default:
        return [0, 0, 0, 0];
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export const ResizingHandles = connect(mapStateToProps)(AResizingHandles);
