/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { client, events, PlayerState } from '@csegames/camelot-unchained';
import { useConfig } from '@csegames/camelot-unchained/lib/graphql/react';
// import { graphql } from 'react-apollo';
import { ErrorBoundary } from '@csegames/camelot-unchained/lib/components/ErrorBoundary';

import DragStore from '../DragAndDrop/DragStore';
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

export interface HUDProps {
  dispatch: (action: any) => void;
  layout: LayoutState;
  invites: InvitesState;
  data?: any;
}

export interface HUDState {
}

class HUD extends React.Component<HUDProps, HUDState> {
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

        <InteractiveAlertView />

        <DevUI />
        <ScenarioPopup />

        <ScenarioResults />
        <HUDFullScreen />
        <div style={{ position: 'fixed', left: 0, right: 0, margin: '0 auto', bottom: 10, pointerEvents: 'none' }}>
          <SkillBar />
        </div>
        <ContextMenu />
        <Watermark />
      </div>
    );
  }

  public componentDidMount() {
    this.props.dispatch(initialize());
    this.props.dispatch(initializeInvites());

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
}

const HUDWithQL: any = HUD; // graphql(ql.queries.MySocial)(HUD);

function select(state: SessionState) {
  return {
    layout: state.layout,
    invites: state.invites,
  };
}

export default connect(select)(HUDWithQL);
