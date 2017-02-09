/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-24 17:42:57
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-27 11:58:07
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import {
  Spinner,
  RaisedButton,
  Tooltip,
} from 'camelot-unchained';

export interface ActionButtonStyle extends StyleDeclaration {
  container: React.CSSProperties;
  error: React.CSSProperties;
}

export const defaultActionButtonStyle: ActionButtonStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },

  error: {
    fontSize: '0.9em',
    color: 'darkred',
    position: 'absolute',
    top: '-1.2em',
  },
};

export interface ActionButtonProps {
  preActionContent: (props: any) => JSX.Element;
  inActionContent: (props: any) => JSX.Element;
  postActionContent: (props: any) => JSX.Element;
  renderData?: any;
  action: () => Promise<{ok: boolean, error: string}>;
  onActionSuccess: () => void;
  styles?: Partial<ActionButtonStyle>;
}

export interface ActionButtonState {
  executing: boolean;
  executed: boolean;
  error: string;
}

export class ActionButton extends React.Component<ActionButtonProps, ActionButtonState> {
  constructor(props: ActionButtonProps) {
    super(props);
    this.state = {
      executing: false,
      executed: false,
      error: null,
    };
  }

  doExecute = () => {
    this.props.action().then(result => {
      if (result.ok) {
        this.setState({
          executed: true,
          executing: false,
          error: null,
        });
        this.props.onActionSuccess();
        return;
      }
      this.setState({
        executing: false,
        error: result.error,
      });
    });
  }

  render() {
    const ss = StyleSheet.create(defaultActionButtonStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.container, custom.container)}>
        {
            this.state.error ?
            (
              <div className={css(ss.error, custom.error)}>
                <Tooltip content={() => <span>{this.state.error}</span>}>
                  <i className="fa fa-exclamation-circle"></i> error.
                </Tooltip>
              </div>
            ) : null
          }
        <RaisedButton onClick={this.state.executed ? null : this.doExecute}>
          {
            this.state.executing ? 
              <span>{this.props.inActionContent(this.props.renderData)}</span> : 
                this.state.executed ?
                  <span>{this.props.postActionContent(this.props.renderData)}</span> :
                  <span>{this.props.preActionContent(this.props.renderData)}</span>
          }
        </RaisedButton>
      </div>
    );
  }
}

export default ActionButton;
