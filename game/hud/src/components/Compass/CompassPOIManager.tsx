/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  getCompassFacingData,
  getCompassPositionData,
  calculateBearing,
  calculateDistance,
  calculateElevation,
  convertToMinusAngle,
} from 'actions/compass';
import { Vec2f, Vec3f } from '@csegames/camelot-unchained';
import { easeLinear } from 'd3-ease';
import Animate from 'react-move/Animate';

export type CompassPOIPartial<D = any> = (Pick<
  CompassPOI<D> & CompassPOIWithPosition,
  'id' |
  'type' |
  'data' |
  'offset' |
  'byAtLeast' |
  'position'
> | Pick<
  CompassPOI<D> & CompassPOIWithDegrees,
  'id' |
  'type' |
  'data' |
  'offset' |
  'byAtLeast' |
  'degrees'
>);

export type CompassPOI<D = any> = {
  id: string;
  type: string;
  data: D;
  offset: number;
  byAtLeast: number;
  distance: number;
  elevation: number;
  bearing: number;
  placement: number;
  placementStyle: React.CSSProperties;
  isLevel: boolean;
  isAbove: boolean;
  isBelow: boolean;
} & (CompassPOIWithPosition | CompassPOIWithDegrees);

export type CompassPOIWithPosition = {
  position: Vec3f;
};

export type CompassPOIWithDegrees = {
  degrees: number;
};

export function isCompassPOIWithDegrees(poi: CompassPOI): poi is typeof poi & CompassPOIWithDegrees {
  if (poi.hasOwnProperty('degrees')) {
    return true;
  }
  return false;
}

export function isCompassPOIWithPosition(poi: CompassPOI): poi is typeof poi & CompassPOIWithPosition {
  if (poi.hasOwnProperty('position')) {
    return true;
  }
  return false;
}

export function withCompassPOIPartialDefaults<D = any>(poi: Partial<CompassPOIPartial<D>>): CompassPOIPartial<D> {
  return {
    ...{
      offset: 0,
      byAtLeast: 0,
    },
    ...poi,
  } as CompassPOIPartial<D>;
}

export interface CompassPOIList {
  [type: string]: {
    [id: string]: CompassPOI;
  };
}

export interface CompassPOIProviderProps<D = any> {
  compass: CompassContext;
  pois: CompassPOI<D>[];
}

export interface CompassContext {
  renderTimestamp: number;
  poiList: CompassPOIList;
  facing: number;
  facingNorth: number;
  position: Vec3f;
  convertToArray: <D = any>(type: string, poiList: CompassPOIList) => CompassPOI<D>[];
  hasPOI: (type: string, id: string) => boolean;
  addPOI: (type: string, pois: CompassPOIPartial | CompassPOIPartial[]) => void;
  updatePOI: (type: string, pois: CompassPOIPartial | CompassPOIPartial[]) => void;
  removePOI: (type: string, ids: string | string[]) => void;
  removePOIByType: (type: string) => void;
}

export interface CompassPOIManagerInnerProps {
  children: (value: CompassContext) => React.ReactNode;
  degreesToShow: number;
  position: Vec3f;
}

export interface CompassPOIManagerInnerState {
  renderTimestamp: number;
  poiList: CompassPOIList;
  facing: number;
  facingNorth: number;
}

class CompassPOIManagerInner extends React.Component<CompassPOIManagerInnerProps, CompassPOIManagerInnerState> {
  public name: string = 'CompassPOIManager';

  private renderIntervalTime: number = 100;
  private renderInterval: NodeJS.Timer;
  private updateFacingIntervalTime: number = 25;
  private updateFacingInterval: NodeJS.Timer;

  public state = {
    renderTimestamp: 0,
    poiList: {},
    facing: 0,
    facingNorth: 0,
  };

  public render() {
    const poiList = this.buildPOIList();
    return (
      <>
        {this.props.children({
          renderTimestamp: this.state.renderTimestamp,
          poiList,
          convertToArray: this.convertToArray,
          facing: this.state.facing,
          facingNorth: this.state.facingNorth,
          position: this.props.position,
          hasPOI: this.hasPOI,
          addPOI: this.addPOI,
          updatePOI: this.updatePOI,
          removePOI: this.removePOI,
          removePOIByType: this.removePOIByType,
        })}
      </>
    );
  }

  public shouldComponentUpdate(nextProps: CompassPOIManagerInnerProps, nextState: CompassPOIManagerInnerState) {
    if (this.state.renderTimestamp !== nextState.renderTimestamp) {
      return true;
    }
    return false;
  }

