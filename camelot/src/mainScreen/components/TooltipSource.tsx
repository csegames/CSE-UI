/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../redux/store';
import { hideTooltip, showTooltip, TooltipParams, TooltipPositionType } from '../redux/tooltipSlice';
import { simpleRectFromDOMRect } from '../redux/dragAndDropSlice';

// Styles
const Root = 'TooltipSource-Root';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  tooltipID: string;
  content: () => React.ReactNode;
  positionType: TooltipPositionType;
  active?: boolean;
  xOffset?: number;
  yOffset?: number;
  maxWidth?: string;
  noOuterBorder?: boolean;
}

interface InjectedProps {
  currentTooltipID: string;
}

interface State {
  isEntered: boolean;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class TooltipSource extends React.Component<Props, State> {
  private rootRef: HTMLDivElement | null = null;

  constructor(props: Props) {
    super(props);

    this.state = { isEntered: false };
  }

  public render(): React.ReactNode {
    const { children, className, onMouseEnter, onMouseLeave, ...otherProps } = this.props;
    return (
      <div
        className={`${Root} ${className}`}
        ref={(r) => {
          this.rootRef = r;
        }}
        {...otherProps}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        {children}
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const idChanged = this.props.tooltipID !== prevProps.tooltipID;
    const shouldDisplay = (this.props.active ?? true) && this.state.isEntered;
    const wasDisplayed = (prevProps.active ?? true) && prevState.isEntered;

    if (shouldDisplay === wasDisplayed && !idChanged) return;

    if (shouldDisplay) {
      this.props.dispatch(showTooltip(this.createParams()));
    } else {
      this.props.dispatch(hideTooltip(idChanged ? prevProps.tooltipID : this.props.tooltipID));
    }
  }

  componentWillUnmount(): void {
    if (this.props.currentTooltipID === this.props.tooltipID) {
      this.props.dispatch(hideTooltip(this.props.tooltipID));
    }
  }

  private onMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    this.props.onMouseEnter?.(e);
    this.setState({ isEntered: true });
  }

  private onMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
    this.props.onMouseLeave?.(e);
    this.setState({ isEntered: false });
  }

  private createParams(): TooltipParams {
    return {
      id: this.props.tooltipID,
      content: this.props.content(),
      maxWidth: this.props.maxWidth,
      noOuterBorder: this.props.noOuterBorder,
      position:
        this.props.positionType == 'mouse'
          ? {
              type: 'mouse',
              xOffset: this.props.xOffset ?? 0,
              yOffset: this.props.yOffset ?? 0
            }
          : {
              type: 'source',
              sourceRect: simpleRectFromDOMRect(this.rootRef?.getBoundingClientRect()),
              xOffset: this.props.xOffset ?? 0,
              yOffset: this.props.yOffset ?? 0
            }
    };
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): ReactProps & InjectedProps {
  const currentTooltipID = state.tooltip.id;
  return {
    ...ownProps,
    currentTooltipID
  };
}

export default connect(mapStateToProps)(TooltipSource);
