/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-05 12:37:28
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-05 12:42:23
 */

import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Quadrant, windowQuadrant } from '../util';

const defaultStyles = {
  contextMenu: {
    backgroundColor: '#4d573e',
    border: '1px solid darken(#4d573e, 20%)',
    color: '#ececec',
    'z-index': '9998',
  },
};

export interface ContextMenuContentProps {
  close: () => void;
}

export interface ContextMenuProps {
  content: (props: ContextMenuContentProps) => any;
  contentProps?: any;
  offsetLeft?: number;
  offsetRight?: number;
  offsetTop?: number;
  offsetBottom?: number;
  style?: React.CSSProperties;
}

export interface ContextMenuState {
  x: number;
  y: number;
  wndRegion: Quadrant;
  hidden: boolean;
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
}

export class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {

  private mouseOverElement = false;

  constructor(props: ContextMenuProps) {
    super(props);
    this.state = {
      x: -99999,
      y: -99999,
      wndRegion: Quadrant.TopLeft,
      hidden: true,
      offsetLeft: this.props.offsetLeft || 10,
      offsetTop: this.props.offsetTop || 10,
      offsetRight: this.props.offsetRight || 5,
      offsetBottom: this.props.offsetBottom || 5,
    };
  }

  public render() {

    const ss = StyleSheet.create({
      contextMenu: {
        ...defaultStyles.contextMenu,
        ...(this.props.style || {}),
      },
    });

    const contentProps = this.props.contentProps || {};

    return (
      <div onContextMenu={this.onContextMenu} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
        style={{ display: 'inline-block' }}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <div className={css(ss.contextMenu)} style={this.computeStyle()}>
              <this.props.content close={this.hide} {...contentProps}/>
            </div>
        }
      </div>
    );
  }

  public hide = () => {
    this.setState({ hidden: true } as any);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('mousedown', this.onMouseDown);
  }

  public show = (clientX: number, clientY: number) => {
    this.setState({
      hidden: false,
      wndRegion: windowQuadrant(clientX, clientY),
      x: clientX,
      y: clientY,
    } as any);
  }

  private componentWillUnmount() {
    // unreg window handlers
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('mousedown', this.onMouseDown);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.which === 27 && !this.state.hidden) {
      // escape, close this
      this.hide();
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    if (!this.mouseOverElement && !this.state.hidden) {
      this.hide();
    }
  }

  private onMouseEnter = () => {
    this.mouseOverElement = true;
  }

  private onMouseLeave = () => {
    this.mouseOverElement = false;
  }

  private onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!this.state.hidden) this.hide();
    this.show(e.clientX, e.clientY);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('mousedown', this.onMouseDown);
  }

  private computeStyle = (): React.CSSProperties => {
    switch (this.state.wndRegion) {
      case Quadrant.TopLeft:
        return {
          position: 'fixed',
          left: `${this.state.x + this.state.offsetLeft}px`,
          top: `${this.state.y + this.state.offsetTop}px`,
        };
      case Quadrant.TopRight:
        return {
          position: 'fixed',
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          top: `${this.state.y + this.state.offsetTop}px`,
        };
      case Quadrant.BottomLeft:
        return {
          position: 'fixed',
          left: `${this.state.x + this.state.offsetLeft}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`,
        };
      case Quadrant.BottomRight:
        return {
          position: 'fixed',
          right: `${window.window.innerWidth - this.state.x + this.state.offsetRight}px`,
          bottom: `${window.window.innerHeight - this.state.y + this.state.offsetBottom}px`,
        };
    }
  }
}

export default ContextMenu;
