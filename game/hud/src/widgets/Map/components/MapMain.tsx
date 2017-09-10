/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Justin Vick (justin.zezmin@gmail.com)
 * @Date: 9/8/2017 16:48
 * @Last Modified by: Justin Vick (justin.zezmin@gmail.com)
 * @Last Modified time: 9/8/2017 16:48
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';


export interface MapStyle extends StyleDeclaration {
  mainMapContainer: React.CSSProperties;
  map: React.CSSProperties;
  mapKey: React.CSSProperties;
}

export const defaultMapStyle: MapStyle = {
  mainMapContainer: {
    display: '-webkit-inline-box',
    position: 'relative',
    height: '100%',
    width: '100%',
  },

  mapContainer: {
    width: '75%',
    height: '100%',
    position: 'relative',
  },

  map: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRight: '2px #3b524a',
    borderRightStyle: 'dashed',
  },

  keyContainer: {
    position: 'relative',
    width: '25%',
    textAlign: 'center',
  },

  mapKey: {
    position: 'relative',
    maxWidth: '50%',
    marginTop: '60%',
    border: '1px #ae945e',
    borderStyle: 'dashed',
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
      <div className={css(ss.mainMapContainer)}>
        <img src={'images/inventorybg.png'} className={css(ss.backgroundImg)}/>
        <div className={css(ss.mapContainer)}>
          <img className={css(ss.map)} src={'images/world-map.jpg'}/>
        </div>
        <div className={css(ss.keyContainer)}>
          <img className={css(ss.mapKey)} src={'images/map-key.jpg'}/>
        </div>
      </div>
    );
  }
}

export default MapMain;
