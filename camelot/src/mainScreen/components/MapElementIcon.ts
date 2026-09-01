/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MapDataType } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';

// Persistent record for one map entity's icon. Instances live for as long as the entity is on
// the map and are mutated in place every animation tick instead of being rebuilt, so position
// updates apply directly to the DOM via bindRef and never require a React re-render.
export class MapElementIcon {
  public faction: number;
  public type: MapDataType;
  public x: number;
  public y: number;

  private ref: HTMLDivElement | null = null;
  private onDataChanged: (() => void) | null = null;
  // Tracks what's actually on the DOM node, so writePosition can skip static icons (most of them,
  // most frames) instead of touching style on every icon every tick regardless of movement.
  private lastWrittenX: number | null = null;
  private lastWrittenY: number | null = null;

  constructor(public readonly id: string, faction: number, type: MapDataType, x: number, y: number) {
    this.faction = faction;
    this.type = type;
    this.x = x;
    this.y = y;
  }

  // Called by the owning component's ref callback so position writes have a DOM node to target.
  bindRef(ref: HTMLDivElement | null): void {
    this.ref = ref;
    this.lastWrittenX = null;
    this.lastWrittenY = null;
    this.writePosition();
  }

  // Called by the owning component to be notified when faction/type change (icon image, tooltip),
  // which position writes alone don't cover.
  bindDataChanged(callback: (() => void) | null): void {
    this.onDataChanged = callback;
  }

  update(faction: number, type: MapDataType, x: number, y: number): void {
    const needsRerender = faction !== this.faction || type !== this.type;
    this.faction = faction;
    this.type = type;
    this.x = x;
    this.y = y;
    this.writePosition();
    if (needsRerender) {
      this.onDataChanged?.();
    }
  }

  private writePosition(): void {
    if (!this.ref) {
      return;
    }
    if (this.x !== this.lastWrittenX) {
      this.ref.style.left = `${this.x}%`;
      this.lastWrittenX = this.x;
    }
    if (this.y !== this.lastWrittenY) {
      this.ref.style.bottom = `${this.y}%`;
      this.lastWrittenY = this.y;
    }
  }
}
