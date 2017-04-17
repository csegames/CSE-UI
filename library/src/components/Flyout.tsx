/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 11:35:54
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-17 18:22:26
 */

import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Quadrant, windowQuadrant } from '../util';

const defaultStyles = {
  flyout: {
    backgroundColor: '#4d573e',
    border: '1px solid darken(#4d573e, 20%)',
    color: '#ececec',
    'z-index': '9998',
  },
};

export interface FlyoutContentProps {
  close: () => void;
}

export interface FlyoutProps {
  content: (props: FlyoutContentProps) => any;
  contentProps?: any;
  offsetLeft?: number;
  offsetRight?: number;
  offsetTop?: number;
  offsetBottom?: number;
  style?: React.CSSProperties;
}

export interface FlyoutState {
  x: number;
  y: number;
  wndRegion: Quadrant;
  hidden: boolean;
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
}

export class Flyout extends React.Component<FlyoutProps, FlyoutState> {

  private mouseOverElement = false;

  constructor(props: FlyoutProps) {
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
      Flyout: {
        ...defaultStyles.flyout,
        ...(this.props.style || {}),
      },
    });

    const contentProps = this.props.contentProps || {};

    return (
      <div onClick={this.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}
        style={{ display: 'inline-block' }}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <div className={css(ss.Flyout)} style={this.computeStyle()}>
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

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!this.state.hidden) return;
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

export default Flyout;
