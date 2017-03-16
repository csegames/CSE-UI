/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
let Draggable = require('react-draggable');
import { client, GroupInvite, groupType, hasClientAPI, Tooltip, ql, events } from 'camelot-unchained';
import Chat from 'cu-xmpp-chat';
import { graphql, InjectedGraphQLProps } from 'react-apollo';

import { LayoutState, lockHUD, unlockHUD, setPosition, initialize, resetHUD, setVisibility, Widget } from '../../services/session/layout';
import { SessionState } from '../../services/session/reducer';
import { InvitesState } from '../../services/session/invites';
import HUDDrag, { HUDDragState, HUDDragOptions } from '../HUDDrag';

import InteractiveAlert, { Alert } from '../InteractiveAlert';
import Watermark from '../Watermark';
import Social from '../../widgets/Social';

import { BodyParts } from '../../lib/PlayerStatus';

// TEMP -- Disable this being movable/editable
import HUDNav from '../../services/session/layoutItems/HUDNav';

import Console from '../Console';


export interface HUDProps extends InjectedGraphQLProps<ql.MySocialQuery> {
  dispatch?: (action: any) => void;
  layout?: LayoutState;
  invites?: InvitesState;
}

export interface HUDState {
  activeDrags: number;
  deltaPosition: { x: number, y: number };
  controlledPosition: { x: number, y: number };
  orderName: string;
}

class HUD extends React.Component<HUDProps, HUDState> {
  healthX: number;
  healthY: number;

  constructor(props: HUDProps) {
    super(props);
    this.state = {
      activeDrags: 0,
      deltaPosition: { x: 0, y: 0 },
      controlledPosition: { x: 100, y: 100 },
      orderName: '',
    }
  }

  componentWillReceiveProps(props: HUDProps) {
    if (props.data && props.data.myOrder && props.data.myOrder.name !== this.state.orderName) {
      
        events.fire('chat-leave-room', this.state.orderName);
      
      // we either are just loading up, or we've changed order.
      if (props.data.myOrder.id) {
        // we left our order, leave chat room
        events.fire('chat-show-room', props.data.myOrder.name);
      }
      
      this.setState({
        orderName: props.data.myOrder.name,
      });
    }
  }

  componentDidMount() {
    this.props.dispatch(initialize());

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
    this.setVisibility('welcome', true)
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

  setVisibility = (widgetName: string, vis: boolean) => {
    this.props.dispatch(setVisibility({ name: widgetName, visibility: vis }));
  }

  draggable = (type: string, widget: Widget<any>, Widget: any, options?: HUDDragOptions, widgetProps?: any) => {
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
          widget: widget,
          position: {
            x: { anchor: s.xAnchor, offset: s.x },
            y: { anchor: s.yAnchor, offset: s.y },
            size: { width: s.width, height: s.height },
            scale: s.scale,
            opacity: s.opacity,
            visibility: widget.position.visibility,
            zOrder: widget.position.zOrder,
            layoutMode: widget.position.layoutMode,
          }
        }));
      }}
      render={() => {
        if (this.props.layout.locked && !widget.position.visibility) return null;
        return <Widget setVisibility={(vis: boolean) => this.props.dispatch(setVisibility({ name: type, visibility: vis }))} {...widgetProps} />;
      }}
      {...options} />;
  }

  onToggleClick = (e: any) => {
    if (e.altKey) {
      this.props.dispatch(resetHUD());
      return;
    }
    return this.props.dispatch(this.props.layout.locked ? unlockHUD() : lockHUD());
  }

  render() {

    const widgets = this.props.layout.widgets;
    const locked = this.props.layout.locked;

    let orderedWidgets: JSX.Element[] = [];
    widgets.forEach((widget, key) => {
      orderedWidgets[widget.position.zOrder] = this.draggable(key, widget, widget.component, widget.dragOptions, widget.props);
    });

    return (
      <div className='HUD' style={locked ? {} : { backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        {orderedWidgets.map(c => c)}

        <Console />

        <div style={{ position: 'fixed', left: '2px', top: '2px', width: '900px', height: '200px', pointerEvents: 'none' }}>
          <HUDNav.component {...HUDNav.props} />
        </div>

        <InteractiveAlert dispatch={this.props.dispatch}
          invites={this.props.invites.invites} />
        <Social />
        <Watermark />
      </div>
    );
  }
}



const HUDWithQL = graphql(ql.queries.MySocial)(HUD);
export default connect(s => s)(HUDWithQL);
