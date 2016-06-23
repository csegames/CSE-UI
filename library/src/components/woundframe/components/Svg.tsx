/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SVGCircle, SVGRect } from '../resources/Shapes';

export interface SvgState { }
export interface SvgProps {
  className?: string;
  box: string;
  key?: string;
  id: string;
  color: string;
  polygon?: string;
  path?: string;
  circle?: SVGCircle;
  rect?: SVGRect;
  stroke?: string;
  strokeML?: string;
}

export class Svg extends React.Component<SvgProps, SvgState> {
  constructor(props: SvgProps) {
    super(props);
  }
  render() {
    // Build shape style from attributes
    let style = '';
    if (this.props.color) {
      style += 'fill:' + this.props.color + ';';
    }
    if (this.props.stroke) {
      style += 'stroke:' + this.props.stroke + ';';
    }
    if (this.props.strokeML) {
      style += 'stroke-mitrelimit:' + this.props.strokeML + ';';
    }
    return (
      <svg className={this.props.className} viewBox={this.props.box}>
        <style type="text/css">
          {'.' + this.props.id + ' {' + style + '}'}
        </style>
        <g>
          {this.props.polygon ?
            <polygon points={this.props.polygon}
            fill={this.props.color}/>
            : undefined }
          {this.props.path ?
            <path d={this.props.path}
            fill={this.props.color}/>
            : undefined }
          {this.props.circle ?
            <circle cx={this.props.circle.cx} cy={this.props.circle.cy} r={this.props.circle.r}
            fill={this.props.color}/>
            : undefined }
          {this.props.rect ?
            <rect
              x={this.props.rect.x}
              y={this.props.rect.y}
              transform={this.props.rect.transform}
              width={this.props.rect.width}
              height={this.props.rect.height}
              fill={this.props.color}
              />
            : undefined }
        </g>
      </svg>
    );
  }
}

export default Svg;
