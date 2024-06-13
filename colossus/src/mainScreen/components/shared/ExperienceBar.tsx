/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import * as React from 'react';
import { HorizontalWipe, WipeType } from '../../../shared/components/HorizontalWipe';

const ResourceBarContainer = 'Shared-ExperienceBar-ResourceBarContainer';
const BackFill = 'Shared-ExperienceBar-BackFill';
const FillContainer = 'Shared-ExperienceBar-FillContainer';
const Fill = 'Shared-ExperienceBar-Fill';
const Text = 'Shared-ExperienceBar-Text';

interface State {
  xp: number;
  maxXP: number;
  shouldAnimateXP: boolean;
  wipe: WipeType;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  current: number;
  level: number;
  xpForLevels: number[];
  fillStyle?: string;
  hideText?: boolean;
  suppressMaxStyle?: boolean;
  onAnimationComplete?: () => void;
  onXPAnimationBegun?: (xpFrom: number, xpTo: number, xpMax: number, durationMS: number) => void;
  onLevelUpAnimationBegun?: (newLevel: number, durationMS: number) => void;
}

const animateFillBarStyle = {
  transition: 'width 1s ease-in'
};
export class ExperienceBar extends React.Component<Props, State> {
  private pendingAnimations: (() => void)[];
  private animTimeout: number = null;

  constructor(props: Props) {
    super(props);
    this.pendingAnimations = [];

    this.state = {
      xp: props.current,
      maxXP: props.xpForLevels[props.level - 1] ?? 100,
      shouldAnimateXP: false,
      wipe: ''
    };
  }

  public render() {
    const { current, level, xpForLevels, className, ...otherProps } = this.props;
    const maxLevel = xpForLevels.length;
    let { xp, maxXP } = this.state;
    if (level === maxLevel) {
      xp = maxXP;
    }
    let barPercentage = (xp / maxXP) * 100;

    // After maxed, with all animations complete, the bar changes color.
    const maxStyle =
      !this.props.suppressMaxStyle && level === maxLevel && !this.animTimeout && this.pendingAnimations.length === 0
        ? 'max'
        : '';

    return (
      <div className={`${ResourceBarContainer} ${className}`} {...otherProps}>
        <div className={BackFill} style={{ width: `${barPercentage}%` }} />

        <div
          className={FillContainer}
          style={{ width: `${barPercentage}%`, ...(this.state.shouldAnimateXP ? animateFillBarStyle : {}) }}
        >
          <div className={`${Fill} ${maxStyle} ${this.props.fillStyle ?? ''}`} />
        </div>
        <HorizontalWipe type={this.state.wipe} />
        <div className={Text}>{this.getText()}</div>
      </div>
    );
  }

