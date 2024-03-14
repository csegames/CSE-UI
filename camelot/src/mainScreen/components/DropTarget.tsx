/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { addDropTarget, removeDropTarget } from '../redux/dragAndDropSlice';
import { RootState } from '../redux/store';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

const HoverColor = 'HUD-DropTarget-HoverColor';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Only Draggables with a matching dropType will trigger drop events. */
  dropType: string;
  /** The drop handler will receive this data. */
  dropData?: any;
  getHoverColor?: (draggableID: string) => string | null;
}

interface InjectedProps {
  dispatch?: Dispatch;
  // hudWidth and hudHeight are not directly used, but injecting them ensures that this widget
  // reports its bounds on a screen resize.
  hudWidth: number;
  hudHeight: number;
  currentDraggableID: string | null;
}

type Props = ReactProps & InjectedProps;

interface State {
  isHovered: boolean;
}

class DropTarget extends React.Component<Props, State> {
  isAdded: boolean = false;
  private dropTargetID: string;

  constructor(props: Props) {
    super(props);
    this.state = { isHovered: false };
    this.dropTargetID = genID();
  }

  public render(): React.ReactNode {
    const { children, ...otherProps } = this.props;
    const color: string | null =
      this.state.isHovered && this.props.currentDraggableID
        ? this.props.getHoverColor?.(this.props.currentDraggableID) ?? null
        : null;
    return (
      <div
        {...otherProps}
        ref={(r) => {
          if (r && !this.isAdded) {
            this.props.dispatch(
              addDropTarget({
                dropTargetID: this.dropTargetID,
                dropType: this.props.dropType,
                data: this.props.dropData,
                element: r
              })
            );
            this.isAdded = true;
          }
        }}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        {children}
        {color && <div style={{ backgroundColor: color }} className={HoverColor} />}
      </div>
    );
  }

  componentWillUnmount(): void {
    this.props.dispatch(removeDropTarget({ dropTargetID: this.dropTargetID, dropType: this.props.dropType }));
  }

  onMouseEnter(): void {
    this.setState({ isHovered: true });
  }

  onMouseLeave(): void {
    this.setState({ isHovered: false });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { hudWidth, hudHeight } = state.hud;

  return {
    ...ownProps,
    hudWidth,
    hudHeight,
    currentDraggableID: state.dragAndDrop.currentDraggableID
  };
}

export default connect(mapStateToProps)(DropTarget);
