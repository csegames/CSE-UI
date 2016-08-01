/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
let Draggable = require('react-draggable');
import {client, GroupInvite} from 'camelot-unchained';
import Chat from 'cu-xmpp-chat';

import {LayoutState, Position, lockHUD, unlockHUD, savePosition, initialize, resetHUD} from '../../services/session/layout';
import {HUDSessionState} from '../../services/session/reducer';

import Crafting from '../../widgets/Crafting';
import PlayerHealth from '../../widgets/PlayerHealth';
import EnemyTargetHealth from '../../widgets/TargetHealth';
import FriendlyTargetHealth from '../../widgets/FriendlyTargetHealth';
import Warband from '../../widgets/Warband';
import InviteAlert from '../InviteAlert';

function select(state: HUDSessionState): HUDProps {
  return {
    layout: state.layout
  }
}

export interface HUDProps {
  dispatch?: (action: any) => void;
  layout?: LayoutState;
}

export interface HUDState {
  activeDrags: number;
  deltaPosition: {x:number,y:number};
  controlledPosition: {x:number,y:number};
  invites: GroupInvite[];
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
      invites: [{
          created: '',
          groupType: 0,
          inviteCode: 'abcde-fgh12-341-5103',
          invitedByID: '',
          invitedByName: 'CSE-JB'
        },{
          created: '',
          groupType: 0,
          inviteCode: 'abcde-fgh12-341-5103',
          invitedByID: '',
          invitedByName: 'BEN'
        }]
    }
  }

  componentDidMount() {
    this.props.dispatch(initialize());
  }

  handleDrag =  (e:any, ui:any) => {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    } as any);
  }

  onStart = () => {
    this.setState({activeDrags: ++this.state.activeDrags} as any);
  }

  onStop = () => {
    this.setState({activeDrags: --this.state.activeDrags} as any);
  }

  onWheel = (name: string, e: any) => {
    if (this.props.layout.locked) return;

    const factor = e.altKey ? 0.01 : 0.10;

    const pos: Position = this.props.layout.widgets[name];

    if (e.nativeEvent.deltaY < 0) {
      this.props.dispatch(savePosition(name, {
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
        scale: pos.scale - factor
      }));
    } else {
      this.props.dispatch(savePosition(name, {
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
        scale: pos.scale + factor
      }));
    }
  }

  draggableWidget = (name: string, widgets: any, Widget: any, containerClass: string, props?: any) => {
    const pos: Position = widgets[name];
    return (
      <Draggable handle='.drag-handle'
                  defaultPosition={{x: pos.x, y: pos.y}}
                  position={{x: pos.x, y: pos.y}}
                  grid={[1, 1]}
                  zIndex={100}
                  onStart={this.onStart}
                  onDrag={this.handleDrag}
                  onStop={(e:any, ui:any) => {
                    this.onStop();
                    this.props.dispatch(savePosition(name, {x: ui.x, y: ui.y, width: pos.width, height: pos.height, scale: pos.scale}));
                  }}>
        <div>
          <div className={containerClass}
               style={{
                 transform:`scale(${pos.scale})`,
                 '-webkit-transform':`scale(${pos.scale})`,
                 height: `${pos.height}px`,
                 width: `${pos.width}px`
               }}
               onWheel={(e: any) => this.onWheel(name, e)}>
            <Widget {...props} />
            <div className={`drag-handle ${this.props.layout.locked ? 'hidden':''}`}></div>
          </div>
        </div>
      </Draggable>
    );
  }

  onToggleClick = (e: React.MouseEvent) => {
    if (e.altKey) {
      this.props.dispatch(resetHUD());
      return;
    }
    return this.props.dispatch(this.props.layout.locked ? unlockHUD() : lockHUD());
  }


        // {this.draggableWidget('PlayerHealth', widgets, PlayerHealth, 'player-health')}
        // {this.draggableWidget('TargetHealth', widgets, TargetHealth, 'target-health')}
        // {this.draggableWidget('Warband', widgets, Warband, 'warband')}
        // {this.draggableWidget('Chat', widgets, Chat, 'chat-window', {hideChat: () => {}, loginToken:client.loginToken})}
        // <InviteAlert invites={this.state.invites}
        //              acceptInvite={(invite: GroupInvite, force?: boolean) => {
        //                console.log('invite accepted')
        //                this.setState({
        //                  invites: []
        //                } as any)
        //              }}
        //              declineInvite={(invite: GroupInvite) => {
        //                this.setState({
        //                  invites: []
        //                } as any)
        //              }} />

        // <button onClick={() => locked ? this.props.dispatch(unlockHUD()) : this.props.dispatch(lockHUD())}
        //         style={{position: 'fixed'}}>Toggle UI Lock</button>


  // for now just a fixed chat
  render() {

    const widgets = this.props.layout.widgets;
    const locked = this.props.layout.locked;

    return (
      <div className='HUD' style={locked ? {} : {backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
        <div id='cse-ui-crafting'>
          <Crafting/>
        </div>
        {this.draggableWidget('Chat', widgets, Chat, 'chat-window', {loginToken:client.loginToken})}
        {this.draggableWidget('PlayerHealth', widgets, PlayerHealth, 'player-health', {})}
        {this.draggableWidget('EnemyTargetHealth', widgets, EnemyTargetHealth, 'target-health', {})}
        {this.draggableWidget('FriendlyTargetHealth', widgets, FriendlyTargetHealth, 'target-health', {})}
        
        <div className={`HUD__toggle ${locked ? 'HUD__toggle--locked': 'HUD__toggle--unlocked'} hint--top-left hint--slide`}
             onClick={e => this.onToggleClick(e)}
             data-hint={locked ? 'unlock hud | alt+click to reset': 'lock hud | alt+click to reset'}></div>
      </div>
    );
  }
}



export default connect(select)(HUD);