  private getText() {
    if (this.props.hideText) {
      return '';
    }

    const { xp, maxXP } = this.state;
    return `${Math.round(xp).toFixed(0)} / ${Math.round(maxXP).toFixed(0)}`;
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.current !== prevProps.current || this.props.level !== prevProps.level) {
      // We've already confirmed that there is a change.  If we're in the middle of an animation, let's wait until it finishes.
      if (this.animTimeout) {
        clearTimeout(this.animTimeout);
        this.animTimeout = null;
        this.pendingAnimations = [];
      }

      const lastAnimatedLevel = this.props.level;
      const lastAnimatedXP = this.props.current;
      const isAnimationExpired = () => {
        return lastAnimatedLevel !== this.props.level || lastAnimatedXP !== this.props.current;
      };

      let currentLevel = prevProps.level;
      let currentXP = prevProps.current;

      // Loop through, creating new anim segments, until everything is caught up.
      this.pendingAnimations = [];
      let justMaxed = false;

      while (currentLevel !== this.props.level || currentXP !== this.props.current) {
        // If the levels are not the same, then we need to animate from currentXP to an appropriate maxXP.
        if (currentLevel < this.props.level) {
          // Animate from currentXP to maxXP for the currentLevel.
          const currentMaxXP = this.props.xpForLevels[currentLevel - 1];
          this.pendingAnimations.push(() => {
            if (isAnimationExpired()) return;
            this.props.onXPAnimationBegun?.(this.state.xp, currentMaxXP, currentMaxXP, 1000);
            this.setState({ shouldAnimateXP: true, xp: currentMaxXP, maxXP: currentMaxXP, wipe: '' });
            this.runNextAnimationAfterMS(1000);
          });
          // Now we're at the next level (or max level).
          currentLevel += 1;
          const capturedCurrentLevel = currentLevel;
          if (currentLevel >= this.props.xpForLevels.length) {
            // Reached max level!  Fancy wipe!
            this.pendingAnimations.push(() => {
              if (isAnimationExpired()) return;
              game.playGameSound(SoundEvents.PLAY_UI_ABILITY_COOLDOWN_OVER);
              this.props.onLevelUpAnimationBegun?.(capturedCurrentLevel, 1500);
              this.setState({ shouldAnimateXP: false, wipe: 'bifrost' });
              this.runNextAnimationAfterMS(1500);
            });
            // And back to normal state.
            this.pendingAnimations.push(() => {
              if (isAnimationExpired()) return;
              this.setState({ shouldAnimateXP: false, wipe: '' });
              this.runNextAnimationAfterMS(1);
            });

            justMaxed = true;
            currentXP = this.props.current;
          } else {
            // Wipe animation to celebrate a level up.
            this.pendingAnimations.push(() => {
              if (isAnimationExpired()) return;
              game.playGameSound(SoundEvents.PLAY_UI_ABILITY_COOLDOWN_OVER);
              this.props.onLevelUpAnimationBegun?.(capturedCurrentLevel, 1500);
              this.setState({ shouldAnimateXP: false, wipe: 'white' });
              this.runNextAnimationAfterMS(1500);
            });

            // Not max level.  Reset to zero xp.
            // Reset to zero XP at the start of the NEXT level.
            const maxXPForNextLevel = this.props.xpForLevels[currentLevel - 1] ?? 100;
            this.pendingAnimations.push(() => {
              if (isAnimationExpired()) return;
              this.props.onXPAnimationBegun?.(0, 0, maxXPForNextLevel, 1);
              this.setState({
                shouldAnimateXP: false,
                xp: 0,
                maxXP: maxXPForNextLevel,
                wipe: ''
              });
              this.runNextAnimationAfterMS(250);
            });
            currentXP = 0;
          }
        } else if (!justMaxed) {
          // We're at the right level, so we just need to add some xp and make the bar move.
          const maxXPForCurrentLevel = this.props.xpForLevels[currentLevel - 1] ?? 100;
          const capturedCurrentXP = currentXP;
          this.pendingAnimations.push(() => {
            if (isAnimationExpired()) return;
            this.props.onXPAnimationBegun?.(capturedCurrentXP, this.props.current, maxXPForCurrentLevel, 1000);
            this.setState({ shouldAnimateXP: true, xp: this.props.current, maxXP: maxXPForCurrentLevel, wipe: '' });
            this.runNextAnimationAfterMS(1000);
          });
          // Mark our progress so this loop can end.
          currentXP = this.props.current;
        }
      }

      // Start the first animation segment.
      if (this.pendingAnimations.length > 0) {
        this.runNextAnimationAfterMS(500);
      }
    }
  }

  componentWillUnmount(): void {
    if (this.animTimeout) {
      clearTimeout(this.animTimeout);
      this.animTimeout = null;
      // If we were animating, we're done with that now.
      this.props.onAnimationComplete?.();
    }
    this.pendingAnimations = [];
  }

  private runNextAnimationAfterMS(delay: number): void {
    this.animTimeout = window.setTimeout(() => {
      if (this.pendingAnimations.length > 0) {
        const [nextAnim, ...pendingAnimations] = this.pendingAnimations;
        this.pendingAnimations = pendingAnimations;
        nextAnim();
      } else {
        this.animTimeout = null;
        this.forceUpdate();
        this.props.onAnimationComplete?.();
      }
    }, delay);
  }
}
