 /**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client } from '@csegames/camelot-unchained';

// Ahh... input owenrship
//
// When an input field has focus, and keys are pressed, these keys are also sent to the
// client, which depending on the key and have undesirable effects (moving your character
// about, firing off abilities, or opening other UI windows etc).
//
// In order to prevent this, the input element must request input ownership.  Once requested
// any input sent to the user interface that has ownership will not be sent to the client until
// it is released.
//
// Additionally, in order for button clicks to work along side input fields that are requesting
// ownership, the buttons must also request ownership otherwise the click even is not reliably
// received (and there is a nasty side effect of the cursor jumping from the button clicked to
// the input field releasing ownership).
//
// Finally, another gotcha to deal with is when switching focus from one element managing
// ownership to another managing ownership is that releasing input ownership causes some focus
// weirdness so to avoid this, the release is done on a timer, then if we are placing focus into
// another element that wants us to keep input ownership, we simply cancel the release rather
// than grabing ownership again.
//
// Usage:
//
//  import inputOwnership from './InputOnwership';
//
//  <input type=text onFocus={inputOwnership} onBlur={inputOwnership} ../>
//  <input type=text onFocus={inputOwnership} onBlur={inputOwnership} ../>
//  <button onFocus={inputOwnership} onBlur={inputOwnership}>OK</button>
//  <button onFocus={inputOwnership} onBlur={inputOwnership}>Cancel</button>
//
// Have a look at Button and Input components, these hide way the focus and ownership
// handling allowing the code to concentrate on the important stuff.
//
//  TODO:
//    Move this into 'camelot-unchained'.
//    Add Input and Button classes to camelot-unchained that manage input ownership so
//    React components can concentrate on the important stuff.

let timer: any;

export const inputOwnership = (e: React.FocusEvent<any> | React.MouseEvent<any>): void => {
  if (e.type === 'focus') {
    if (timer) {  // don't release input ownership if focus moving to another field
      clearTimeout(timer);
      timer = undefined;
    } else {
      client.RequestInputOwnership();
    }
  } else if (e.type === 'blur') {
    // release input ownership after short delay allowing next field
    // to cancel the release
    timer = setTimeout(() => {
      client.ReleaseInputOwnership();
      timer = undefined;
    },                 10);
  } else if (e.type === 'click' && (e.target as HTMLElement).nodeName === 'BUTTON') {
    client.ReleaseInputOwnership();
    if (timer) {  // we released it already
      clearTimeout(timer);
      timer = undefined;
    }
  }
};

export default inputOwnership;
