/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import * as React from 'react';
import * as _ from 'lodash';
import { setDragStoreInfo, getDragStore, defaultDragStoreState } from './DragStore';

export interface PositionInformation {
  top: number;
  left: number;
  bottom?: number;

  width: number;
  height: number;
}

enum MouseButtons {
  Left = 1,
  Middle = 1 << 1,
  Right = 1 << 2,
  M4 = 1 << 3,
  M5 = 1 << 4,
}

export interface Draggable<TData, TProps> extends React.ComponentClass<TProps> {
  // Data object to transfer with the drag.
  data: TData;

  // Fired when an element is being dragged.
  onDrag?: (e: DragEvent<TData, TProps>) => void;

  // Fired when a drag is being ended.
  onDragEnd?: (e: DragEvent<TData, TProps>) => void;

  // Fired when a drag item enters a valid drop target.
  onDragEnter?: (e: DragEvent<TData, TProps>) => void;

  // Fired when a drag item leaves a valid drop target.
  onDragLeave?: (e: DragEvent<TData, TProps>) => void;

  // Fired when a drag item is being dragged over a valid drop target.
  onDragOver?: (e: DragEvent<TData, TProps>) => void;

  // Fired when drag is started.
  onDragStart?: (e: DragEvent<TData, TProps>) => void;

  // Fired when a drag item is dropped on a valid drop target.
  onDrop?: (e: DragEvent<TData, TProps>) => void;
}

export interface DragEvent<TData, TProps> {
  // data object to transfer with the drag
  dataTransfer: TData;

  // key to identify type of data being transferred
  // dropTargets that do not accept this key will not
  // allow a drop
  dataKey: string;

  // The element being dragged
  target: Draggable<TData, TProps>;

  // screen (global) X coordinates of the mouse position
  screenX: number;

  // screen (global) Y coordinates of the mouse position
  screenY: number;

  // local X coordinates of the mouse position
  clientX: number;

  // local Y coordinates of the mouse position
  clientY: number;

  // which button/s were pressed when this event was fired on the mouse
  button: MouseButtons;

  // whether the control key was pressed when this event was fired
  ctrlKey: boolean;

  // whether the shift key was pressed when this event was fired
  shiftKey: boolean;

  // whether the alt key was pressed when this event was fired
  altKey: boolean;

  // whether the meta key was pressed when this event was fired
  metaKey: boolean;
}

export interface DraggableOptions {
  // Unique id of this Draggable item
  id: string;

  // Key to identify type of data that is allowed.
  dataKey: string;

  // What should the draggable item look like?
  dragRender?: JSX.Element;

  // Should act as a drop target as well as a draggable item. Default: FALSE - only a drag item
  dropTarget?: boolean;

  // If there is a scroll body, need this to add listener to that body.
  scrollBodyId?: string;

  // Disables drag. If dropTarget is set to true, acts as only a drop zone.
  disableDrag?: boolean;

  // Sets container of D&D item to flex 1 width 100% and height 100%
  fullDimensions?: boolean;
}

export interface DraggableData {
  [key: string]: any;
}

export interface DragAndDropInjectedProps {
  dragItemIsOver?: boolean;
}

export interface DragAndDropState extends DragAndDropInjectedProps {
  draggingPosition: PositionInformation;
}

