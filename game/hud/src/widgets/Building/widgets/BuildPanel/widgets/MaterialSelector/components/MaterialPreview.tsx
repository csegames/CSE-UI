/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';

import { GlobalState } from '../services/session/reducer';

function select(state: GlobalState) {
  const mat = state.materialSelector.hoverMaterial;
  return {
    material: mat,
    show: mat != null,
  };
}

export interface MaterialPreviewProps {
  dispatch: any;
  material: Material;
  show: boolean;
}

export interface MaterialPreviewState {
}

class MaterialPreview extends React.Component<MaterialPreviewProps, MaterialPreviewState> {

  constructor(props: MaterialPreviewProps) {
    super(props);
  }

  public render() {
    if (!this.props.show) return null;

    const name = this.props.material.id + '. ' + this.props.material.tags.join(', ');

    return (
      <div className='material-preview'>
        <img src={`data:image/png;base64, ${this.props.material.icon}`} />
        <div className='name'>{name}</div>
      </div>
    );
  }
}

export default connect(select)(MaterialPreview);
