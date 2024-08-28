/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDLayer,
  HUDWidget,
  addMenuWidgetExiting,
  hideMenuWidget,
  removeMenuWidgetExiting,
  setSelectedWidgetBounds,
  updateWidgetStates
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import Draggable from './Draggable';
import DraggableHandle, { DropHandlerDraggableData } from './DraggableHandle';
import HUDForceScaler from './HUDForceScaler';
import HUDAnchorChain from './HUDAnchorChain';
import { CSETransition } from '../../shared/components/CSETransition';
import { Menu } from './menu/Menu';
import { InitTopic } from '../redux/initializationSlice';
import { reportException } from '@csegames/library/dist/_baseGame/types/ErrorBoundary';
import { Button } from './Button';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

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
import {
  HUDHorizontalAnchor,
  HUDVerticalAnchor,
  HUDWidgetState
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

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
  widgets: Dictionary<HUDWidget>;
  showMockData: boolean;
  exitingWidgetIds: string[];
  uninitializedTopics: InitTopic[];
  dispatch?: Dispatch;
  // Even though we don't directly use these, having them here means that
  // we get a 'componentDidUpdate' call whenever the window is resized.
  hudWidth: number;
  hudHeight: number;
}

type Props = ReactProps & InjectedProps;

type State = {
  error: Error | null;
  key: string;
};

