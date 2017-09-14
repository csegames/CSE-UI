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
import ReactImageMagnify from 'react-image-magnify';
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
    height: '100%',
    position: 'relative',
  },

  map: {
    maxHeight: '100%',
    width: 'auto',
    position: 'relative',
    borderRight: '2px #3b524a',
    borderRightStyle: 'dashed',
  },

  keyContainer: {
    position: 'absolute',
    width: '25%',
    top: '0px',
    right: '0px',
  },

  mapKey: {
    position: 'absolute',
    maxWidth: '50%',
    border: '1px #ae945e',
    borderStyle: 'dashed',
    right: '0px',
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
  map: HTMLImageElement;
  mapKey: string;
}

class MapMain extends React.Component<MapMainProps> {
  public render() {
    const map = this.props.map;
    const smallImage = {
      isFluidWidth: true,
      src: map.src,
    };
    const largeImage = {
      src: map.src,
      width: map.width,
      height: map.height,
    };
    const ss = StyleSheet.create({ ...defaultMapStyle, ...this.props.styles });
    return (
      <div className={css(ss.mainMapContainer)}>
        <img src={'images/inventorybg.png'} className={css(ss.backgroundImg)}/>
        <ReactImageMagnify className={css(ss.mapContainer)} imageClassName={css(ss.map)}
                           largeImage={largeImage} smallImage={smallImage}/>
        <div className={css(ss.keyContainer)}>
          <img className={css(ss.mapKey)} src={this.props.mapKey}/>
        </div>
      </div>
    );
  }
}

export default MapMain;
