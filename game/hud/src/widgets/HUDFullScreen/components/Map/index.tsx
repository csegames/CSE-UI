/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import OL from 'ol';
import { CUQuery } from '@csegames/camelot-unchained/lib/graphql/schema';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { request } from '@csegames/camelot-unchained/lib/utils/request';
import * as events from '@csegames/camelot-unchained/lib/events';
import client from '@csegames/camelot-unchained/lib/core/client';

declare const ol: typeof OL;

const Container = styled('div')`
`;

const query = `
{
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

}

export interface State {
  updateMap: boolean;
}

type Coord = [number, number];

export class GameMap extends React.Component<Props, State> {
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
      updateMap: false,
    };
  }

  public render() {
    return (
      <Container style={{ position: 'relative' }}>
        <div id='worldmap' ref={r => this.mapRef = r} ></div>
        <div id='maptooltip' className='map-tooltip' ref={r => this.tooltipRef = r}></div>
        {this.state.updateMap ?
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
    client.OnCharacterZoneChanged((id) => {
      this.zoneID = id;
      this.fetchMetaData();
    });

    this.navigationEventHandle = events.on('hudnav--navigate', this.handleNavigationEvent);
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
    events.off(this.navigationEventHandle);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.updateMap !== nextState.updateMap) return true;
    if (this.initialized) return false;
    return true;
  }

  private handleNavigationEvent = (name: string) => {
    if (name === 'map') {
      this.setState({
        updateMap: true,
      });
    } else {
      if (this.state.updateMap) {
        this.setState({
          updateMap: false,
        });
      }
    }
  }

  private fetchMetaData = () => {
    request('get', `https://s3.amazonaws.com/camelot-unchained/map/zone/${this.zoneID}/metadata.json`)
      .then((result) => {
        if (!result.ok) {
          console.error(result.statusText);
          setTimeout(() => this.fetchMetaData(), 5000);
          return;
        }
        this.metadata = result.json();
        this.initializeMap(this.metadata);
      });
  }

  private onQueryResult = (graphql: GraphQLResult<Pick<CUQuery, 'world'>>) => {
    if (!this.map || graphql.loading || !graphql.data) {
      return;
    }

    if (!graphql.data.world || !graphql.data.world.map) {
      // no map data, so nothing to do
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

export default GameMap;
