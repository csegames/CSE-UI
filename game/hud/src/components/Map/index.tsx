/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import OL from 'ol';

declare const ol: typeof OL;

const Container = styled('div')`
`;

export interface Props {

}

export interface State {

}

export class GameMap extends React.PureComponent<Props, State> {
  private mapRef: HTMLDivElement = null;
  private map: ol.Map;

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public render() {


    return (
      <Container>
        <div id='worldmap' ref={(r: HTMLDivElement) => this.mapRef = r}>
        </div>
      </Container>
    );
  }

  public componentDidMount() {

    const extent: [number, number, number, number] = [0, 0, 1024, 968];
    const projection = new ol.proj.Projection({
      code: 'map-image',
      units: 'pixels',
      extent,
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

    console.log(this.mapRef);
    this.map.setTarget(this.mapRef || document.getElementById('worldmap'));
  }

  public componentWillUnmount() {
    this.map.setTarget(undefined);
  }
}

export default GameMap;
