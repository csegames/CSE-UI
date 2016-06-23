/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ToolTipProps {
  shapeId: number;
  typeId: number;
  type?: string;
  shape: string;
  icon: string;
};
export interface ToolTipState {
};

class ToolTip extends React.Component<ToolTipProps, ToolTipState> {
  public name: string = 'ToolTip';

  constructor(props: ToolTipProps) {
    super(props);
  }

  onClick = (): void => {
  }

  render() {
    return (
      <div className="tooltip">
        <div className="inner silver-gradient-border">
          <img src={'data:image/png;base64,' + this.props.icon}/>
          <div>
            <div>
              <span className="label">ShapeId:</span>
              <span className="field">{this.props.shapeId}</span>
            </div>
            <div>
              <span className="label">TypeId:</span>
              <span className="field">{this.props.typeId}</span>
            </div>
            <div>
              <span className="label">Shape:</span>
              <span className="field">{this.props.shape.replace(/-/g,' ')}</span>
            </div>
            { this.props.type
              ? <div>
                  <span className="label">Type:</span>
                  <span className="field">{this.props.type.replace(/-/g,' ')}</span>
                </div>
              : undefined
            }
          </div>
        </div>
      </div>
    );
  }
}

export default ToolTip;
