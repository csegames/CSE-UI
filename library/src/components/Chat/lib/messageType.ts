/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

enum messageType {
  SYSTEM = -1,
  NONE = 0,
  AVAILIBLE = 1,
  UNAVAILIBLE = 2,
  MESSAGE_GROUP = 3,
  MESSAGE_CHAT = 4,
  COMBAT_LOG = 5,
}

export default messageType;
