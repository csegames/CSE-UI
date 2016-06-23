/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const Name = React.createClass<any, any>({
  render: function() {
    return (<div id="name">{this.props.name}</div>);
  }
});

export default Name;
