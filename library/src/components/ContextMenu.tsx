/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { Quadrant, windowQuadrant } from '../utils';

const Container = styled('div')`
  background-color: #4D573E;
  border: 1px solid darken(#4D573E, 20%);
  color: #ECECEC;
  z-index: 9998;
`;

export interface ContextMenuContentProps {
  close: () => void;
}

export interface ContextMenuProps {
  content: (props: ContextMenuContentProps) => any;
  onContextMenuContentShow?: () => void;
  onContextMenuContentHide?: () => void;
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
    const contentProps = this.props.contentProps || {};

    return (
      <div
        onContextMenu={this.onContextMenu}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={{ display: 'inline-block' }}>
        {this.props.children}
        {
          this.state.hidden ? null :
            <Container style={this.computeStyle()}>
              <this.props.content close={this.hide} {...contentProps}/>
            </Container>
        }
      </div>
    );
  }

  public shouldComponentUpdate(nextProps: ContextMenuProps, nextState: ContextMenuState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  }

  public hide = () => {
    if (this.props.onContextMenuContentHide) this.props.onContextMenuContentHide();
    this.setState({ hidden: true } as any);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('mousedown', this.onMouseDown);
  }

  public show = (clientX: number, clientY: number) => {
    if (this.props.onContextMenuContentShow) this.props.onContextMenuContentShow();
    this.setState({
      hidden: false,
      wndRegion: windowQuadrant(clientX, clientY),
      x: clientX,
      y: clientY,
    } as any);
  }

  public componentWillUnmount() {
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
