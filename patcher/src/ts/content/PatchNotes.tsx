/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export class PatchNotesProps {
};

class PatchNotes extends React.Component<PatchNotesProps, any> {
  public name = 'PatchNotes';

  constructor(props: PatchNotesProps) {
    super(props);
  }

  render() {
    return (
      <div id={this.name} className='main-content'>
        <div className='content-area'>
          <h2>{this.name}</h2>
          <p>content</p>
        </div>
      </div>
    );
  }
};

export default PatchNotes;