function dragAndDrop<PropsTypes extends DragAndDropInjectedProps & { ref?: (ref: any) => any }>(
  options: DraggableOptions | ((props: Omit<PropsTypes, keyof DragAndDropInjectedProps>) => DraggableOptions),
) {
  return (WrappedComponent: React.ComponentClass<PropsTypes> | React.StatelessComponent<PropsTypes>) => {
    return class DragAndDrop extends React.Component<
      Omit<PropsTypes, keyof DragAndDropInjectedProps>,
      DragAndDropState
    > {
      public mounted: boolean;
      private ref: HTMLDivElement;
      private draggableRef: any;

      private mouseDownTimeout: any;
      private initTimeout: any;
      private initialPosition: PositionInformation;
      private dimensions: { height: number; width: number; top: number; left: number; };
      private onScroll = _.throttle(() => {
        // This inits position after throttled through scroll if a scrollById is provided.
        this.initPosition();
      }, 50);
      private options: DraggableOptions;

      constructor(props: Omit<PropsTypes, keyof DragAndDropInjectedProps>) {
        super(props);

        this.options = options ? typeof options === 'function' ? options(props) : options : null;

        this.state = {
          dragItemIsOver: false,
          draggingPosition: null,
        };
      }

      public render() {
        return (
          <div
            ref={ref => this.ref = ref}
            id={'drag-and-drop-item-container'}
            style={this.options.fullDimensions ? { flex: '1', width: '100%', height: '100%' } : {}}
            onMouseMove={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onMouseDown={this.onMouseDown}
            onMouseUp={() => clearTimeout(this.mouseDownTimeout)}>
            <WrappedComponent
              ref={(ref: any) => this.draggableRef = ref}
              {...this.props}
              dragItemIsOver={this.state.dragItemIsOver}
            />
          </div>
        );
      }

      public componentDidMount() {
        // Init position of items
        this.mounted = true;

        // onResize re init position of items
        window.addEventListener('resize', this.initPosition);

        // If scrollBodyId provided then addEventListener scroll
        if (this.options && this.options.scrollBodyId) {
          const scrollBody = document.getElementById(this.options.scrollBodyId);
          if (scrollBody) {
            scrollBody.addEventListener('scroll', this.onScroll);
          }
        }
      }

      public shouldComponentUpdate(nextProps: any, nextState: DragAndDropState) {
        return !_.isEqual(nextState.draggingPosition, this.state.draggingPosition) ||
          nextState.dragItemIsOver !== this.state.dragItemIsOver ||
          !_.isEqual(nextProps, this.props);
      }

      public componentWillReceiveProps(nextProps: Omit<PropsTypes, keyof DragAndDropInjectedProps>) {
        if (!_.isEqual(this.props, nextProps)) {
          if (this.state.dragItemIsOver) {
            this.setState({ dragItemIsOver: false });
          }

          this.options = options ? typeof options === 'function' ? options(nextProps) : options : null;
        }
      }

      public componentDidUpdate(prevProps: any, prevState: DragAndDropState) {
        if (!this.ref || !this.dimensions) return;
        const dimensions = {
          width: this.dimensions.width,
          height: this.dimensions.height,
          top: this.dimensions.top,
          left: this.dimensions.left,
        };
        const positionHasChanged = dimensions && this.initialPosition &&
          (dimensions.width !== this.initialPosition.width || dimensions.height !== this.initialPosition.height ||
          dimensions.top !== this.initialPosition.top || dimensions.left !== this.initialPosition.left);

        if (positionHasChanged || (dimensions && !this.initialPosition)) {
          this.initPosition();
        }
      }

      public componentWillUnmount() {
        // Clear initPosition timeout
        this.mounted = false;
        setDragStoreInfo(defaultDragStoreState);

        clearTimeout(this.initTimeout);
        clearTimeout(this.mouseDownTimeout);

        // Remove listener for onResize re init
        window.removeEventListener('resize', this.initPosition);

        // If scrollBodyId provided then removeEventListener scroll
        if (this.options && this.options.scrollBodyId) {
          const scrollBody = document.getElementById(this.options.scrollBodyId);
          if (scrollBody) {
            scrollBody.removeEventListener('scroll', this.onScroll);
          }
        }
      }

      private initPosition = () => {
        // Only initialize position if the item actually does anything with dragging/dropping
        if (!this.options.disableDrag || this.options.dropTarget) {
          this.initTimeout = setTimeout(() => {
            if (this.mounted) {
              if (!this.dimensions) {
                this.dimensions = this.ref && {
                  top: this.ref.clientTop,
                  left: this.ref.clientLeft,
                  height: this.ref.clientHeight,
                  width: this.ref.clientWidth,
                };
              }
              if (this.dimensions) {
                const { top, left, width, height } = this.dimensions;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                if (top < windowHeight && left < windowWidth || top >= 0 || left >= 0) {
                  this.initialPosition = { top, left, width, height };
                  if (!this.state.draggingPosition ||
                      this.state.draggingPosition.width !== width ||
                      this.state.draggingPosition.height !== height) {
                    this.setState({ draggingPosition: this.initialPosition });
                  }
                }
              }
            }
          }, 1);
        }
      }

      private onMouseEnter = (e: any) => {
        if (!this.dimensions) {
          this.initPosition();
        }
        if (this.mounted && this.options.dropTarget && !this.state.dragItemIsOver) {
          const dragStore = getDragStore();
          if (dragStore.isDragging && !_.isEqual(dragStore.draggableRef, this.draggableRef) &&
              dragStore.dataKey === this.options.dataKey) {

            this.setState({ dragItemIsOver: true });
            setDragStoreInfo({ dropTargetRef: this.draggableRef });

            const dragEvent = this.createDragEvent(e);
            if (this.draggableRef && this.draggableRef.onDragOver) {
              this.draggableRef.onDragOver(dragEvent);
            }

            if (this.draggableRef && this.draggableRef.onDragEnter) {
              this.draggableRef.onDragEnter(dragEvent);
            }
          }
        }
      }

      private onMouseLeave = (e: any) => {
        if (this.mounted && this.options.dropTarget && this.state.dragItemIsOver) {
          this.setState({ dragItemIsOver: false });

          setDragStoreInfo({ dropTargetRef: null });

          const dragEvent = this.createDragEvent(e);
          if (this.draggableRef && this.draggableRef.onDragLeave) {
            this.draggableRef.onDragLeave(dragEvent);
          }
        }
      }

      private onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 2) return;
        if (this.mounted && !this.options.disableDrag && this.initialPosition) {
          this.mouseDownTimeout = setTimeout(() => {
            // Call onDragStart if it is defined
            setDragStoreInfo({
              draggableRef: this.draggableRef,
              draggableData: this.draggableRef.data(),
              draggableInitPosition: this.initialPosition,
              dataKey: this.options.dataKey,
              draggingPosition: this.initialPosition,
              dragRender: this.options.dragRender ||
                <WrappedComponent
                  {...this.props}
                  dragItemIsOver={this.state.dragItemIsOver}
                />,
              dropTargetRef: null,
            });
          }, 150);
        }
      }

      private createDragEvent(e: React.MouseEvent<any>, drop?: boolean) {
        const dragStore = getDragStore();
        const dragEvent: DragEvent<DraggableData, PropsTypes> = {
          dataTransfer: drop ? this.draggableRef.data() : dragStore.draggableData,
          dataKey: this.options.dataKey,
          target: drop ? this.draggableRef : dragStore.draggableRef,
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
    };
  };
}

export default dragAndDrop;
