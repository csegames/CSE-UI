/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import VisualEffects from '../../../../../components/VisualEffects/VisualEffects';

export interface NoCharacterSelectFXProps {

}

class NoCharacterSelectFX extends React.Component<NoCharacterSelectFXProps> {
  public render() {
    const layers = [
      { id: 'bg', extraClass: 'no-char', resistance: 1 },
      { id: 'veil', extraClass: 'arthurian', resistance: 100 },
      { id: 'veil2', extraClass: 'arthurian', resistance: 150 },
    ];
    return (
      <VisualEffects id={'no-character-select-fx'} layerInfo={layers} />
    );
  }
}

export default NoCharacterSelectFX;
