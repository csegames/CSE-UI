/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-19 10:54:05
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-04 17:10:12
 */

import * as React from 'react';

export interface LayeredDivProps extends React.HTMLProps<HTMLDivElement> {
  className: string;
  renderLayers: (() => void)[];
}

class LayeredDiv extends React.Component<LayeredDivProps, {}> {
  render() {
    const {className, renderLayers} = this.props;
    const props = Object.assign({}, this.props);

    return (
      <div className={`LayeredDiv ${className || ''}`} {...props} >
        {renderLayers.map((layerRender, index) => <div key={index} className='LayeredDiv__Layer'>{layerRender()}</div>)}
      </div>
    );
  }
}

export default LayeredDiv;
