/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {client, events, plotPermissions, restAPI} from 'camelot-unchained';

  class ModifyPermissionsModel {
      characterID: string;
      loginToken: string;
      entityID: string;
      newPermissions: number;
  }
  
  class DeleteQueuedBlueprintModel {
      characterID: string;
      loginToken: string;
      entityID: string;
      indexToRemove: number;
  }
  
  class ReorderQueueModel {
      characterID: string;
      loginToken: string;
      entityID: string;
      indexToMove: number;
      destinationIndex: number;
  }
  
  class GetQueueStatusModel {
      characterID: string;
      loginToken: string;
  }
  
  class BlueprintModel {
      name: string;
      percentComplete: number;
      estTimeRemaining: number;
      subName: string;
      amtNeeded: number;
  }
  
  class ReceiveQueueStatusModel {
      status: string;
      numContributors: number;
      maxContributors: number;
      blueprints: BlueprintModel[];
  }
  
interface PlotControlUIState {
  plotOwned: boolean;
  currentPermissions: number;
  charID: string;
  entityID: string;
  
  viewingQueue: boolean;
  queue: BlueprintModel[];
  queueState: string;
  numContributors: number;
}
interface PlotControlUIProps {}

class PlotControlUI extends React.Component<PlotControlUIProps, PlotControlUIState> {
  constructor(props: PlotControlUIProps) {
    super(props);
  }

  closeWindow = () => {
    client.CloseUI('plotcontrol');
  }

  onPlotStatus = (eventData: any) => {
    this.setState({plotOwned: eventData.plotOwned, currentPermissions: eventData.permissions, charID: eventData.charID, entityID: eventData.entityID, 
        viewingQueue: this.state.viewingQueue, queue: this.state.queue, queueState: this.state.queueState, numContributors: this.state.numContributors});
    this.getQueueStatus();
  }

  componentWillMount() {
    events.on(events.handlesPlot.topic, this.onPlotStatus);
    this.setState({
      plotOwned: false,
      currentPermissions: 0,
      charID: "",
      entityID: "",
      viewingQueue: false,
      queue: [],
      queueState: "",
      numContributors: 0
    });
    setInterval(() => {if (this.state.plotOwned) this.getQueueStatus()}, 2000); 
  }

  componentWillUnmount() {
    events.off(events.handlesPlot.topic);
  }

  changePermissions = (perm: plotPermissions) => {
    let model: ModifyPermissionsModel = {
    characterID: this.state.charID,
    loginToken: client.loginToken,
    entityID: this.state.entityID,
    newPermissions: perm
    };
    restAPI.postPlotPermissions(model);
  }
  
  releasePlot = () => {
      restAPI.postReleasePlot({characterID: this.state.charID, loginToken: client.loginToken, entityID: this.state.entityID});
  }
  
  removeQueuedBlueprint = (e: any) => {
      let index: number = this.getListIndex(e.target.parentNode);
      let model: DeleteQueuedBlueprintModel = {
        characterID: this.state.charID,
        loginToken: client.loginToken,
        entityID: this.state.entityID,
        indexToRemove: index
      };
      restAPI.postRemoveQueuedBlueprint(model).then(this.getQueueStatus);
  }
  
  reorderBuildQueue = (indexSource: number, indexDestination: number) => {
      let model: ReorderQueueModel = {
        characterID: this.state.charID,
        loginToken: client.loginToken,
        entityID: this.state.entityID,
        indexToMove: indexSource,
        destinationIndex: indexDestination
      };
      
      restAPI.postReorderBuildQueue(model).then(this.getQueueStatus);
  }
  
  getQueueStatus = () => {
      let model: GetQueueStatusModel = {
        characterID: this.state.charID,
        loginToken: client.loginToken
      };
                                                                                                                                                                 
      restAPI.postGetQueueStatus(model).then((data: ReceiveQueueStatusModel) => this.setState({queue: data.blueprints, queueState: data.status, 
          // This calculation could easily be handled server-side, but sending both bits of data
          // lets the UI be more customizable.
          numContributors: Math.min(data.numContributors, data.maxContributors),
          plotOwned: this.state.plotOwned, currentPermissions: this.state.currentPermissions,
          charID: this.state.charID, entityID: this.state.entityID, viewingQueue: this.state.viewingQueue}), (error: any) => console.log(error));
  }
  
  toggleQueue = () => {
      this.setState({plotOwned: this.state.plotOwned, currentPermissions: this.state.currentPermissions, charID: this.state.charID, entityID: this.state.entityID, 
        viewingQueue: !this.state.viewingQueue, queue: this.state.queue, queueState: this.state.queueState, numContributors: this.state.numContributors});
  }
  
  private source: Node;
  private sourceIndex: number;

  getListIndex(node: Node) {
    if (node.parentNode != null) {
        for (let i = 0; i < node.parentNode.childNodes.length; ++i) {
            if (node.parentNode.childNodes[i] == node) return i;
        }
    }
    return -1;
  }
  
  isbefore(a: Node, b: Node) {
    if (a.parentNode == b.parentNode) {
      let aIndex = this.getListIndex(a);
      let bIndex = this.getListIndex(b);
      return aIndex < bIndex;
    }
    return false;
  }
  
