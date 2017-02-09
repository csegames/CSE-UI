/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 14:43:06
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 17:49:37
 */

/*
 * Usage:
 * 
 * Wrap any element with this component and you'll get a confirmation
 * dialog popup when the element inside is clicked.
 * 
 * <ConfirmDialog onConfirm={() => Do something }
 *   onCancel={() => Do something}
 *   content={(props: any) => <div>Are you sure?</div>}
 *   cancelOnClickOutside={true} >
 *   <button>Click Me!</button>
 * </ConfirmDialog>
 * 
 */

import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { merge } from 'lodash';

const defaultStyles: ConfirmDialogStyle = {

  container: {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'default',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  dialog: {
    backgroundColor: '#444',
    minWidth: '250px',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
  },

  content: {
    padding: '10px',
    flex: '1 1 auto',
  },

  buttons: {
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px',
  },

  confirmButton: {
    padding: '5px 10px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },

  cancelButton: {
    padding: '5px 10px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  }
};

export interface ConfirmDialogStyle {
  container: React.CSSProperties;
  dialog: React.CSSProperties;
  content: React.CSSProperties;
  buttons: React.CSSProperties;
  confirmButton: React.CSSProperties;
  cancelButton: React.CSSProperties;
}

export interface ConfirmDialogProps<ContentProps> {
  onConfirm: () => void;
  onCancel: () => void;
  content: (props: ContentProps) => JSX.Element;
  cancelOnClickOutside?: boolean;
  contentProps?: ContentProps;
  style?: Partial<ConfirmDialogStyle>;
  confirmButtonContent?: JSX.Element | string;
  cancelButtonContent?: JSX.Element | string;
}

export interface ConfirmDialogState {
  hidden: boolean;
  cancelOnClickOutside: boolean;
}

export class ConfirmDialog<ContentProps> extends React.Component<ConfirmDialogProps<ContentProps>, ConfirmDialogState> {

  constructor(props: ConfirmDialogProps<ContentProps>) {
    super(props);

    this.state = {
      hidden: true,
      cancelOnClickOutside: this.props.cancelOnClickOutside || false,
    };
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.windowMouseDown);
  }

  public show = () => {
    this.setState({
      hidden: false
    } as any);
    this.mouseOver = false;
  }

  public hide = () => {
    this.setState({
      hidden: true
    } as any);
    window.removeEventListener('mousedown', this.windowMouseDown);
    this.mouseOver = false;
  }

  private confirm = () => {
    this.hide();
    this.props.onConfirm();
  }

  private cancel = () => {
    this.hide();
    this.props.onCancel();
  }

  private mouseOver = false;
  private onMouseEnter = () => {
    this.mouseOver = true;
  }

  private onMouseleave = () => {
    this.mouseOver = false;
  }

  private windowMouseDown = () => {
    if (this.state.cancelOnClickOutside && !this.state.hidden && !this.mouseOver) {
      this.cancel();
    }
  }

  private clicked = () => {
    if (!this.state.hidden) return;
    this.show();
    window.addEventListener('mousedown', this.windowMouseDown);
  }

  render() {
    const ss = StyleSheet.create(merge(defaultStyles, this.props.style || {}));
    return (
      <div onClick={this.clicked} style={{ display: 'inline-block' }}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <div className={css(ss.container)}>
              <div className={css(ss.dialog)} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseleave}>
                <div className={css(ss.content)}>
                  <this.props.content {...this.props.contentProps} />
                </div>
                <div className={css(ss.buttons)}>
                  <div className={css(ss.confirmButton)} onClick={this.confirm}>
                    {this.props.confirmButtonContent || 'Confirm'}
                  </div>
                  <div className={css(ss.cancelButton)} onClick={this.cancel}>
                    {this.props.cancelButtonContent || 'Cancel'}
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default ConfirmDialog;
