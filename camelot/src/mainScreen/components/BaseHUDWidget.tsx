/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as Sentry from '@sentry/browser';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDWidget,
  addConditionalWidgetExiting,
  hideConditionalWidget,
  removeConditionalWidgetExiting,
  setSelectedWidget,
  setSelectedWidgetBounds,
  showConditionalWidget,
  updateWidgetStates
} from '../redux/hudSlice';
import { computeSnap, DEFAULT_SNAP_THRESHOLD_VMIN, gatherSnapTargets } from '../helpers/hudSnapHelpers';
import { AddDispatch, AppDispatch, RootState } from '../redux/store';
import Draggable from './Draggable';
import DraggableHandle, { DropHandlerDraggableData } from './DraggableHandle';
import HUDForceScaler from './HUDForceScaler';
import HUDAnchorChain from './HUDAnchorChain';
import { CSETransition } from '../../shared/components/CSETransition';
import { Menu } from './menu/Menu';
import { LoadingTopic } from '../redux/loadingSlice';
import { Button } from './Button';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import {
  HUDHorizontalAnchor,
  HUDVerticalAnchor,
  HUDWidgetState
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import AnchorTopLeftURL from '../../images/hudeditor/anchor-selected-topleft.png';
import AnchorTopURL from '../../images/hudeditor/anchor-selected-top.png';
import AnchorTopRightURL from '../../images/hudeditor/anchor-selected-topright.png';
import AnchorLeftURL from '../../images/hudeditor/anchor-selected-left.png';
import AnchorCenterURL from '../../images/hudeditor/anchor-selected-center.png';
import AnchorRightURL from '../../images/hudeditor/anchor-selected-right.png';
import AnchorBottomLeftURL from '../../images/hudeditor/anchor-selected-bottomleft.png';
import AnchorBottomURL from '../../images/hudeditor/anchor-selected-bottom.png';
import AnchorBottomRightURL from '../../images/hudeditor/anchor-selected-bottomright.png';
import { SimpleRect, simpleRectFromDOMRect } from '../redux/dragAndDropSlice';

// Styles
const Root = 'HUD-BaseWidget-Root';
const Container = 'HUD-BaseWidget-Container';
const InitFailed = 'HUD-BaseWidget-InitFailed';
const InitFailedContainer = 'HUD-BaseWidget-InitFailedContainer';
const InitFailedLoader = 'HUD-BaseWidget-InitFailedLoader';
const InitFailedMessage = 'HUD-BaseWidget-InitFailedMessage';
const Errored = 'HUD-BaseWidget-Errored';
const ErroredContainer = 'HUD-BaseWidget-ErroredContainer';
const ErroredMessage = 'HUD-BaseWidget-ErroredMessage';
const OverlayRoot = 'HUD-BaseWidget-Overlay-Root';
const SelectableOverlay = 'HUD-BaseWidget-Overlay-Selectable';
const AnchorHandleTopLeft = 'HUD-BaseWidget-Overlay-AnchorHandle TopLeft';
const AnchorHandleTop = 'HUD-BaseWidget-Overlay-AnchorHandle Top';
const AnchorHandleTopRight = 'HUD-BaseWidget-Overlay-AnchorHandle TopRight';
const AnchorHandleLeft = 'HUD-BaseWidget-Overlay-AnchorHandle Left';
const AnchorHandleCenter = 'HUD-BaseWidget-Overlay-AnchorHandle Center';
const AnchorHandleRight = 'HUD-BaseWidget-Overlay-AnchorHandle Right';
const AnchorHandleBottomLeft = 'HUD-BaseWidget-Overlay-AnchorHandle BottomLeft';
const AnchorHandleBottom = 'HUD-BaseWidget-Overlay-AnchorHandle Bottom';
const AnchorHandleBottomRight = 'HUD-BaseWidget-Overlay-AnchorHandle BottomRight';

interface ReactProps {
  widgetID: string;
}

interface InjectedProps {
  selectedWidgetID: string;
  selectedGroupMemberIDs: string[];
  snapEnabled: boolean;
  isEditingHUD: boolean;
  widgets: Dictionary<HUDWidget>;
  showMockData: boolean;
  exitingConditionalWidgetIDs: string[];
  uninitializedTopics: LoadingTopic[];
  vminPx: number;
  activeConditionalWidgetIDs: string[];
  uiScale: number;
  dispatch?: AppDispatch;
  // Even though we don't directly use these, having them here means that
  // we get a 'componentDidUpdate' call whenever the window is resized.
  hudWidth: number;
  hudHeight: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

type State = {
  error: Error | null;
  key: string;
};

class BaseHUDWidget extends React.Component<Props, State> {
  private ref: HTMLDivElement;
  // Captured at drag start for alignment snapping: this widget's pre-drag bounds and the other
  // widgets' bounds to snap against (they don't move during the drag).
  private dragStartBounds: SimpleRect | null = null;
  private snapTargets: SimpleRect[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      key: genID()
    };
  }
  public render(): React.ReactNode {
    const widget = this.props.widgets[this.props.widgetID];
    const show = !this.props.exitingConditionalWidgetIDs.includes(this.props.widgetID);
    return (
      <CSETransition
        id={`Widget_${widget.registration.id}`}
        show={show}
        onExitComplete={() => {
          if (widget.registration.isConditional) {
            this.props.dispatch?.(removeConditionalWidgetExiting(this.props.widgetID));
            this.props.dispatch?.(hideConditionalWidget(this.props.widgetID));
          }
        }}
        key={this.state.key}
      >
        <div
          id={widget.registration.id}
          ref={(r) => {
            this.ref = r as HTMLDivElement;
            this.reportBounds();
          }}
          className={Root}
          style={this.buildStyle()}
          onMouseDown={this.onMouseInteraction.bind(this)}
          onMouseUp={this.onMouseInteraction.bind(this)}
        >
          <Draggable
            className={Container}
            draggableID={widget.registration.id}
            draggingRender={() => this.renderContent(true)}
          >
            {this.renderContent(false)}
          </Draggable>
        </div>
      </CSETransition>
    );
  }

  private onMouseInteraction(): void {
    // When the user interacts with any conditional widget other than the top one,
    // this will bring that widget to the top of the display stack.  If not conditional,
    // or already on top, it does nothing.
    const widget = this.props.widgets[this.props.widgetID];
    if (widget.registration.isConditional) {
      this.props.dispatch?.(showConditionalWidget(this.props.widgetID));
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  public componentDidCatch(error: Error): void {
    console.error(`Rendering error thrown in "${this.props.widgetID}" widget: "${error.message}"`);
    Sentry.captureException(error);
  }

  private renderContent(isDragCopy: boolean): JSX.Element {
    const widget = this.props.widgets[this.props.widgetID];
    if (this.state.error) {
      return (
        <div className={Errored}>
          <Menu
            isDragCopy={isDragCopy}
            title={this.props.widgetID}
            menuID={`HUDWidgetFailedInit.${this.props.widgetID}`}
            closeSelf={
              widget.registration.isConditional
                ? () => {
                    this.props.dispatch(addConditionalWidgetExiting(this.props.widgetID));
                  }
                : undefined
            }
            escapable={widget.registration.isConditional}
            hideCloseButton={widget.registration.isConditional}
          >
            <div className={ErroredContainer}>
              <span className={ErroredMessage}>The {this.props.widgetID} widget crashed because of an error.</span>
              <Button
                onClick={() => {
                  this.setState({ key: genID(), error: null });
                }}
              >
                {'Reload'}
              </Button>
            </div>
          </Menu>
        </div>
      );
    }
    if (!widget.state.initialized) {
      return (
        <div className={InitFailed}>
          <Menu
            isDragCopy={isDragCopy}
            title={this.props.widgetID}
            menuID={`HUDWidgetFailedInit.${this.props.widgetID}`}
            closeSelf={() => {
              this.props.dispatch(addConditionalWidgetExiting(this.props.widgetID));
            }}
            escapable={widget.registration.isConditional}
            hideCloseButton={widget.registration.isConditional}
          >
            <div className={InitFailedContainer}>
              <div className={InitFailedLoader} />
              <span className={InitFailedMessage}>
                {'Some requests failed during initialization.'}
                <br />
                {'Attempting to refetch...'}
              </span>
            </div>
          </Menu>
        </div>
      );
    }
    return isDragCopy ? (
      <>
        <HUDForceScaler widgetID={widget.registration.id}>{widget.registration.render?.(isDragCopy)}</HUDForceScaler>
        {this.renderOverlay(isDragCopy)}
      </>
    ) : (
      <>
        {widget.registration.render?.(isDragCopy)}
        {this.renderOverlay(isDragCopy)}
      </>
    );
  }

  private renderOverlay(isDragCopy: boolean): JSX.Element {
    const isSelected = this.props.selectedWidgetID === this.props.widgetID;
    const isEditableGroupMember =
      this.props.isEditingHUD && this.props.selectedGroupMemberIDs.includes(this.props.widgetID);

    if (isSelected || isEditableGroupMember) {
      return this.renderDraggableOverlay(isDragCopy);
    }
    // Non-selected widgets get a click overlay to select them. Drag requires being selected first.
    if (this.props.isEditingHUD) {
      return <div className={SelectableOverlay} onClick={this.onSelectWidget.bind(this)} />;
    }
    return null;
  }

  private renderDraggableOverlay(isDragCopy: boolean): JSX.Element {
    const widget = this.props.widgets[this.props.widgetID];
    const isSelected = this.props.selectedWidgetID === this.props.widgetID;
    const overlayClassName = isSelected ? OverlayRoot : `${OverlayRoot} groupMember`;
    return (
      <DraggableHandle
        className={overlayClassName}
        draggableID={widget.registration.id}
        // Grabbing a widget in the HUD selects it, so its border updates to the "selected" color.
        onMouseDown={this.onSelectWidget.bind(this)}
        dragStartHandler={this.onWidgetDragStart.bind(this)}
        snapDelta={this.snapWidgetDelta.bind(this)}
        dropHandler={handleHUDWidgetDragEnded.bind(
          this,
          this.props.widgetID,
          this.props.widgets,
          this.props.vminPx,
          this.props.dispatch
        )}
      >
        {isDragCopy && <HUDAnchorChain />}
        {this.renderAnchorHandle()}
      </DraggableHandle>
    );
  }

  // Capture the data needed for alignment snapping once, when the drag begins.
  private onWidgetDragStart(): void {
    this.dragStartBounds = this.ref ? simpleRectFromDOMRect(this.ref.getBoundingClientRect()) : null;
    const widgetIDs = Object.keys(this.props.widgets).filter((id) => this.props.widgets[id].registration);
    this.snapTargets = gatherSnapTargets(widgetIDs, this.props.widgetID);
  }

  // Snap the raw drag delta to nearby widget/HUD edges so widgets align with one another.
  private snapWidgetDelta(rawDelta: [number, number]): [number, number] {
    if (!this.props.snapEnabled || !this.dragStartBounds) {
      return rawDelta;
    }
    const thresholdPx = this.props.vminPx * DEFAULT_SNAP_THRESHOLD_VMIN;
    return computeSnap(
      this.dragStartBounds,
      rawDelta,
      this.snapTargets,
      this.props.hudWidth,
      this.props.hudHeight,
      thresholdPx
    );
  }

  private onSelectWidget(e: React.MouseEvent): void {
    // Stop the click from reaching the widget's own content (e.g. ability buttons) while editing.
    e.stopPropagation();
    this.props.dispatch(setSelectedWidget(this.props.widgetID));
  }

  private renderAnchorHandle(): React.ReactNode {
    const widget = this.props.widgets[this.props.widgetID];
    const t = widget.state.yAnchor === HUDVerticalAnchor.Top;
    const m = widget.state.yAnchor === HUDVerticalAnchor.Center;
    const b = widget.state.yAnchor === HUDVerticalAnchor.Bottom;
    const l = widget.state.xAnchor === HUDHorizontalAnchor.Left;
    const c = widget.state.xAnchor === HUDHorizontalAnchor.Center;
    const r = widget.state.xAnchor === HUDHorizontalAnchor.Right;

    if (t && l) {
      return <img src={AnchorTopLeftURL} className={AnchorHandleTopLeft} />;
    } else if (t && c) {
      return <img src={AnchorTopURL} className={AnchorHandleTop} />;
    } else if (t && r) {
      return <img src={AnchorTopRightURL} className={AnchorHandleTopRight} />;
    } else if (m && l) {
      return <img src={AnchorLeftURL} className={AnchorHandleLeft} />;
    } else if (m && c) {
      return <img src={AnchorCenterURL} className={AnchorHandleCenter} />;
    } else if (m && r) {
      return <img src={AnchorRightURL} className={AnchorHandleRight} />;
    } else if (b && l) {
      return <img src={AnchorBottomLeftURL} className={AnchorHandleBottomLeft} />;
    } else if (b && c) {
      return <img src={AnchorBottomURL} className={AnchorHandleBottom} />;
    } else if (b && r) {
      return <img src={AnchorBottomRightURL} className={AnchorHandleBottomRight} />;
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    this.reportBounds();
  }

  private reportBounds(): void {
    // Reporting bounds allows the HUDEditor to recalculate offsets when changing anchors.
    if (this.ref && this.props.selectedWidgetID === this.props.widgetID) {
      const bounds = simpleRectFromDOMRect(this.ref.getBoundingClientRect());
      this.props.dispatch(setSelectedWidgetBounds(bounds));
    }
  }

  private getWidgetDisplayState(): HUDWidgetState {
    const rawState = this.props.widgets[this.props.widgetID].state;
    let state: HUDWidgetState = { ...rawState, resizable: { ...rawState.resizable } };

    if (rawState.resizable?.isMaximized) {
      const MAXIMIZED_INSET_VMIN = 2.5;
      const MAXIMIZED_TOP_INSET_VMIN = 5.5;

      const hudWidthVmin = this.props.hudWidth / this.props.vminPx;
      const hudHeightVmin = this.props.hudHeight / this.props.vminPx; // Usually 100, but just in case.

      switch (state.xAnchor) {
        case HUDHorizontalAnchor.Right:
        case HUDHorizontalAnchor.Left: {
          state.xOffset = MAXIMIZED_INSET_VMIN;
          break;
        }
        case HUDHorizontalAnchor.Center: {
          state.xOffset = 0;
          break;
        }
      }
      state.resizable.widthVmin = hudWidthVmin - 2 * MAXIMIZED_INSET_VMIN;

      switch (state.yAnchor) {
        case HUDVerticalAnchor.Top: {
          state.yOffset = MAXIMIZED_TOP_INSET_VMIN;
          break;
        }
        case HUDVerticalAnchor.Bottom: {
          state.yOffset = MAXIMIZED_INSET_VMIN;
          break;
        }
        case HUDVerticalAnchor.Center: {
          state.yOffset = (MAXIMIZED_TOP_INSET_VMIN - MAXIMIZED_INSET_VMIN) / 2;
          break;
        }
      }
      state.resizable.heightVmin = hudHeightVmin - MAXIMIZED_INSET_VMIN - MAXIMIZED_TOP_INSET_VMIN;
    }

    return state;
  }

  private buildStyle(): React.CSSProperties {
    const widgetState = this.getWidgetDisplayState();
    const style: React.CSSProperties = {
      opacity: widgetState.opacity ?? 1
    };
    let transform: string = '';
    let origin: string = '';

    switch (widgetState.xAnchor ?? HUDHorizontalAnchor.Left) {
      case HUDHorizontalAnchor.Left: {
        style.left = `${widgetState.xOffset ?? 0}vmin`;
        origin = 'left';
        break;
      }
      case HUDHorizontalAnchor.Center: {
        style.left = `calc(50% + ${widgetState.xOffset ?? 0}vmin)`;
        transform += ' translateX(-50%)';
        origin = 'center';
        break;
      }
      case HUDHorizontalAnchor.Right: {
        style.right = `${widgetState.xOffset ?? 0}vmin`;
        origin = 'right';
        break;
      }
    }

    switch (widgetState.yAnchor ?? HUDVerticalAnchor.Top) {
      case HUDVerticalAnchor.Top: {
        style.top = `${widgetState.yOffset ?? 0}vmin`;
        origin = 'top ' + origin;
        break;
      }
      case HUDVerticalAnchor.Center: {
        style.top = `calc(50% + ${widgetState.yOffset ?? 0}vmin)`;
        transform += ' translateY(-50%)';
        origin = 'center ' + origin;
        break;
      }
      case HUDVerticalAnchor.Bottom: {
        style.bottom = `${widgetState.yOffset ?? 0}vmin`;
        origin = 'bottom ' + origin;
        break;
      }
    }

    const effectiveScale = (widgetState.scale ?? 1) * this.props.uiScale;
    transform += `scale(${effectiveScale},${effectiveScale})`;

    style.transform = transform;
    style.transformOrigin = origin;

    // If this widget was registered as resizable, we set the width and height explicitly.
    // Otherwise the widget's content is responsible for determining its own size.
    if (widgetState.resizable) {
      style.width = `${widgetState.resizable.widthVmin}vmin`;
      style.height = `${widgetState.resizable.heightVmin}vmin`;
    }

    return style;
  }
}

/** If set, this is a cached copy of the original widget state when the resize event began. */
let resizingWidget: HUDWidget;
export function handleHUDWidgetResizeEvent(
  widget: HUDWidget,
  isFinal: boolean,
  vminPx: number,
  dispatch: AppDispatch,
  dt: number,
  dr: number,
  db: number,
  dl: number
): void {
  // Is this the start of a resize drag?
  if (!isFinal && !resizingWidget) {
    // If so, stash a copy of the pre-resize widget data.  This comes from Redux, so it won't be altered out from under us,
    // though each subsequent resize event will provide an updated copy of widget.state.
    resizingWidget = widget;
  }

  // Clone the old state so we don't stomp on it.
  const newWidgetState: HUDWidgetState = {
    ...(resizingWidget.state ?? {}),
    resizable: { ...resizingWidget.state.resizable }
  };

  // We will append the delta, since the old values were the deltas that got it to its current position.
  // Keep in mind that the DIRECTION of a delta is different for certain anchors!
  let dtVmin = dt / vminPx;
  let drVmin = dr / vminPx;
  let dbVmin = db / vminPx;
  let dlVmin = dl / vminPx;

  // Apply any deltas.
  switch (newWidgetState.xAnchor) {
    case HUDHorizontalAnchor.Right: {
      // Clamp DR to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.widthVmin + drVmin < newWidgetState.resizable.minWidthVmin) {
        drVmin = resizingWidget.state.resizable.minWidthVmin - resizingWidget.state.resizable.widthVmin;
      }
      // Clamp DL to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.widthVmin - dlVmin < newWidgetState.resizable.minWidthVmin) {
        dlVmin = resizingWidget.state.resizable.widthVmin - resizingWidget.state.resizable.minWidthVmin;
      }

      // Dragging on a right corner or edge with a right anchor alters the horizontal position offset.
      newWidgetState.xOffset -= drVmin;
      // Either edge alters the size, of course.
      newWidgetState.resizable.widthVmin = Math.max(
        newWidgetState.resizable.minWidthVmin,
        newWidgetState.resizable.widthVmin + drVmin - dlVmin
      );
      break;
    }
    case HUDHorizontalAnchor.Left: {
      // Clamp DR to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.widthVmin + drVmin < newWidgetState.resizable.minWidthVmin) {
        drVmin = resizingWidget.state.resizable.minWidthVmin - resizingWidget.state.resizable.widthVmin;
      }
      // Clamp DL to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.widthVmin - dlVmin < newWidgetState.resizable.minWidthVmin) {
        dlVmin = resizingWidget.state.resizable.widthVmin - resizingWidget.state.resizable.minWidthVmin;
      }

      // Dragging on a left corner or edge with a left anchor alters the horizontal position offset.
      newWidgetState.xOffset += dlVmin;
      // Either edge alters the size, of course.
      newWidgetState.resizable.widthVmin = Math.max(
        newWidgetState.resizable.minWidthVmin,
        newWidgetState.resizable.widthVmin + drVmin - dlVmin
      );
      break;
    }
    case HUDHorizontalAnchor.Center: {
      // Clamp DR to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.widthVmin + drVmin < newWidgetState.resizable.minWidthVmin) {
        drVmin = resizingWidget.state.resizable.minWidthVmin - resizingWidget.state.resizable.widthVmin;
      }
      // Clamp DL to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.widthVmin - dlVmin < newWidgetState.resizable.minWidthVmin) {
        dlVmin = resizingWidget.state.resizable.widthVmin - resizingWidget.state.resizable.minWidthVmin;
      }

      // For a center anchor, any horizontal drag alters the horizontal position offset, but the center only moves
      // half as much as the edge.
      newWidgetState.xOffset += dlVmin / 2;
      newWidgetState.xOffset += drVmin / 2;

      newWidgetState.resizable.widthVmin += drVmin;
      newWidgetState.resizable.widthVmin -= dlVmin;

      break;
    }
  }

  switch (newWidgetState.yAnchor) {
    case HUDVerticalAnchor.Bottom: {
      // Clamp DB to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.heightVmin + dbVmin < newWidgetState.resizable.minHeightVmin) {
        dbVmin = resizingWidget.state.resizable.minHeightVmin - resizingWidget.state.resizable.heightVmin;
      }
      // Clamp DT to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.heightVmin - dtVmin < newWidgetState.resizable.minHeightVmin) {
        dtVmin = resizingWidget.state.resizable.heightVmin - resizingWidget.state.resizable.minHeightVmin;
      }

      // Dragging on a bottom corner or edge with a bottom anchor alters the vertical position offset.
      newWidgetState.yOffset -= dbVmin;
      // Either edge alters the size, of course.
      newWidgetState.resizable.heightVmin = Math.max(
        newWidgetState.resizable.minHeightVmin,
        newWidgetState.resizable.heightVmin - dtVmin + dbVmin
      );
      break;
    }
    case HUDVerticalAnchor.Top: {
      // Clamp DB to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.heightVmin + dbVmin < newWidgetState.resizable.minHeightVmin) {
        dbVmin = resizingWidget.state.resizable.minHeightVmin - resizingWidget.state.resizable.heightVmin;
      }
      // Clamp DT to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.heightVmin - dtVmin < newWidgetState.resizable.minHeightVmin) {
        dtVmin = resizingWidget.state.resizable.heightVmin - resizingWidget.state.resizable.minHeightVmin;
      }

      // Dragging on a top corner or edge with a top anchor alters the vertical position offset.
      newWidgetState.yOffset += dtVmin;
      // Either edge alters the size, of course.
      newWidgetState.resizable.heightVmin = Math.max(
        newWidgetState.resizable.minHeightVmin,
        newWidgetState.resizable.heightVmin - dtVmin + dbVmin
      );
      break;
    }
    case HUDVerticalAnchor.Center: {
      // Clamp DB to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.heightVmin + dbVmin < newWidgetState.resizable.minHeightVmin) {
        dbVmin = resizingWidget.state.resizable.minHeightVmin - resizingWidget.state.resizable.heightVmin;
      }
      // Clamp DT to ensure it doesn't make the widget too small.
      if (resizingWidget.state.resizable.heightVmin - dtVmin < newWidgetState.resizable.minHeightVmin) {
        dtVmin = resizingWidget.state.resizable.heightVmin - resizingWidget.state.resizable.minHeightVmin;
      }

      // For a center anchor, any vertical drag alters the vertical position offset, but the center only moves
      // half as much as the edge.
      newWidgetState.yOffset += dbVmin / 2;
      newWidgetState.yOffset += dtVmin / 2;

      newWidgetState.resizable.heightVmin += dbVmin;
      newWidgetState.resizable.heightVmin -= dtVmin;

      break;
    }
  }

  // This updates the current-session state of the widget.
  dispatch(updateWidgetStates({ [widget.registration.id]: newWidgetState }));

  if (isFinal) {
    // This updates the cross-session persistent state for the widgets.  We only do this
    // on the finalized resize to reduce network spam.
    clientAPI.updateWidgetState(widget.registration.id, newWidgetState);
    resizingWidget = null;
  }
}

