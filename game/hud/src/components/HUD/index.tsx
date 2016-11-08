/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
let Draggable = require('react-draggable');
import {client, GroupInvite, groupType, hasClientAPI} from 'camelot-unchained';
import Chat from 'cu-xmpp-chat';

import {LayoutState, lockHUD, unlockHUD, savePosition, initialize, resetHUD, setVisibility, WidgetPositions} from '../../services/session/layout';
import {SessionState} from '../../services/session/reducer';
import {InvitesState} from '../../services/session/invites';
import HUDDrag, {HUDDragState, HUDDragOptions} from '../HUDDrag';

import Compass from '../../widgets/Compass';
import Crafting from '../../widgets/Crafting';
import EnemyTargetHealth from '../../widgets/TargetHealth';
import FriendlyTargetHealth from '../../widgets/FriendlyTargetHealth';
import InteractiveAlert, {Alert} from '../InteractiveAlert';
import PlayerHealth from '../../widgets/PlayerHealth';
import Respawn from '../../components/Respawn';
import Warband from '../../widgets/Warband';
import Welcome from '../../widgets/Welcome';

import {BodyParts} from '../../lib/PlayerStatus';


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
  deltaPosition: {x:number,y:number};
  controlledPosition: {x:number,y:number};
}

class HUD extends React.Component<HUDProps, HUDState> {
  healthX: number;
  healthY: number;

  constructor(props: HUDProps) {
    super(props);
    this.state = {
      activeDrags: 0,
      deltaPosition: {x:0,y:0},
      controlledPosition: {x:100,y:100},
    }
  }

  componentDidMount() {
    this.props.dispatch(initialize());

    if (client && client.OnCharacterHealthChanged) {

      client.OnCharacterAliveOrDead((alive: boolean) => {
        if (!alive && this.props.layout.widgets['Respawn'] && !this.props.layout.widgets['Respawn'].visibility) {
          this.props.dispatch(setVisibility('Respawn', true));
        } else if (this.props.layout.widgets['Respawn'] && this.props.layout.widgets['Respawn'].visibility) {
          this.props.dispatch(setVisibility('Respawn', false));
        }
      });
    }

    // manage visibility of welcome widget based on localStorage
    this.props.dispatch(setVisibility('Welcome', true));
    try {
      const delayInMin: number = 24 * 60;
      const savedDelay = localStorage.getItem('cse-welcome-hide-start');
      const currentDate: Date = new Date();
      const savedDelayDate: Date = new Date(JSON.parse(savedDelay));
      savedDelayDate.setTime(savedDelayDate.getTime() + (delayInMin*60*1000));
      if (currentDate < savedDelayDate) this.props.dispatch(setVisibility('Welcome', false));
    } catch (error) {
      console.log(error);
    }

  }

  setVisibility = (widget: string, vis: boolean) => {
    this.props.dispatch(setVisibility(widget, vis));
  }

  draggable = (name: string, widgets: WidgetPositions, Widget: any, options?: HUDDragOptions, props?: any) => {
    const w = widgets[name];

    return <HUDDrag name={name}
                    key={w.zOrder}
                    defaultHeight={w.size.height}
                    defaultWidth={w.size.width}
                    defaultScale={w.scale}
                    defaultX={w.x.offset}
                    defaultY={w.y.offset}
                    defaultXAnchor={w.x.anchor}
                    defaultYAnchor={w.y.anchor}
                    defaultOpacity={w.opacity}
                    defaultMode={w.layoutMode}
                    gridDivisions={10}
                    locked={this.props.layout.locked}
                    save= {(s: HUDDragState) => {
                      this.props.dispatch(savePosition(name, {
                          x: {anchor: s.xAnchor, offset: s.x},
                          y: {anchor: s.yAnchor, offset: s.y},
                          size: {width: s.width, height: s.height},
                          scale: s.scale,
                          opacity: s.opacity,
                          visibility: w.visibility,
                          zOrder: w.zOrder,
                          layoutMode: w.layoutMode,
                        }));
                    }}
                    render={() => {
                      if (this.props.layout.locked && !w.visibility) return null;
                      return <Widget setVisibility={(vis: boolean) => this.setVisibility(name, vis)} {...props} />;
                    }}
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

    let orderedWidgets: JSX.Element[] = new Array(6);
    for (let key in widgets) {
      const w = widgets[key];
      switch(key) {
        case 'Chat':
          orderedWidgets[w.zOrder] = this.draggable('Chat', widgets, Chat, {}, {loginToken:client.loginToken});
          break;
        case 'PlayerHealth':
          orderedWidgets[w.zOrder] = this.draggable('PlayerHealth', widgets, PlayerHealth, {lockHeight: true, lockWidth: true}, {});
          break;
        case 'EnemyTargetHealth':
          //orderedWidgets[w.zOrder] = this.draggable('EnemyTargetHealth', widgets, EnemyTargetHealth, {lockHeight: true, lockWidth: true}, {});
          break;
        case 'FriendlyTargetHealth':
          //orderedWidgets[w.zOrder] = this.draggable('FriendlyTargetHealth', widgets, FriendlyTargetHealth, {lockHeight: true, lockWidth: true}, {});
          break;
        case 'Compass':
          orderedWidgets[w.zOrder] = this.draggable('Compass', widgets, Compass, {lockHeight: true, lockWidth: true}, {});
          break;
        case 'Respawn':
          orderedWidgets[w.zOrder] = this.draggable('Respawn', widgets, Respawn, {}, {});
          break;
        case 'Warband':
          //orderedWidgets[w.zOrder] = this.draggable('Warband', widgets, Warband, {lockHeight: true, lockWidth: true}, {});
          break;
        case 'Welcome':
          orderedWidgets[w.zOrder] = this.draggable('Welcome', widgets, Welcome, {lockHeight: true, lockWidth: true}, {});
          break;
      }
    }

    return (
      <div className='HUD' style={locked ? {} : {backgroundColor:'rgba(0, 0, 0, 0.2)'}}>
        <div id='cse-ui-crafting'>
          <Crafting/>
        </div>

        {orderedWidgets.map(c => c)}

        <InteractiveAlert dispatch={this.props.dispatch}
                          invites={this.props.invitesState.invites} />

        <div className={`HUD__toggle ${locked ? 'HUD__toggle--locked': 'HUD__toggle--unlocked'} hint--top-left hint--slide`}
             onClick={e => this.onToggleClick(e)}
             data-hint={locked ? 'unlock hud | alt+click to reset': 'lock hud | alt+click to reset'}></div>
      </div>
    );
  }
}



export default connect(select)(HUD);