  public componentDidMount() {
    this.renderInterval = setInterval(this.updateRenderTimestamp, this.renderIntervalTime);
    this.updateFacingInterval = setInterval(this.updateFacing, this.updateFacingIntervalTime);
  }

  public componentWillUnmount() {
    clearInterval(this.renderInterval);
    clearInterval(this.updateFacingInterval);
  }

  private updateRenderTimestamp = () => {
    this.setState((prevState: CompassPOIManagerInnerState) => ({
      renderTimestamp: (new Date()).getTime(),
    }));
  }

  private updateFacing = () => {
    this.setState(getCompassFacingData());
  }

  private buildPOIList = (): CompassPOIList => {
    return Object.keys(this.state.poiList).reduce((currentList, type) => {
      return {
        ...currentList,
        [type]: (Object.keys(this.state.poiList[type]).reduce((currentPOIs, id) => {
          const poi: CompassPOI = this.state.poiList[type][id];
          const poiInfo: Partial<CompassPOI> = {};
          if (isCompassPOIWithDegrees(poi)) {
            poiInfo.placement = this.getPoiPlacement(poi.degrees);
            poiInfo.placementStyle = this.getPoiPlacementStyle(poiInfo.placement, poi.offset);
            poiInfo.distance = 0;
            poiInfo.elevation = 0;
            poiInfo.bearing = this.getBearing(poi.degrees);
            poiInfo.isAbove = false;
            poiInfo.isBelow = false;
            poiInfo.isLevel = true;
          } else if (isCompassPOIWithPosition(poi)) {
            poiInfo.placement = this.getPoiPlacement(poi.position);
            poiInfo.placementStyle = this.getPoiPlacementStyle(poiInfo.placement, poi.offset);
            poiInfo.distance = this.getDistance(poi.position);
            poiInfo.elevation = this.getElevation(poi.position);
            poiInfo.bearing = this.getBearing(poi.position);
            poiInfo.isAbove = this.isTargetAbove(poi.position, poi.byAtLeast);
            poiInfo.isBelow = this.isTargetBelow(poi.position, poi.byAtLeast);
            poiInfo.isLevel = this.isTargetLevel(poi.position, poi.byAtLeast);
          }
          return {
            ...currentPOIs,
            [id]: {
              ...poi,
              ...poiInfo,
            },
          };
        }, {})),
      };
    }, {});
  }

  private convertToArray<D = any>(type: string, poiList: CompassPOIList) {
    if (poiList[type]) {
      return Object.keys(poiList[type]).map((id) => {
        return poiList[type][id];
      }) as CompassPOI<D>[];
    } else {
      return [] as CompassPOI<D>[];
    }
  }

  private hasPOI = (type: string, id: string) => {
    if (this.state.poiList[type] && this.state.poiList[type][id]) {
      return true;
    } else {
      return false;
    }
  }

  private addPOI = (type: string, pois: CompassPOIPartial | CompassPOIPartial[]) => {
    const poiArray = Array.isArray(pois) ? pois : [pois];
    this.setState((prevState: CompassPOIManagerInnerState) => {
      return {
        ...prevState,
        poiList: {
          ...prevState.poiList,
          [type]: {
            ...(prevState.poiList[type] ? prevState.poiList[type] : {}),
            ...(poiArray.reduce((carry, poi) => {
              return {
                ...carry,
                [poi.id]: poi,
              };
            }, {})),
          },
        },
      };
    });
  }

  private updatePOI = (type: string, pois: CompassPOIPartial | CompassPOIPartial[]) => {
    const poiArray = Array.isArray(pois) ? pois : [pois];
    this.setState((prevState: CompassPOIManagerInnerState) => {
      return {
        ...prevState,
        poiList: {
          ...prevState.poiList,
          [type]: {
            ...(prevState.poiList[type] ? prevState.poiList[type] : {}),
            ...(poiArray.reduce((carry, poi) => {
              return {
                ...carry,
                [poi.id]: {
                  ...((
                    prevState.poiList[type] ?
                    prevState.poiList[type] :
                    {}
                  ).hasOwnProperty(poi.id) ? prevState.poiList[type][poi.id] : {}),
                  ...poi,
                },
              };
            }, {})),
          },
        },
      };
    });
  }