export function handleHUDWidgetDragEnded(
  // These fields need to be passed in from Redux when this function is bound.
  widgetID: string,
  widgets: Record<string, HUDWidget>,
  vminPx: number,
  dispatch: AppDispatch,
  // These fields are passed in by the eventual caller.
  _data: unknown,
  { dragDelta }: DropHandlerDraggableData
): void {
  // Save the widget's overridden location.
  // We want it in vmin to reduce the chance of getting lost offscreen.
  const newWidgetState: HUDWidgetState = { ...widgets[widgetID].state };
  // Append the delta, since the old value was the delta that got it to its current position.
  let xDelta = dragDelta[0] / vminPx;
  let yDelta = dragDelta[1] / vminPx;
  // Keep in mind that the DIRECTION of a delta is different for certain anchors!
  if (newWidgetState.xAnchor === HUDHorizontalAnchor.Right) {
    xDelta *= -1;
  }
  if (newWidgetState.yAnchor === HUDVerticalAnchor.Bottom) {
    yDelta *= -1;
  }

  newWidgetState.xOffset += xDelta;
  newWidgetState.yOffset += yDelta;

  clientAPI.updateWidgetState(widgetID, newWidgetState);
  dispatch(updateWidgetStates({ [widgetID]: newWidgetState }));
}

