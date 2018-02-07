/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'react-emotion';
import { client, events } from 'camelot-unchained';
import { useConfig } from 'camelot-unchained/lib/graphql/react';
import DragStore from '../DragAndDrop/DragStore';
// import { graphql } from 'react-apollo';

import {
  LayoutState,
  setPosition,
  initialize,
  setVisibility,
  Widget,
} from '../../services/session/layout';
import { InvitesState, initializeInvites } from '../../services/session/invites';
import { SessionState } from '../../services/session/reducer';
import HUDDrag, { HUDDragState, HUDDragOptions } from '../HUDDrag';

import InteractiveAlert from '../InteractiveAlert';
import Watermark from '../Watermark';
import HUDFullScreen from '../HUDFullScreen';
import DevUI from '../DevUI';
import SkillBar from '../SkillBar';
import ScenarioPopup, { ScenarioPopupType } from '../ScenarioPopup';

import { ZoneName } from '../ZoneName';

// TEMP -- Disable this being movable/editable
import HUDNav from '../../services/session/layoutItems/HUDNav';

import Console from '../Console';

const OverlayContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(rgba(0,0,0,0.2) 55%, transparent);
  pointer-events: none;
  opacity: ${(props: any) => props.opacity};
`;

useConfig({
  url: `${client.apiHost}/graphql`,
  requestOptions: {
    headers: {
      loginToken: client.loginToken,
      shardID: `${client.shardID}`,
      characterID: client.characterID,
    },
  },
});

export interface HUDProps {
  dispatch: (action: any) => void;
  layout: LayoutState;
  invites: InvitesState;
  data?: any;
}

export interface HUDState {
  scenarioWidget: ScenarioPopupType;
}

class HUD extends React.Component<HUDProps, HUDState> {

  constructor(props: HUDProps) {
    super(props);
    this.state = {
      scenarioWidget: ScenarioPopupType.None,
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
        <ZoneName />
        <Console />

        <div style={{ position: 'fixed', left: '2px', top: '2px', width: '900px', height: '200px', pointerEvents: 'none' }}>
          <HUDNav.component {...HUDNav.props} />
        </div>

        <DevUI />

        <OverlayContainer opacity={this.state.scenarioWidget === ScenarioPopupType.None ? 0 : 1}>
          <ScenarioPopup type={this.state.scenarioWidget} />
        </OverlayContainer>

        <InteractiveAlert dispatch={this.props.dispatch}
          invites={this.props.invites.invites} />
        <HUDFullScreen />
        <Watermark />
        <div style={{ position: 'fixed', left: 0, right: 0, margin: '0 auto', bottom: 10 }}>
          <SkillBar />
        </div>
      </div>
    );
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

  public componentDidMount() {
    this.props.dispatch(initialize());
    this.props.dispatch(initializeInvites());

    if (client && client.OnCharacterHealthChanged) {

      client.OnCharacterAliveOrDead((alive: boolean) => {
        const respawn = this.props.layout.widgets.get('respawn');
        if (!alive && respawn && !respawn.position.visibility) {
          this.setVisibility('respawn', true);
        } else if (respawn && respawn.position.visibility) {
          this.setVisibility('respawn', false);
        }
      });
    }

    // manage visibility of welcome widget based on localStorage
    this.setVisibility('welcome', true);
    try {
      const delayInMin: number = 24 * 60;
      const savedDelay = localStorage.getItem('cse-welcome-hide-start');
      const currentDate: Date = new Date();
      const savedDelayDate: Date = new Date(JSON.parse(savedDelay));
      savedDelayDate.setTime(savedDelayDate.getTime() + (delayInMin * 60 * 1000));
      if (currentDate < savedDelayDate) this.setVisibility('welcome', false);
    } catch (error) {
      console.log(error);
    }
  }

  private setVisibility = (widgetName: string, vis: boolean) => {
    this.props.dispatch(setVisibility({ name: widgetName, visibility: vis }));
  }

  private draggable = (type: string, widget: Widget<any>, Widget: any, options?: HUDDragOptions, widgetProps?: any) => {
    let props = widgetProps;
    if (typeof props === 'function') {
      props = props();
    }
    return <HUDDrag name={type}
      key={widget.position.zOrder}
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
      gridDivisions={10}
      locked={this.props.layout.locked}
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
            visibility: widget.position.visibility,
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
      {...options} />;
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
