/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SVGShape, shapes } from '../resources/Shapes';
import { Svg } from './Svg';

export interface PartState { }
export interface PartProps {
  key: string;
  part: number,
  health: number,
  max: number,
  wounds: number,
  state: number,
  color: string
}

function getShape(part: number, state: number) : SVGShape {
  return shapes[part][state];
}

export class Part extends React.Component<PartProps, PartState> {
  constructor(props: PartProps) {
    super(props);
  }
  render() {
    const part = this.props.part;
    const shape : SVGShape = getShape(part, this.props.state);
    const id: string = 'part' + part;
    return (
      <Svg className="part" id={ id } box={ shape.box } color={ this.props.color }
        polygon={ shape.polygon } path={ shape.path }>
      </Svg>
    );
  }
}