export function toggleMaximizeWidget(
  widgetID: string,
  widgets: Record<string, HUDWidget>,
  dispatch: AppDispatch
): void {
  const newWidgetState: HUDWidgetState = {
    ...widgets[widgetID].state,
    resizable: { ...widgets[widgetID].state.resizable, isMaximized: !widgets[widgetID].state.resizable.isMaximized }
  };

  clientAPI.updateWidgetState(widgetID, newWidgetState);
  dispatch(updateWidgetStates({ [widgetID]: newWidgetState }));
}

function mapStateToProps(state: RootState, ownProps: ReactProps): ReactProps & InjectedProps {
  const {
    activeConditionalWidgetIDs,
    exitingConditionalWidgetIDs,
    hudWidth,
    hudHeight,
    showMockData,
    widgets,
    vminPx,
    uiScale,
    isEditingHUD
  } = state.hud;
  const { selectedWidgetID, selectedGroupMemberIDs, snapEnabled } = state.hud.editor;
  const { uninitializedTopics } = state.loading;
  return {
    ...ownProps,
    hudWidth,
    hudHeight,
    selectedWidgetID,
    selectedGroupMemberIDs,
    snapEnabled,
    isEditingHUD,
    showMockData,
    widgets,
    exitingConditionalWidgetIDs,
    uninitializedTopics,
    vminPx,
    activeConditionalWidgetIDs,
    uiScale
  };
}

export default connect(mapStateToProps)(BaseHUDWidget);
