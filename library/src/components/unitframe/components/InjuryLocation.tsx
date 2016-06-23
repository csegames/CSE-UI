/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const InjuryLocation = React.createClass<any, any>({
  render: function() {
    let name : string;
    switch(this.part) {
    case 0: name = "Torso"; break;
    default: name = "Torso"; break;
    }
    return (<div id="injury-location">{name}</div>);
  }
});

export default InjuryLocation;
