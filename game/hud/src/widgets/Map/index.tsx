/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import MapMain from './components/MapMain';

export interface MapContainerProps {
  containerClass?: string;
  visibleComponent: string;
}

export interface MapContainerState {
  visible: boolean;
  mapLoaded: boolean;
}

class MapContainer extends React.Component<MapContainerProps, MapContainerState> {
  private map: HTMLImageElement;

  constructor(props: MapContainerProps) {
    super(props);
    this.state = {
      visible: false,
      mapLoaded: false,
    };
    this.map = new Image();
    this.map.src = 'images/world-map.jpg';
    this.map.onload = () => {
      this.setState((prevState) => {
        return {
          ...prevState,
          mapLoaded: true,
        };
      });
    };
  }

  public render() {
    return (this.props.visibleComponent === 'map' && this.state.mapLoaded) && (
      <MapMain map={this.map} mapKey={'images/map-key.jpg'} />
    );
  }
}

export default MapContainer;
