/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import * as React from 'react';
import styled from 'react-emotion';
import OL from 'ol';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { request } from '@csegames/camelot-unchained/lib/utils/request';

import { FullScreenContext } from '../../lib/utils';
import { MapGQL } from 'gql/interfaces';

declare const ol: typeof OL;

const Container = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  background: url(images/map/map_bg.jpg);
  background-size: cover;
`;

const LoadingContainer = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LoadingText = styled('div')`
  font-size: 22px;
  color: white;
`;

const RetryButton = styled('button')`
  font-size: 22px;
  display: block;
  background: rgba(255,0,0,0.4);
  border: none;
  color: white !important;
  border-radius: 5px;
  padding: 10px;
  margin-top: 25px !important;
  &:hover {
    background: rgba(255,0,0,0.6);
  }
  &:focus {
    outline: 0;
    outline-color: transparent;
    outline-style: none;
  }
`;

const query = gql`
  query MapGQL {
    world {
      map {
        static {
          position
          anchor
          tooltip
          src
          offset
          size
          color
          actions {
            onClick {
              type
              command
            }
          }
        }

        dynamic {
          position
          anchor
          tooltip
          src
          offset
          size
          color
          actions {
            onClick {
              type
              command
            }
          }
        }
      }
    }
  }
`;

interface MapMetadata {
  ZoneName: string;
  ResourceID: string;
  MapBoundsM: {
    min: { x: number; y: number; z: number; };
    max: { x: number; y: number; z: number; };
  };
  MapResolutionPx: { x: number; y: number; };
  ScalePxToM: number;
}

export interface Props {
  visibleComponentLeft: string;
  visibleComponentRight: string;
}

export interface State {
  loading: boolean;
  failedToLoad: boolean;
}

type Coord = [number, number];

export class GameMap extends React.Component<Props, State> {
  private eventHandles: EventHandle[] = [];
  private mapRef: HTMLDivElement = null;
  private tooltipRef: HTMLDivElement = null;
  private map: ol.Map;
  private tooltip: ol.Overlay;
  private staticVectorSource: ol.source.Vector;
  private dynamicVectorSource: ol.source.Vector;
  private initialized = false;
  private zoneID: string;
  private metadata: MapMetadata;
  private navigationEventHandle: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      failedToLoad: false,
    };
  }

  public render() {
    const { visibleComponentLeft, visibleComponentRight } = this.props;
    return (
      <Container style={{ position: 'relative' }}>
        <div id='worldmap' ref={r => this.mapRef = r} ></div>
        <div id='maptooltip' className='map-tooltip' ref={r => this.tooltipRef = r}></div>
        {this.state.loading &&
          <LoadingContainer>
            {this.state.failedToLoad ? (
              <>
                <LoadingText>Failed To Load Map Data</LoadingText>
                <RetryButton onClick={this.fetchMetaData}>RELOAD</RetryButton>
              </>
            ) : (
              <LoadingText>Fetching Map Data...</LoadingText>
            )}
          </LoadingContainer>
        }
        {this.metadata && (visibleComponentLeft === 'map-left' || visibleComponentRight === 'map-right') ?
          <GraphQL
            query={{
              query,
              pollInterval: 2000,
            }}
            onQueryResult={this.onQueryResult}
          /> : null
        }
      </Container>
    );
  }

  public componentDidMount() {
    this.initialized = true;
    this.zoneID = window['zoneID'];
    this.fetchMetaData();
    this.eventHandles.push(game.selfPlayerState.onUpdated(() => {
      if (game.selfPlayerState.zoneID !== this.zoneID) {
        this.zoneID = game.selfPlayerState.zoneID;
        this.fetchMetaData();
      }
    }));
  }

  public componentWillUnmount() {
    if (this.map) {
      this.map.setTarget(undefined);
    }
    if (this.dynamicVectorSource) {
      this.dynamicVectorSource.clear();
    }
    if (this.staticVectorSource) {
      this.staticVectorSource.clear();
    }
    this.initialized = false;
    game.off(this.navigationEventHandle);
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.props.visibleComponentLeft !== nextProps.visibleComponentLeft) return true;
    if (this.props.visibleComponentRight !== nextProps.visibleComponentRight) return true;
    if (this.state.loading !== nextState.loading) return true;
    if (this.state.failedToLoad !== nextState.failedToLoad) return true;
    if (this.initialized) return false;
    return true;
  }

  private fetchMetaData = () => {
    this.setState({
      failedToLoad: false,
    });
    request('get', `https://s3.amazonaws.com/camelot-unchained/map/zone/${this.zoneID}/metadata.json`)
      .then((result) => {
        if (!result.ok) {
          this.setState({
            failedToLoad: true,
          });
          return;
        }
        this.metadata = result.json();
        this.initializeMap(this.metadata);
      });
  }

  private onQueryResult = (graphql: GraphQLResult<MapGQL.Query>) => {
    if (!this.map || graphql.loading || !graphql.data) {
      if (!this.state.loading) {
        this.setState({ loading: true });
      }
      return;
    }

    if (!graphql.data.world || !graphql.data.world.map) {
      // no map data, so nothing to do
      if (!this.state.loading) {
        this.setState({ loading: true });
      }
      return;
    }

    if (graphql.data.world.map.dynamic) {

      const features = graphql.data.world.map.dynamic.map((point): ol.Feature => {

        const projectedPosition: Coord = [
          point.position[0] / this.metadata.ScalePxToM,
          point.position[1] / this.metadata.ScalePxToM,
        ];

        const feature = new ol.Feature({
          type: 'icon',
          geometry: new ol.geom.Point(projectedPosition),
          content: point.tooltip,
        });

        let image: ol.style.Icon;
        image = new ol.style.Icon({
          src: point.src,
          // color: point.color,
          // crossOrigin: 'anonymous',
          anchor: point.anchor,
          anchorOrigin: 'top-left',
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
        });

        feature.setStyle(new ol.style.Style({ image }));
        return feature;
      });

      if (features.length > 0) {
        this.dynamicVectorSource.clear();
        this.dynamicVectorSource.addFeatures(features);
      }

      if (this.state.loading) {
        this.setState({ loading: false });
      }
    }
  }

  private initializeMap = (metadata: MapMetadata) => {
    // const height = metadata.MapResolutionPx.y;
    // const width = metadata.MapResolutionPx.x;
    // const extent: [number, number, number, number] = [width * -0.5, height * -0.5, width * 0.5, height * 0.5];
    const extent: [number, number, number, number] = [
      metadata.MapBoundsM.min.x / metadata.ScalePxToM,
      metadata.MapBoundsM.min.y / metadata.ScalePxToM,
      metadata.MapBoundsM.max.x / metadata.ScalePxToM,
      metadata.MapBoundsM.max.y / metadata.ScalePxToM,
    ];
    const projection = new ol.proj.Projection({
      code: 'map-image',
      units: 'pixels',
      extent,
    });

    this.staticVectorSource = new ol.source.Vector({
      features: [],
    });

    this.dynamicVectorSource = new ol.source.Vector({
      features: [],
    });

    const layers = [
      new ol.layer.Image({
        source: new ol.source.ImageStatic({
          projection,
          url: `https://s3.amazonaws.com/camelot-unchained/map/zone/${metadata.ResourceID}/full.bmp`,
          imageExtent: extent,
        }),
      }),
      new ol.layer.Vector({
        source: this.staticVectorSource,
      }),
      new ol.layer.Vector({
        source: this.dynamicVectorSource,
      }),
    ];

    this.map = new ol.Map({
      view: new ol.View({
        projection,
        center: ol.extent.getCenter(extent),
        zoom: 2,
        maxZoom: 8,
      }),
      controls: ol.control.defaults({
        attributionOptions: {
          className: 'display-none',
        },
      }),
      logo: false,
      layers,
    });

    this.tooltip = new ol.Overlay({
      element: this.tooltipRef,
      positioning: 'bottom-center',
      stopEvent: false,
    });

    if (this.map) {
      this.map.setTarget(this.mapRef);
      this.map.addOverlay(this.tooltip);

      this.map.on('pointermove', (e: any) => {
        const pixel = e.pixel;
        const feature = this.map.forEachFeatureAtPixel(pixel, f => f);
        this.tooltipRef.style.display = feature ? '' : 'none';
        if (feature) {
          this.tooltip.setPosition(e.coordinate);
          this.tooltipRef.innerHTML = feature.get('content');
        }
      });
    }
  }
}

class GameMapWithInjectedContext extends React.Component<{}> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({ visibleComponentLeft, visibleComponentRight }) => {
          return (
            <GameMap visibleComponentLeft={visibleComponentLeft} visibleComponentRight={visibleComponentRight} />
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default GameMapWithInjectedContext;
