/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'react-emotion';
import * as _ from 'lodash';
import { client, events, PlayerState } from '@csegames/camelot-unchained';
import { useConfig } from '@csegames/camelot-unchained/lib/graphql/react';
// import { graphql } from 'react-apollo';
import { ErrorBoundary } from '@csegames/camelot-unchained/lib/components/ErrorBoundary';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';

import DragStore from '../DragAndDrop/DragStore';
import {
  LayoutState,
  setPosition,
  initialize,
  setVisibility,
  Widget,
  resetHUDWidget,
} from '../../services/session/layout';
import { InvitesState, initializeInvites } from '../../services/session/invites';
import { SessionState } from '../../services/session/reducer';
import HUDDrag, { HUDDragState, HUDDragOptions } from '../HUDDrag';
import Watermark from '../Watermark';
import HUDFullScreen from '../../widgets/HUDFullScreen';
import DevUI from '../DevUI';
import SkillBar from '../SkillBar';
import ScenarioPopup from '../ScenarioPopup';
import ScenarioResults from '../ScenarioResults';

import { ZoneName } from '../ZoneName';

// TEMP -- Disable this being movable/editable
import HUDNav from '../../services/session/layoutItems/HUDNav';
import Console from '../Console';
import { InteractiveAlertView } from '../InteractiveAlert';
import { ContextMenu } from '../ContextMenu';
import { Tooltip } from 'UI/Tooltip';
import PassiveAlert from '../PassiveAlert';

useConfig({
  url: `${client.apiHost}/graphql`,
  requestOptions: {
    headers: {
      loginToken: client.loginToken,
      shardID: `${client.shardID}`,
      characterID: client.characterID,
    },
  },
}, {
  url: client.apiHost.replace('http', 'ws') + '/graphql',
  initPayload: {
    shardID: client.shardID,
    loginToken: client.loginToken,
    characterID: client.characterID,
  },
});

