/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { clone } from '../../lib/reduxUtils';

export enum LayoutMode {
  FLOAT,
  GRID,
  EDGESNAP,
  WIDGETSNAP,
}

export enum Edge {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

enum EditMode {
  NONE,
  MOVE,
  SIZEX,
  SIZEXLEFT,
  SIZEY,
  SIZEYUP,
  SIZEBOTH,
  SCALE,
  SCALEHOLD,
  OPACITY,
  OPACITYHOLD,
}

export interface HUDSize {
  height: number;
  width: number;
  scale: number;
}

export interface HUDPosition {
  height: number;
  width: number;
  scale: number;
  x: number;
  y: number;
  visible: boolean;
  layoutMode?: LayoutMode;
  xGrid?: number;
  yGrid?: number;
  edge?: Edge;
}

export interface HUDDragOptions {
  minHeight?: number; // px -- default: this.defaultHeight / 4
  minWidth?: number; // px -- default: this.defaultWidth / 4
  maxHeight?: number; // px -- default: this.defaultHeight * 5
  maxWidth?: number; // px; -- default: this.defaultWidth * 5

  minScale?: number; // % -- default: .25
  maxScale?: number; // % -- default: 3

  defaultVisible?: boolean;  // is this widget visible -- default: true

  lockHeight?: boolean;
  lockWidth?: boolean;
  lockScale?: boolean;
  lockX?: boolean;
  lockY?: boolean;
  lockDrag?: boolean;
  lockVisibility?: boolean;
  lockOpacity?: boolean;

  scaleFactor?: number; // default 0.01
}

export interface HUDDragProps extends HUDDragOptions {
  // element specific
  name: string;

  defaultHeight: number; // px
  defaultWidth: number;  // px

  defaultScale: number;  // %
  defaultOpacity: number; // %

  defaultX: number; // x position in px from grid line
  defaultY: number;  // y position in px from grid line
  defaultXAnchor: any;  // position relative to grid index on x
  defaultYAnchor: any;  // position relative to grid index on You

  defaultMode: LayoutMode;

  render: (size: HUDSize) => any;  // function called to render this view withint the defined space.
  save: (position: HUDPosition) => any; // called to save position.

  // general settings
  locked: boolean;  // is the ui locked for editing?
  gridDivisions: number; // how divided is the grid (we divide the height and width by this number)
  zOrder: number;
  selected: boolean; // is this the widget currently selected for editing?
}

export interface HUDDragState {
  height: number;
  width: number;
  scale: number;
  opacity: number;
  x: number;
  y: number;
  visible: boolean;

  // GRID MODE
  xAnchor?: any;
  yAnchor?: any;

  // config
  minHeight: number;
  minWidth: number;
  maxHeight: number;
  maxWidth: number;
  minScale: number;
  maxScale: number;
  scaleFactor: number;

  // controls
  mode: EditMode;
  layoutMode: LayoutMode;
}

export interface HUDDragDefaultPosition {
  defaultX: number;
  defaultY: number;
  defaultXAnchor: number;
  defaultYAnchor: number;
}

class HUDDrag extends React.Component<HUDDragProps, HUDDragState> {

  private didUpdate: boolean = false;
  private lastPosition = { x: NaN , y: NaN };

  constructor(props: HUDDragProps) {
    super(props);
    this.state = {
      height: props.defaultHeight,
      width: props.defaultWidth,
      scale: props.defaultScale,
      opacity: props.defaultOpacity,
      x: props.defaultX,
      y: props.defaultY,
      xAnchor: props.defaultXAnchor,
      yAnchor: props.defaultYAnchor,
      visible: props.defaultVisible || true,

      minHeight: props.minHeight || props.defaultHeight / 4,
      maxHeight: props.maxHeight || props.defaultHeight * 5,
      minWidth: props.minWidth || props.defaultWidth / 4,
      maxWidth: props.maxWidth || props.defaultWidth * 5,
      minScale: props.minScale || 0.5,
      maxScale: props.maxScale || 3,

      scaleFactor: props.scaleFactor || 0.01,

      mode: EditMode.NONE,
      layoutMode: props.defaultMode || LayoutMode.GRID,
    };
  }

  public render() {
    const position = this.getPosition();
    const scale = this.state.scale !== 1 ? {
      transform: `scale(${this.state.scale})`,
      WebkitTransform: `scale(${this.state.scale})`,
    } : {};
    return (
      <div
        id={this.props.name}
        className={`HUDDrag`}
        style={{
          position: 'fixed',
          height: `${this.state.height}px`,
          width: `${this.state.width}px`,
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: 'none',
          zIndex: !this.props.locked && this.props.selected ? 999 : this.props.zOrder,
          ...scale,
        }}>
          <div style={{
            height: '100%',
            width: '100%',
            opacity: this.state.opacity,
            visibility: this.state.visible ? 'visible' : 'hidden',
            display: this.state.visible ? 'block' : 'none',
          }} >
            {this.props.render(clone(this.state))}
          </div>
        {this.props.locked ? null : this.renderEditControls()}
      </div>
    );
  }