  renderPermissions() {
      let permString = "Current Permissions: ";
        let prevPermission = false;
        if (this.state.currentPermissions == plotPermissions.Self) {
          permString += "Self Only";
        }
        else
        {
          if ((this.state.currentPermissions & plotPermissions.Group) == plotPermissions.Group) {
            permString += "Group"
            prevPermission = true;
          }
          if ((this.state.currentPermissions & plotPermissions.Friends) == plotPermissions.Friends) {
            if (prevPermission) permString += ", ";
            permString += "Friends";
            prevPermission = true;
          }
          if ((this.state.currentPermissions & plotPermissions.Guild) == plotPermissions.Guild) {
            if (prevPermission) permString += ", ";
            permString += "Guild";
            prevPermission = true;
          }
          if ((this.state.currentPermissions & plotPermissions.Realm) == plotPermissions.Realm) {
            if (prevPermission) permString += ", ";
            permString += "Realm";
            prevPermission = true;
          }
          if ((this.state.currentPermissions & plotPermissions.All) == plotPermissions.All) {
            if (prevPermission) permString += ", ";
            permString += "All";
            prevPermission = true;
          }
        }

        permString += ".";
        return (
          <div className="cu-window-content">
            <ul className="list">
              <li>{permString}</li>
              <button className="plotButton" onMouseDown={this.changePermissions.bind(this, plotPermissions.Self)}>Self Only</button>
              <button className="plotButton" onMouseDown={this.changePermissions.bind(this, plotPermissions.Group)}>Group</button>
              <button className="plotButton" onMouseDown={this.changePermissions.bind(this, plotPermissions.Friends)}>Friends</button>
              <button className="plotButton" onMouseDown={this.changePermissions.bind(this, plotPermissions.Guild)}>Guild</button>
              <button className="plotButton" onMouseDown={this.changePermissions.bind(this, plotPermissions.Realm)}>Realm</button>
              <button className="plotButton" onMouseDown={this.changePermissions.bind(this, plotPermissions.All)}>All</button>
            </ul>
            <button className="plotButton" onMouseDown={this.releasePlot.bind(this)}>Release Plot</button>
            <button className="plotButton" onMouseDown={this.toggleQueue.bind(this)}>View Queue</button>
          </div>
        );
  }
  
  renderConstruction() {
      let renderedQueue: JSX.Element;
      if (this.state.queueState != "InCombat") {
        const blueprints: JSX.Element[] = [];
        for(let i = 0; i < this.state.queue.length; ++i) {
            let blueprint = this.state.queue[i];
            let renderedBlueprint: JSX.Element;
          
            let timeRemaining: JSX.Element;
            let timeRemainingSeconds = Math.round(blueprint.estTimeRemaining);
            if (timeRemainingSeconds != -1) {
              let timeRemainingHours = Math.floor(timeRemainingSeconds / 3600);
              timeRemainingSeconds = timeRemainingSeconds % 3600;
              let timeRemainingMinutes = Math.floor(timeRemainingSeconds / 60);
              timeRemainingSeconds = timeRemainingSeconds % 60;
              timeRemaining = (
                <div>{timeRemainingHours + "h " + timeRemainingMinutes + "m " + timeRemainingSeconds + "s"}</div>  
              );
            }
            else
            {
                timeRemaining = (
                  <div>"Inf"</div>  
                );
            }
         
            let upArrow: JSX.Element;
            if (i != 0) {
                upArrow = (
                  <a onMouseDown={this.reorderBuildQueue.bind(this, i, i-1)} className="plotMoveUp">↑</a>  
                );
            }

            let downArrow: JSX.Element;
            if (i != this.state.queue.length - 1) {
                downArrow = (
                  <a onMouseDown={this.reorderBuildQueue.bind(this, i, i+1)} className="plotMoveDown">↓</a>
                );
            }
            
            if (blueprint.subName == "") {
              renderedBlueprint = (
                <li className="blueprint">
                  {blueprint.name}
                  {timeRemaining}
                  <progress value={blueprint.percentComplete.toString()} max="1"></progress>
                  {upArrow}
                  {downArrow}
                  <a onMouseDown={this.removeQueuedBlueprint.bind(this)} className="cu-window-close"></a>
                </li>
              );
            }
            else
            {
                renderedBlueprint = (
                  <li className="matBlueprint">
                    {blueprint.name}
                    {timeRemaining}
                    <progress value={blueprint.percentComplete.toString()} max="1"></progress>
                    {upArrow}
                    {downArrow}
                    <a onMouseDown={this.removeQueuedBlueprint.bind(this)} className="cu-window-close"></a>
                    <div>
                      {blueprint.amtNeeded} {blueprint.subName} needed to complete.
                    </div>
                  </li>
                );
            }
            blueprints.push(renderedBlueprint);
        }
        renderedQueue = (
        <ul className="list">
        Allies on Plot: {this.state.numContributors}
        {blueprints}
        </ul>   
        );
      }
      else
      {
          renderedQueue = (
              <div className="list">Your plot is under attack!</div>
          );
      }
        
      return (
        <div className="cu-window-content">
          {renderedQueue}
          <button className="plotButton" onMouseDown={this.releasePlot.bind(this)}>Release Plot</button>
          <button className="plotButton" onMouseDown={this.toggleQueue.bind(this)}>Permissions</button>
        </div>  
      );
  }

  // Render the unit frame using character data-perm
  render() {
    let body: any;
    if (this.state.plotOwned === true) {
      if (!this.state.viewingQueue) {
        body = this.renderPermissions();
      }
      else 
      {
          body = this.renderConstruction();
      }
    }
    else
    {
      body = (<div className="cu-window-content">You don't own a plot!</div>);
    }

    return (
      <div className="cu-window">
        <div className="cu-window-header">
          <div className="cu-window-title">Your Plot</div>
          <div className="cu-window-actions">
            <a onMouseDown={this.closeWindow.bind(this)} className="cu-window-close"></a>
          </div>
        </div>
        {body}
      </div>
    );
  }
}

events.on('init', () => {
  ReactDom.render(<PlotControlUI/>, document.getElementById("cse-ui-plotcontrol"));
});
