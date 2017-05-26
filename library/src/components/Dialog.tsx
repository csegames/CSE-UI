/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 14:43:06
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-07 15:13:21
 */

/*
 * Usage:
 * 
 * Wrap any element with this component and you'll get a confirmation
 * dialog popup when the element inside is clicked.
 * 
 * <Dialog content={(props: any) => <div>Are you sure?</div>}
 *   cancelOnClickOutside={true} >
 *   <button>Click Me!</button>
 * </Dialog>
 * 
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface DialogStyle extends StyleDeclaration {
  container: React.CSSProperties;
  dialog: React.CSSProperties;
  contentWrapper: React.CSSProperties;
}

export const defaultDialogStyle: DialogStyle = {
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
    zIndex: 99999,
  },

  dialog: {
    backgroundColor: '#444',
    minWidth: '250px',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
  },

  contentWrapper: {
    flex: '1 1 auto',
  },
};

export interface DialogProps<ContentProps> {
  content: (props: ContentProps) => JSX.Element;
  closeOnClickOutside?: boolean;
  contentProps?: ContentProps;
  style?: Partial<DialogStyle>;
}

export interface DialogState {
  hidden: boolean;
  closeOnClickOutside: boolean;
}

export class Dialog<ContentProps> extends React.Component<DialogProps<ContentProps>, DialogState> {

  private mouseOver = false;

  constructor(props: DialogProps<ContentProps>) {
    super(props);

    this.state = {
      hidden: true,
      closeOnClickOutside: this.props.closeOnClickOutside || false,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultDialogStyle);
    const custom = StyleSheet.create(this.props.style || {});
    return (
      <div onClick={this.clicked} style={{ display: 'inline-block' }}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <div className={css(ss.container, custom.container)}>
              <div
                className={css(ss.dialog, custom.dialog)}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseleave}>
                <div className={css(ss.contentWrapper, custom.contentWrapper)}>
                  <this.props.content {...this.props.contentProps} />
                </div>
              </div>
            </div>
        }
      </div>
    );
  }

  public show = () => {
    this.setState({
      hidden: false,
    } as any);
    this.mouseOver = false;
  }

  public hide = () => {
    this.setState({
      hidden: true,
    } as any);
    window.removeEventListener('mousedown', this.windowMouseDown);
    this.mouseOver = false;
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.windowMouseDown);
  }

  private onMouseEnter = () => {
    this.mouseOver = true;
  }

  private onMouseleave = () => {
    this.mouseOver = false;
  }

  private windowMouseDown = () => {
    if (this.state.closeOnClickOutside && !this.state.hidden && !this.mouseOver) {
      this.hide();
    }
  }

  private clicked = () => {
    if (!this.state.hidden) return;
    this.show();
    window.addEventListener('mousedown', this.windowMouseDown);
  }
}

export default Dialog;
