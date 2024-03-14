/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ParallaxInfo {
  layerInfo: LayerInfo[];
  miscInfo?: () => JSX.Element;
}

export interface LayerInfo {
  id: string;
  resistance?: number;
  extraClass?: string | string[];
  shouldParallaxVertical?: boolean;
  hidden?: boolean;
}

export const parallaxInfo: ParallaxInfo[] = [
  {
    layerInfo: [
      { id: 'bg', extraClass: 'arthurian', resistance: 120 },
      { id: 'layer1', extraClass: 'arthurian', resistance: 90 },
      { id: 'ray1', extraClass: 'arthurian', resistance: 40 },
      { id: 'ray2', extraClass: 'arthurian', resistance: -15 },
      { id: 'ray3', extraClass: 'arthurian', resistance: -60 },
      { id: 'veil', extraClass: 'arthurian', resistance: 200, shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'arthurian' },
      { id: 'particle', extraClass: 'arthurian', resistance: -50, shouldParallaxVertical: true }
    ]
  },
  {
    layerInfo: [
      { id: 'bg', extraClass: 'viking', resistance: 120 },
      { id: 'layer2', extraClass: 'viking', resistance: 70 },
      { id: 'layer1', extraClass: 'viking', resistance: 50 },
      { id: 'ray1', extraClass: 'viking', resistance: 40 },
      { id: 'ray2', extraClass: 'viking', resistance: -15 },
      { id: 'ray3', extraClass: 'viking', resistance: -60 },
      { id: 'veil', extraClass: 'viking', resistance: 200, shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'viking' },
      { id: 'particle', extraClass: 'viking', resistance: -50, shouldParallaxVertical: true }
    ],
    miscInfo: () => <div className='clouds viking' />
  },
  {
    layerInfo: [
      { id: 'bg', extraClass: 'tdd-human', resistance: 70 },
      { id: 'layer2', extraClass: 'tdd-human', resistance: 80 },
      { id: 'layer1', extraClass: 'tdd-human', resistance: 100 },
      { id: 'ray1', extraClass: 'tdd', resistance: 40 },
      { id: 'ray2', extraClass: 'tdd', resistance: -15 },
      { id: 'ray3', extraClass: 'tdd', resistance: -60 },
      { id: 'veil', extraClass: 'tdd-human', resistance: 200, shouldParallaxVertical: true },
      { id: 'veil2', extraClass: 'tdd' }
    ],
    miscInfo: () => <div className='clouds tdd' />
  }
];
