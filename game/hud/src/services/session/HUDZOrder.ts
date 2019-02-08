/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// The higher the widget in the enum, the more precedence it will take over the other widgets.
// ErrorMessages should always be at the top.

enum HUDZOrder {
  Building,
  ErrorMessages,
  AbilityQueue,
  FriendlyTargetSiegeHealth,
  EnemyTargetSiegeHealth,
  PlayerSiegeHealth,
  FriendlyTarget,
  EnemyTarget,
  PlayerHealth,
  Warband,
  Compass,
  BattleGroups,
  BattleGroupWatchList,
  Chat,
  CompassTooltip,
  PlacementMode,
  Crafting,
  MiniScenarioScoreboard,
  FullScenarioScoreboard,
  ScenarioPopup,
  Announcement,
  ReleaseControl,
  Progression,
  InteractiveAlert,
  DevUI,

  // Widgets above all else
  Build,
  MOTD,
  Scoreboard,
  ScenarioJoin,
  ScenarioButton,
  Respawn,
  HUDNav,
  RefillAmmo,
  MaximizedDevUI,
  GameMenu,
  Settings,
  GameInfo,
}

export default HUDZOrder;