  public componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  public componentDidUnMount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  public componentWillReceiveProps(nextProps: HUDDragProps) {
    // update positions
    this.setPosition(nextProps);

    // update min & max height if needed
    const stateUpdate: any = {};

    if (this.props.minHeight !== nextProps.minHeight) {
      stateUpdate.minHeight = nextProps.minHeight || nextProps.defaultHeight / 4;
    }

    if (this.props.maxHeight !== nextProps.maxHeight) {
      stateUpdate.maxHeight = nextProps.maxHeight || nextProps.defaultHeight * 5;
    }

    if (this.props.minWidth !== nextProps.minWidth) {
      stateUpdate.minWidth = nextProps.minWidth || nextProps.defaultWidth / 4;
    }

    if (this.props.maxWidth !== nextProps.maxWidth) {
      stateUpdate.maxWidth = nextProps.maxWidth || nextProps.defaultWidth * 5;
    }

    if (this.props.defaultVisible !== nextProps.defaultVisible) {
      stateUpdate.visible = nextProps.defaultVisible;
    }

    if (!_.isEmpty(stateUpdate)) {
      this.setState(stateUpdate);
    }
  }

  private setPosition = (nextProps: HUDDragProps) => {
    let posStateUpdate = null;
    if (this.state.layoutMode === LayoutMode.EDGESNAP) {
      // Check and update edge snap widgets position
      const fixedPos = this.getPosition();
      const pos = HUDDrag.fixedToEdgeSnap(
        fixedPos.x,
        fixedPos.y,
        this.state.height * this.state.scale,
        this.state.width * this.state.scale,
      );
      posStateUpdate = pos;
    }

    if (this.props.defaultX !== nextProps.defaultX ||
        this.props.defaultY !== nextProps.defaultY ||
        this.props.defaultHeight !== nextProps.defaultHeight ||
        this.props.defaultWidth !== nextProps.defaultWidth ||
        this.props.defaultVisible !== nextProps.defaultVisible ||
        this.props.defaultScale !== nextProps.defaultScale ||
        this.props.defaultOpacity !== nextProps.defaultOpacity) {
      // We reached this because of a RESET
      posStateUpdate = {
        x: nextProps.defaultX,
        y: nextProps.defaultY,
        width: nextProps.defaultWidth,
        height: nextProps.defaultHeight,
        xAnchor: nextProps.defaultXAnchor,
        yAnchor: nextProps.defaultYAnchor,
        scale: nextProps.defaultScale,
        opacity: nextProps.defaultOpacity,
        visible: nextProps.defaultVisible,
      };
    }

    // If there are actual updates to positions, then update local state.
    if (posStateUpdate) {
      this.setState(posStateUpdate as any);
    }
  }

  private setMode = (m: EditMode) => {
    this.setState({
      mode: m,
    } as any);
  }

  private mouseMovement = (e: MouseEvent) => {
    if (this.lastPosition.x === NaN) {
      // just starting to move, so 0 move
      this.lastPosition = { x: e.screenX, y: e.screenY };
      return { x: 0, y: 0 };
    }
    const movement = { x: e.screenX - this.lastPosition.x, y: e.screenY - this.lastPosition.y };
    this.lastPosition = { x: e.screenX, y: e.screenY };
    return movement;
  }

  private onMouseMove = (e: MouseEvent | any) => {
    const mouseMove = this.mouseMovement(e);
    switch (this.state.mode) {
      default: return;
      case EditMode.NONE: return;
      case EditMode.MOVE:
        {
          const deltaX = this.props.lockX ? 0 : mouseMove.x;
          const deltaY = this.props.lockY ? 0 : mouseMove.y;
          const fixedPos = this.getPosition();
          switch (this.state.layoutMode) {
            case LayoutMode.GRID:
              {
                const pos = HUDDrag.fixedToGrid(fixedPos.x + deltaX, fixedPos.y + deltaY, this.props.gridDivisions);
                this.setState(pos as any);
              }
              break;
            case LayoutMode.EDGESNAP:
              {
                const pos = HUDDrag.fixedToEdgeSnap(
                fixedPos.x + deltaX, fixedPos.y + deltaY,
                this.state.height * this.state.scale,
                this.state.width * this.state.scale,
              );
                this.setState(pos as any);
              }
              break;
          }
        }
        break;
      case EditMode.SIZEX:
        {
          const deltaX = mouseMove.x;
          this.setState({
            x: this.state.x - (this.state.xAnchor === 1 ? deltaX : 0),
            width: this.state.width + deltaX,
          } as any);
        }
        break;
      case EditMode.SIZEXLEFT:
        {
          const deltaX = mouseMove.x;
          this.setState({
            x: this.state.x + (this.state.xAnchor === 1 ? 0 : deltaX),
            width: this.state.width - deltaX,
          } as any);
        }
        break;
      case EditMode.SIZEY:
        {
          const deltaY = mouseMove.y;
          this.setState({
            y: this.state.y - (this.state.yAnchor === 2 ? deltaY : 0),
            height: this.state.height + deltaY,
          } as any);
        }
        break;
      case EditMode.SIZEYUP:
        {
          const deltaY = mouseMove.y;
          this.setState({
            y: this.state.y + (this.state.yAnchor === 2 ? 0 : deltaY),
            height: this.state.height - deltaY,
          } as any);
        }
        break;
      case EditMode.SIZEBOTH:
        {
          const deltaX = mouseMove.x;
          const deltaY = mouseMove.y;
          this.setState({
            x: this.state.x - (this.state.xAnchor === 1 ? deltaX : 0),
            y: this.state.y - (this.state.yAnchor === 2 ? deltaY : 0),
            width: this.state.width + deltaX,
            height: this.state.height + deltaY,
          } as any);
        }
        break;
    }
    this.didUpdate = true;
  }

