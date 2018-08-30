/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client, events, GroupMemberState, Vec3f, AnyEntityState } from '@csegames/camelot-unchained';
import { hubEvents } from '@csegames/camelot-unchained/lib/signalR/hubs/groupsHub';
import {
  CompassPOIProviderProps,
  CompassPOI,
  CompassPOIPartial,
  withCompassPOIPartialDefaults,
  CompassContext,
} from 'components/Compass/CompassPOIManager';
import { CompassTooltipData } from 'components/CompassTooltip';
import { showCompassTooltip, hideCompassTooltip, updateCompassTooltip } from 'actions/compassTooltip';

const MemberPoi = styled('div')`
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 19px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left linear .1s;
  user-select: none;
`;

const MemberPoiCircle = styled('div')`
  width: 20px;
  height: 20px;
  border-radius: 19px;
  background: rgba(11, 102, 35,.8);
  box-shadow: 0 0 1px rgba(11, 102, 35,.8);
  pointer-events: auto;
`;

const StyledSvg = styled('svg')`
  fill: rgba(255,255,255,0.8);
  text-shadow: none;
  stroke: rgba(255,255,255,0.8);
  stroke-opacity: 0;
  display: block;
  margin: 0 auto;
`;

// from https://material.io/tools/icons/?icon=person&style=baseline
const MemberIcon = () => (
  <StyledSvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'>
    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/>
    <path d='M0 0h24v24H0z' fill='none'/>
  </StyledSvg>
);

interface WarbandMemberData {
  id: string;
  characterID: string;
  name: string;
  isAlive: boolean;
  position: Vec3f;
}

interface MemberPoiContainerProps {
  compass: CompassContext;
  poi: CompassPOI<WarbandMemberData>;
  friendlyTarget: string;
}
interface MemberPoiContainerState {
  hoverCount: number;
  hover: boolean;
}

class MemberPoiContainer extends React.Component<MemberPoiContainerProps, MemberPoiContainerState> {

  public state = {
    hover: false,
    hoverCount: 0,
  };

  public render() {
    const { poi } = this.props;
    const distance = Math.round(poi.distance);
    let cappedDistance: number;
    if (distance > 100) {
      cappedDistance = 100;
    } else {
      cappedDistance = distance;
    }
    const cappedDistancePercentage = cappedDistance / 100;
    const scaleAmount = ((1 - cappedDistancePercentage) * 0.5);
    return (
      <>
        <MemberPoi style={poi.placementStyle}>
          <MemberPoiCircle
            style={{
              WebkitTransform: `scale(${1 + scaleAmount}`, transform: `scale(${1 + scaleAmount}`,
              background: poi.data.id === this.props.friendlyTarget ? 'rgba(15, 82, 186,.8)' : 'rgba(11, 102, 35,.8)',
              boxShadow: (
                poi.data.id === this.props.friendlyTarget ? '0 0 1px rgba(15, 82, 186,.8)' : '0 0 1px rgba(11, 102, 35,.8)'
              ),
            }}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleClick}
          >
            <MemberIcon />
          </MemberPoiCircle>
        </MemberPoi>
      </>
    );
  }

  public shouldComponentUpdate(nextProps: MemberPoiContainerProps, nextState: MemberPoiContainerState) {
    if (nextProps.compass.renderTimestamp !== this.props.compass.renderTimestamp) {
      return true;
    }
    return false;
  }

  public componentDidUpdate() {
    if (this.state.hover) {
      updateCompassTooltip(this.getTooltipData());
    }
  }

  public componentWillUnmount() {
    hideCompassTooltip(this.props.poi.id);
  }


  public handleClick = () => {
    client.RequestFriendlyTargetEntityID(this.props.poi.data.id);
  }

  private getTooltipData = (): CompassTooltipData => {
    return {
      id: this.props.poi.id,
      title: this.props.poi.data.name,
      distance: this.props.poi.distance,
      elevation: this.props.poi.elevation,
      bearing: this.props.poi.bearing,
    };
  }

  private handleMouseEnter = () => {
    this.setState((prevState: MemberPoiContainerState) => {
      showCompassTooltip(this.getTooltipData());
      const hoverCount = prevState.hoverCount + 1;
      return {
        hoverCount,
        hover: true,
      };
    });
  }

  private handleMouseLeave = () => {
    const hoverCount = this.state.hoverCount;
    setTimeout(() => {
      this.setState((prevState: MemberPoiContainerState) => {
        if (hoverCount === prevState.hoverCount) {
          hideCompassTooltip(this.props.poi.id);
          return {
            hoverCount: 0,
            hover: false,
          };
        } else {
          return null;
        }
      });
    }, 1000);
  }
}

