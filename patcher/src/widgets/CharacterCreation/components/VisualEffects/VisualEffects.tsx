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

export interface RenderParticleInfo {
  id: string;
  effect: any;
}

export interface RenderParallaxInfo {
  id: string;
  resistance: number;
  extraClass?: string;
  shouldParallaxVertical?: boolean;
}

export interface VisualEffectsProps {
  particlesInfo: RenderParticleInfo[] | RenderParticleInfo;
  parallaxInfo: RenderParallaxInfo[] | RenderParallaxInfo;
  renderMisc?: () => JSX.Element;
}

class VisualEffects extends React.Component<VisualEffectsProps, {}> {
  public render() {
    const { particlesInfo, parallaxInfo, renderMisc } = this.props;

    return (
      <div className='videobg'>
        {_.isArray(particlesInfo) ? particlesInfo.map((particleInfo, i) => {
          return <div key={i} id={particleInfo.id} className={particleInfo.id} />;
        }) : <div id={particlesInfo.id} className={particlesInfo.id} />}
        <div className='parallax'>
          {_.isArray(parallaxInfo) ? parallaxInfo.map((parallaxInfo, i) => {
            const extraClass = parallaxInfo.extraClass ? parallaxInfo.extraClass : '';

            // TODO: LOOK HERE SOMETIME !!!
            return <div key={i} className={`bgelement ${parallaxInfo.id} ${extraClass}`} />;
          }) : <div className={`bgelement ${parallaxInfo.id} ${parallaxInfo.extraClass ? parallaxInfo.extraClass : ''}`} />}
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
    const { parallaxInfo } = this.props;
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
    
    if (_.isArray(parallaxInfo)) {
      // this.props.parallaxInfo is an array
      parallaxInfo.forEach((parallax) => {
        if (!parallax.shouldParallaxVertical) {
          return $(`.${parallax.id}`).parallaxHorizontal(parallax.resistance, e);
        }
        return $(`.${parallax.id}`).parallaxBoth(parallax.resistance, e);
      });
    } else {
      // this.props.parallaxInfo is an object
      if (!parallaxInfo.shouldParallaxVertical) {
        return $(`.${parallaxInfo.id}`).parallaxHorizontal(parallaxInfo.resistance, e);
      }
      return $(`.${parallaxInfo.id}`).parallaxBoth(parallaxInfo.resistance, e);
    }
  }

  private setParticles = () => {
    const { particlesInfo } = this.props;
    if (_.isArray(particlesInfo)) {
      // this.props.particlesInfo is an array
      particlesInfo.forEach((particle) => {
        return particlesJS(particle.id, particle.effect);
      });
    } else {
      // this.props.particlesInfo is an object
      particlesJS(particlesInfo.id, particlesInfo.effect);
    }
  }
}

export default VisualEffects;
