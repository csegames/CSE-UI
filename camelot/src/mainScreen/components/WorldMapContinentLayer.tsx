/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const Root = 'HUD-WorldMapContinentLayer-Root';

const PULSE_ANIMATION = 'HUD-WorldMapContinentLayer-Pulse 0.5s ease-in-out infinite';
const INACTIVE_FILTER = 'grayscale(1) brightness(0.5)';
// A single fully-opaque drop-shadow reads as a hard outline; don't stack more (perf).
const IDLE_OUTLINE_BLUR = '4px';
const ACTIVE_OUTLINE_BLUR = '7px';
const HOVERED_Z_INDEX = 2;
const CURRENT_ZONE_Z_INDEX = 1;
const INACTIVE_OPACITY = 0.5;
const HOVER_SCALE = 'scale(1.01, 1.01)';
const DEFAULT_SCALE = 'scale(1, 1)';

interface Props {
  src: string;
  exists: boolean;
  isHovered: boolean;
  isCurrentZone: boolean;
  glow: string;
}

// PureComponent so hover/ownership changes only re-render the layers whose props changed.
export class WorldMapContinentLayer extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { src, exists, isHovered, isCurrentZone, glow } = this.props;

    const filterValue = !exists
      ? INACTIVE_FILTER
      : isHovered || isCurrentZone
        ? `drop-shadow(0 0 ${ACTIVE_OUTLINE_BLUR} ${glow})`
        : `drop-shadow(0 0 ${IDLE_OUTLINE_BLUR} ${glow})`;

    const style: React.CSSProperties = {
      zIndex: isCurrentZone ? CURRENT_ZONE_Z_INDEX : isHovered ? HOVERED_Z_INDEX : 0,
      opacity: exists ? 1 : INACTIVE_OPACITY,
      WebkitFilter: filterValue,
      filter: filterValue,
      transform: isHovered ? HOVER_SCALE : DEFAULT_SCALE,
      pointerEvents: 'none',
      ...(isCurrentZone && !isHovered
        ? { WebkitAnimation: PULSE_ANIMATION, animation: PULSE_ANIMATION, willChange: 'opacity' }
        : {})
    };

    return <img className={Root} src={src} style={style} draggable={false} />;
  }
}
