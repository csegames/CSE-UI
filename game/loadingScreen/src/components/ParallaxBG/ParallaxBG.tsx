/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import classnames from 'classnames';

declare var particlesJS: any;
declare var Parallax: any;

export interface LayerInfo {
  id: string;
  resistance?: number;
  extraClass?: string | string[];
  shouldParallaxVertical?: boolean;
  particleEffect?: any;
  hidden?: boolean;
}

export interface ParallaxBGProps {
  layerInfo: LayerInfo[] | LayerInfo;
  id: string;
  renderMisc?: () => JSX.Element;
  effectsOff?: boolean;
}

export class ParallaxBG extends React.Component<ParallaxBGProps, {}> {
  private parallaxInstance: any;
  public render() {
    const { layerInfo } = this.props;

    return (
      <div className='videobg'>
        <div className='parallax' data-relative-input='true' id={this.props.id}>
          {_.isArray(layerInfo) ? (layerInfo as LayerInfo[]).map((layer, i) => {
            const extraClass = layer.extraClass ? layer.extraClass : '';
            if (layer.particleEffect) {
              return (
                <div
                  key={i}
                  id={layer.id}
                  className={layer.id}
                  style={layer.hidden ? { opacity: 0 } : { opacity: 1 }}
                />
              );
            } else if (layer.resistance) {
              return (
                <div
                  key={i}
                  data-depth={layer.resistance / 1000}
                  className={_.isArray(layer.extraClass) ? classnames([`bgelement ${layer.id}`, ...layer.extraClass]) :
                     `bgelement ${layer.id} ${extraClass}`}
                  style={{ opacity: layer.hidden ? 0 : 1 }}
                />
              );
            }
          }) : null}
          {this.props.renderMisc && this.props.renderMisc()}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const scene = document.getElementById(this.props.id);
    this.parallaxInstance = new Parallax(scene);
    if (!this.props.effectsOff) {
      this.setParticles();
    }
  }

  public componentWillUnmount() {
    if (this.parallaxInstance) {
      this.parallaxInstance.destroy();
      this.parallaxInstance = null;
    }
  }

  private setParticles = () => {
    const { layerInfo } = this.props;
    if (_.isArray(layerInfo)) {
      // this.props.layerInfo is an array
      (layerInfo as LayerInfo[]).forEach((layer) => {
        if (layer.particleEffect) {
          return particlesJS(layer.id, layer.particleEffect);
        }
      });
    } else {
      // this.props.layerInfo is an object
      if ((layerInfo as LayerInfo).particleEffect) {
        particlesJS((layerInfo as LayerInfo).id, (layerInfo as LayerInfo).particleEffect);
      }
    }
  }
}
