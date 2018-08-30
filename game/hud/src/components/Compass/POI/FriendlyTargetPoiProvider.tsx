/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client, Vec3f, AnyEntityState, PlayerState } from '@csegames/camelot-unchained';
import {
  CompassPOIProviderProps,
  CompassPOI,
  CompassPOIPartial,
  withCompassPOIPartialDefaults,
  CompassContext,
} from 'components/Compass/CompassPOIManager';
import { updateCompassTooltip, hideCompassTooltip, showCompassTooltip } from 'actions/compassTooltip';
import { CompassTooltipData } from 'components/CompassTooltip';

const FriendlyTargetPoi = styled('div')`
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

const FriendlyTargetPoiCircle = styled('div')`
  width: 20px;
  height: 20px;
  border-radius: 19px;
  background: rgba(15, 82, 186,.8);
  box-shadow: 0 0 1px rgba(15, 82, 186,.8);
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSvg = styled('svg')`
  fill: rgba(255,255,255,0.8);
  text-shadow: none;
  stroke: rgba(255,255,255,0.8);
  stroke-opacity: 0;
  display: block;
  margin: 0 auto;
`;

// tslint:disable:max-line-length
// from https://game-icons.net/lorc/originals/reticule.html
const TargetIcon = () => (
  <StyledSvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' style={{ width: '14px', height: '14px' }}>
    <path d='M0 0h512v512H0z' fill='transparent' fillOpacity='0'></path>
    <g className='' transform='translate(0,0)' style={{ touchAction: 'none' }}>
      <path d='M265.22 19.688v57.75c91.033 4.56 164.143 77.686 168.717 168.718h57.75c-4.635-123.12-103.345-221.85-226.468-226.47zm-18.69.03C123.67 24.65 24.717 123.244 20.063 246.157H78.44C83 155.333 155.786 82.33 246.53 77.47V19.72zm9.69 107.22c-32.23 0-61.768 11.79-84.408 31.312l22.47 22.47c12.306-10.246 27.204-17.487 43.562-20.626l18.78 70.53 18.75-70.374c15.887 3.182 30.37 10.232 42.407 20.156l22.345-22.344c-22.465-19.41-51.782-31.125-83.906-31.125zm97.124 44.343L331 193.626c9.996 12.136 17.072 26.77 20.22 42.813l-70.095 18.687 70.125 18.656c-3.15 16.247-10.31 31.112-20.438 43.44l22.344 22.342c19.513-22.637 31.312-52.154 31.313-84.375 0-32.124-11.716-61.44-31.126-83.906zm-194.75.157c-19.478 22.446-31.28 51.697-31.28 83.75 0 32.15 11.885 61.6 31.467 84.22l22.532-22.532c-9.933-12.202-16.96-26.866-20.093-42.875l70.936-18.875-70.906-18.906c3.136-15.81 10.098-30.235 19.906-42.25l-22.562-22.532zm-138.5 93.407C25.044 387.51 123.868 486.332 246.53 491.28V432.94c-90.544-4.852-163.21-77.547-168.06-168.094H20.093zm413.812 0C429.044 355.6 356.056 428.42 265.22 432.97v58.342c122.924-4.638 221.507-103.596 226.436-226.468h-57.75zm-177.28 14.75l-18.97 71.28c-16.208-3.188-30.995-10.455-43.22-20.687L172 352.625c22.618 19.582 52.072 31.47 84.22 31.47 32.05 0 61.304-11.803 83.75-31.283l-22.345-22.343c-11.955 9.914-26.296 16.98-42.03 20.217l-18.97-71.093z' fill='#fff' fillOpacity='1'></path>
    </g>
  </StyledSvg>
);
// tslint:enable:max-line-length

interface FriendlyTargetData {
  id: string;
  name: string;
  isAlive: boolean;
  position: Vec3f;
}

interface FriendlyTargetPoiContainerProps {
  compass: CompassContext;
  poi: CompassPOI<FriendlyTargetData>;
}

interface FriendlyTargetPoiContainerState {
  hover: boolean;
  hoverCount: number;
}

class FriendlyTargetPOIContainer extends React.Component<
  FriendlyTargetPoiContainerProps,
  FriendlyTargetPoiContainerState
> {
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
        <FriendlyTargetPoi style={poi.placementStyle}>
          <FriendlyTargetPoiCircle
            style={{ WebkitTransform: `scale(${1 + scaleAmount}`, transform: `scale(${1 + scaleAmount}` }}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <TargetIcon />
          </FriendlyTargetPoiCircle>
        </FriendlyTargetPoi>
      </>
    );
  }

  public shouldComponentUpdate(nextProps: FriendlyTargetPoiContainerProps, nextState: FriendlyTargetPoiContainerState) {
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
    this.setState((prevState: FriendlyTargetPoiContainerState) => {
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
      this.setState((prevState: FriendlyTargetPoiContainerState) => {
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

export interface FriendlyTargetPoiProviderState {
  playerId: string;
}

export default class FriendlyTargetPoiProvider extends React.Component<
  CompassPOIProviderProps<FriendlyTargetData>,
  FriendlyTargetPoiProviderState
> {

  public state = {
    playerId: '',
  };

  public render() {
    return (
      <>
        {this.props.pois.filter(
          poi => poi.data.isAlive && !this.props.compass.hasPOI('warband', `warband-${poi.data.id}`),
        ).map(poi => (
          <FriendlyTargetPOIContainer
            key={poi.id}
            compass={this.props.compass}
            poi={poi}
          />
        ))}
      </>
    );
  }

  public componentDidMount() {
    client.OnFriendlyTargetStateChanged((state: AnyEntityState) => {
      if (state) {
        const poi = this.getFriendlyTargetPOI(state);
        if (poi.data.id && poi.data.id !== this.state.playerId) {
          if (!this.props.compass.hasPOI('friendly', `friendly-${poi.data.id}`)) {
            this.props.compass.removePOIByType('friendly');
          }
          this.props.compass.addPOI('friendly', poi);
        } else {
          this.props.compass.removePOIByType('friendly');
        }
      } else {
        this.props.compass.removePOIByType('friendly');
      }
    });
    client.OnPlayerStateChanged((state: PlayerState) => {
      this.setState((prevState: FriendlyTargetPoiProviderState) => {
        if (prevState.playerId !== state.id) {
          return {
            playerId: state.id,
          };
        } else {
          return null;
        }
      });
    });
  }

  public shouldComponentUpdate(
    nextProps: CompassPOIProviderProps<FriendlyTargetData>,
    nextState: FriendlyTargetPoiProviderState,
  ) {
    if (nextProps.compass.renderTimestamp !== this.props.compass.renderTimestamp) {
      return true;
    }
    return false;
  }

  private getFriendlyTargetPOI = (state: AnyEntityState): CompassPOIPartial<FriendlyTargetData> => {
    return withCompassPOIPartialDefaults({
      id: `friendly-${state.id}`,
      type: 'friendly',
      position: state.position,
      offset: 18,
      byAtLeast: 10,
      data: this.getFriendlyTargetData(state),
    });
  }

  private getFriendlyTargetData = (state: AnyEntityState): FriendlyTargetData => {
    return {
      id: state.id,
      name: state.name,
      isAlive: state.isAlive,
      position: state.position,
    };
  }
}
