/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const StaminaText = React.createClass<any, any>({
  render: function() {
    let text = '';
    if (this.props.maxStamina) {
      text = this.props.stamina + '/' + this.props.maxStamina;
    }
    return (<div id="stamina-text">{text}</div>);
  }
});

export default StaminaText;
