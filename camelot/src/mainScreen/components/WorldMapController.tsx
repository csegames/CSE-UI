/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../redux/store';
import { ResizeDetector } from '../../shared/components/ResizeDetector';
import {
  addMouseUpNeededReason,
  hideConditionalWidget,
  removeMouseUpNeededReason,
  toggleConditionalWidget
} from '../redux/hudSlice';
import { WIDGET_ID_WORLD_MAP } from './WorldMap';

const MOUSE_UP_NEEDED_REASON_PANNING = 'WorldMapPanning';

const SCALE_DELTA = 0.2;
const MAX_SCALE_MULTIPLIER = 3;

// CSS classes
const Root = 'HUD-WorldMapController-Root';
const MapContainer = 'HUD-WorldMapController-MapContainer';
const OverlaysContainer = 'HUD-WorldMapController-OverlaysContainer';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  displayedZoneID: string;
  map: React.ReactNode;
  overlays: React.ReactNode;
}

interface InjectedProps {
  zoneID: string;
}

interface State {
  scale: number;
  translateX: number;
  translateY: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AWorldMapController extends React.Component<Props, State> {
  private rootWidth: number = -1;
  private rootHeight: number = -1;
  private mapWidth: number = -1;
  private mapHeight: number = -1;
  private mouseMoveHandler: (e: MouseEvent) => void;
  private mouseUpHandler: (e: MouseEvent) => void;
  private lastX: number = 0;
  private lastY: number = 0;
  private baseScale = -1;

  constructor(props: Props) {
    super(props);
    this.state = {
      // Initial scale of 1 so we can stash the original size of the map image.
      scale: 1,
      translateX: 0,
      translateY: 0
    };
    // Stashing the function pointers used to register for window events, so we can unregister them later.
    this.mouseMoveHandler = this.onMouseMove.bind(this);
    this.mouseUpHandler = this.onMouseUp.bind(this);
  }

  render(): JSX.Element {
    const { children, className, style, displayedZoneID, ...otherProps } = this.props;
    return (
      <div
        className={`${Root} ${className}`}
        {...otherProps}
        onMouseDown={this.handleMouseDown.bind(this)}
        onWheel={this.handleMouseWheel.bind(this)}
      >
        <ResizeDetector key={displayedZoneID} onResize={this.onRootResize.bind(this)} />
        <div className={MapContainer} style={{ ...(style ?? {}), ...this.buildContainerStyle() }}>
          <ResizeDetector key={displayedZoneID} onResize={this.onContainerResize.bind(this)} />
          {this.props.map}
        </div>
        <div className={OverlaysContainer} style={this.buildOverlaysStyle()}>
          {this.props.overlays}
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If the user changes zones with the map open, we need to recenter and rescale the map.
    // The easiest way to do this is to just close and reopen the map underneath the loading screen.
    if (prevProps.zoneID !== this.props.zoneID) {
      this.props.dispatch?.(hideConditionalWidget(WIDGET_ID_WORLD_MAP));
      setTimeout(() => {
        this.props.dispatch?.(toggleConditionalWidget(WIDGET_ID_WORLD_MAP));
      }, 1000);
    }
  }

  private buildContainerStyle(): React.CSSProperties {
    let props: React.CSSProperties = { top: '0', left: '0' };

    // Translate first, then scale.  Otherwise the translation would itself be scaled as well.
    props.transform = `translate(${this.state.translateX}px,${this.state.translateY}px) scale(${this.state.scale})`;

    if (this.rootWidth <= 0 || this.mapWidth <= 0) {
      // Until the content is ready, don't render it.  This avoids having the size
      // shift visibly shortly after opening the map.
      props.opacity = 0.01;
    }

    return props;
  }

  private buildOverlaysStyle(): React.CSSProperties {
    // Overlays are not scaled because we want the icons to always appear at the same size, regardless
    // of map zoom level.
    let props: React.CSSProperties = {
      top: `${this.state.translateY}px`,
      left: `${this.state.translateX}px`,
      width: `${this.mapWidth * this.state.scale}px`,
      height: `${this.mapHeight * this.state.scale}px`
    };
    return props;
  }

  private onRootResize(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number): void {
    this.rootWidth = newWidth;
    this.rootHeight = newHeight;
    this.calculateBaseScale();
    if (oldWidth == -1 && newWidth > 0) {
      this.calculateInitialPosition();
    }
  }

  private onContainerResize(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number): void {
    if ((oldWidth == -1 || oldWidth == 0) && newWidth > 0) {
      this.mapWidth = newWidth;
      this.mapHeight = newHeight;
      this.calculateBaseScale();
      this.calculateInitialPosition();
    }
  }

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
    // We shouldn't ordinarily mutate anything during this function, but this lets us pre-empt the render
    // so that the size and position calculations can start from the correct state.
    if (this.props.displayedZoneID !== nextProps.displayedZoneID) {
      this.rootWidth = -1;
      this.rootHeight = -1;
      this.mapWidth = -1;
      this.mapHeight = -1;
      this.lastX = 0;
      this.lastY = 0;
      this.baseScale = -1;
    }

    return true;
  }

  private calculateBaseScale(): void {
    let scale: number = 1.0;
    const { rootWidth, rootHeight, mapWidth, mapHeight } = this;
    // If the widgets haven't loaded yet, give up and wait for them.
    if (rootWidth < 0 || mapWidth < 0) {
      return;
    }

    if (mapWidth === 0 || mapHeight === 0 || rootWidth === 0 || rootHeight === 0) {
      // Content is invisible, so might as well hide it.
      scale = 0;
    } else if (mapWidth / mapHeight > rootWidth / rootHeight) {
      // Content is Wide, so width should match perfectly.
      scale = rootWidth / mapWidth;
    } else {
      // Content is Tall, so height should match perfectly.
      scale = rootHeight / mapHeight;
    }

    // Start at baseScale, and never go below base scale.
    if (this.baseScale < 0 || this.state.scale < scale) {
      requestAnimationFrame(() => {
        this.setState({ scale });
      });
    }

    this.baseScale = scale;
  }

  private calculateInitialPosition(): void {
    let translateX: number = 0;
    let translateY: number = 0;
    const { rootWidth, rootHeight, mapWidth, mapHeight } = this;
    // If the widgets haven't loaded yet, give up and wait for them.
    if (rootWidth < 0 || mapWidth < 0 || this.baseScale < 0) {
      return;
    }

    if (mapWidth / mapHeight > rootWidth / rootHeight) {
      // Content is Wide, so should be centered vertically.
      translateX = 0;
      translateY = (rootHeight - mapHeight * this.baseScale) / 2.0;
    } else {
      // Content is Tall, so should be centered horizontally.
      translateY = 0;
      translateX = (rootWidth - mapWidth * this.baseScale) / 2.0;
    }

    requestAnimationFrame(() => {
      this.setState({ translateX, translateY });
    });
  }

  private handleMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    // If there was a passed-in handler, run it too.
    this.props.onMouseDown?.(e);

    // Click-drag to pan (0-left, 1-middle, 2-right)
    if (e.button === 0 || e.button === 2) {
      this.lastX = e.clientX;
      this.lastY = e.clientY;

      // Register for window-level events, since the cursor will almost definitely jump out of the handle
      // during drag-to-pan.
      window.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('mouseup', this.mouseUpHandler);

      // Because mouseUp doesn't trigger over transparent UI pixels, we use this to turn on a
      // background capable of ensuring that we will receive the event.
      this.props.dispatch?.(addMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_PANNING));
    }
  }

  private onMouseUp(e: MouseEvent): void {
    if (e.button === 0 || e.button === 2) {
      // Unregister from the window-level events.
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      window.removeEventListener('mouseup', this.mouseUpHandler);
      // And tell Redux we no longer need the special background that ensures we will receive mouseUp events.
      this.props.dispatch(removeMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_PANNING));
    }
  }

  private onMouseMove(e: MouseEvent): void {
    const dx = this.lastX - e.clientX;
    const dy = this.lastY - e.clientY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.setState({ translateX: this.state.translateX - dx, translateY: this.state.translateY - dy });
  }

  private handleMouseWheel(e: React.WheelEvent) {
    let ds = (e.deltaY < 0 ? SCALE_DELTA : -SCALE_DELTA) * this.baseScale;
    // Never shrink below the "fits in the borders", and never go beyond the max scale.
    let newScale = Math.min(this.baseScale * MAX_SCALE_MULTIPLIER, Math.max(this.baseScale, this.state.scale + ds));
    ds = newScale - this.state.scale;
    let dx = -(ds * this.mapWidth) / 2.0;
    let dy = -(ds * this.mapHeight) / 2.0;

    this.setState({
      scale: newScale,
      translateX: this.state.translateX + dx,
      translateY: this.state.translateY + dy
    });
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    zoneID: state.loading.zoneID
  };
};

export const WorldMapController = connect(mapStateToProps)(AWorldMapController);
