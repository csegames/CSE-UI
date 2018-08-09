/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client, events, GroupMemberState } from '@csegames/camelot-unchained';
import { CompassContextConsumer, CompassContext } from '../CompassContext';
import CompassElevationSwitch from '../CompassElevationSwitch';
import { hubEvents } from '@csegames/camelot-unchained/lib/signalR/hubs/groupsHub';

const MemberPoi = styled('div')`
  position: absolute;
  margin: 0;
  padding: 0;
  margin-top: 6px;
  text-shadow: 2px 2px 4px black;
  font-size: 0.6em;
  color: rgba(0,255,0,.8);
  width: 40px;
  text-align: center;
  font-weight: bold;
  border-radius: 100px;
  height: 25px;
  line-height: 8px;
`;

const StyledSvg = styled('svg')`
  fill: rgba(0,255,0,.8);
  text-shadow: none;
  stroke: rgba(0,255,0,.8);
  stroke-opacity: 0;
  display: block;
  margin: 0 auto;
`;

// from https://material.io/tools/icons/?icon=person&style=baseline
const MemberIcon = () => (
  <StyledSvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/>
    <path d='M0 0h24v24H0z' fill='none'/>
  </StyledSvg>
);

export interface WarbandMembersState {
  members: GroupMemberState[];
}

export default class WarbandMembers extends React.Component<{}, WarbandMembersState> {

  private eventUpdateHandle: number;
  private eventJoinedHandle: number;
  private eventRemovedHandle: number;

  public state: WarbandMembersState = {
    members: [],
  };

  public render() {
    return (
      <CompassContextConsumer>
        {(compass: CompassContext) => (
          <>
            {this.state.members.filter(member => member.isAlive).map(member => (
              <MemberPoi style={compass.getPoiPlacementStyle(member.position, 12.5)}>
                <MemberIcon />
                {Math.round(compass.getDistance(member.position))}
                <CompassElevationSwitch bufferZone={1} target={member.position}>
                  {(isLevel, isAbove, isBelow) => (
                    <>
                      {
                        isLevel ? '' :
                        isAbove ? `↑` :
                        `↓`
                      }
                    </>
                  )}
                </CompassElevationSwitch>
              </MemberPoi>
            ))}
          </>
        )}
      </CompassContextConsumer>
    );
  }

  public componentWillMount() {
    this.eventUpdateHandle = events.on(hubEvents.memberUpdate, this.onWarbandMemberUpdated);
    this.eventJoinedHandle = events.on(hubEvents.memberJoined, this.onWarbandMemberJoined);
    this.eventRemovedHandle = events.on(hubEvents.memberRemoved, this.onWarbandMemberRemoved);
  }

  public componentWillUnmount() {
    events.off(this.eventUpdateHandle);
    events.off(this.eventJoinedHandle);
    events.off(this.eventRemovedHandle);
  }

  public onWarbandMemberUpdated = (rawNewMemberState: string) => {
    const newMemberState: GroupMemberState = JSON.parse(rawNewMemberState);
    if (newMemberState.characterID !== client.characterID) {
      this.setState(state => ({
        members: state.members.map((member) => {
          if (member.characterID === newMemberState.characterID) {
            return newMemberState;
          } else {
            return member;
          }
        }),
      }));
    }
  }

  public onWarbandMemberJoined = (rawNewMemberState: string) => {
    const newMemberState: GroupMemberState = JSON.parse(rawNewMemberState);
    if (newMemberState.characterID !== client.characterID) {
      this.setState((state) => {
        return {
          members: state.members.filter((member) => {
            return member.characterID !== newMemberState.characterID;
          }).concat([newMemberState]),
        };
      });
    }
  }

  public onWarbandMemberRemoved = (rawNewMemberState: string) => {
    const newMemberState: GroupMemberState = JSON.parse(rawNewMemberState);
    if (newMemberState.characterID !== client.characterID) {
      this.setState(state => ({
        members: state.members.filter((member) => {
          return member.characterID !== newMemberState.characterID;
        }),
      }));
    } else {
      this.setState({
        members: [],
      });
    }
  }
}