  private onMouseDown = (e: any, mode: EditMode) => {
    // check if we can do this or not...

    // for now we always allow it
    this.setMode(mode);
    e.preventDefault();
    e.stopPropagation();
    this.lastPosition = { x: e.screenX , y: e.screenY };
  }

  private onMouseUp = () => {
    this.lastPosition = { x: NaN , y: NaN };
    if (this.state.mode !== EditMode.NONE) this.setMode(EditMode.NONE);
    if (this.didUpdate) {
      this.props.save(clone(this.state));
      this.didUpdate = false;
    }
  }

  private getPosition = () => {
    switch (this.state.layoutMode) {
      default: return null;
      case LayoutMode.GRID:
        return HUDDrag.gridToFixed(
          this.state.x,
          this.state.y,
          this.state.xAnchor,
          this.state.yAnchor,
          this.props.gridDivisions,
        );
      case LayoutMode.EDGESNAP: {
        const screen = { width: window.innerWidth, height: window.innerHeight };
        return {
          x: this.state.xAnchor === Edge.LEFT ?
          this.state.x : screen.width - this.state.width * this.state.scale - this.state.x,
          y: this.state.yAnchor === Edge.TOP ?
          this.state.y : screen.height - this.state.height * this.state.scale - this.state.y,
        };
      }
    }
  }

  private static gridToFixed(x: number, y: number, xGrid: number, yGrid: number, divisions: number) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      x: (width / divisions) * xGrid + x,
      y: (height / divisions) * yGrid + y,
    };
  }

  private static fixedToGrid(x: number, y: number, divisions: number) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const segmentWidth = width / divisions;
    const segmentHeight = height / divisions;

    const xGrid = (x / segmentWidth) | 0;
    const yGrid = (y / segmentHeight) | 0;

    return {
      x: x - segmentWidth * xGrid,
      xAnchor: xGrid,
      y: y - segmentHeight * yGrid,
      yAnchor: yGrid,
    };
  }

  private static fixedToEdgeSnap(x: number, y: number, h: number, w: number) {
    const s = { w: window.innerWidth, h: window.innerHeight };

    const left = x < (s.w - (x + w));
    const top = y < (s.h - (y + h));

    return {
      x: left ? x : s.w - (x + w),
      xAnchor: left ? Edge.LEFT : Edge.RIGHT,
      y: top ? y : s.h - (y + h),
      yAnchor: top ? Edge.TOP : Edge.BOTTOM,
    };
  }

  private renderEditControls = () => {
    return (this.props.name === 'building' ? null : // building should be removed as HUDDrag item
      <div className={ this.props.selected ? 'HUDDrag__controlsSelected' : 'HUDDrag__controls' }>
        <div className={ this.props.selected ? 'HUDDrag__controls__nameSelected' : 'HUDDrag__controls__name' }>
          { this.props.name === 'motd' ? 'MOTD' : _.startCase(this.props.name) }
        </div>
        {this.props.lockDrag || (this.props.lockX && this.props.lockY) ? null :
          <div className='HUDDrag__controls__dragHandle' onMouseDown={e => this.onMouseDown(e, EditMode.MOVE)}/>}
        {this.props.lockWidth ? null :
          <div
            className='HUDDrag__controls__resizeXHandle HUDDrag__controls__resizeXHandle--left'
            onMouseDown={e => this.onMouseDown(e, EditMode.SIZEXLEFT)}
          />}
        {this.props.lockWidth ? null :
          <div
            className='HUDDrag__controls__resizeXHandle HUDDrag__controls__resizeXHandle--right'
            onMouseDown={e => this.onMouseDown(e, EditMode.SIZEX)}
          />}
        {this.props.lockHeight ? null :
          <div
            className='HUDDrag__controls__resizeYHandle HUDDrag__controls__resizeYHandle--top'
            onMouseDown={e => this.onMouseDown(e, EditMode.SIZEYUP)}
          />}
        {this.props.lockHeight ? null :
          <div
            className='HUDDrag__controls__resizeYHandle HUDDrag__controls__resizeYHandle--bottom'
            onMouseDown={e => this.onMouseDown(e, EditMode.SIZEY)}
          />}
        {this.props.lockWidth || this.props.lockHeight ? null :
          <div className='HUDDrag__controls__resizeXYHandle' onMouseDown={e => this.onMouseDown(e, EditMode.SIZEBOTH)}/>}
      </div>
    );
  }
}

export default HUDDrag;
