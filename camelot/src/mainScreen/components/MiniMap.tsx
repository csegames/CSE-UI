/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../redux/hudSlice';
import { AddDispatch, RootState } from '../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { floatEquals } from '@csegames/library/dist/_baseGame/utils/mathExtensions';
import { getFactionData } from '../gameData/factionData';
import { ResizeDetector } from '../../shared/components/ResizeDetector';
import { WorldMapIcons } from './WorldMapIcons';
import { getMapDetails, parseZoneBounds } from '../helpers/mapHelpers';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.25;
const BASE_MAP_HEIGHT_VMIN = 69;

// CSS classes
const Root = 'HUD-MiniMap-Root';
const MiniMapCircleMask = 'HUD-MiniMap-CircleMask';
const MiniMapContainer = 'HUD-Minimap-Container';
const MiniMapImage = 'HUD-MiniMap-Image';
const MiniMapFrame = 'HUD-MiniMap-Frame';
const MiniMapZoomIn = 'HUD-MiniMap-ZoomIn';
const MiniMapZoomOut = 'HUD-MiniMap-ZoomOut';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  uiFactionID: string;
  zoneID: string;
  zones: Record<string, ZoneInfo>;
}

interface State {
  animationHandle: ListenerHandle;
  xPercent: number;
  yPercent: number;
  mapWidth: number;
  mapHeight: number;
  maskWidth: number;
  maskHeight: number;
  zoom: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AMiniMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animationHandle: clientAPI.startAnimation(this.animate.bind(this)),
      xPercent: -1,
      yPercent: -1,
      mapWidth: -1,
      mapHeight: -1,
      maskWidth: -1,
      maskHeight: -1,
      zoom: clientAPI.getMinimapState().zoom
    };
  }

  render(): React.ReactNode {
    const zone = this.props.zones[this.props.zoneID];
    if (this.state.xPercent < 0 || this.state.yPercent < 0 || !zone) {
      return null;
    }
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div className={Root}>
        <div className={MiniMapCircleMask} style={{ backgroundImage: `url(${factionData.squareBackgroundImage})` }}>
          <ResizeDetector onResize={this.onMaskResize.bind(this)} />
          <div className={MiniMapContainer} style={this.buildContainerStyle()}>
            <ResizeDetector onResize={this.onContainerResize.bind(this)} />
            <img
              className={MiniMapImage}
              style={{ height: `${BASE_MAP_HEIGHT_VMIN * this.state.zoom}vmin` }}
              src={getMapDetails(zone).mapURL}
            />
            <WorldMapIcons zone={zone} />
          </div>
        </div>
        <img className={MiniMapFrame} src={factionData.miniMapImage} />
        <div
          className={MiniMapZoomIn}
          style={{ backgroundImage: `url(${factionData.squareBackgroundImage})`, borderColor: factionData.borderColor }}
          onClick={this.onZoomIn.bind(this)}
        >+</div>
        <div
          className={MiniMapZoomOut}
          style={{ backgroundImage: `url(${factionData.squareBackgroundImage})`, borderColor: factionData.borderColor }}
          onClick={this.onZoomOut.bind(this)}
        >−</div>
      </div>
    );
  }

  private onZoomIn(): void {
    const zoom = Math.min(this.state.zoom + ZOOM_STEP, MAX_ZOOM);
    this.setState({ zoom });
    clientAPI.setMinimapState({ zoom });
    clientAPI.playGameSound(SoundEvents.PLAY_UI_MINI_MAP_PLUS);
  }

  private onZoomOut(): void {
    const zoom = Math.max(this.state.zoom - ZOOM_STEP, MIN_ZOOM);
    this.setState({ zoom });
    clientAPI.setMinimapState({ zoom });
    clientAPI.playGameSound(SoundEvents.PLAY_UI_MINI_MAP_MINUS);
  }

  private onMaskResize(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number): void {
    this.setState({ maskWidth: newWidth, maskHeight: newHeight });
  }

  private onContainerResize(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number): void {
    this.setState({ mapWidth: newWidth, mapHeight: newHeight });
  }

  private buildContainerStyle(): React.CSSProperties {
    const factionData = getFactionData(this.props.uiFactionID);

    let props: React.CSSProperties = {
      backgroundImage: `url(${factionData.squareBackgroundImage})`
    };
    // If the map hasn't loaded, don't try to style it yet.
    if (this.state.mapHeight < 0) {
      return props;
    }

    // xPercent and yPercent are the player's relative coordinates inside of the zone bounds.
    // We need to convert those to coordinates within the map bounds.
    const mapBounds = getMapDetails(this.props.zones[this.props.zoneID]).bounds;
    const zoneBounds = parseZoneBounds(this.props.zones[this.props.zoneID].Bounds);

    const zoneStartPercentX = (zoneBounds.x - mapBounds.x) / mapBounds.width;
    const zoneStartPercentY = (zoneBounds.y - mapBounds.y) / mapBounds.height;
    const zoneWidthPercent = zoneBounds.width / mapBounds.width;
    const zoneHeightPercent = zoneBounds.height / mapBounds.height;

    const mapXPercent = this.state.xPercent * zoneWidthPercent + zoneStartPercentX;
    const mapYPercent = this.state.yPercent * zoneHeightPercent + zoneStartPercentY;

    const offsetX = -mapXPercent * this.state.mapWidth + this.state.maskWidth / 2.0;
    const offsetY = -mapYPercent * this.state.mapHeight + this.state.maskHeight / 2.0;

    props.transform = `translate(${offsetX}px, ${offsetY}px)`;

    return props;
  }

  componentWillUnmount(): void {
    this.state.animationHandle.close();
  }

  private animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    const { playerYaw, playerX, playerY } = data;
    const zone = this.props.zones[this.props.zoneID];
    if (!zone || isNaN(playerYaw) || isNaN(playerX) || isNaN(playerY)) {
      if (this.state.xPercent >= 0 || this.state.yPercent >= 0) {
        this.setState({
          xPercent: -1,
          yPercent: -1
        });
      }
      return;
    }
    const zoneCoordinates = zone.Bounds.split(' - ');
    const startX = Number(zoneCoordinates[0].substring(1, zone.Bounds.indexOf(',')));
    const startY = Number(zoneCoordinates[0].substring(zoneCoordinates[0].indexOf(',') + 1));
    const endX = Number(zoneCoordinates[1].substring(0, zoneCoordinates[1].indexOf(',')));
    const endY = Number(
      zoneCoordinates[1].substring(zoneCoordinates[1].indexOf(',') + 1, zoneCoordinates[1].length - 1)
    );
    const rangeX = endX - startX;
    const rangeY = endY - startY;
    let xPercent = (playerX - startX) / rangeX;
    // Zone y-coords have zero at the bottom.  UI y-coords have zero at the top.  So we invert the yPercent.
    let yPercent = 1.0 - (playerY - startY) / rangeY;

    if (
      this.state.xPercent < 0 ||
      !floatEquals(xPercent, this.state.xPercent, 0.001) ||
      this.state.yPercent < 0 ||
      !floatEquals(yPercent, this.state.yPercent, 0.001)
    ) {
      this.setState({
        xPercent,
        yPercent
      });
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    zoneID: state.loading.zoneID,
    zones: state.zones.zones
  };
};

const MiniMap = connect(mapStateToProps)(AMiniMap);

export const WIDGET_ID_WORLD_MAP = 'Mini Map';
export const miniMapRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_WORLD_MAP,
  nameStringID: 'HUDEditorWidgetNameMiniMap',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 2.5,
    yOffset: 2.5
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <MiniMap isDragCopy={isDragCopy} />;
  }
};
