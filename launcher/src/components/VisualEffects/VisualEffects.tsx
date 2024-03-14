/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

// declare var particlesJS: any;
declare var Parallax: any;

export interface LayerInfo {
  id: string;
  src?: string;
  resistance?: number;
  shouldParallaxVertical?: boolean;
  particleEffect?: any;
  hidden?: boolean;
  isDiv?: boolean;
}

export interface Props {
  layerInfo: LayerInfo[] | LayerInfo;
  id: string;
  renderMisc?: () => JSX.Element;
  effectsOff?: boolean;
  disableParallax?: boolean;
  disableParticles?: boolean;
}

class VisualEffects extends React.PureComponent<Props, {}> {
  private parallaxInstance: any;
  public render() {
    const { layerInfo } = this.props;
    return (
      <div className='videobg'>
        <div className='parallax' data-relative-input='true' id={this.props.id}>
          {_.isArray(layerInfo)
            ? layerInfo.map((layer, i) => {
                if (!layer) return null;

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
                  return !layer.isDiv ? (
                    <img
                      key={i}
                      data-depth={layer.resistance / 1000}
                      src={layer.src}
                      className={`bgelement ${layer.id}`}
                      style={{ opacity: layer.hidden ? 0 : 1 }}
                    />
                  ) : (
                    <div key={i} data-depth={layer.resistance / 1000} className={`bgelement ${layer.id}`} />
                  );
                }
              })
            : null}
          {this.props.renderMisc && this.props.renderMisc()}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.initialize();
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.disableParallax && this.props.disableParallax) {
      this.disableParallax();
    }

    if (prevProps.disableParallax && !this.props.disableParallax) {
      this.enableParallax();
    }

    if (!this.props.effectsOff && prevProps.layerInfo !== this.props.layerInfo) {
      // this.setParticles();
    }
  }

  public componentWillUnmount() {
    if (this.parallaxInstance) {
      this.parallaxInstance.destroy();
      this.parallaxInstance = null;
    }
  }

  private initialize = () => {
    if (!this.props.disableParallax) {
      this.initializeParallax();
    }
    if (!this.props.effectsOff) {
      // this.setParticles();
    }
  };

  private initializeParallax = () => {
    const scene = document.getElementById(this.props.id);
    this.parallaxInstance = new Parallax(scene);
  };

  private enableParallax = () => {
    if (this.parallaxInstance) {
      this.parallaxInstance.enable();
    } else {
      this.initializeParallax();
    }
  };

  private disableParallax = () => {
    if (this.parallaxInstance) {
      this.parallaxInstance.disable();
    }
  };

  // private setParticles = () => {
  //   const { layerInfo } = this.props;
  //   if (_.isArray(layerInfo)) {
  //     // this.props.layerInfo is an array
  //     layerInfo.forEach((layer) => {
  //       if (layer.particleEffect) {
  //         return particlesJS(layer.id, layer.particleEffect);
  //       }
  //     });
  //   } else {
  //     // this.props.layerInfo is an object
  //     if (layerInfo.particleEffect) {
  //       particlesJS(layerInfo.id, layerInfo.particleEffect);
  //     }
  //   }
  // }
}

export default VisualEffects;
