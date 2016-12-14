/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
let Draggable = require('react-draggable');
import { client, GroupInvite, groupType, hasClientAPI } from 'camelot-unchained';
import Chat from 'cu-xmpp-chat';

import { LayoutState, lockHUD, unlockHUD, setPosition, initialize, resetHUD, setVisibility, Widget, WidgetTypes } from '../../services/session/layout';
import { SessionState } from '../../services/session/reducer';
import { InvitesState } from '../../services/session/invites';
import HUDDrag, { HUDDragState, HUDDragOptions } from '../HUDDrag';

import Compass from '../../widgets/Compass';
import Crafting from '../../widgets/Crafting';
import EnemyTargetHealth from '../../widgets/TargetHealth';
import FriendlyTargetHealth from '../../widgets/FriendlyTargetHealth';
import InteractiveAlert, { Alert } from '../InteractiveAlert';
import PlayerHealth from '../../widgets/PlayerHealth';
import Respawn from '../../components/Respawn';
import Warband from '../../widgets/Warband';
import Welcome from '../../widgets/Welcome';

import { BodyParts } from '../../lib/PlayerStatus';


function select(state: SessionState): HUDProps {
  return {
    layout: state.layout,
    invitesState: state.invites,
  }
}

export interface HUDProps {
  dispatch?: (action: any) => void;
  layout?: LayoutState;
  invitesState?: InvitesState;
}

export interface HUDState {
  activeDrags: number;
  deltaPosition: { x: number, y: number };
  controlledPosition: { x: number, y: number };
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
    }
  }

  componentDidMount() {
    this.props.dispatch(initialize());

    if (client && client.OnCharacterHealthChanged) {

      client.OnCharacterAliveOrDead((alive: boolean) => {
        const respawn = this.props.layout.widgets.get(WidgetTypes[WidgetTypes.RESPAWN]);
        if (!alive && respawn && !respawn.position.visibility) {
          this.setVisibility(WidgetTypes.RESPAWN, true);
        } else if (respawn && respawn.position.visibility) {
          this.setVisibility(WidgetTypes.RESPAWN, false);
        }
      });
    }

    // manage visibility of welcome widget based on localStorage
    this.setVisibility(WidgetTypes.WELCOME, true)
    try {
      const delayInMin: number = 24 * 60;
      const savedDelay = localStorage.getItem('cse-welcome-hide-start');
      const currentDate: Date = new Date();
      const savedDelayDate: Date = new Date(JSON.parse(savedDelay));
      savedDelayDate.setTime(savedDelayDate.getTime() + (delayInMin * 60 * 1000));
      if (currentDate < savedDelayDate) this.setVisibility(WidgetTypes.WELCOME, false);
    } catch (error) {
      console.log(error);
    }

  }

  setVisibility = (widget: WidgetTypes, vis: boolean) => {
    this.props.dispatch(setVisibility({ name: WidgetTypes[widget], visibility: vis }));
  }

  draggable = (type: string, widget: Widget<any>, Widget: any, options?: HUDDragOptions, props?: any) => {
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
      gridDivisions={10}
      locked={this.props.layout.locked}
      save={(s: HUDDragState) => {
        this.props.dispatch(setPosition({
          name: type,
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
      } }
      render={() => {
        if (this.props.layout.locked && !widget.position.visibility) return null;
        return <Widget setVisibility={(vis: boolean) => this.props.dispatch(setVisibility({name: type, visibility: vis}))} {...props} />;
      } }
      {...options} />;
  }

  onToggleClick = (e: React.MouseEvent) => {
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
        <div id='cse-ui-crafting'>
          <Crafting />
        </div>

        {orderedWidgets.map(c => c)}

        <InteractiveAlert dispatch={this.props.dispatch}
          invites={this.props.invitesState.invites} />

        <div className={`HUD__toggle ${locked ? 'HUD__toggle--locked' : 'HUD__toggle--unlocked'} hint--top-left hint--slide`}
          onClick={e => this.onToggleClick(e)}
          data-hint={locked ? 'unlock hud | alt+click to reset' : 'lock hud | alt+click to reset'}></div>
      </div>
    );
  }
}



export default connect(select)(HUD);
