/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-29 15:36:53
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-05-12 14:06:50
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {client, events, plotPermissions, webAPI, hasClientAPI} from 'camelot-unchained';

interface PlotControlUIState {
  plotOwned: boolean;
  currentPermissions: number;
  charID: string;
  entityID: string;
  
  viewingQueue: boolean;
  queue: webAPI.QueuedBlueprintMessage[];
  queueState: string;
  numContributors: number;
  visible: boolean;
}
interface PlotControlUIProps {}

class PlotControlUI extends React.Component<PlotControlUIProps, PlotControlUIState> {

  private source: Node;
  private sourceIndex: number;
  
  constructor(props: PlotControlUIProps) {
    super(props);
    this.state = {
      plotOwned: false,
      currentPermissions: 0,
      charID: '',
      entityID: '',
      viewingQueue: false,
      queue: [],
      queueState: '',
      numContributors: 0,
      visible: false,
    };
  }

  // Render the unit frame using character data-perm
  public render() {
    let body: any;
    if (this.state.plotOwned === true) {
      if (!this.state.viewingQueue) {
        body = this.renderPermissions();
      } else {
        body = this.renderConstruction();
      }
    } else {
      body = (<div className='cu-window-content'>You don't own a plot!</div>);
    }

    if (this.state.visible) {
      return (
        <div id='plotcontrol-container' className='cu-window'>
          <div className='cu-window-header'>
            <div className='cu-window-title'>Your Plot</div>
            <div className='cu-window-actions'>
              <a onClick={this.closeWindow} className='cu-window-close'></a>
            </div>
          </div>
          {body}
        </div>
      );
    } else return null;
  }

  private closeWindow = () => {
    events.fire('hudnav--navigate', 'plotcontrol');
  }

  private onPlotStatus = (plotOwned: boolean, currentPermissions: number, charID: string, entityID: string) => {
    this.setState((state, props) => {
      return {
        ...state,
        plotOwned,
        currentPermissions,
        charID,
        entityID,
      };
    });
    this.getQueueStatus();
  }

  private componentWillMount() {
    client.OnPlotStatus(this.onPlotStatus);
    setInterval(() => {if (this.state.plotOwned) this.getQueueStatus();}, 2000); 
  }

  private componentDidMount() {
    events.on('hudnav--navigate', (name: string) => {
      if (name === 'plotcontrol') {
        if (!this.state.visible) {
          this.setState((state, props) => ({ visible: true }));
        } else {
          this.setState((state, props) => ({ visible: false }));
        }
      }
    });
  }

  private changePermissions = (perm: plotPermissions) => {
    webAPI.PlotsAPI.modifyPermissionsV1(
      client.shardID,
      client.characterID,
      client.loginToken,
      this.state.entityID,
      perm,
    );
  }
  
  private releasePlot = () => {
    webAPI.PlotsAPI.releasePlotV1(
      client.shardID,
      client.characterID,
      client.loginToken,
      this.state.entityID,
    );
  }
  
  private removeQueuedBlueprint = (idx: number) => {
    webAPI.PlotsAPI.removeQueuedBlueprintV1(
      client.shardID,
      client.characterID,
      client.loginToken,
      this.state.entityID,
      idx,
    ).then(this.getQueueStatus);
  }
  
  private reorderBuildQueue = (indexSource: number, indexDestination: number) => {
    webAPI.PlotsAPI.reorderQueueV1(
      client.shardID,
      client.characterID,
      client.loginToken,
      this.state.entityID,
      indexSource,
      indexDestination,
    ).then(this.getQueueStatus);
  }
  
  private getQueueStatus = () => {
    const resp = webAPI.PlotsAPI.getQueueStatusV1(client.shardID, client.characterID, client.loginToken).then((resp) => {
      if (!resp.ok) return;
      this.setState((state, props) => ({
        ...state,
        queue: resp.data.blueprints,
        queueState: resp.data.status,
        numContributors: Math.min(resp.data.numContributors, resp.data.maxContributors),
      }));
    },
    (err: any) => console.log(err));
  }
  
  private toggleQueue = () => {
    this.setState((state, props) => ({
      ...state,
      viewingQueue: !state.viewingQueue,
    }));
  }
  
  private renderPermissions() {
    let permString = 'Current Permissions: ';
    let prevPermission = false;
    if (this.state.currentPermissions === plotPermissions.Self) {
      permString += 'Self Only';
    } else {
      if ((this.state.currentPermissions & plotPermissions.Group) === plotPermissions.Group) {
        permString += 'Group';
        prevPermission = true;
      } if ((this.state.currentPermissions & plotPermissions.Friends) === plotPermissions.Friends) {
        if (prevPermission) permString += ', ';
        permString += 'Friends';
        prevPermission = true;
      } if ((this.state.currentPermissions & plotPermissions.Guild) === plotPermissions.Guild) {
        if (prevPermission) permString += ', ';
        permString += 'Guild';
        prevPermission = true;
      } if ((this.state.currentPermissions & plotPermissions.Realm) === plotPermissions.Realm) {
        if (prevPermission) permString += ', ';
        permString += 'Realm';
        prevPermission = true;
      } if ((this.state.currentPermissions & plotPermissions.All) === plotPermissions.All) {
        if (prevPermission) permString += ', ';
        permString += 'All';
        prevPermission = true;
      }
    }

    permString += '.';
    return (
      <div className='cu-window-content'>
        <ul className='list'>
          <li>{permString}</li>
          <button className='plotButton' onClick={this.changePermissions.bind(this, plotPermissions.Self)}>
            Self Only
          </button>
          <button className='plotButton' onClick={this.changePermissions.bind(this, plotPermissions.Group)}>
            Group
          </button>
          <button className='plotButton' onClick={this.changePermissions.bind(this, plotPermissions.Friends)}>
            Friends
          </button>
          <button className='plotButton' onClick={this.changePermissions.bind(this, plotPermissions.Guild)}>
            Guild
          </button>
          <button className='plotButton' onClick={this.changePermissions.bind(this, plotPermissions.Realm)}>
            Realm
          </button>
          <button className='plotButton' onClick={this.changePermissions.bind(this, plotPermissions.All)}>
            All
          </button>
        </ul>
        <button className='plotButton' onClick={this.releasePlot.bind(this)}>Release Plot</button>
        <button className='plotButton' onClick={this.toggleQueue.bind(this)}>View Queue</button>
      </div>
    );
  }
  
  private renderConstruction() {
    let renderedQueue: JSX.Element;
    if (this.state.queueState !== 'InCombat') {
      const blueprints: JSX.Element[] = [];
      for (let i = 0; i < this.state.queue.length; ++i) {
          const blueprint = this.state.queue[i];
          let renderedBlueprint: JSX.Element;
        
          let timeRemaining: JSX.Element;
          let timeRemainingSeconds = Math.round(blueprint.estTimeRemaining);
          if (timeRemainingSeconds !== -1) {
            const timeRemainingHours = Math.floor(timeRemainingSeconds / 3600);
            timeRemainingSeconds = timeRemainingSeconds % 3600;
            const timeRemainingMinutes = Math.floor(timeRemainingSeconds / 60);
            timeRemainingSeconds = timeRemainingSeconds % 60;
            timeRemaining = (
              <div>{timeRemainingHours + 'h ' + timeRemainingMinutes + 'm ' + timeRemainingSeconds + 's'}</div>  
            );
          } else {
            timeRemaining = (
              <div>"Inf"</div>  
            );
          }
        
          let upArrow: JSX.Element;
          if (i !== 0) {
            upArrow = (
              <a onClick={() => this.reorderBuildQueue(i, i - 1)} className='plotMoveUp'>↑</a>  
            );
          }

          let downArrow: JSX.Element;
          if (i !== this.state.queue.length - 1) {
            downArrow = (
              <a onClick={() => this.reorderBuildQueue(i, i + 1)} className='plotMoveDown'>↓</a>
            );
          }
          
          if (blueprint.subName === '') {
            renderedBlueprint = (
              <li className='blueprint'>
                {blueprint.name}
                {timeRemaining}
                <progress value={blueprint.percentComplete.toString()} max='1'></progress>
                {upArrow}
                {downArrow}
                <a onClick={() => this.removeQueuedBlueprint(i)} className='cu-window-close'></a>
              </li>
            );
          } else {
            renderedBlueprint = (
              <li className='matBlueprint'>
                {blueprint.name}
                {timeRemaining}
                <progress value={blueprint.percentComplete.toString()} max='1'></progress>
                {upArrow}
                {downArrow}
                <a onClick={() => this.removeQueuedBlueprint(i)} className='cu-window-close'></a>
                <div>
                  {blueprint.amtNeeded} {blueprint.subName} needed to complete.
                </div>
              </li>
            );
          }
          blueprints.push(renderedBlueprint);
      }
      renderedQueue = (
      <ul className='list'>
      Allies on Plot: {this.state.numContributors}
      {blueprints}
      </ul>   
      );
    } else {
      renderedQueue = (
        <div className='list'>Your plot is under attack!</div>
      );
    }
      
    return (
      <div className='cu-window-content'>
        {renderedQueue}
        <button className='plotButton' onClick={this.releasePlot.bind(this)}>Release Plot</button>
        <button className='plotButton' onClick={this.toggleQueue.bind(this)}>Permissions</button>
      </div>  
    );
  }
}

export default PlotControlUI;
