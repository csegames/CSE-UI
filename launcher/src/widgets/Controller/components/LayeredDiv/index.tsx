/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface LayeredDivProps extends React.HTMLProps<HTMLDivElement> {
  className: string;
  renderLayers: (() => void)[];
}

class LayeredDiv extends React.Component<LayeredDivProps, {}> {
  public render() {
    const { className, renderLayers } = this.props;
    const props = Object.assign({}, this.props);

    return (
      <div className={`LayeredDiv ${className || ''}`} {...props}>
        {renderLayers.map((layerRender, index) => (
          <div key={index} className='LayeredDiv__Layer'>
            {() => layerRender()}
          </div>
        ))}
      </div>
    );
  }
}

export default LayeredDiv;