enum EditMode {
  NONE,
  MOVE,
  MOVEEDITOR,
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

interface EditorPosition {
  x: number;
  y: number;
}

const HUDNavContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 900px;
  height: 200px;
  pointer-events: none;
  z-index: 999;
`;

const ZoneNameContainer = styled('div')`
  position: fixed;
  top: 50px;
  left: 0;
`;

const SkillBarContainer = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 10px;
  margin: 0 auto;
  pointer-events: none;
`;

const HUDEditorContainer = styled('div')`
  position: fixed;
  width: 200px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  color: white;
  background-color: gray;
  background: url(images/progression/progress-bg-grey.png) no-repeat;
  border: 2px solid #6e6c6c;
  box-shadow: 0 0 30px 0 #000;
  z-index: 942;
`;

const HUDEditorTitle = styled('div')`
  padding-left: 4px;
  div.editorDragHandle {
    cursor: move;
  }
  div.resetHUDButton {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 0.7em;
    color: #91743a;
  }
  a {
    text-decoration: none;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    -webkit-animation: none;
    animation: none;
    &:hover {
      color: white;
      -webkit-animation: glow 1.5s ease-in-out infinite alternate;
      animation: glow 1.5s ease-in-out infinite alternate;
    }
  }
`;

const HUDEditorList = styled('div')`
  padding: 5px 5px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  border-top: 1px solid #3b3634;
  border-bottom: 1px solid #3b3634;
  background: rgba(0, 0, 0, 0.6);
  width: 190px;
  height: calc(100% - 104px);
  position: relative;
  box-shadow: 0 0 30px 0 #000;
  margin-bottom: 4px;
  font-family: 'Caudex', serif;
  font-size: .85em;
  ul {
    li {
      background: #191919;
      margin-bottom: 4px;
      margin-right: 20px;
      -webkit-transition: all 0.5s ease;
      div {
        display: inline-block;
        padding: 5px 10px;
        pointer-events: all;
      }
      div.HUDWidgetName {
        background: #191919;
        color: #93866c;
        width: 100%;
        cursor: pointer;
      }
      div.HUDWidgetNameSelected {
        background: #191919;
        background-color: #91743a;
        color: #fff;
        width: 100%;
      }
      &:hover {
        background: #191919;
        -webkit-transition: all 0.5s ease;
        div.HUDWidgetName {
          background: #93866c;
          color: #fff;
        }
      }
    }
  }
`;

const HUDEditorToolbar = styled('div')`
  display: flex;
  align-items: center;
  margin: 0 auto;
  color: #93866c;
  a {
    color: #93866c !important;
    text-decoration: none;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    -webkit-animation: none;
    animation: none;
    &:hover {
      color: white;
      -webkit-animation: glow 1.5s ease-in-out infinite alternate;
      animation: glow 1.5s ease-in-out infinite alternate;
    }
  }
`;

const HUDEditorToolbarTitle = styled('div')`
  text-align: center;
  font-size: .7em;
  color: #91743a;
`;

const HUDEditorToolbarItem = styled('div')`
  margin: auto;
  width: 55px;
  height: 40px;
  font-size: 1.2em;
  text-align: center;
  i {
    position: relative;
  }
  div.HUDToolbarScaleText {
    position: relative;
    bottom: 0px;
    height: 0px;
    text-align: center;
    color: white;
    font-size: .5em;
    cursor: default !important;
  }
  div.HUDToolbarScaleControls {
    position: relative;
    bottom: 10px;
    left: 0px;
    width: 100%;
    height: 0px;
    div {
      display: inline-block;
      text-align: center;
      width: 33%;
      font-size: 1em;
      cursor: pointer;
    }
  }
  div.HUDToolbarDragControl {
    margin: auto;
    position: relative;
    width: 75%;
    height: 25px;
    top: 0px;
    left: 0px;
    cursor: row-resize !important;
  }
`;

const HUDEditorTooltip = css`
  background-color: #020405;
  color: white;
  border: 1px solid #4A4A4A;
  padding: 2px 5px;
`;

export interface HUDProps {
  dispatch: (action: any) => void;
  layout: LayoutState;
  invites: InvitesState;
  data?: any;
}

export interface HUDState {
  selectedWidget: HUDWidget | null;
  mode: EditMode;
  minScale: number;
  maxScale: number;
  scaleFactor: number;
  editorPosition: EditorPosition;
}

interface HUDWidget {
  widget: Widget<any>;
  name: string;
}

class HUD extends React.Component<HUDProps, HUDState> {
  private lastPosition = { x: NaN , y: NaN };
  private mouseDownForScaleHold: boolean = false;
  private mouseScaleHoldInitTimeout: NodeJS.Timer = null;
  private mouseDownForOpacityHold: boolean = false;
  private mouseOpacityHoldInitTimeout: NodeJS.Timer = null;
  private tooltipMessage: string = null;
  private tooltipEvent: React.MouseEvent<HTMLElement> = null;

  constructor(props: HUDProps) {
    super(props);
    this.state = {
      selectedWidget: null,
      mode: EditMode.NONE,
      minScale: 0.5,
      maxScale: 3,
      scaleFactor: 0.01,
      editorPosition: { x: 2, y: 300 },
    };
  }

