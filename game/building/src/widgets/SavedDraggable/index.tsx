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

const CURRENT_STATE_VERSION: number = 3;
const MIN_STATE_VERSION_PERCENT: number = 3;

export enum Anchor {
  TO_START = -1,
  TO_CENTER = 0,
  TO_END = 1
}

export interface AnchoredAxis {
  anchor: Anchor;               // -1 (start) 0 (center) 1 (end)
  px: number;
}

interface AnchoredPosition {
  x: AnchoredAxis;
  y: AnchoredAxis;
  size: Size;
  scale?: number;
}

export interface AbsolutePosition {
  x: number,
  y: number,
  size: Size
}

export interface Size {
  width: number;
  height: number;
}

interface LayoutState {
  version?: number;
  position: AnchoredPosition;
}

export interface SavedDraggableProps {
  saveName: string;
  defaultX: [number, Anchor];
  defaultY: [number, Anchor];
  defaultSize?: [number, number];
}

export interface SavedDraggableState {
  absolutePosition: AbsolutePosition;
  resizable: boolean;
}

const SAVE_PREFIX = "cu/game/draggable/";

class SavedDraggable extends React.Component<SavedDraggableProps, SavedDraggableState> {


  constructor(props: SavedDraggableProps) {
    super(props);

    this.state = this.loadLayoutState();
  }

  getScreenSize(): Size {
    return { width: window.innerWidth, height: window.innerHeight }
  }

  loadLayoutState(): SavedDraggableState {
    const screen: Size = this.getScreenSize();
    const pos: AnchoredPosition = {
      x: {px: this.props.defaultX[0], anchor: this.props.defaultX[1] },
      y: {px: this.props.defaultY[0], anchor: this.props.defaultY[1] },
      size: null
    };

    let resizable = true;
    if (this.props.defaultSize == null) {
      pos.size = { width: 0, height: 0 };
      resizable = false;
    } else {
      pos.size = {
        width: this.props.defaultSize[0],
        height: this.props.defaultSize[1]
      };
    }

    const absPosition: AbsolutePosition = this.loadLayout(this.anchored2position(pos, screen), screen);

    return {
      absolutePosition: this.forceOnScreen(absPosition, screen),
      resizable: resizable
    }
  }


  axis2anchor(position: number, width: number, range: number): AnchoredAxis {
    if (position < (range * 0.25)) return { anchor: Anchor.TO_START, px: position };
    if ((position + width) > (range * 0.75)) return { anchor: Anchor.TO_END, px: range - position };
    return { anchor: Anchor.TO_CENTER, px: position - (range * 0.5) };
  }

  position2anchor(current: AbsolutePosition, screen: Size): AnchoredPosition {
    return {
      x: this.axis2anchor(current.x, current.size.width, screen.width),
      y: this.axis2anchor(current.y, current.size.height, screen.height),
      size: {
        width: current.size.width,
        height: current.size.height
      },
      scale: 1
    };
  }

  anchor2axis(anchored: AnchoredAxis, range: number): number {
    switch (anchored.anchor) {
      case Anchor.TO_CENTER: // relative to center
        return (range * 0.5) + anchored.px;
      case Anchor.TO_START: // relative to start
        return anchored.px;
      case Anchor.TO_END:
        return range - anchored.px;
    }
  }

  anchored2position(anchored: AnchoredPosition, screen: Size): AbsolutePosition {
    return {
      x: this.anchor2axis(anchored.x, screen.width),
      y: this.anchor2axis(anchored.y, screen.height),
      size: anchored.size,
    };
  }

  forceOnScreen(pos: AbsolutePosition, screen: Size): AbsolutePosition {
    const size = pos.size;
    if (pos.x < 0) pos.x = 0;
    if (pos.y < 0) pos.y = 0;
    if (pos.x + size.width > screen.width) pos.x = screen.width - size.width;
    if (pos.y + size.height > screen.height) pos.y = screen.height - size.height;
    if (pos.x < 0) { pos.x = 0; size.width = screen.width; }
    if (pos.y < 0) { pos.y = 0; size.height = screen.height; }
    return pos;
  }

  savePositionAndSize(position: AbsolutePosition) {
    const screen: Size = this.getScreenSize();
    position = this.forceOnScreen(position, screen);

    const save: LayoutState = {
      version: CURRENT_STATE_VERSION,
      position: this.position2anchor(position, screen),
    };
    localStorage.setItem(SAVE_PREFIX + this.props.saveName, JSON.stringify(save));
    console.log('saving='+JSON.stringify(save))
  }


  loadLayout(defaultPosition: AbsolutePosition, screen: Size): AbsolutePosition {
    //const state: LayoutState = JSON.parse(localStorage.getItem(SAVE_PREFIX + this.props.saveName)) as LayoutState;
    const state: LayoutState = null;

    if (state && ((state.version | 0) >= MIN_STATE_VERSION_PERCENT)) {
      return this.anchored2position(state.position, screen);
    }

    return defaultPosition;
  }

  saveLayout = (event: Event, dragPosition: { x: number, y: number }) => {
    let position: AbsolutePosition = {
      x: dragPosition.x,
      y: dragPosition.y,
      size: this.state.absolutePosition.size
    };
    this.savePositionAndSize(position);
    this.setState({ absolutePosition: position } as SavedDraggableState);
    this.stopDrag();
  }

  saveResize = (event: Event, resize: { element: any, size: Size }) => {
    const styleSize = resize.size;
    let position: AbsolutePosition = {
      x: this.state.absolutePosition.x,
      y: this.state.absolutePosition.y,
      size: this.state.absolutePosition.size
    };


    this.savePositionAndSize(position);
    this.setState({ absolutePosition: position } as SavedDraggableState);
    this.stopDrag();
  }

  handleResize = (event: Event, resize: { element: any, size: any }) => {
    let position: AbsolutePosition = {
      x: this.state.absolutePosition.x,
      y: this.state.absolutePosition.y,
      size: resize.size
    };

    this.setState({ absolutePosition: position } as SavedDraggableState);
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
    const grid = [10, 10];

    let resizeable: any = this.props.children;
    if (this.state.resizable) {
      resizeable = (
        <Resizable width={this.state.absolutePosition.size.width} height={this.state.absolutePosition.size.height}
          draggableOpts={{ grid: grid }}
          onResizeStart={this.startDrag}
          onResize={this.handleResize}
          onResizeStop={this.saveResize} >
          <div style={{ width: this.state.absolutePosition.size.width + 'px', height: (this.state.absolutePosition.size.height) + 'px' }}>
            {this.props.children}
          </div>
        </Resizable>
      );
    }

    return (
      <Draggable handle=".dragHandle"
        position={this.state.absolutePosition} grid={grid} zIndex={100}
        onStart={this.startDrag}
        onStop={this.saveLayout} >
        {resizeable}
      </Draggable >
    )
  }
}

export default SavedDraggable;
