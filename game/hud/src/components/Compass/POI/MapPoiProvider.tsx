/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import * as React from 'react';
import styled from 'react-emotion';
import { client, Vec3f, Vec2f } from '@csegames/camelot-unchained';
import hash from 'object-hash';
import {
  CompassPOIProviderProps,
  CompassPOI,
  CompassContext,
  withCompassPOIPartialDefaults,
  CompassPOIPartial,
} from 'components/Compass/CompassPOIManager';
import { CompassTooltipData } from 'components/CompassTooltip';
import { showCompassTooltip, hideCompassTooltip, updateCompassTooltip } from 'actions/compassTooltip';
// import { query } from '@csegames/camelot-unchained/lib/graphql/query';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { MapPoiProviderGQL } from 'gql/interfaces';

const MapPoi = styled('div')`
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

const MapPoiCircle = styled('div')`
  width: 20px;
  height: 20px;
  border-radius: 19px;
  background: rgba(0,0,0,.8);
  box-shadow: 0 0 1px rgba(0,0,0,.8);
  pointer-events: auto;
  background-size: contain;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }
`;

interface MapPoiData {
  id: string;
  tooltip: string;
  src: string;
  position: Vec3f | Vec2f;
}

interface MapPoiContainerProps {
  compass: CompassContext;
  poi: CompassPOI<MapPoiData>;
}
interface MapPoiContainerState {
  hoverCount: number;
  hover: boolean;
}

class MapPoiContainer extends React.Component<MapPoiContainerProps, MapPoiContainerState> {

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
        <MapPoi style={poi.placementStyle}>
          <MapPoiCircle
            style={{
              WebkitTransform: `scale(${1 + scaleAmount}`,
              transform: `scale(${1 + scaleAmount}`,
              backgroundImage: `url(${poi.data.src})`,
            }}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          />
        </MapPoi>
      </>
    );
  }

  public shouldComponentUpdate(nextProps: MapPoiContainerProps, nextState: MapPoiContainerState) {
    if (nextProps.compass.renderTimestamp !== this.props.compass.renderTimestamp) {
      return true;
    }
    return false;
  }

  public componentDidMount() {
    client.OnCharacterZoneChanged((id) => {
      this.props.compass.removePOIByType('map');
    });
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
      title: this.props.poi.data.tooltip,
      distance: this.props.poi.distance,
      elevation: this.props.poi.elevation,
      bearing: this.props.poi.bearing,
    };
  }

  private handleMouseEnter = () => {
    this.setState((prevState: MapPoiContainerState) => {
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
      this.setState((prevState: MapPoiContainerState) => {
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

const query = gql`
  query MapPoiProviderGQL {
    world {
      map {
        static {
          position
          tooltip
          src
        }

        dynamic {
          position
          tooltip
          src
        }
      }
    }
  }
`;

export interface MapPoiProviderProps extends CompassPOIProviderProps<MapPoiData> {}

export interface MapPoiProviderState {}

export default class MapPoiProvider extends React.Component<
  MapPoiProviderProps,
  MapPoiProviderState
> {

  public state = {};

  public render() {
    return (
      <>
        <GraphQL
          query={{
            query,
            pollInterval: 30000,
          }}
          onQueryResult={this.onQueryResult}
        />
        {this.props.pois.map(poi => (
          <MapPoiContainer
            key={poi.id}
            compass={this.props.compass}
            poi={poi}
          />
        ))}
      </>
    );
  }

  public componentDidMount() {
  }

  public componentWillUnmount() {
  }

  public shouldComponentUpdate(nextProps: CompassPOIProviderProps<MapPoiData>, nextState: MapPoiProviderState) {
    if (nextProps.compass.renderTimestamp !== this.props.compass.renderTimestamp) {
      return true;
    }
    return false;
  }

  private onQueryResult = (graphql: GraphQLResult<MapPoiProviderGQL.Query>) => {
    if (graphql.ok && graphql.data && graphql.data.world  && graphql.data.world.map) {
      const pois: CompassPOIPartial<MapPoiData>[] = [];
      if (graphql.data.world.map.dynamic) {
        graphql.data.world.map.dynamic.forEach((dynamicMarker) => {
          pois.push(this.getMapPoi({
            id: hash(dynamicMarker),
            position: {
              x: dynamicMarker.position[0],
              y: dynamicMarker.position[1],
            },
            src: dynamicMarker.src,
            tooltip: dynamicMarker.tooltip,
          }));
        });
      }
      if (graphql.data.world.map.static) {
        graphql.data.world.map.static.forEach((staticMarker) => {
          pois.push(this.getMapPoi({
            id: hash(staticMarker),
            position: {
              x: staticMarker.position[0],
              y: staticMarker.position[1],
            },
            src: staticMarker.src,
            tooltip: staticMarker.tooltip,
          }));
        });
      }
      const newIds = pois.map(poi => poi.id);
      const existingIds = this.props.pois.map(poi => poi.id);
      const toDelete = existingIds.filter(id => newIds.indexOf(id) < 0);
      this.props.compass.addPOI('map', pois);
      this.props.compass.removePOI('map', toDelete);
    }
  }

  private getMapPoi = (data: MapPoiData): CompassPOIPartial<MapPoiData> => {
    return withCompassPOIPartialDefaults({
      id: `map-${data.id}`,
      type: 'map',
      position: data.position,
      offset: 18,
      byAtLeast: 10,
      data,
    });
  }
}