  public render() {
    const widgets = this.props.layout.widgets.map((widget, name) => ({ widget, name })).toArray();
    const locked = this.props.layout.locked;
    const renderWidgets = widgets
                    .sort((a, b) => a.widget.position.zOrder - b.widget.position.zOrder)
                    .map((w, idx) =>
                      this.draggable(w.name, w.widget, w.widget.component, w.widget.dragOptions, w.widget.props));

    return (
      <div className='HUD' style={locked ? {} : { backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        {renderWidgets}
        <DragStore />
        <ZoneNameContainer>
          <ZoneName />
        </ZoneNameContainer>
        <Console />

        <HUDNavContainer>
          <HUDNav.component {...HUDNav.props} />
        </HUDNavContainer>

        <InteractiveAlertView />
        <DevUI />
        <ScenarioPopup />

        <ScenarioResults />

        <HUDFullScreen />
        <SkillBarContainer>
          <SkillBar />
        </SkillBarContainer>
        <ContextMenu />
        <Tooltip />
        <PassiveAlert />
        { locked ? null : this.showHUDEditor(widgets) }
        <Watermark />
      </div>
    );
  }

  public componentWillMount() {
    // Always load MOTD
    this.setVisibility('motd', true);
  }

  public componentDidMount() {
    this.props.dispatch(initialize());
    this.props.dispatch(initializeInvites());
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    if (client && client.OnPlayerStateChanged) {

      client.OnPlayerStateChanged((playerState: PlayerState) => {
        const alive = playerState.isAlive;
        const respawn = this.props.layout.widgets.get('respawn');
        if (!alive && respawn && !respawn.position.visibility) {
          this.setVisibility('respawn', true);
        } else if (respawn && respawn.position.visibility) {
          this.setVisibility('respawn', false);
        }
      });
    }
  }

  public componentDidUnMount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  public componentDidUpdate(prevProps: HUDProps) {
    if (this.props.layout.locked !== prevProps.layout.locked) {
      this.setState({
        editorPosition: { x: 2, y: 300 },
        selectedWidget: null,
      });
    }
  }

  public componentWillReceiveProps(props: HUDProps) {
    if (!this.props.data && !props.data) return;
    if (!this.props.data ||
        (props.data && props.data.myOrder && props.data.myOrder.name !==
        (this.props.data && this.props.data.myOrder && this.props.data.myOrder.name))) {

      if (this.props.data && this.props.data.myOrder) events.fire('chat-leave-room', this.props.data.myOrder.name);

      // we either are just loading up, or we've changed order.
      if (props.data.myOrder && props.data.myOrder.id) {
        // we left our order, leave chat room
        events.fire('chat-show-room', props.data.myOrder.name);
      }
    }
  }

  private setVisibility = (widgetName: string, vis: boolean) => {
    this.props.dispatch(setVisibility({ name: widgetName, visibility: vis }));
  }

  private showHUDEditor = (widgets: HUDWidget[]) => {
    return (
      <HUDEditorContainer
        className='cse-ui-scroller-thumbonly'
        style={{
          right: `${this.state.editorPosition.x}px`,
          top: `${this.state.editorPosition.y}px`,
        }}>
        <HUDEditorTitle>
          <div className='editorDragHandle' onMouseDown={e => this.onMouseDown(e, EditMode.MOVEEDITOR)}>
            <b>UI Widgets</b>
          </div>
          <a href='#' onClick={ () => events.fire('hudnav--navigate', 'reset') }>
            <div className='resetHUDButton'><b>Reset All</b></div>
          </a>
        </HUDEditorTitle>
        <HUDEditorList>
          <ul>
            { _.sortBy(widgets, 'name').map((widget) => {
              return (widget.name === 'building' ? null : // building should be removed as HUDDrag item
                <li
                  key={widget.name}
                  onClick={() => this.setState({
                    selectedWidget: widget,
                    minScale: widget.widget.dragOptions.minScale || 0.5,
                    maxScale: widget.widget.dragOptions.maxScale || 3,
                    scaleFactor: widget.widget.dragOptions.scaleFactor || 0.01})}
                  >
                  <div className={
                    this.state.selectedWidget && this.state.selectedWidget.name === widget.name ?
                      'HUDWidgetNameSelected' : 'HUDWidgetName'
                  }>
                    { widget.name === 'motd' ? 'MOTD' : _.startCase(widget.name) }
                  </div>
                </li>
              );
            }) }
          </ul>
        </HUDEditorList>
        { !this.state.selectedWidget ? <HUDEditorToolbarTitle>- No Widget Selected -</HUDEditorToolbarTitle> : <div>
          <HUDEditorToolbarTitle>
            <b>- {this.state.selectedWidget.name === 'motd' ? 'MOTD' : _.startCase(this.state.selectedWidget.name)} -</b>
          </HUDEditorToolbarTitle>
          <HUDEditorToolbar>

            { this.state.selectedWidget.widget.dragOptions.lockVisibility ? null :
              <HUDEditorToolbarItem
                  onMouseOver={ (e: React.MouseEvent<HTMLElement>) => {
                    this.tooltipMessage = 'Toggle Visibility';
                    this.tooltipEvent = e;
                    this.onMouseOver(e);
                  } }
                  onMouseLeave={ this.onMouseLeave }
              >
                <a href='#'><i
                  className={`fa ${this.state.selectedWidget.widget.position.visibility ? 'fa-eye' : 'fa-eye-slash'}`}
                  onClick={ () => this.setVisibility(
                    this.state.selectedWidget.name,
                    !this.state.selectedWidget.widget.position.visibility,
                  ) }>
                </i></a>
              </HUDEditorToolbarItem>
            }

            { this.state.selectedWidget.widget.dragOptions.lockOpacity ? null :
              <HUDEditorToolbarItem
                onMouseOver={ (e: React.MouseEvent<HTMLElement>) => {
                  this.tooltipMessage = 'Adjust Opacity';
                  this.tooltipEvent = e;
                  this.onMouseOver(e);
                } }
                onMouseLeave={ this.onMouseLeave }
              >
                <a href='#'>
                  <div className='HUDToolbarDragControl'
                    onMouseDown={e => this.onMouseDown(e, EditMode.OPACITY)}
                    onWheel={(e) => {
                      const deltaY = e.deltaY;
                      setTimeout(() => {
                        this.setOpacity(
                          this.state.selectedWidget.name,
                          this.state.selectedWidget.widget,
                          this.state.selectedWidget.widget.position.opacity + (deltaY < 0 ? 0.01 : -0.01),
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
                        this.state.selectedWidget.name,
                        this.state.selectedWidget.widget,
                        this.state.selectedWidget.widget.position.opacity - 0.01,
                      )}
                      onMouseDown={e => this.startOpacityHold(false)}
                    >-</div>
                  </a>
                  <div></div>
                  <a href='#'>
                    <div
                      onClick={() => this.setOpacity(
                        this.state.selectedWidget.name,
                        this.state.selectedWidget.widget,
                        this.state.selectedWidget.widget.position.opacity + 0.01,
                      )}
                      onMouseDown={e => this.startOpacityHold(true)}
                    >+</div>
                  </a>
                </div>
                <div className='HUDToolbarScaleText'>
                  {`${(this.state.selectedWidget.widget.position.opacity * 100).toFixed(0)}%`}
                </div>
              </HUDEditorToolbarItem>
            }

            { this.state.selectedWidget.widget.dragOptions.lockScale ? null :
                <HUDEditorToolbarItem
                  onMouseOver={ (e: React.MouseEvent<HTMLElement>) => {
                    this.tooltipMessage = 'Adjust Scale';
                    this.tooltipEvent = e;
                    this.onMouseOver(e);
                  } }
                  onMouseLeave={ this.onMouseLeave }
                >
                  <a href='#'>
                    <div className='HUDToolbarDragControl'
                        onMouseDown={e => this.onMouseDown(e, EditMode.SCALE)}
                        onWheel={(e) => {
                          const deltaY = e.deltaY;
                          setTimeout(() => this.setScale(
                            this.state.selectedWidget.name,
                            this.state.selectedWidget.widget,
                            this.state.selectedWidget.widget.position.scale + (deltaY < 0 ? 0.01 : -0.01)),
                          );
                        }}>
                      <i className='fa fa-search-plus'></i>
                    </div>
                  </a>
                  <div className='HUDToolbarScaleControls'>
                    <a href='#'>
                      <div
                        onClick={() => this.setScale(
                          this.state.selectedWidget.name,
                          this.state.selectedWidget.widget,
                          this.state.selectedWidget.widget.position.scale - this.state.scaleFactor,
                          )}
                        onMouseDown={e => this.startScaleHold(false)}
                      >-</div>
                    </a>
                    <div></div>
                    <a href='#'>
                      <div
                        onClick={() => this.setScale(
                          this.state.selectedWidget.name,
                          this.state.selectedWidget.widget,
                          this.state.selectedWidget.widget.position.scale + this.state.scaleFactor,
                        )}
                        onMouseDown={e => this.startScaleHold(true)}
                      >+</div>
                    </a>
                  </div>
                  <div className='HUDToolbarScaleText'>
                    {`${(this.state.selectedWidget.widget.position.scale * 100).toFixed(0)}%`}
                  </div>
                </HUDEditorToolbarItem>
            }

            <HUDEditorToolbarItem
                onMouseOver={ (e: React.MouseEvent<HTMLElement>) => {
                  this.tooltipMessage = 'Reset Widget';
                  this.tooltipEvent = e;
                  this.onMouseOver(e);
                } }
                onMouseLeave={ this.onMouseLeave }
            >
              <a href='#'>
                <i
                  className='fa fa-retweet'
                  onClick={ () => this.resetWidget(this.state.selectedWidget.name) }
                ></i>
              </a>
            </HUDEditorToolbarItem>

          </HUDEditorToolbar>
        </div> }
      </HUDEditorContainer>
    );
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
    const name = this.state.selectedWidget ? this.state.selectedWidget.name : null;
    const widget = this.state.selectedWidget ? this.state.selectedWidget.widget : null;
    const mouseMove = this.mouseMovement(e);
    switch (this.state.mode) {
      default: return;
      case EditMode.NONE: return;
      case EditMode.SCALE:
        {
          this.setScale(
            name,
            widget,
            this.state.selectedWidget.widget.position.scale + (mouseMove.y * this.state.scaleFactor * -1),
          );
        }
        break;
      case EditMode.OPACITY:
        {
          this.setOpacity(name, widget, this.state.selectedWidget.widget.position.opacity + (mouseMove.y * -0.01));
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
    } as any);
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

    const s = up ? this.state.selectedWidget.widget.position.scale + this.state.scaleFactor
      : this.state.selectedWidget.widget.position.scale - this.state.scaleFactor;
    this.setScale(this.state.selectedWidget.name, this.state.selectedWidget.widget, s);
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

    const o = this.state.selectedWidget.widget.position.opacity + (up ? 0.01 : -0.01);
    this.setOpacity(this.state.selectedWidget.name, this.state.selectedWidget.widget, o);
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

  private draggable = (type: string, widget: Widget<any>, Widget: any, options?: HUDDragOptions, widgetProps?: any) => {
    let props = widgetProps;
    if (typeof props === 'function') {
      props = props();
    }
    return (
      <ErrorBoundary key={widget.position.zOrder}>
        <HUDDrag
          name={type}
          defaultHeight={widget.position.size.height}
          defaultWidth={widget.position.size.width}
          defaultScale={widget.position.scale}
          defaultX={widget.position.x.offset}
          defaultY={widget.position.y.offset}
          defaultXAnchor={widget.position.x.anchor}
          defaultYAnchor={widget.position.y.anchor}
          defaultOpacity={widget.position.opacity}
          defaultMode={widget.position.layoutMode}
          defaultVisible={widget.position.visibility}
          zOrder={widget.position.zOrder}
          gridDivisions={10}
          locked={this.props.layout.locked}
          selected={
            this.state.selectedWidget && this.state.selectedWidget.name === type ? true : false
          }
          save={(s: HUDDragState) => {
            this.props.dispatch(setPosition({
              name: type,
              widget,
              position: {
                x: { anchor: s.xAnchor, offset: s.x },
                y: { anchor: s.yAnchor, offset: s.y },
                size: { width: s.width, height: s.height },
                scale: s.scale,
                opacity: s.opacity,
                visibility: s.visible,
                zOrder: widget.position.zOrder,
                layoutMode: widget.position.layoutMode,
              },
            }));
          }}
          render={() => {
            if (this.props.layout.locked && !widget.position.visibility) return null;
            return <Widget
              setVisibility={(vis: boolean) => this.props.dispatch(setVisibility({ name: type, visibility: vis }))}
              {...props}
            />;
          }}
          {...options}
        />
      </ErrorBoundary>
    );
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

const HUDWithQL: any = HUD; // graphql(ql.queries.MySocial)(HUD);

function select(state: SessionState) {
  return {
    layout: state.layout,
    invites: state.invites,
  };
}

export default connect(select)(HUDWithQL);
