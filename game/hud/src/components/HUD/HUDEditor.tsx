/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';
import { events } from '@csegames/camelot-unchained';

import {
  setPosition,
  setVisibility,
  Widget,
  resetHUDWidget,
} from '../../services/session/layout';

import {
  HUDEditorContainer,
  HUDEditorTitle,
  HUDEditorList,
  HUDEditorToolbar,
  HUDEditorToolbarTitle,
  HUDEditorToolbarItem,
  HUDEditorTooltip,
} from './style';

enum EditMode {
  NONE,
  MOVE,
  MOVEEDITOR,
  SCALE,
  SCALEHOLD,
  OPACITY,
  OPACITYHOLD,
}

interface EditorPosition {
  x: number;
  y: number;
}

interface HUDWidget<T = any> {
  widget: Widget<T>;
  name: string;
}

export interface Props {
  widgets: HUDWidget[];
  selectedWidget: HUDWidget | null;
  dispatch: (action: any) => void;
  setSelectedWidget: (selectedWidget: HUDWidget) => void;
}

export interface State {
  mode: EditMode;
  editorPosition: EditorPosition;
  minScale: number;
  maxScale: number;
  scaleFactor: number;
}

class HUDEditor extends React.Component<Props, State> {
  private lastPosition = { x: NaN , y: NaN };
  private mouseDownForScaleHold: boolean = false;
  private mouseScaleHoldInitTimeout: NodeJS.Timer = null;
  private mouseDownForOpacityHold: boolean = false;
  private mouseOpacityHoldInitTimeout: NodeJS.Timer = null;
  private tooltipMessage: string = null;
  private tooltipEvent: React.MouseEvent<HTMLElement> = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      mode: EditMode.NONE,
      editorPosition: { x: 35, y: 150 },
      minScale: 0.5,
      maxScale: 3,
      scaleFactor: 0.01,
    };
  }

  public render() {
    const { widgets } = this.props;
    return (
      <HUDEditorContainer
        style={{
          right: `${this.state.editorPosition.x}px`,
          top: `${this.state.editorPosition.y}px`,
        }}>
        <HUDEditorTitle>
          <div className='editorDragHandle' onMouseDown={e => this.onMouseDown(e, EditMode.MOVEEDITOR)}>
            <b>UI Widgets</b>
            <a href='#' onClick={ () => events.fire('hudnav--navigate', 'reset') }>
              <div className='resetHUDButton'><b>Reset All</b></div>
            </a>
          </div>
        </HUDEditorTitle>
        <HUDEditorList className='cse-ui-scroller-thumbonly'>
          <ul>
            { _.sortBy(widgets, 'name').map((widget) => {
              const isVisible = widget.widget.position.visibility;
              const isSelected = this.props.selectedWidget && this.props.selectedWidget.name === widget.name;
              const classes = `HUDWidgetName${ isVisible ? '' : ' hidden' }${ isSelected ? ' selected' : '' }`;
              return (widget.name === 'building' ? null : // building should be removed as HUDDrag item
                <li
                  key={widget.name}
                  onClick={() => {
                    this.props.setSelectedWidget(widget);
                  }}>
                  <div className={ classes }
                    onMouseOver={ isVisible ? null : this.onMouseOverListVisibility }
                    onMouseLeave={ isVisible ? null : this.onMouseLeave }
                  >
                    { widget.name === 'motd' ? 'MOTD' : _.startCase(widget.name) }
                    {/* { !isVisible &&
                      <span>&nbsp;<i
                        className={'fa fa-eye-slash'}
                      ></i></span>
                    } */}
                  </div>
                </li>
              );
            }) }
          </ul>
        </HUDEditorList>
        { !this.props.selectedWidget ? <HUDEditorToolbarTitle>- No Widget Selected -</HUDEditorToolbarTitle> : <div>
          <HUDEditorToolbarTitle>
            <b>- {this.props.selectedWidget.name === 'motd' ? 'MOTD' : _.startCase(this.props.selectedWidget.name)} -</b>
          </HUDEditorToolbarTitle>
          <HUDEditorToolbar>

            { this.props.selectedWidget.widget.dragOptions.lockVisibility ? null :
              <HUDEditorToolbarItem
                  onMouseOver={ this.onMouseOverToggleVisibility }
                  onMouseLeave={ this.onMouseLeave }
              >
                <a href='#'><i
                  className={`fa ${this.props.selectedWidget.widget.position.visibility ? 'fa-eye' : 'fa-eye-slash'}`}
                  onClick={ () => this.setVisibility(
                    this.props.selectedWidget.name,
                    !this.props.selectedWidget.widget.position.visibility,
                  ) }>
                </i></a>
              </HUDEditorToolbarItem>
            }

            { this.props.selectedWidget.widget.dragOptions.lockOpacity ? null :
              <HUDEditorToolbarItem
                onMouseOver={ this.onMouseOverAdjustOpacity }
                onMouseLeave={ this.onMouseLeave }
              >
                <a href='#'>
                  <div className='HUDToolbarDragControl'
                    onMouseDown={e => this.onMouseDown(e, EditMode.OPACITY)}
                    onWheel={(e) => {
                      const deltaY = e.deltaY;
                      setTimeout(() => {
                        this.setOpacity(
                          this.props.selectedWidget.name,
                          this.props.selectedWidget.widget,
                          this.props.selectedWidget.widget.position.opacity + (deltaY < 0 ? 0.01 : -0.01),
                        );
                      });
                    }}>
                    <i className='fa fa-lightbulb-o'></i>
                  </div>
                </a>
                <div className='HUDToolbarScaleControls'>
                  <a href='#'>
                    <div
                      onClick={() => this.setOpacity(
                        this.props.selectedWidget.name,
                        this.props.selectedWidget.widget,
                        this.props.selectedWidget.widget.position.opacity - 0.01,
                      )}
                      onMouseDown={e => this.startOpacityHold(false)}
                    >-</div>
                  </a>
                  <div></div>
                  <a href='#'>
                    <div
                      onClick={() => this.setOpacity(
                        this.props.selectedWidget.name,
                        this.props.selectedWidget.widget,
                        this.props.selectedWidget.widget.position.opacity + 0.01,
                      )}
                      onMouseDown={e => this.startOpacityHold(true)}
                    >+</div>
                  </a>
                </div>
                <div className='HUDToolbarScaleText'>
                  {`${(this.props.selectedWidget.widget.position.opacity * 100).toFixed(0)}%`}
                </div>
              </HUDEditorToolbarItem>
            }

            { this.props.selectedWidget.widget.dragOptions.lockScale ? null :
                <HUDEditorToolbarItem
                  onMouseOver={ this.onMouseOverAdjustScale }
                  onMouseLeave={ this.onMouseLeave }
                >
                  <a href='#'>
                    <div className='HUDToolbarDragControl'
                        onMouseDown={e => this.onMouseDown(e, EditMode.SCALE)}
                        onWheel={(e) => {
                          const deltaY = e.deltaY;
                          setTimeout(() => this.setScale(
                            this.props.selectedWidget.name,
                            this.props.selectedWidget.widget,
                            this.props.selectedWidget.widget.position.scale + (deltaY < 0 ? 0.01 : -0.01)),
                          );
                        }}>
                      <i className='fa fa-search-plus'></i>
                    </div>
                  </a>
                  <div className='HUDToolbarScaleControls'>
                    <a href='#'>
                      <div
                        onClick={() => this.setScale(
                          this.props.selectedWidget.name,
                          this.props.selectedWidget.widget,
                          this.props.selectedWidget.widget.position.scale - this.state.scaleFactor,
                          )}
                        onMouseDown={e => this.startScaleHold(false)}
                      >-</div>
                    </a>
                    <div></div>
                    <a href='#'>
                      <div
                        onClick={() => this.setScale(
                          this.props.selectedWidget.name,
                          this.props.selectedWidget.widget,
                          this.props.selectedWidget.widget.position.scale + this.state.scaleFactor,
                        )}
                        onMouseDown={e => this.startScaleHold(true)}
                      >+</div>
                    </a>
                  </div>
                  <div className='HUDToolbarScaleText'>
                    {`${(this.props.selectedWidget.widget.position.scale * 100).toFixed(0)}%`}
                  </div>
                </HUDEditorToolbarItem>
            }

            <HUDEditorToolbarItem
                onMouseOver={ this.onMouseOverResetWidget }
                onMouseLeave={ this.onMouseLeave }
            >
              <a href='#'>
                <i
                  className='fa fa-retweet'
                  onClick={ () => this.resetWidget(this.props.selectedWidget.name) }
                ></i>
              </a>
            </HUDEditorToolbarItem>

          </HUDEditorToolbar>
        </div> }
      </HUDEditorContainer>
    );
  }

  public componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    this.props.setSelectedWidget(null);
  }

  public componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  private onMouseDown = (e: React.MouseEvent<HTMLDivElement>, mode: EditMode) => {
    // check if we can do this or not...

    // for now we always allow it
    this.setMode(mode);
    e.preventDefault();
    e.stopPropagation();
    this.lastPosition = { x: e.screenX , y: e.screenY };
  }

  private onMouseUp = () => {
    this.lastPosition = { x: NaN , y: NaN };
    this.mouseDownForScaleHold = false;
    if (this.mouseScaleHoldInitTimeout != null) {
      clearTimeout(this.mouseScaleHoldInitTimeout);
    }
    this.mouseDownForOpacityHold = false;
    if (this.mouseOpacityHoldInitTimeout != null) {
      clearTimeout(this.mouseOpacityHoldInitTimeout);
    }
    if (this.state.mode !== EditMode.NONE) this.setMode(EditMode.NONE);
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
    const name = this.props.selectedWidget ? this.props.selectedWidget.name : null;
    const widget = this.props.selectedWidget ? this.props.selectedWidget.widget : null;
    const mouseMove = this.mouseMovement(e);
    switch (this.state.mode) {
      default: return;
      case EditMode.NONE: return;
      case EditMode.SCALE:
        {
          this.setScale(
            name,
            widget,
            this.props.selectedWidget.widget.position.scale + (mouseMove.y * this.state.scaleFactor * -1),
          );
        }
        break;
      case EditMode.OPACITY:
        {
          this.setOpacity(name, widget, this.props.selectedWidget.widget.position.opacity + (mouseMove.y * -0.01));
        }
        break;
      case EditMode.MOVEEDITOR:
        {
          this.setState({
            editorPosition: {
              x: this.state.editorPosition.x - mouseMove.x,
              y: this.state.editorPosition.y + mouseMove.y,
            },
          });
        }
        break;
    }
  }

  private setMode = (m: EditMode) => {
    this.setState({
      mode: m,
    });
  }

  private setVisibility = (widgetName: string, vis: boolean) => {
    this.props.dispatch(setVisibility({ name: widgetName, visibility: vis }));
  }

  private resetWidget = (name: string) => {
    this.props.dispatch(resetHUDWidget(name));
  }

  private startScaleHold = (up: boolean) => {
    if (this.mouseDownForScaleHold || this.state.mode !== EditMode.NONE) return;
    this.mouseDownForScaleHold = true;

    this.mouseScaleHoldInitTimeout = setTimeout(() => {
      if (this.mouseDownForScaleHold) {
        this.setMode(EditMode.SCALEHOLD);
      }
      this.runScaleHold(up, true, 1);
    }, 750);
  }

  private runScaleHold = (up: boolean, initial: boolean, speed: number) => {
    if (!initial && this.state.mode !== EditMode.SCALEHOLD) return;

    const s = up ? this.props.selectedWidget.widget.position.scale + this.state.scaleFactor
      : this.props.selectedWidget.widget.position.scale - this.state.scaleFactor;
    this.setScale(this.props.selectedWidget.name, this.props.selectedWidget.widget, s);
    setTimeout(() => this.runScaleHold(up, false, speed - 0.00001), 700 * speed > 0.5 ? speed : 0.5);
  }

  private setScale = (name: string, widget: Widget<any>, s: number) => {
    if (s < this.state.minScale) s = this.state.minScale;
    if (s > this.state.maxScale) s = this.state.maxScale;
    this.props.dispatch(setPosition({
      name,
      widget,
      position: {
        x: { anchor: widget.position.x.anchor, offset: widget.position.x.offset },
        y: { anchor: widget.position.y.anchor, offset: widget.position.y.offset },
        size: { width: widget.position.size.width, height: widget.position.size.height },
        scale: s,
        opacity: widget.position.opacity,
        visibility: widget.position.visibility,
        zOrder: widget.position.zOrder,
        layoutMode: widget.position.layoutMode,
      },
    }));
  }

  private startOpacityHold = (up: boolean) => {
    if (this.mouseDownForOpacityHold || this.state.mode !== EditMode.NONE) return;
    this.mouseDownForOpacityHold = true;

    this.mouseOpacityHoldInitTimeout = setTimeout(() => {
      if (this.mouseDownForOpacityHold) {
        this.setMode(EditMode.OPACITYHOLD);
      }
      this.runOpacityHold(up, true, 1);
    }, 750);
  }

  private runOpacityHold = (up: boolean, initial: boolean, speed: number) => {
    if (!initial && this.state.mode !== EditMode.OPACITYHOLD) return;

    const o = this.props.selectedWidget.widget.position.opacity + (up ? 0.01 : -0.01);
    this.setOpacity(this.props.selectedWidget.name, this.props.selectedWidget.widget, o);
    setTimeout(() => this.runOpacityHold(up, false, speed - 0.00001), 700 * speed > 0.5 ? speed : 0.5);
  }

  private setOpacity = (name: string, widget: Widget<any>, o: number) => {
    if (o < 0.1) o = 0.1;
    if (o > 1) o = 1;
    this.props.dispatch(setPosition({
      name,
      widget,
      position: {
        x: { anchor: widget.position.x.anchor, offset: widget.position.x.offset },
        y: { anchor: widget.position.y.anchor, offset: widget.position.y.offset },
        size: { width: widget.position.size.width, height: widget.position.size.height },
        scale: widget.position.scale,
        opacity: o,
        visibility: widget.position.visibility,
        zOrder: widget.position.zOrder,
        layoutMode: widget.position.layoutMode,
      },
    }));
  }

  private onMouseOverListVisibility = (e: React.MouseEvent<HTMLElement>) => {
    this.tooltipMessage = 'Widget is Hidden';
    this.tooltipEvent = e;
    this.onMouseOver(e);
  }

  private onMouseOverToggleVisibility = (e: React.MouseEvent<HTMLElement>) => {
    this.tooltipMessage = 'Toggle Visibility';
    this.tooltipEvent = e;
    this.onMouseOver(e);
  }

  private onMouseOverAdjustOpacity = (e: React.MouseEvent<HTMLElement>) => {
    this.tooltipMessage = 'Adjust Opacity';
    this.tooltipEvent = e;
    this.onMouseOver(e);
  }

  private onMouseOverAdjustScale = (e: React.MouseEvent<HTMLElement>) => {
    this.tooltipMessage = 'Adjust Scale';
    this.tooltipEvent = e;
    this.onMouseOver(e);
  }

  private onMouseOverResetWidget = (e: React.MouseEvent<HTMLElement>) => {
    this.tooltipMessage = 'Reset Widget';
    this.tooltipEvent = e;
    this.onMouseOver(e);
  }

  private onMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    const showPayload: ShowTooltipPayload = {
      content: this.tooltipMessage,
      styles: { tooltip: HUDEditorTooltip },
      event: this.tooltipEvent,
    };
    showTooltip(showPayload);
  }

  private onMouseLeave = () => {
    this.tooltipMessage = null;
    this.tooltipEvent = null;
    hideTooltip();
  }

}

export default HUDEditor;
