/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Justin Vick (jusitn.zezmin@gmail.com)
 * @Date: 9/8/2017 16:48
 * @Last Modified by: Justin Vick (jusitn.zezmin@gmail.com)
 * @Last Modified time: 9/8/2017 16:48
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';


export interface MapStyle extends StyleDeclaration {
  mapContainer: React.CSSProperties;
  map: React.CSSProperties;
  mapKey: React.CSSProperties;
}

export const defaultMapStyle: MapStyle = {
  mapContainer: {
    position: 'relative',
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },

  map: {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '100%',
    position: 'relative',
  },

  mapKey: {
    position: 'relative',
    maxWidth: '25%',
    paddingLeft: '5%',
    bottom: '38%',
  },

  backgroundImg: {
    position: 'absolute',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
};

export interface MapMainProps {
  styles?: Partial<MapStyle>;
}

class MapMain extends React.Component<MapMainProps> {
  public render() {
    const ss = StyleSheet.create({ ...defaultMapStyle, ...this.props.styles });
    return (
      <div className={css(ss.mapContainer)}>
        <img src={'images/inventorybg.png'} className={css(ss.backgroundImg)}/>
        <img className={css(ss.map)} src={'images/world-map.jpg'}/>
        <img className={css(ss.mapKey)} src={'images/map-key.jpg'}/>
      </div>
    );
  }
}

export default MapMain;
