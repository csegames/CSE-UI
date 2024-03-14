/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as classnames from 'classnames';
import Parallax from 'parallax-js/dist/parallax';
import { LayerInfo } from './parallaxInfo';

// Styles
const VideoBG = 'ParallaxBG-VideoBG';
const Parallaxer = 'ParallaxBG-Parallaxer';
const BGElement = 'ParallaxBG-BGElement';

interface Props {
  layerInfo: LayerInfo[] | LayerInfo;
  id: string;
  renderMisc?: () => JSX.Element;
  effectsOff?: boolean;
}

export class ParallaxBG extends React.Component<Props> {
  private parallaxInstance: any;

  public render() {
    const { layerInfo } = this.props;

    return (
      <div className={VideoBG}>
        <div className={Parallaxer} data-relative-input='true' id={this.props.id}>
          {Array.isArray(layerInfo)
            ? (layerInfo as LayerInfo[]).map((layer, i) => {
                const extraClass = layer.extraClass ? layer.extraClass : '';
                if (layer.resistance) {
                  return (
                    <div
                      key={i}
                      data-depth={layer.resistance / 1000}
                      className={
                        Array.isArray(layer.extraClass)
                          ? classnames([`${BGElement} ${layer.id}`, ...layer.extraClass])
                          : `${BGElement} ${layer.id} ${extraClass}`
                      }
                      style={{ opacity: layer.hidden ? 0 : 1 }}
                    />
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
    const scene = document.getElementById(this.props.id);
    this.parallaxInstance = new Parallax(scene);
  }

  public componentWillUnmount() {
    if (this.parallaxInstance) {
      this.parallaxInstance.destroy();
      this.parallaxInstance = null;
    }
  }
}
