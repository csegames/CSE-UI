/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { Particles } from './particles';

declare var $: any;
declare var TweenLite: any;
declare var particlesJS: any;

export interface LayerInfo {
  id: string;
  resistance?: number;
  extraClass?: string;
  shouldParallaxVertical?: boolean;
  particleEffect?: any;
}

export interface VisualEffectsProps {
  layerInfo: LayerInfo[] | LayerInfo;
  renderMisc?: () => JSX.Element;
}

class VisualEffects extends React.Component<VisualEffectsProps, {}> {
  public render() {
    const { layerInfo, renderMisc } = this.props;
    
    return (
      <div className='videobg'>
        <div className='parallax'>
          {_.isArray(layerInfo) ? layerInfo.map((layer, i) => {
            if (layer.particleEffect) {
              // Particle layer
              return <div key={i} id={layer.id} className={layer.id} />;
            } else {
              // Parallax layer
              const extraClass = layer.extraClass ? layer.extraClass : '';
              return <div key={i} className={`bgelement ${layer.id} ${extraClass}`} />;
            }
          }) : () => {
            if (layerInfo.particleEffect) {
              return <div id={layerInfo.id} className={layerInfo.id} />;
            } else {
              <div className={`bgelement ${layerInfo.id} ${layerInfo.extraClass ? layerInfo.extraClass : ''}`} />;
            }
          }}
        </div>
        {this.props.renderMisc && this.props.renderMisc()}
      </div>
    );
  }

  public componentDidMount() {
    this.setParticles();
    $(document).mousemove((e: MouseEvent) => {
      this.setParallax(e);
    });

  }

  private setParallax = (e: MouseEvent) => {
    const { layerInfo } = this.props;
    $.fn.parallaxBoth = function(resistance: any, mouse: any) {
      const el = $(this);
      TweenLite.to(el, 1, {
        x: -((mouse.clientX - window.innerWidth / 1) / resistance),
        y: -((mouse.clientY - window.innerHeight / 1) / resistance),
      });
    };
    
    $.fn.parallaxHorizontal = function(resistance: any, mouse: any) {
      const el = $(this);
      TweenLite.to(el, 1, {
        x: -((mouse.clientX - window.innerWidth / 1) / resistance),
      });
    };
    
    if (_.isArray(layerInfo)) {
      // this.props.layerInfo is an array
      layerInfo.forEach((layer) => {
        if (!layer.particleEffect) {
          if (!layer.shouldParallaxVertical) {
            return $(`.${layer.id}`).parallaxHorizontal(layer.resistance, e);
          }
          return $(`.${layer.id}`).parallaxBoth(layer.resistance, e);
        }
      });
    } else {
      // this.props.layerInfo is an object
      if (!layerInfo.particleEffect) {
        if (!layerInfo.shouldParallaxVertical) {
          return $(`.${layerInfo.id}`).parallaxHorizontal(layerInfo.resistance, e);
        }
        return $(`.${layerInfo.id}`).parallaxBoth(layerInfo.resistance, e);
      }
    }
  }

  private setParticles = () => {
    const { layerInfo } = this.props;
    if (_.isArray(layerInfo)) {
      // this.props.layerInfo is an array
      layerInfo.forEach((layer) => {
        if (layer.particleEffect) {
          return particlesJS(layer.id, layer.particleEffect);
        }
      });
    } else {
      // this.props.layerInfo is an object
      if (layerInfo.particleEffect) {
        particlesJS(layerInfo.id, layerInfo.particleEffect);
      }
    }
  }
}

export default VisualEffects;
