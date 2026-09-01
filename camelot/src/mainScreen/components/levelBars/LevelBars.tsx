/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { AppDispatch, RootState, store } from '../../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { ProgressionTrackDef } from '../../dataSources/manifest/progressionTrackManifest';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralUnlocked
} from '../../helpers/stringTableHelpers';
import {
  PlayerEntityStateModel,
  ProgressState
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { getFactionData } from '../../gameData/factionData';
import { showToaster } from '../../redux/toastersSlice';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { TAG_PREFIX_ARCHETYPE_CLASS } from '../../helpers/abilityBookHelpers';

// String IDs
const StringIDProgressionNewLevelMessage = 'ProgressionNewLevelMessage';
const StringIDProgressionNotificationLevelUp = 'ProgressionNotificationLevelUp';
const StringIDProgressionAbilityPointGained = 'ProgressionAbilityPointGained';

// CSS classes
const Root = 'HUD-LevelBars-Root';
const BarContainer = 'HUD-LevelBars-BarContainer';
const BarText = 'HUD-LevelBars-BarText';
const BarClipper = 'HUD-LevelBars-BarClipper';
const BarContent = 'HUD-LevelBars-BarContent';
const BarFill = 'HUD-LevelBars-BarFill';
const BarBling = 'HUD-LevelBars-BarBling';
const BarEnd = 'HUD-LevelBars-BarEnd';

const LEVEL_UP_BLING_DURATION_MS = 3000;

interface State {
  /** The state used for display, and to detect changes. */
  progression: Record<string, ProgressState>;
  progress: ProgressState[];
  /** Any tracks that recently leveled up and should play a LevelUp animation. */
  levelUpTrackIDs: string[];
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  classDef: ClassDef;
  stringTable: Record<string, StringTableEntryDef>;
  progressionTracks: Record<string, ProgressionTrackDef>;
  self: PlayerEntityStateModel;
  uiFactionID: string;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class ALevelBars extends React.Component<Props, State> {
  // Maps ProgressionTrackID to a timeout handle.
  private levelUpTimeouts: Record<string, number> = {};

  constructor(props: Props) {
    super(props);

    // Constructor runs under CharacterSelect, so initial state has no data.

    this.state = {
      progression: {},
      progress: [],
      levelUpTrackIDs: []
    };
  }

  render(): React.ReactNode {
    if (!this.props.classDef) {
      return null;
    }

    this.animateLevelUps();

    return <div className={Root}>{this.state.progress.map(this.renderLevelBar.bind(this))}</div>;
  }

  private animateLevelUps(): void {
    // Because we detect level ups in a static function, we have to capture that in the widget instance
    // so we can mark the specific level ups as complete.
    this.state.levelUpTrackIDs.forEach((ptID: string) => {
      // If there is not a timeout for this levelUp track, then it was just now triggered, so start one.
      if (!this.levelUpTimeouts[ptID]) {
        // When the level up animation is complete, mark it as done.
        this.levelUpTimeouts[ptID] = window.setTimeout(() => {
          // Clean up the handle.
          delete this.levelUpTimeouts[ptID];
          // Remove the track from the list of levelUps.
          this.setState({ levelUpTrackIDs: this.state.levelUpTrackIDs.filter((lutID) => lutID !== ptID) });
        }, LEVEL_UP_BLING_DURATION_MS);
      }
    });
  }

  private renderLevelBar(progress: ProgressState): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const isLevelUp = this.state.levelUpTrackIDs.includes(progress.id);

    const total = progress?.total ?? 1;
    // During the levelUp anim, we let the bar stay full for a few seconds,
    // even though the data has probably reset it.
    const current = isLevelUp ? total : progress?.progress ?? 0;

    return (
      <FactionBorder
        key={progress.id}
        className={BarContainer}
        type={BorderType.Secondary}
        background={BorderBackground.ProgressBar}
      >
        <div className={BarClipper}>
          <div className={BarContent}>
            <img
              className={BarFill}
              src={factionData.progressBarImage}
              style={{ width: `${Math.min(1, current / total) * 100}%` }}
            />
            <div className={BarEnd} />
          </div>
        </div>
        <img className={`${BarBling}${isLevelUp ? ' levelUp' : ''}`} src={factionData.progressBarImage} />
        {/* Rendered last so it paints above BarClipper/BarBling without needing z-index. */}
        <div className={BarText}>{`${current} / ${total}`}</div>
      </FactionBorder>
    );
  }

  public static getDerivedStateFromProps(props: Props, state: State): State {
    // If there is no self, then there is no progression or progress to compare.
    if (!props.self) {
      return { progression: {}, progress: [], levelUpTrackIDs: [] };
    }

    if (props.self.progression !== state.progression) {
      const archetypeTrackIDs = (props.classDef?.progressionTracks ?? []).filter((ptID) => {
        const progressionTrack = props.progressionTracks[ptID];
        return progressionTrack?.tags.some((tag) => tag.startsWith('Asset.Class.'));
      });
      const archetypeProgress = archetypeTrackIDs.map((ptID) => {
        return props.self.progression[ptID] ?? { id: ptID, level: 0, progress: 0, total: 1 };
      });

      // For all progression tracks, if a level-up occurred, push it into the toaster system.
      Object.values(props.self.progression).forEach((prog) => {
        if (prog.level > state.progression[prog.id]?.level) {
          const track = props.progressionTracks[prog.id];
          if (track) {
            // Push a right toaster for the track level up event.
            let stringTable = store.getState().stringTable.stringTable;
            // Only the archetype/character track grants a new ability point; spending one on a
            // specialization track also raises its level, but isn't a gain.
            const isArchetypeTrack = track.tags.some((tag) => tag.startsWith(TAG_PREFIX_ARCHETYPE_CLASS));
            store.dispatch?.(
              showToaster({
                id: `LevelUp${prog.id}`,
                content: {
                  // Same layout as the quest toasts: eyebrow banner over an icon + title row.
                  eyebrow: getStringTableValue(StringIDProgressionNotificationLevelUp, stringTable),
                  titleIconURL: track.iconURL,
                  title: getStringTableValue(track.nameKey, stringTable),
                  message: getTokenizedStringTableValue(StringIDProgressionNewLevelMessage, stringTable, {
                    LEVEL: (prog.level + 1).toFixed(0)
                  }),
                  rewards: isArchetypeTrack
                    ? [{ name: getStringTableValue(StringIDProgressionAbilityPointGained, stringTable), amount: 1 }]
                    : undefined,
                  isSmall: true
                },
                position: 'level',
                soundEvent: SoundEvents.PLAY_UI_SPECIALIZATION_UP
              })
            );
            // Scan for new unlocks at the new level.  Add small right toasters for those.
            Object.entries(track.abilityUnlocks).forEach(([abilityID, unlockAtLevel]) => {
              if (unlockAtLevel === prog.level) {
                const ability = store.getState().gameDefs.abilityDisplayDefsByStringID[abilityID];
                if (ability) {
                  store.dispatch?.(
                    showToaster({
                      id: `AbilityUnlock${ability.id}`,
                      content: {
                        // Same layout as the quest toasts: eyebrow banner over an icon + title row.
                        eyebrow: getStringTableValue(StringIDGeneralUnlocked, stringTable),
                        titleIconURL: ability.iconURL,
                        title: ability.name,
                        isSmall: true
                      },
                      position: 'level',
                      soundEvent: SoundEvents.PLAY_UI_ABILITY_LEVEL_UP
                    })
                  );
                }
              }
            });
          }
        }
      });

      // For archetype progress in particular, update our local state.
      if (state.progress.length === 0) {
        const newState: State = {
          progression: props.self.progression,
          progress: archetypeProgress,
          levelUpTrackIDs: []
        };
        // If this is the initial login update for the character, just stash their values.  No animations.
        return newState;
      } else {
        // This is an update that may contain level ups!  Check for those, and maybe do animations.
        let newState: State = {
          progression: props.self.progression,
          progress: archetypeProgress,
          levelUpTrackIDs: state.levelUpTrackIDs
        };

        state.progress.forEach((oldProgress) => {
          const newProgress = props.self.progression[oldProgress.id];

          if (newProgress && oldProgress.id === newProgress.id) {
            if (newProgress.level > oldProgress.level) {
              // Queue the level-up animation for this track!
              newState.levelUpTrackIDs.push(newProgress.id);
              // This is a static function, but the timeout for the animation has to be specific to the widget instance,
              // so we set it up in `animateLevelUps()` when the instance detects new levelUpTrackIDs.
            }
          }
        });

        return newState;
      }
    }

    return state;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    classDef: state.gameDefs.classesByNumericID[state.entities.self?.classID],
    progressionTracks: state.gameDefs.progressionTracks,
    self: state.entities.self,
    uiFactionID: state.hud.uiFactionID
  };
}

const LevelBars = connect(mapStateToProps)(ALevelBars);

export const WIDGET_ID_LEVEL_BARS = 'Level Bars';
export const levelBarsRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_LEVEL_BARS,
  nameStringID: 'HUDEditorWidgetNameLevelBars',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Bottom,
    yOffset: 0.5,
    // Needs to appear over the decorations of the AbilityBars.
    layerOffset: 1
  },
  layer: HUDLayer.HUD,
  requiresGameDefsLoaded: true,
  render: (isDragCopy: boolean) => {
    return <LevelBars isDragCopy={isDragCopy} />;
  }
};
