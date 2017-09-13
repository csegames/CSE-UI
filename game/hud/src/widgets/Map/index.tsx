/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Justin Vick (justin.zezmin@gmail.com)
 * @Date: 2017-09-08 16:32
 * @Last Modified by: Justin Vick (justin.zezmin@gmail.com)
 * @Last Modified time: 2017-09-08 16:32
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

const map = new Image();

class MapContainer extends React.Component<MapContainerProps, MapContainerState> {
  constructor(props: MapContainerProps) {
    super(props);
    this.state = {
      visible: false,
      mapLoaded: false,
    };
  }

  public componentWillMount() {
    map.src = 'images/world-map.jpg';
    map.onload = () => {
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
      <MapMain map={map} mapKey={'images/map-key.jpg'}/>
    );
  }
}

export default MapContainer;
