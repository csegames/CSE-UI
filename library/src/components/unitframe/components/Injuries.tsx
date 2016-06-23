/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import Injury from './Injury';

// Display list of injuries.  Only injuries not 100% are shown
const Injuries = React.createClass<any, any>({
  render: function() {
    const injuries : any[] = [];
    if (this.props && this.props.injuries) {
      for (let i = 0; i < this.props.injuries.length; i++) {
        const injury = this.props.injuries[i];
        // TODO: should we only display if health < maxHealth or wounds > 0 ???
        if (injury && (injury.health < injury.maxHealth || injury.wounds > 0)) {
          injuries.push(<Injury injury={injury}/>);
        }
      }
    }
    return (
      <div id="injuries" className="cse-injuries">
        {injuries}
      </div>
    );
  }
});

export default Injuries;
