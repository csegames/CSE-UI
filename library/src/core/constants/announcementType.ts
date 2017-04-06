/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

enum announcementType {
  TEXT = 1,   // Display in the chat window.
  POPUP = 2,  // Display in Announcement Module
  ALL = TEXT | POPUP,
}

export default announcementType;
