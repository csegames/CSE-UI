/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Keep up to date with the versions in BuildingNetworkState.h and Building.cs
enum plotPermissions {
  Self = 0,
  Group = 1 << 0,
  Friends = 1 << 1,
  Guild = 1 << 2,
  Realm = 1 << 3,
  All = 1 << 4,
  COUNT = 1 << 5,
}

export default plotPermissions;
