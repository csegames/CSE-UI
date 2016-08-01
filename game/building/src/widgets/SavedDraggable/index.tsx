/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
const Resizable = require('react-resizable').Resizable;
const ResizableBox = require('react-resizable').ResizableBox;
const Draggable = require('react-draggable');
const DraggableCore = Draggable.DraggableCore;

const CURRENT_STATE_VERSION: number = 2;
const MIN_STATE_VERSION_PERCENT: number = 2;

export interface LayoutState {
  version?: number;
  position: Position;
  size: Size
}

export interface Position {
  x: number,
  y: number,
}

export interface Size {
  width: number;
  height: number;
  scale: number
}


export interface SavedDraggableProps {
  saveName: string;
  defaultPositionInPercentages: Position;
  defaultSizeInPercentages?: Size;
}

export interface SavedDraggableState {
  positionInPixels: Position;
  sizeInPixels: Size;
  resizable: boolean;
}

const SAVE_PREFIX = "cu/game/draggable/";

class SavedDraggable extends React.Component<SavedDraggableProps, SavedDraggableState> {
  
  
  constructor(props: SavedDraggableProps) {
    super(props);

    this.state = this.loadLayoutState();
  }

  getScreenSize(): Size {
    return { width: window.innerWidth, height: window.innerHeight, scale: 1 }
  }

  loadLayoutState() {
    const screen: Size = this.getScreenSize();
    const pos: Position = this.props.defaultPositionInPercentages;
    let resizable = true;
    let size: Size = this.props.defaultSizeInPercentages;
    if (size == null) {
      size = { width: 0, height: 0, scale: 1 };
      resizable = false;
    }

    const layout = this.loadLayout(
      this.pcnt2pxPosition({ x: pos.x / 100, y: pos.y / 100 } as Position, screen),
      this.pcnt2pxSize({ width: size.width / 100, height: size.height / 100 } as Size, screen),
      screen
    );

    return {
      positionInPixels: this.forceOnScreen(layout.position, layout.size, screen),
      sizeInPixels: layout.size,
      resizable: resizable
    }
  }

  px2pcntPosition(pos: Position, screen: Size): Position {
    // converts pixel co-ordinates into % of display size    
    return {
      x: Math.floor(100 * pos.x / screen.width) / 100,
      y: Math.floor(100 * pos.y / screen.height) / 100,
    };
  }

  px2pcntSize(size: Size, screen: Size): Size {
    // converts pixel co-ordinates into % of display size    
    return {
      width: Math.floor(100 * size.width / screen.width) / 100,
      height: Math.floor(100 * size.height / screen.height) / 100,
      scale: 1
    };
  }

  pcnt2pxPosition(pos: Position, screen: Size): Position {
    // converts % co-ordinates into pixels for current display
    if (pos.x > 1) pos.x = 1;
    if (pos.x < 0) pos.x = 0;
    return {
      x: screen.width * pos.x,
      y: screen.height * pos.y,
    }
  }

  pcnt2pxSize(size: Size, screen: Size): Size {
    // converts % co-ordinates into pixels for current display
    return {
      width: screen.width * size.width,
      height: screen.height * size.height,
      scale: 1
    }
  }

  forceOnScreen(pos: Position, size: Size, screen: Size): Position {
    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;
    if (pos.x + size.width > screen.width) pos.x = screen.width - size.width;
    if (pos.y + size.height > screen.height) pos.y = screen.height - size.height;
    if (pos.x < 0) { pos.x = 0; size.width = screen.width; }
    if (pos.y < 0) { pos.y = 0; size.height = screen.height; }
    return pos;
  }

  savePositionAndSize(position: Position, size: Size) {
    const screen: Size = this.getScreenSize();
    position = this.forceOnScreen(position, size, screen);

    const save: LayoutState = {
      version: CURRENT_STATE_VERSION,
      position: this.px2pcntPosition(position, screen),
      size: this.px2pcntSize(size, screen)
    };
    localStorage.setItem(SAVE_PREFIX + this.props.saveName, JSON.stringify(save));
  }


  loadLayout(defaultPosition: Position, defaultSize: Size, screen: Size): LayoutState {
    const state: LayoutState = JSON.parse(localStorage.getItem(SAVE_PREFIX + this.props.saveName)) as LayoutState;
    //const state: LayoutState = null;

    if (state && ((state.version | 0) >= MIN_STATE_VERSION_PERCENT)) {
      return {
        version: CURRENT_STATE_VERSION,
        position: this.pcnt2pxPosition(state.position, screen),
        size: this.pcnt2pxSize(state.size, screen)
      } as LayoutState;
    }

    return {
      version: CURRENT_STATE_VERSION,
      position: defaultPosition,
      size: defaultSize
    } as LayoutState;
  }

  saveLayout = (event: Event, dragPosition: { x: number, y: number }) => {
    let position = {
      x: dragPosition.x,
      y: dragPosition.y,
    };
    const size = {
      width: this.state.sizeInPixels.width,
      height: this.state.sizeInPixels.height,
      scale: this.state.sizeInPixels.scale
    }
    this.savePositionAndSize(position, size);
    this.setState({ positionInPixels: position } as SavedDraggableState);
    this.stopDrag();
  }

  saveResize = (event: Event, resize: { element: any, size: Size }) => {
    const styleSize = resize.size;
    let position = {
      x: this.state.positionInPixels.x,
      y: this.state.positionInPixels.y,
    };

    const size = {
      width: styleSize.width,
      height: styleSize.height,
      scale: this.state.sizeInPixels.scale
    }

    this.savePositionAndSize(position, size);
    this.setState({ sizeInPixels: size } as SavedDraggableState);
    this.stopDrag();
  }

  handleResize = (event: Event, resize: { element: any, size: any }) => {
    //const dif = this.state.sizeInPixels.width - resize.size.width;
    const size = {
      width: resize.size.width,
      height: resize.size.height,
      scale: this.state.sizeInPixels.scale
    }

    this.setState({ sizeInPixels: size } as SavedDraggableState);
  }

  handleWindowResize = (ev: UIEvent) => {
    //minimizing the window sets the innerWidth/Height to zero. 
    //this prevents that from messing with the calculations
    if (window.innerWidth >= 640 && window.innerHeight >= 480) {
      this.setState(this.loadLayoutState());
    }
  }

  startDrag = () => {
    window.document.body.style.backgroundColor = 'rgba(100,100,200, 0.1)';
  }

  stopDrag = () => {
    window.document.body.style.backgroundColor = null;
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    this.stopDrag();
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  render() {
    const screen: Size = this.getScreenSize();
    const grid = [Math.floor(screen.width / 100), Math.floor(screen.height / 100)];

    let resizeable: any = this.props.children;
    if (this.state.resizable) {
      resizeable = (
        <Resizable width={this.state.sizeInPixels.width} height={this.state.sizeInPixels.height}
          draggableOpts={{ grid: grid }}
          onResizeStart={this.startDrag}
          onResize={this.handleResize}
          onResizeStop={this.saveResize} >
          <div style={{ width: this.state.sizeInPixels.width + 'px', height: (this.state.sizeInPixels.height) + 'px' }}>
            {this.props.children}
          </div>
        </Resizable>
      );
    }

    return (
      <Draggable handle=".dragHandle"
        position={this.state.positionInPixels} grid={grid} zIndex={100}
        onStart={this.startDrag}
        onStop={this.saveLayout} >
        {resizeable}
      </Draggable >
    )
  }
}

export default SavedDraggable;
