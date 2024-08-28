/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  TooltipParams,
  TooltipPosition,
  hideTooltip,
  showTooltip,
  updateTooltip
} from '../../mainScreen/redux/tooltipSlice';
import { RootState } from '../../mainScreen/redux/store';

// Styles
const Root = 'TooltipSource-Root';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  tooltipParams: TooltipParams;
}

interface InjectedProps {
  currentTooltipID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class TooltipSource extends React.Component<Props> {
  private rootRef: HTMLDivElement = null;
  public render(): React.ReactNode {
    const { children, className, ...otherProps } = this.props;
    return (
      <div
        className={`${Root} ${className}`}
        ref={(r) => {
          this.rootRef = r;
        }}
        {...otherProps}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        {children}
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    if (this.props.currentTooltipID === this.props.tooltipParams.id) {
      // If the params changed while the tooltip is visible, we should update the tooltip!
      this.props.dispatch(updateTooltip(this.props.tooltipParams));
    }
  }

  private onMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    this.props.onMouseEnter?.(e);
    const [mouseX, mouseY] = this.applyTooltipPositioning(e.clientX, e.clientY);
    const newParams: TooltipParams = { ...this.props.tooltipParams, mouseX, mouseY };
    this.props.dispatch(showTooltip(newParams));
  }

  private onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    this.props.onMouseMove?.(e);
    const [mouseX, mouseY] = this.applyTooltipPositioning(e.clientX, e.clientY);
    const newParams: Partial<TooltipParams> = { ...this.props.tooltipParams, mouseX, mouseY };
    this.props.dispatch(updateTooltip(newParams));
  }

  private onMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
    this.props.onMouseLeave?.(e);
    this.props.dispatch(hideTooltip());
  }

  componentWillUnmount(): void {
    if (this.props.currentTooltipID === this.props.tooltipParams.id) {
      this.props.dispatch(hideTooltip());
    }
  }

  private applyTooltipPositioning(x: number, y: number): [number, number] {
    const position = this.props.tooltipParams.position ?? TooltipPosition.AtMouse;
    switch (position) {
      case TooltipPosition.OutsideSource: {
        // Adjusts the mouse "position" to be just outside of this TooltipSource on the right side.
        // Note that this logic doesn't work out if the tooltip has to flip position in order to stay on screen.
        const bounds = this.rootRef.getBoundingClientRect();
        return [bounds.right, y];
      }
      case TooltipPosition.AtMouse:
      default: {
        // No changes.
        return [x, y];
      }
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const currentTooltipID = state.tooltip.id;
  return {
    ...ownProps,
    currentTooltipID
  };
}

export default connect(mapStateToProps)(TooltipSource);
