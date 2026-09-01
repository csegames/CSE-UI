/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { addDropTarget, removeDropTarget } from '../redux/dragAndDropSlice';
import { AddDispatch, RootState } from '../redux/store';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

const Root = 'HUD-DropTarget-Root';
const HoverColor = 'HUD-DropTarget-HoverColor';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Only Draggables with a matching dropType will trigger drop events. */
  dropType: string;
  /** The drop handler will receive this data. */
  dropData?: any;
  getHoverColor?: (draggableID: string) => string | null;
  /** Show the hover color for the entire duration of a drag, not just while the cursor is over this target. */
  showColorWhileDragging?: boolean;
}

interface InjectedProps {
  // hudWidth and hudHeight are not directly used, but injecting them ensures that this widget
  // reports its bounds on a screen resize.
  hudWidth: number;
  hudHeight: number;
  currentDraggableID: string | null;
}

type Props = ReactProps & InjectedProps & AddDispatch;

interface State {
  isHovered: boolean;
}

class DropTarget extends React.Component<Props, State> {
  isAdded: boolean = false;
  private dropTargetID: string;
  // Hover color only depends on which item is being dragged, not on how many times we re-render
  // during that drag (e.g. from unrelated prop changes), so cache it per draggableID.
  private hoverColorCache: { draggableID: string; color: string | null } | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { isHovered: false };
    this.dropTargetID = genID();
  }

  public render(): React.ReactNode {
    const { children, onMouseEnter, onMouseLeave, className, showColorWhileDragging, ...otherProps } = this.props;
    const shouldShowColor = this.props.currentDraggableID && (showColorWhileDragging || this.state.isHovered);
    let color: string | null = null;
    if (shouldShowColor) {
      if (this.hoverColorCache?.draggableID !== this.props.currentDraggableID) {
        this.hoverColorCache = {
          draggableID: this.props.currentDraggableID,
          color: this.props.getHoverColor?.(this.props.currentDraggableID) ?? null
        };
      }
      color = this.hoverColorCache.color;
    }
    return (
      <div
        {...otherProps}
        className={`${Root}${className ? ` ${className}` : ''}`}
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

  onMouseEnter(e: React.MouseEvent<HTMLDivElement>): void {
    this.props.onMouseEnter?.(e);
    this.setState({ isHovered: true });
  }

  onMouseLeave(e: React.MouseEvent<HTMLDivElement>): void {
    this.props.onMouseLeave?.(e);
    this.setState({ isHovered: false });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): ReactProps & InjectedProps {
  const { hudWidth, hudHeight } = state.hud;

  return {
    ...ownProps,
    hudWidth,
    hudHeight,
    currentDraggableID: state.dragAndDrop.currentDraggableID
  };
}

export default connect(mapStateToProps)(DropTarget);