export interface WarbandMembersPoiProviderState {
  characterIdToIdMap: {
    [characterId: string]: string;
  };
  friendlyTarget: string;
}

export default class WarbandMembersPoiProvider extends React.Component<
  CompassPOIProviderProps<WarbandMemberData>,
  WarbandMembersPoiProviderState
> {

  public state = {
    characterIdToIdMap: {},
    friendlyTarget: '',
  };

  private eventUpdateHandle: number;
  private eventJoinedHandle: number;
  private eventRemovedHandle: number;

  public render() {
    return (
      <>
        {this.props.pois.filter(poi => (poi.data.isAlive)).map(poi => (
          <MemberPoiContainer
            key={poi.id}
            compass={this.props.compass}
            poi={poi}
            friendlyTarget={this.state.friendlyTarget}
          />
        ))}
      </>
    );
  }

  public componentDidMount() {
    this.eventUpdateHandle = events.on(hubEvents.memberUpdate, this.onWarbandMemberUpdated);
    this.eventJoinedHandle = events.on(hubEvents.memberJoined, this.onWarbandMemberJoined);
    this.eventRemovedHandle = events.on(hubEvents.memberRemoved, this.onWarbandMemberRemoved);
    client.OnFriendlyTargetStateChanged((state: AnyEntityState) => {
      if (state) {
        this.setState({
          friendlyTarget: state.id,
        });
      } else {
        this.setState({
          friendlyTarget: '',
        });
      }
    });
  }

  public componentWillUnmount() {
    events.off(this.eventUpdateHandle);
    events.off(this.eventJoinedHandle);
    events.off(this.eventRemovedHandle);
  }

  public shouldComponentUpdate(
    nextProps: CompassPOIProviderProps<WarbandMemberData>,
    nextState: WarbandMembersPoiProviderState,
  ) {
    if (nextProps.compass.renderTimestamp !== this.props.compass.renderTimestamp) {
      return true;
    }
    return false;
  }

  public onWarbandMemberUpdated = (rawNewMemberState: string) => {
    const newMemberState: GroupMemberState = JSON.parse(rawNewMemberState);
    if (newMemberState.characterID !== client.characterID) {
      this.props.compass.updatePOI('warband', this.getWarbandMemberPOI(newMemberState));
    }
  }

  public onWarbandMemberJoined = (rawNewMemberState: string) => {
    const newMemberState: GroupMemberState = JSON.parse(rawNewMemberState);
    if (newMemberState.characterID !== client.characterID) {
      this.setState((prevState: WarbandMembersPoiProviderState) => {
        return {
          characterIdToIdMap: {
            ...prevState.characterIdToIdMap,
            [newMemberState.characterID]: newMemberState.id,
          },
        };
      });
      this.props.compass.addPOI('warband', this.getWarbandMemberPOI(newMemberState));
    }
  }

  public onWarbandMemberRemoved = (characterID: string) => {
    if (characterID !== client.characterID) {
      this.props.compass.removePOI('warband', `warband-${this.state.characterIdToIdMap[characterID]}`);
    } else {
      this.props.compass.removePOIByType('warband');
    }
  }

  private getWarbandMemberPOI = (state: GroupMemberState): CompassPOIPartial<WarbandMemberData> => {
    return withCompassPOIPartialDefaults({
      id: `warband-${state.id}`,
      type: 'warband',
      position: state.position,
      offset: 18,
      byAtLeast: 10,
      data: this.getWarbandMemberData(state),
    });
  }

  private getWarbandMemberData = (state: GroupMemberState): WarbandMemberData => {
    return {
      id: state.id,
      characterID: state.characterID,
      name: state.name,
      isAlive: state.isAlive,
      position: {
        x: Math.round(state.position.x),
        y: Math.round(state.position.y),
        z: Math.round(state.position.z),
      },
    };
  }
}
