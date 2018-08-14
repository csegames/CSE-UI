/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

enum HUDZOrder {
  Building,
  ErrorMessages,
  SkillQueue,
  FriendlyTargetSiegeHealth,
  EnemyTargetSiegeHealth,
  PlayerSiegeHealth,
  FriendlyTarget,
  EnemyTarget,
  PlayerHealth,
  Warband,
  Chat,
  Compass,
  Crafting,
  Announcement,
  PlotControl,
  ReleaseControl,
  Progression,
  DevUI,

  // Widgets above all else
  MOTD,
  Scoreboard,
  Respawn,
  HUDNav,
  RefillAmmo,
  MaximizedDevUI,
  GameMenu,
  Settings,
  GameInfo,
}

export default HUDZOrder;
