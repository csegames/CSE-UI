/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import OL from 'ol';
import { CUQuery } from 'camelot-unchained/lib/graphql/schema';
import { withGraphQL, GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';

declare const ol: typeof OL;

const Container = styled('div')`
`;

export interface Props extends GraphQLInjectedProps<Pick<CUQuery, 'world'>> {

}

export interface State {

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

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <Container style={{ position: 'relative' }}>
        <div id='worldmap' ref={r => this.mapRef = r} ></div>
        <div id='maptooltip' className='map-tooltip' ref={r => this.tooltipRef = r}></div>
      </Container>
    );
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (!this.map || nextProps.graphql.loading || !nextProps.graphql.data) {
      return;
    }

    if (!nextProps.graphql.data.world || !nextProps.graphql.data.world.map) {
      // no map data, so nothing to do
      return;
    }

    if (nextProps.graphql.data.world.map.dynamic) {

      const features = nextProps.graphql.data.world.map.dynamic.map((point): ol.Feature => {
        const feature = new ol.Feature({
          type: 'icon',
          geometry: new ol.geom.Point(point.position as Coord),
          content: point.tooltip,
        });

        let image: ol.style.Icon;
        image = new ol.style.Icon({
          src: point.src,
          color: point.color,
          // anchor: point.anchor,
          anchorOrigin: 'top-left',
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
        });

        feature.setStyle(new ol.style.Style({ image }));
        return feature;
      });

      if (features.length > 0) {
        console.log('adding features');
        this.dynamicVectorSource.clear();
        this.dynamicVectorSource.addFeatures(features);
      }
    }
  }

  public componentDidMount() {
    const height = 4525;
    const width = 4512;
    const extent: [number, number, number, number] = [width * -0.5, height * -0.5, width * 0.5, height * 0.5];
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
          url: 'images/world-map.jpg',
          projection: new ol.proj.Projection({
            code: 'map-image',
            units: 'pixels',
            extent,
          }),
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

    this.initialized = true;
  }

  public componentWillUnmount() {
    this.map.setTarget(undefined);
    this.dynamicVectorSource.clear();
    this.staticVectorSource.clear();
    this.initialized = false;
  }

  public shouldComponentUpdate() {
    if (this.initialized) return false;
    return true;
  }
}

export default withGraphQL(`
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
`)(GameMap);
