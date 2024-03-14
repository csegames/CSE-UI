/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { lerp, clamp, mapValueRange, BlendStop, linearBlend } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { HealthBarState } from '..';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { ReviveInteractionBar } from './ReviveInteractionBar';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
import { findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { HealthBarKind } from '@csegames/library/dist/hordetest/game/types/HealthBarKind';
import { VoiceChatMemberStatus } from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';

// Distance in meters that is considered "far away"
// The arrow will be smoothly scaled based on this value.
const FAR_DISTANCE = 250.0;

// readability helper function for specifying distance ratios using a value in meters
const DistanceInMetersToRatio = (distMeters: number): number => clamp(distMeters / FAR_DISTANCE, 0.0, 1.0);

// Distance from the player (in meters) over which the characters's name will not be shown
const HIDE_NAME_DIST = DistanceInMetersToRatio(175.0);

// Distance from the player (in meters) over which the characters's health bar will not be shown
const HIDE_HEALTH_BAR_DIST = DistanceInMetersToRatio(100.0);

// Distance (in meters) over which to fade out a UI element.
// This should be fairly small so that UI elements are not in transition phases for too long
const BLEND_DISTANCE = DistanceInMetersToRatio(5.0);

// Arrow scale when the distance between the local player and this character is zero
const ARROW_MIN_SCALE = 0.4;

// Arrow scale when the distance between the local player and this character is at or above FAR_DISTANCE
const ARROW_MAX_SCALE = 1.0;

// readability helper function

const ElementImportance = (val: { healthbar: number; name: number; arrow: number }): number[] => [
  val.healthbar,
  val.name,
  val.arrow
];

// When to take into account screenspace distance, physical distance, or a combination of both, for the healthbar, name,
// and arrow parts of the nameplate.
//
// This essentially defines a linear gradient, where 'value' indicatates if the screenspace or physical distance should
// be the primary factor driving if an element is shown for each component.
//
// If the value is 1.0 for a given component, that means consider screen-space distance only. If value is 0.0, that means
// consider physical distance only. If value is between 0 and 1, iIt will interpolate between these values smoothly and
// consider both proportionally.
const NAMEPLATE_ELEMENT_OPACITY_BLEND_STOPS: BlendStop[] = [
  // pos = distance ratio value between 0.0 and 1.0, where 0.0 means right next to the player and 1.0 means FAR_DISTANCE

  // close up
  { pos: 0.0, value: ElementImportance({ healthbar: 1.0, name: 1.0, arrow: 1.0 }) },

  // close up to medium distance transition
  { pos: HIDE_HEALTH_BAR_DIST, value: ElementImportance({ healthbar: 1.0, name: 1.0, arrow: 1.0 }) },
  { pos: HIDE_HEALTH_BAR_DIST + BLEND_DISTANCE, value: ElementImportance({ healthbar: 0.0, name: 1.0, arrow: 1.0 }) },

  // medium distance to far away transition
  { pos: HIDE_NAME_DIST, value: ElementImportance({ healthbar: 0.0, name: 1.0, arrow: 1.0 }) },
  { pos: HIDE_NAME_DIST + BLEND_DISTANCE, value: ElementImportance({ healthbar: 0.0, name: 0.0, arrow: 1.0 }) },

  // far away (arrow only)
  { pos: 1.0, value: ElementImportance({ healthbar: 0.0, name: 0.0, arrow: 1.0 }) }
];

const HEALTH_BAR_HEIGHT_PX = 13;
const CHARACTER_NAME_HEIGHT_PX = 16;

const Container = 'WorldSpace-HealthBar-UserHealthBar-Container';

const BarOuter = 'WorldSpace-HealthBar-UserHealthBar-BarOuter';

const BarrierBar = 'WorldSpace-HealthBar-UserHealthBar-BarrierBar';

const HealthBar = 'WorldSpace-HealthBar-UserHealthBar-HealthBar';

const HealthBarFull = 'WorldSpace-HealthBar-UserHealthBar-HealthBarFull';

const CharacterName = 'WorldSpace-HealthBar-UserHealthBar-CharacterName';

const ArrowAndVoiceChatIconContainer = 'WorldSpace-HealthBar-UserHealthBar-ArrowAndVoiceChatIconContainer';

const ArrowOuter = 'WorldSpace-HealthBar-UserHealthBar-ArrowOuter';

const Arrow = 'WorldSpace-HealthBar-UserHealthBar-Arrow';

const ArrowPolygon = 'WorldSpace-HealthBar-UserHealthBar-ArrowPolygon';

const VoiceChatIcon = 'WorldSpace-HealthBar-UserHealthBar-VoiceChatIcon';

const NameContainer = 'WorldSpace-ReviveInteractionBar-NameContainer';

const ReviveIcon = 'Worldspace-ReviveInteractionBar-ReviveIcon';

export interface Props {
  state: HealthBarState;
}

export class UserHealthBar extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    // the player is in a downed or similar state and is not able to revive, therefore we should hide the revive bar.
    if (this.props.state.hideReviveBar) {
      return null;
    }

    // baseline relative physical distance - 0.0 means close up and 1.0 means far away
    const physicalDistanceAlpha = clamp(this.props.state.worldSpaceDistanceToPlayer / FAR_DISTANCE, 0.0, 1.0);

    // baseline screen-space distance - 1.0 means in the center of the screen and 0.0 means its on the side of the screen
    const screenDistanceAlpha = clamp(
      Math.pow(1.0 - this.props.state.relativeScreenSpaceDistanceToCrosshair, 7),
      0.0,
      1.0
    );

    const [healthBarBlendFactor, nameBlendFactor, arrowBlendFactor] = linearBlend(
      NAMEPLATE_ELEMENT_OPACITY_BLEND_STOPS,
      physicalDistanceAlpha
    );

    const getElementAlpha = (blendFactor: number) => {
      // normally we just use either the physical blend factor or the screen-distance blend factor, whichever is higher
      const alpha = Math.max(blendFactor, screenDistanceAlpha);

      // If we're past 95% of the FAR_DISTANCE, then also factor in straight linear physical distance, so that even if the player
      // is looking directly at the health bar, it's still going to fade out as it reaches FAR_DISTANCE.
      return alpha * mapValueRange(clamp(physicalDistanceAlpha, 0.95, 1.0), 0.95, 1.0, 1.0, 0.0);
    };

    // This worldspace frame has the same screen-space origin no matter how far away the character is (we
    // can't just use margin-top:-10px here - it will just not render those bits). Also, characters that
    // are far away have a very small screen-space size (could be 10 pixels or less). We want to draw the
    // arrow on top of these players, but we also don't want the arrow to move around vertically when we're
    // showing/hiding the health bars/name at closer ranges.
    // Solution is to hide the healthbar/name as normal when the distance is less than FAR_DISTANCE, but
    // between FAR_DISTANCE and FAR_DISTANCE + OFFSET, smoothly shrink the (invisible) healthbar and name
    // frames so we can move the arrow up towards the top of the worldspace frame.
    const healthBarAlpha = getElementAlpha(healthBarBlendFactor);
    const healthBarHeight = lerp(0.0, HEALTH_BAR_HEIGHT_PX, healthBarAlpha);
    const healthBarMarginPx = lerp(0.0, 2.0, healthBarAlpha);
    const healthBarOpacity = healthBarAlpha;

    const nameAlpha = getElementAlpha(nameBlendFactor);
    const characterNameHeight = lerp(0.0, CHARACTER_NAME_HEIGHT_PX, nameAlpha);
    const characterNameOpacity = nameAlpha;

    const arrowAlpha = getElementAlpha(arrowBlendFactor);
    const arrowScale = lerp(ARROW_MAX_SCALE, ARROW_MIN_SCALE, physicalDistanceAlpha); // scale directly with physical distance
    const arrowOpacity = arrowAlpha;

    // if a player is downed show either a red arrow to direct players to them or the revive bar
    if (this.props.state.lifeState === LifeState.Downed) {
      if (this.props.state.worldSpaceDistanceToPlayer > this.props.state.reviveRange) {
        return (
          <div className={Container}>
            {this.getCharacterName(CHARACTER_NAME_HEIGHT_PX, 1)}
            <div className={ArrowAndVoiceChatIconContainer}>
              <div className={ArrowOuter}>
                {this.getArrow(arrowScale, 1)}
                {this.getVoiceChatIcon(1)}
              </div>
            </div>
          </div>
        );
      }
      return <ReviveInteractionBar state={this.props.state} />;
    }

    // The double-div here (ArrowAndVoiceChatIconContainer -> ArrowOuter) is needed because we want to center the arrow
    // but put the voice chat icon to the right of the centered element. If we didn't do this, the arrow would snap left
    // and right when the voice chat icon appears and disappears.
    return (
      <div className={Container}>
        {this.getHealthBar(healthBarHeight, healthBarMarginPx, healthBarOpacity)}
        {this.getCharacterName(characterNameHeight, characterNameOpacity)}
        <div className={ArrowAndVoiceChatIconContainer}>
          <div className={ArrowOuter}>
            {this.getArrow(arrowScale, arrowOpacity)}
            {this.getVoiceChatIcon(arrowOpacity)}
          </div>
        </div>
      </div>
    );
  }

  private getArrow(arrowScale: number, opacity: number) {
    // normally we want to avoid opacity due to issues with coherent, but in this case it's unavoidable - we need stuff to fade out over a distance
    const downed = this.props.state.lifeState === LifeState.Downed ? 'downed' : '';
    const enemyStyle = this.props.state.kind == HealthBarKind.EnemyUser ? 'Enemy' : '';

    return (
      <svg className={Arrow} width='32' height='16' style={{ opacity: opacity, transform: `scale(${arrowScale})` }}>
        <polygon className={`${ArrowPolygon} ${downed} ${enemyStyle}`} points={'0,0 32,0 16,16'} />
      </svg>
    );
  }

  private getVoiceChatIcon(opacity: number): JSX.Element {
    if (opacity <= 0) {
      return null;
    }

    if (this.props.state.voiceChatStatus == VoiceChatMemberStatus.Speaking) {
      let icon = null;
      if (this.props.state.voiceChatVolume < 0.25) {
        icon = 'fs-icon-misc-speaker1';
      } else if (this.props.state.voiceChatVolume < 0.5) {
        icon = 'fs-icon-misc-speaker2';
      } else if (this.props.state.voiceChatVolume < 0.75) {
        icon = 'fs-icon-misc-speaker3';
      } else {
        icon = 'fs-icon-misc-speaker4';
      }

      // normally we want to avoid opacity due to issues with coherent, but in this case it's unavoidable - we need stuff to fade out over a distance
      return <div className={`${VoiceChatIcon} ${icon}`} style={{ opacity: opacity }} />;
    }
  }

  private getCharacterName(heightPx: number, opacity: number): JSX.Element {
    if (heightPx <= 0 || opacity <= 0) {
      return null;
    }

    let classList: string = `${CharacterName} `;
    if (this.props.state.voiceChatStatus == VoiceChatMemberStatus.Speaking) {
      classList += 'Speaking ';
    }

    const reviveIcon =
      this.props.state.lifeState === LifeState.Downed ? (
        <div className={ReviveIcon}>
          {Math.max(0, Math.round(this.props.state.downedStateEndTime - this.props.state.worldTime))}
        </div>
      ) : null;

    // normally we want to avoid opacity due to issues with coherent, but in this case it's unavoidable - we need stuff to fade out over a distance
    const nameHeightScale = clamp(heightPx / CHARACTER_NAME_HEIGHT_PX, 0.33, 1.0);
    return (
      <div className={NameContainer}>
        <div
          className={classList}
          style={{ height: `${heightPx}px`, opacity: opacity, transform: `scale(${nameHeightScale})` }}
        >
          {this.props.state.name}
        </div>
        {reviveIcon}
      </div>
    );
  }

  private getHealthBar(heightPx: number, marginPx: number, opacity: number): JSX.Element {
    const enemyStyle = this.props.state.kind == HealthBarKind.EnemyUser ? 'Enemy' : '';

    const health = findEntityResource(this.props.state.resources, EntityResourceIDs.Health);
    if (!health || heightPx <= 0 || opacity <= 0) {
      return null;
    }

    const healthPercent = clamp((health.current / health.max) * 100, 0, 100);
    const barrier = findEntityResource(this.props.state.resources, EntityResourceIDs.Barrier);

    // normally we want to avoid opacity due to issues with coherent, but in this case it's unavoidable - we need stuff to fade out over a distance
    if (barrier.max > 0) {
      // show both the divine barrier and the health bar
      const barrierPercent = clamp((barrier.current / barrier.max) * 100, 0, 100);
      return (
        <div className={BarOuter} style={{ opacity: opacity, height: `${heightPx}px`, marginBottom: `${marginPx}px` }}>
          <div className={BarrierBar} style={{ width: `${barrierPercent}%` }} />
          <div className={`${HealthBar} ${enemyStyle}`} style={{ width: `${healthPercent}%` }} />
        </div>
      );
    } else {
      // just show the health bar
      return (
        <div className={BarOuter} style={{ opacity: opacity, height: `${heightPx}px`, marginBottom: `${marginPx}px` }}>
          <div className={`${HealthBarFull} ${enemyStyle}`} style={{ width: `${healthPercent}%` }} />
        </div>
      );
    }
  }
}
