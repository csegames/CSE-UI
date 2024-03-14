/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { ContextMenuParams, hideContextMenu, showContextMenu } from '../redux/contextMenuSlice';
import { RootState } from '../redux/store';
import { hideTooltip } from '../redux/tooltipSlice';

// Styles
const Root = 'ContextMenuSource-Root';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  menuParams?: ContextMenuParams;
}

interface InjectedProps {
  currentMenuID: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ContextMenuSource extends React.Component<Props> {
  public render(): React.ReactNode {
    const { children, className, ...otherProps } = this.props;
    return (
      <div className={`${Root} ${className}`} {...otherProps} onMouseDown={this.onMouseDown.bind(this)}>
        {children}
      </div>
    );
  }

  private onMouseDown(e: React.MouseEvent) {
    // If we don't want to show a context menu right now (maybe content is conditional), just do nothing.
    if (!this.props.menuParams || !this.props.menuParams.content) {
      return;
    }

    if (e.button === 2) {
      // Right click?
      const newParams: ContextMenuParams = { ...this.props.menuParams, mouseX: e.clientX, mouseY: e.clientY };
      this.props.dispatch(showContextMenu(newParams));
      // For items with both a tooltip and a context menu, the context menu  takes precedence.
      this.props.dispatch(hideTooltip());
      // We are the final handler if we summon a context menu.
      e.stopPropagation();
    }
  }

  componentWillUnmount(): void {
    if (this.props.currentMenuID === this.props.menuParams?.id) {
      this.props.dispatch(hideContextMenu());
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const currentMenuID = state.contextMenu.id;
  return {
    ...ownProps,
    currentMenuID
  };
}

export default connect(mapStateToProps)(ContextMenuSource);
