/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { TooltipParams, hideTooltip, showTooltip, updateTooltip } from '../../mainScreen/redux/tooltipSlice';
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
  public render(): React.ReactNode {
    const { children, className, ...otherProps } = this.props;
    return (
      <div
        className={`${Root} ${className}`}
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
    const newParams: TooltipParams = { ...this.props.tooltipParams, mouseX: e.clientX, mouseY: e.clientY };
    this.props.dispatch(showTooltip(newParams));
  }

  private onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    this.props.onMouseMove?.(e);
    const newParams: Partial<TooltipParams> = { ...this.props.tooltipParams, mouseX: e.clientX, mouseY: e.clientY };
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
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const currentTooltipID = state.tooltip.id;
  return {
    ...ownProps,
    currentTooltipID
  };
}

export default connect(mapStateToProps)(TooltipSource);
