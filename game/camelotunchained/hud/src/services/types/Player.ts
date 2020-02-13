/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {

  type Player = ImmutablePlayerState | GroupMemberState;
  type Entity = ImmutableEntityState | GroupMemberState;

  interface Window {
    isPlayer(state: Entity): state is Player;
    isSiege(state: Entity): state is ImmutableSiegeState;
    isKinematic(state: Entity): state is ImmutableKinematicState;
    isGroupMemberState(state: Entity): state is GroupMemberState;
  }

  function isPlayer(state: Entity): state is Player;
  function isSiege(state: Entity): state is ImmutableSiegeState;
  function isKinematic(state: Entity): state is ImmutableKinematicState;
  function isGroupMemberState(state: Entity): state is GroupMemberState;
}
function isPlayer(
  state: Entity,
): state is Player {
  return (state as PlayerStateModel).type === 'player';
}
window.isPlayer = isPlayer;

function isSiege(
  state: Entity,
): state is ImmutableSiegeState {
  return (state as SiegeStateModel).type === 'siege';
}
window.isSiege = isSiege;

function isKinematic(
  state: Entity,
): state is ImmutableKinematicState {
  return (state as KinematicStateModel).type === 'kinematic';
}
window.isKinematic = isKinematic;

function isGroupMemberState(
  state: Entity,
): state is GroupMemberState {
  return 'displayOrder' in state;
}
window.isGroupMemberState = isGroupMemberState;