class BaseHUDWidget extends React.Component<Props, State> {
  private ref: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      key: genID()
    };
  }
  public render(): React.ReactNode {
    const widget = this.props.widgets[this.props.widgetID];
    const show = !this.props.exitingWidgetIds.includes(this.props.widgetID);
    return (
      <CSETransition
        show={show}
        onExitComplete={() => {
          if (widget.registration.layer === HUDLayer.Menus) {
            this.props.dispatch?.(removeMenuWidgetExiting(this.props.widgetID));
            this.props.dispatch?.(hideMenuWidget(this.props.widgetID));
          }
        }}
        key={this.state.key}
      >
        <div
          id={widget.registration.name}
          ref={(r) => {
            this.ref = r as HTMLDivElement;
            this.reportBounds();
          }}
          className={Root}
          style={this.buildStyle()}
        >
          <Draggable className={Container} draggableID={widget.registration.name}>
            {this.renderContent(false)}
          </Draggable>
        </div>
      </CSETransition>
    );
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  public componentDidCatch(error: Error): void {
    console.error(`Rendering error thrown in "${this.props.widgetID}" widget: "${error.message}"`);
    reportException(error);
  }

  private renderContent(isDragCopy: boolean): JSX.Element {
    const widget = this.props.widgets[this.props.widgetID];
    if (this.state.error) {
      return (
        <div className={Errored}>
          <Menu
            title={this.props.widgetID}
            menuID={`HUDWidgetFailedInit.${this.props.widgetID}`}
            closeSelf={
              widget.registration.layer === HUDLayer.Menus
                ? () => {
                    this.props.dispatch(addMenuWidgetExiting(this.props.widgetID));
                  }
                : undefined
            }
            escapable={widget.registration.layer === HUDLayer.Menus}
            hideCloseButton={widget.registration.layer !== HUDLayer.Menus}
          >
            <div className={ErroredContainer}>
              <span className={ErroredMessage}>The {this.props.widgetID} widget crashed because of an error.</span>
              <Button
                onClick={() => {
                  this.setState({ key: genID(), error: null });
                }}
              >
                Reload
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
            title={this.props.widgetID}
            menuID={`HUDWidgetFailedInit.${this.props.widgetID}`}
            closeSelf={() => {
              this.props.dispatch(addMenuWidgetExiting(this.props.widgetID));
            }}
            escapable={widget.registration.layer === HUDLayer.Menus}
            hideCloseButton={widget.registration.layer !== HUDLayer.Menus}
          >
            <div className={InitFailedContainer}>
              <div className={InitFailedLoader} />
              <span className={InitFailedMessage}>
                Some requests failed during initialization.
                <br />
                Attempting to refetch...
              </span>
            </div>
          </Menu>
        </div>
      );
    }
    return isDragCopy ? (
      <>
        <HUDForceScaler>{widget.registration.render?.()}</HUDForceScaler>
        {this.renderOverlay(isDragCopy)}
      </>
    ) : (
      <>
        {widget.registration.render?.()}
        {this.renderOverlay(isDragCopy)}
      </>
    );
  }

  private renderOverlay(isDragCopy: boolean): JSX.Element {
    if (this.props.selectedWidgetID === this.props.widgetID) {
      const widget = this.props.widgets[this.props.widgetID];
      return (
        <DraggableHandle
          className={OverlayRoot}
          draggableID={widget.registration.name}
          draggingRender={this.renderContent.bind(this, true)}
          dropHandler={this.handleDragEnded.bind(this)}
        >
          {isDragCopy && <HUDAnchorChain />}
          {this.renderAnchorHandle()}
        </DraggableHandle>
      );
    }
    return null;
  }

  private renderAnchorHandle(): JSX.Element {
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
      const bounds = this.ref.getBoundingClientRect();
      this.props.dispatch(setSelectedWidgetBounds(bounds));
    }
  }

  private buildStyle(): React.CSSProperties {
    const widget = this.props.widgets[this.props.widgetID];
    const style: React.CSSProperties = {
      opacity: widget.state.opacity ?? 1
    };
    let transform: string = '';
    let origin: string = '';

    switch (widget.state.xAnchor ?? HUDHorizontalAnchor.Left) {
      case HUDHorizontalAnchor.Left: {
        style.left = `${widget.state.xOffset ?? 0}vmin`;
        origin = 'left';
        break;
      }
      case HUDHorizontalAnchor.Center: {
        style.left = `calc(50% + ${widget.state.xOffset ?? 0}vmin)`;
        transform += ' translateX(-50%)';
        origin = 'center';
        break;
      }
      case HUDHorizontalAnchor.Right: {
        style.right = `${widget.state.xOffset ?? 0}vmin`;
        origin = 'right';
        break;
      }
    }

    switch (widget.state.yAnchor ?? HUDVerticalAnchor.Top) {
      case HUDVerticalAnchor.Top: {
        style.top = `${widget.state.yOffset ?? 0}vmin`;
        origin = 'top ' + origin;
        break;
      }
      case HUDVerticalAnchor.Center: {
        style.top = `calc(50% + ${widget.state.yOffset ?? 0}vmin)`;
        transform += ' translateY(-50%)';
        origin = 'center ' + origin;
        break;
      }
      case HUDVerticalAnchor.Bottom: {
        style.bottom = `${widget.state.yOffset ?? 0}vmin`;
        origin = 'bottom ' + origin;
        break;
      }
    }

    if (widget.state.scale !== undefined) {
      transform += `scale(${widget.state.scale},${widget.state.scale})`;
    }

    style.transform = transform;
    style.transformOrigin = origin;

    return style;
  }

  private handleDragEnded(_data: unknown, { dragDelta }: DropHandlerDraggableData): void {
    // Save the widget's overridden location.
    // We want it in vmin to reduce the chance of getting lost offscreen.
    const pxToVmin = Math.min(this.props.hudHeight, this.props.hudWidth) / 100;
    const newWidgetState: HUDWidgetState = { ...this.props.widgets[this.props.widgetID].state };
    // Append the delta, since the old value was the delta that got it to its current position.
    let xDelta = dragDelta[0] / pxToVmin;
    let yDelta = dragDelta[1] / pxToVmin;
    // Keep in mind that the DIRECTION of a delta is different for certain anchors!
    if (newWidgetState.xAnchor === HUDHorizontalAnchor.Right) {
      xDelta *= -1;
    }
    if (newWidgetState.yAnchor === HUDVerticalAnchor.Bottom) {
      yDelta *= -1;
    }

    newWidgetState.xOffset += xDelta;
    newWidgetState.yOffset += yDelta;

    clientAPI.updateWidgetState(this.props.widgetID, newWidgetState);
    this.props.dispatch(updateWidgetStates({ [this.props.widgetID]: newWidgetState }));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { exitingMenuIds: exitingWidgetIds, hudWidth, hudHeight, showMockData, widgets } = state.hud;
  const { selectedWidgetId: selectedWidgetID } = state.hud.editor;
  const { uninitializedTopics } = state.initialization;
  return {
    ...ownProps,
    hudWidth,
    hudHeight,
    selectedWidgetID,
    showMockData,
    widgets,
    exitingWidgetIds,
    uninitializedTopics
  };
}

export default connect(mapStateToProps)(BaseHUDWidget);