  private removePOI = (type: string, ids: string | string[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    this.setState((prevState: CompassPOIManagerInnerState) => {
      const currentList = prevState.poiList[type] ? prevState.poiList[type] : {};
      return {
        ...prevState,
        poiList: {
          ...prevState.poiList,
          [type]: {
            ...(Object.keys(currentList).reduce((carry, key) => {
              if (idsArray.indexOf(key) >= 0) {
                return carry;
              } else {
                const poi = currentList[key];
                return {
                  ...carry,
                  [poi.id]: poi,
                };
              }
            }, {})),
          },
        },
      };
    });
  }

  private removePOIByType = (type: string) => {
    this.setState((prevState: CompassPOIManagerInnerState) => {
      return {
        ...prevState,
        poiList: {
          ...(Object.keys(prevState.poiList).reduce((carry, key) => {
            if (key === type) {
              return {
                ...carry,
                [key]: {},
              };
            } else {
              return {
                ...carry,
                [key]: prevState.poiList[key],
              };
            }
          }, {})),
        },
      };
    });
  }

  private getBearing = (target: Vec2f | Vec3f | number) => {
    if (typeof target === 'number') {
      return 0;
    } else {
      return calculateBearing(this.props.position, target);
    }
  }

  private getDistance = (target: Vec2f | Vec3f | number) => {
    if (typeof target === 'number') {
      return 0;
    } else {
      return calculateDistance(this.props.position, target);
    }
  }

  private getElevation = (target: Vec2f | Vec3f | number) => {
    if (typeof target === 'number') {
      return 0;
    } else {
      return calculateElevation(this.props.position, target);
    }
  }

  private isTargetAbove = (target: Vec2f | Vec3f | number, byAtLeast: number = 0) => {
    return (this.getElevation(target) - byAtLeast) > 0;
  }

  private isTargetBelow = (target: Vec2f | Vec3f | number, byAtLeast: number = 0) => {
    return (this.getElevation(target) + byAtLeast)  < 0;
  }

  private isTargetLevel = (target: Vec2f | Vec3f | number, buffer: number = 0) => {
    return this.getElevation(target) <= buffer &&  this.getElevation(target) >= (0 - buffer);
  }

  private getPoiPlacement = (angleOrPosition: number | Vec3f | Vec2f): number => {
    let angle;
    if (typeof angleOrPosition === 'number') {
      angle = angleOrPosition;
    } else {
      angle = this.getBearing(angleOrPosition);
    }
    angle = angle % 360;
    const facingAdjustment = 360 - this.state.facingNorth;
    const percentPerDegree = 100 / this.props.degreesToShow;
    const adjustedAngle = convertToMinusAngle((angle + facingAdjustment) % 360);
    const leftPosition = (adjustedAngle * percentPerDegree) + 50;
    return leftPosition;
  }

  private getPoiPlacementStyle = (placement: number, offset: number = 0): React.CSSProperties => {
    return {
      visibility: (placement < -25 || placement > 125) ? 'hidden' : 'visible',
      left: `calc(${placement}% - ${offset}px)`,
    };
  }
}

export interface CompassPOIManagerProps {
  children: (value: CompassContext) => React.ReactNode;
  degreesToShow: number;
}

export interface CompassPOIManagerState {
  position: Vec3f;
}

class CompassPOIManager extends React.Component<CompassPOIManagerProps, CompassPOIManagerState> {

  private updatePositionIntervalTime: number = 25;
  private updatePositionInterval: NodeJS.Timer;

  public state = {
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  };

  public render() {
    return (
      <Animate
        key={'position'}
        start={{
          x: this.state.position.x,
          y: this.state.position.y,
          z: this.state.position.z,
        }}
        update={{
          x: [this.state.position.x],
          y: [this.state.position.y],
          z: [this.state.position.z],
          timing: { duration: 200, ease: easeLinear, delay: 0 },
        }}
        >
        {({ x, y, z }: any | Vec3f) => (
          <CompassPOIManagerInner
            degreesToShow={this.props.degreesToShow}
            position={{ x, y, z }}
            children={this.props.children}
          />
        )}
      </Animate>
    );
  }

  public shouldComponentUpdate(nextProps: CompassPOIManagerProps, nextState: CompassPOIManagerState) {
    if (this.props.children !== nextProps.children) {
      return true;
    }
    if (this.props.degreesToShow !== nextProps.degreesToShow) {
      return true;
    }
    if (
      this.state.position.x !== nextState.position.x ||
      this.state.position.y !== nextState.position.y ||
      this.state.position.z !== nextState.position.z
    ) {
      return true;
    }
    return false;
  }

  public componentDidMount() {
    this.updatePositionInterval = setInterval(this.updatePosition, this.updatePositionIntervalTime);
  }

  public componentWillUnmount() {
    clearInterval(this.updatePositionInterval);
  }

  private updatePosition = () => {
    this.setState(getCompassPositionData());
  }
}

export default CompassPOIManager;
