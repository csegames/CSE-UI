/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { ParallaxBG } from './ParallaxBG';
import { LayerInfo } from './parallaxInfo';

// Styles
const Root = 'ParallaxContainer-Root';

interface Props {
  layerInfo: LayerInfo[];
  miscInfo?: () => JSX.Element;
  effectsOff?: boolean;
}

export class ParallaxContainer extends React.Component<Props> {
  render(): JSX.Element {
    const { effectsOff, layerInfo, miscInfo } = this.props;

    return (
      <div className={Root}>
        <ParallaxBG
          id='character-select-fx-parallax'
          effectsOff={effectsOff}
          layerInfo={layerInfo}
          renderMisc={miscInfo}
        />
      </div>
    );
  }
}
