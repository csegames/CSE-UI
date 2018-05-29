/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import * as events from '@csegames/camelot-unchained/lib/events';

export interface PositionInformation {
  top: number;
  left: number;
  bottom?: number;

  width: number;
  height: number;
}

export interface DragStoreProps {

}

export interface DragStoreState {
  isDragging: boolean;
  dataKey: string;
  draggableRef: any;
  draggableData: any;
  draggableInitPosition: PositionInformation;
  draggingPosition: PositionInformation;
  dropTargetRef: any;
  dragRender: JSX.Element;
}

export const defaultDragStoreState: DragStoreState = {
  isDragging: false,
  dataKey: '',
  draggableRef: null,
  draggableData: null,
  draggableInitPosition: null,
  draggingPosition: null,
  dropTargetRef: null,
  dragRender: <div style={{
    backgroundColor: 'blue',
    width: '100%',
    height: '100%',
  }} />,
};

let dragStore: DragStoreState = defaultDragStoreState;

export function setDragStoreInfo(partialDragStore: Partial<DragStoreState>) {
  events.fire('set-drag-store', partialDragStore);
}

export function getDragStore(): DragStoreState {
  return dragStore;
}

class DragStore extends React.Component<DragStoreProps, DragStoreState> {
  constructor(props: DragStoreProps) {
    super(props);
    this.state = defaultDragStoreState;
  }

  public render() {
    return this.state.isDragging ? (
      <div style={{
        position: 'fixed',
        top: `${this.state.draggingPosition.top}px`,
        left: `${this.state.draggingPosition.left}px`,
        width: this.state.draggingPosition.width,
        height: this.state.draggingPosition.height,
        zIndex: 9999,
        pointerEvents: 'none',
      }}>
        {this.state.dragRender}
      </div>
    ) : null;
  }

  public componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    events.on('set-drag-store', this.onSetDragStoreInfo);
  }

  public componentWillUpdate(nextProps: DragStoreProps, nextState: DragStoreState) {
    if (!_.isEqual(this.state, nextState)) {
      dragStore = { ...this.state, ...nextState };
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (e: any) => {
    if (!this.state.isDragging && this.state.draggableRef) {
      if (this.state.draggableRef.onDragStart) {
        this.state.draggableRef.onDragStart(this.createDragEvent(e));
      }
      this.setState({ isDragging: true });
    }

    if (this.state.isDragging && this.state.draggableRef) {
      if (this.state.draggableRef.onDrag) {
        this.state.draggableRef.onDrag(this.createDragEvent(e));
      }
      const { draggableInitPosition } = this.state;
      const top = e.clientY - (draggableInitPosition.height / 2);
      const left = e.clientX - (draggableInitPosition.width / 2);
      const draggingPosition = { height: draggableInitPosition.height, width: draggableInitPosition.width, top, left };
      this.setState({ draggingPosition });
    }
  }

  private onMouseUp = (e: any) => {
    const dragEvent = this.createDragEvent(e);
    if (this.state.isDragging) {
      // Call onDragEnd if it defined
      if (this.state.draggableRef && this.state.draggableRef.onDragEnd) {
        this.state.draggableRef.onDragEnd(dragEvent);
      }

      this.setState({ isDragging: false, draggingPosition: this.state.draggableInitPosition });
    }

    if (this.state.dropTargetRef && this.state.dropTargetRef.onDrop) {
      this.state.dropTargetRef.onDrop(dragEvent);
    }
    if (this.state.dropTargetRef && this.state.dropTargetRef.onDragLeave) {
      this.state.dropTargetRef.onDragLeave(dragEvent);
    }

    this.setState({ ...defaultDragStoreState });
  }

  private onSetDragStoreInfo = (partialDragStore: Partial<DragStoreState>) => {
    this.setState({ ...this.state, ...partialDragStore });
  }

  private createDragEvent = (e: React.MouseEvent<any>, drop?: boolean) => {
    const dragEvent: any = {
      dataTransfer: drop ? this.state.draggableRef.data() : this.state.draggableData,
      dataKey: this.state.dataKey,
      target: drop ? this.state.dropTargetRef : this.state.draggableRef,
      screenX: e.screenX,
      screenY: e.screenY,
      clientX: e.clientX,
      clientY: e.clientY,
      button: e.button,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
    };

    return dragEvent;
  }
}

export default DragStore;
