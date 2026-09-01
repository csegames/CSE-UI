/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import DraggableHandle from './DraggableHandle';
import { handleHUDWidgetDragEnded } from './BaseHUDWidget';
import { HUDWidget, showConditionalWidget } from '../redux/hudSlice';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  widgetID: string;
  isDisabled?: boolean;
}

interface InjectedProps {
  vminPx: number;
  widgets: Record<string, HUDWidget>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ABaseHUDWidgetDraggableHandle extends React.Component<Props> {
  public render(): React.ReactNode {
    const { children, onMouseDown, widgetID, ...otherProps } = this.props;
    return (
      <DraggableHandle
        {...otherProps}
        draggableID={widgetID}
        onMouseDown={this.handleMouseDown.bind(this)}
        dropHandler={handleHUDWidgetDragEnded.bind(
          this,
          this.props.widgetID,
          this.props.widgets,
          this.props.vminPx,
          this.props.dispatch
        )}
      >
        {children}
      </DraggableHandle>
    );
  }

  private handleMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    // If the associated widget is a Conditional widget and not at the top of the stack,
    // this will bring it to the top so it can be readily seen while dragging.
    this.props.dispatch?.(showConditionalWidget(this.props.widgetID));

    // Run any passed-in handlers as well.
    this.props.onMouseDown?.(e);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { vminPx, widgets } = state.hud;
  return {
    ...ownProps,
    vminPx,
    widgets
  };
}

export const BaseHUDWidgetDraggableHandle = connect(mapStateToProps)(ABaseHUDWidgetDraggableHandle);
