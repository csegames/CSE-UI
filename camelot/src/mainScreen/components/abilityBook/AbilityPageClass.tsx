/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  replaceStringTokens
} from '../../helpers/stringTableHelpers';
import { AbilityWithActivation } from '../../redux/abilitiesSlice';
import { AbilityGroup } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import TooltipSource from '../TooltipSource';
import Draggable from '../Draggable';
import DraggableHandle, { DropHandlerDraggableData } from '../DraggableHandle';
import { DropTypeAbilityButton } from '../abilityBars/AbilityButton';
import { AbilityBarSlotDropTargetData } from '../abilityBars/AbilityBarSlot';
import { getFactionData } from '../../gameData/factionData';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import {
  PlayerEntityStateModel,
  ProgressState
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { AbilityTooltip } from '../abilityBars/AbilityTooltip';
import { FactionButton } from '../FactionButton';
import { AbilityBookAbilityDisplayData } from './AbilityBook';
import { GameDefsState } from '../../redux/gameDefsSlice';
import {
  getAbilityByDisplayDefID,
  getAvailableAbilityPoints,
  TAG_PREFIX_ARCHETYPE_CLASS,
  TAG_PREFIX_SPECIALIZATION
} from '../../helpers/abilityBookHelpers';

const LEVEL_UP_ANIMATION_DURATION_MS = 1500;

// CSS classes
const Root = 'HUD-AbilityPageClass-Root';
const ArchetypeColumn = 'HUD-AbilityPageClass-ArchetypeColumn';
const SpecsColumn = 'HUD-AbilityPageClass-SpecsColumn';
const PointsHeader = 'HUD-AbilityPageClass-PointsHeader';
const PointsBorder = 'HUD-AbilityPageClass-PointsBorder';
const PointsLabel = 'HUD-AbilityPageClass-PointsLabel';
const SpecsSection = 'HUD-AbilityPageClass-SpecsSection';
const SpecColumn = 'HUD-AbilityPageClass-SpecColumn';
const SpecLabel = 'HUD-AbilityPageClass-SpecLabel';
const LevelLabel = 'HUD-AbilityPageClass-LevelLabel';
const ArchetypeNameBorder = 'HUD-AbilityPageClass-ArchetypeNameBorder';
const SpecNameBorder = 'HUD-AbilityPageClass-SpecNameBorder';
const LevelBorder = 'HUD-AbilityPageClass-LevelBorder';
const AbilityTrackColumn = 'HUD-AbilityPageClass-AbilityTrackColumn';
const AbilityContainer = 'HUD-AbilityPageClass-AbilityContainer';
const TrainButton = 'HUD-AbilityPageClass-TrainButton';
const AbilitiesListEntry = 'HUD-AbilityPageClass-AbilitiesListEntry';
const AbilityIconContainer = 'HUD-AbilityPageClass-AbilityIconContainer';
const AbilitiesListEntryDraggable = 'HUD-AbilityPageClass-AbilitiesListEntryDraggable';
const AbilitiesListEntryDraggableHandle = 'HUD-AbilityPageClass-AbilitiesListEntryDraggableHandle';
const AbilitiesListEntryIcon = 'HUD-AbilityPageClass-AbilitiesListEntryIcon';
const AbilitiesListEntryIconDraggable = 'HUD-AbilityPageClass-AbilitiesListEntryIconDraggable';
const LastAbilityDecoration = 'HUD-AbilityPageClass-LastAbilityDecoration';
const ConnectionLine = 'HUD-AbilityPageClass-ConnectionLine';
const TooltipRoot = 'HUD-AbilityBook-TooltipRoot';
const TooltipHeader = 'HUD-AbilityBook-TooltipHeader';
const TooltipDescription = 'HUD-AbilityBook-TooltipDescription';

// String IDs
const StringIDAbilityBookUnlockLevel = 'AbilityBookUnlockLevel';
const StringIDAbilityBookAvailablePoints = 'AbilityBookAvailablePoints';
const StringIDAbilityBookCharacterLevel = 'AbilityBookCharacterLevel';
const StringIDAbilityBookTrackLevel = 'AbilityBookTrackLevel';
const StringIDAbilityBookNotEnoughPoints = 'AbilityBookNotEnoughPoints';
const StringIDAbilityBookTrain = 'AbilityBookTrain';

interface State {
  // This caches the previous state so we can compare it to detect level ups that need animation.
  progression: Record<string, ProgressState>;
  // When detected, we mark the track here.
  levelUpTrackID: string;
}

interface ReactProps {}

interface InjectedProps {
  uiFactionID: string;
  myClass: ClassDef;
  stringTable: Record<string, StringTableEntryDef>;
  defs: GameDefsState;
  groups: Dictionary<AbilityGroup>;
  abilities: Record<number, AbilityWithActivation>;
  abilityIDsByDisplayDefID: Record<number, number>;
  self: PlayerEntityStateModel;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AAbilityPageClass extends React.Component<Props, State> {
  private availablePoints: number = 0;
  private levelUpTimeout: number = 0;

  constructor(props: Props) {
    super(props);

    this.state = { progression: {}, levelUpTrackID: '' };
  }

  render(): React.ReactNode {
    // If a level up anim is pending, start it!
    this.animateLevelUps();

    const classDef = this.props.myClass;

    const archetypeTracks = classDef.progressionTracks.filter((ptID) => {
      const progressionTrack = this.props.defs.progressionTracks[ptID];
      return progressionTrack.tags.some((tag) => tag.startsWith(TAG_PREFIX_ARCHETYPE_CLASS));
    });

    const specializationTracks = classDef.progressionTracks.filter((ptID) => {
      const progressionTrack = this.props.defs.progressionTracks[ptID];
      return progressionTrack.tags.some((tag) => tag.startsWith(TAG_PREFIX_SPECIALIZATION));
    });

    const characterLevel = this.props.self.characterLevel ?? 0;
    const displayCharacterLevel = characterLevel + 1;

    this.availablePoints = getAvailableAbilityPoints(classDef, this.props.defs, this.props.self);

    return (
      <div className={Root}>
        <FactionBorder
          className={ArchetypeColumn}
          type={BorderType.Primary}
          background={BorderBackground.Darken}
          includeRight={false}
        >
          <div
            className={ArchetypeNameBorder}
            style={{ backgroundImage: `url(${getFactionData(this.props.uiFactionID).headerBorderSecondaryImage})` }}
          >
            <div className={SpecLabel}>{getStringTableValue(classDef.name, this.props.stringTable)}</div>
          </div>
          <FactionBorder
            className={LevelBorder}
            type={BorderType.Secondary}
            background={BorderBackground.PatternSmall}
            includeTop={false}
          >
            <div className={LevelLabel}>
              {getTokenizedStringTableValue(StringIDAbilityBookCharacterLevel, this.props.stringTable, {
                LEVEL: displayCharacterLevel.toFixed()
              })}
            </div>
          </FactionBorder>
          <FactionButton className={`${TrainButton} max`} size={'m'} widthOverrideVmin={6.5} />
          {this.renderAbilityTrack(archetypeTracks[0], false)}
        </FactionBorder>
        <div className={SpecsColumn}>
          <FactionBorder className={SpecsSection} type={BorderType.Primary} background={BorderBackground.PatternLarge}>
            {specializationTracks.map(this.renderSpecColumn.bind(this))}
          </FactionBorder>
          <div className={PointsHeader}>
            <FactionBorder
              className={PointsBorder}
              type={BorderType.Secondary}
              background={BorderBackground.PatternSmall}
            >
              <div className={PointsLabel}>
                {getTokenizedStringTableValue(StringIDAbilityBookAvailablePoints, this.props.stringTable, {
                  POINTS: this.availablePoints.toFixed(0)
                })}
              </div>
            </FactionBorder>
          </div>
        </div>
      </div>
    );
  }

  private animateLevelUps(): void {
    // Because we detect level ups in a static function, we have to capture that in the widget instance
    // so we can mark the specific level ups as complete.

    if (this.state.levelUpTrackID !== '' && this.levelUpTimeout === 0) {
      // After the animation finishes, clear the levelUpTrackID so the views can transition back to a non-anim state.
      this.levelUpTimeout = window.setTimeout(() => {
        this.levelUpTimeout = 0;
        this.setState({ levelUpTrackID: '' });
      }, LEVEL_UP_ANIMATION_DURATION_MS);
    }
  }

  public static getDerivedStateFromProps(props: Props, state: State): State {
    // If there is no self, then there is no progression or progress to compare.
    if (!props.self) {
      return { progression: {}, levelUpTrackID: '' };
    }

    if (props.self.progression !== state.progression) {
      // Progression changed, so at a minimum we will update the cached version.
      let newState: State = {
        progression: props.self.progression,
        levelUpTrackID: ''
      };
      // Empty progression would mean that this is the first login update for a character, and thus
      // wouldn't animate anything.
      if (Object.keys(state.progression).length > 0) {
        // Non-empty is an update that may contain level ups!  Check for those, and maybe queue animations.
        props.myClass.progressionTracks.forEach((ptID: string) => {
          const newProgress = props.self.progression[ptID];
          const oldProgress = state.progression[ptID];
          if (newProgress && oldProgress && newProgress.level > oldProgress.level) {
            newState.levelUpTrackID = ptID;
          }
        });
      }
      // This is a static function, but the timeout for the animation has to be specific to the widget instance,
      // so we set it up in animateLevelUps() during render().
      return newState;
    }

    // If no level ups detected, pass along the state unaltered.
    return state;
  }

  private renderAbilityTrack(ptID: string, isSpec: boolean): React.ReactNode {
    const abilityData = this.getFilteredAbilities([ptID]);
    if (abilityData.length <= 0) {
      return null;
    }

    return <div className={AbilityTrackColumn}>{abilityData.map(this.renderAbilityCell.bind(this, isSpec))}</div>;
  }

  private getMaxLevelForTrack(ptID: string): number {
    const track = this.props.defs.progressionTracks[ptID];
    if (!track) {
      return 0;
    }
    const unlockLevels = Object.values(track.abilityUnlocks).sort();
    return unlockLevels[unlockLevels.length - 1];
  }

  private renderSpecColumn(ptID: string, index: number): React.ReactNode {
    const track = this.props.defs.progressionTracks[ptID];
    const state = this.props.self.progression[ptID];

    const level = state?.level ?? 0;
    const displayLevel = level + 1;
    const odd = index % 2 === 1;
    const isMaxLevel = level >= this.getMaxLevelForTrack(ptID);
    const canTrain = !isMaxLevel && this.availablePoints > 0;

    return (
      <FactionBorder
        className={SpecColumn}
        type={BorderType.Primary}
        background={odd ? BorderBackground.Darken : BorderBackground.None}
        includeTop={false}
        includeBottom={false}
        includeLeft={odd}
        includeRight={odd}
      >
        <div
          className={SpecNameBorder}
          style={{ backgroundImage: `url(${getFactionData(this.props.uiFactionID).headerBorderSecondaryImage})` }}
        >
          <div className={SpecLabel}>{getStringTableValue(track.nameKey, this.props.stringTable)}</div>
        </div>
        <FactionBorder
          className={LevelBorder}
          type={BorderType.Secondary}
          background={BorderBackground.PatternSmall}
          includeTop={false}
        >
          <div className={LevelLabel}>
            {getTokenizedStringTableValue(StringIDAbilityBookTrackLevel, this.props.stringTable, {
              LEVEL: displayLevel.toFixed()
            })}
          </div>
        </FactionBorder>
        <FactionButton
          className={`${TrainButton}${!canTrain ? ' max' : ''}`}
          size={'m'}
          widthOverrideVmin={6.5}
          fontScale={1.3}
          disabled={!canTrain}
          disabledTooltip={getStringTableValue(StringIDAbilityBookNotEnoughPoints, this.props.stringTable)}
          onClick={this.onTrainClicked.bind(this, ptID)}
        >
          {getStringTableValue(StringIDAbilityBookTrain, this.props.stringTable)}
        </FactionButton>
        {this.renderAbilityTrack(ptID, true)}
      </FactionBorder>
    );
  }

  private renderAbilityCell(
    isSpec: boolean,
    data: AbilityBookAbilityDisplayData,
    index: number,
    all: AbilityBookAbilityDisplayData[]
  ): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const draggableId = `AbilityBook${data.ability?.id}`;

    const progress = this.props.self.progression[data.progressionTrackID];
    const trackLevel = progress?.level ?? 0;
    const isLocked = trackLevel < data.unlockedAtLevel;
    const isLast = index === all.length - 1;
    const lastClass = isLast ? ' last' : '';

    const isLevelUpTrack = this.state.levelUpTrackID === data.progressionTrackID;
    const shouldAnimateCell = isLevelUpTrack && data.unlockedAtLevel === trackLevel;
    // Lines are drawn after cells, so if the NEXT cell should animate, then this LINE should animate.
    const shouldAnimateLine = isLevelUpTrack && (all[index + 1]?.unlockedAtLevel ?? 0) === trackLevel;

    return (
      <div className={`${AbilityContainer}${lastClass}`}>
        <TooltipSource
          className={`${AbilitiesListEntry}${isLocked ? ' locked' : ''}${lastClass}${
            shouldAnimateCell ? ' levelUp' : ''
          }`}
          tooltipID={`abilityCell${data.displayDef.id}`}
          content={this.renderAbilityTooltip.bind(this, data)}
          positionType='mouse'
          key={data.displayDef.id}
          style={shouldAnimateCell ? { opacity: 0.2 } : {}}
        >
          {isLast && isSpec && <img className={LastAbilityDecoration} src={factionData.hudnavEndImage} />}
          <FactionBorder className={`${AbilityIconContainer}${lastClass}`} type={BorderType.Secondary}>
            <Draggable
              className={`${AbilitiesListEntryDraggable}${lastClass}`}
              draggableID={draggableId}
              draggingRender={() => (
                <img className={`${AbilitiesListEntryIconDraggable}${lastClass}`} src={data.displayDef.iconURL} />
              )}
            >
              <DraggableHandle
                className={`${AbilitiesListEntryDraggableHandle}${!data.ability ? ' disabled' : ''}${lastClass}`}
                draggableID={draggableId}
                dropHandler={this.onAbilityDropped.bind(this)}
                dragStartHandler={this.onAbilityDragStarted.bind(this)}
                dropType={DropTypeAbilityButton}
                isDisabled={!data.ability}
              >
                <img className={AbilitiesListEntryIcon} src={data.displayDef.iconURL} />
              </DraggableHandle>
            </Draggable>
          </FactionBorder>
          {isLast && isSpec && <img className={`${LastAbilityDecoration} right`} src={factionData.hudnavEndImage} />}
        </TooltipSource>
        {!isLast && this.renderConnectionLine(trackLevel, data, index, all, shouldAnimateLine)}
      </div>
    );
  }

  private renderConnectionLine(
    trackLevel: number,
    data: AbilityBookAbilityDisplayData,
    index: number,
    all: AbilityBookAbilityDisplayData[],
    shouldAnimate: boolean
  ): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const nextIsUnlocked = all[index + 1].unlockedAtLevel <= trackLevel;

    return (
      <>
        <div
          className={ConnectionLine}
          style={
            nextIsUnlocked && !shouldAnimate
              ? { borderColor: 'white', backgroundColor: factionData.mailSenderColor }
              : {}
          }
        />
        {shouldAnimate && (
          <div
            className={`${ConnectionLine} levelUp`}
            style={nextIsUnlocked ? { backgroundColor: factionData.mailSenderColor } : {}}
          />
        )}
      </>
    );
  }

  private onTrainClicked(progressionTrackID: string): void {
    // Request an increment to the track.
    clientAPI.applySpecAllocation([{ trackID: progressionTrackID, delta: 1 }]);
  }

  private renderAbilityTooltip(data: AbilityBookAbilityDisplayData): JSX.Element {
    const description = replaceStringTokens(data.displayDef.description, data.ability?.stats ?? {});

    const level = this.props.self.progression[data.progressionTrackID]?.level ?? 0;

    const isLocked = data.unlockedAtLevel > level;

    return !isLocked ? (
      <AbilityTooltip abilityID={data.ability?.id ?? 0} />
    ) : (
      <div className={TooltipRoot}>
        <div className={TooltipHeader}>{data.displayDef.name}</div>
        <div className={TooltipDescription}>
          {isLocked && (
            <>
              {getTokenizedStringTableValue(StringIDAbilityBookUnlockLevel, this.props.stringTable, {
                LEVEL: `${data.unlockedAtLevel + 1}`
              })}
              <br />
            </>
          )}
          {description.split('\n').map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  private onAbilityDropped(data: AbilityBarSlotDropTargetData, { currentDraggableID }: DropHandlerDraggableData): void {
    // Do nothing if we didn't drop onto an ability slot.
    if (!data) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
      return;
    }

    const group = this.props.groups[data.groupID];

    // Not allowed to muck up system bars, and possibly some others.
    if (group.isSystem || !group.canReplace) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
      return;
    }

    // Nothing else is in the way, so let's set the ability!
    const abilityId = +currentDraggableID.slice(11);
    clientAPI.setAbility(data.groupID, data.slotIndex, abilityId);
    clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_RELEASE);
  }

  private onAbilityDragStarted(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_SELECT);
  }

  private getFilteredAbilities(progressionTrackIDs: string[]): AbilityBookAbilityDisplayData[] {
    const abilities: AbilityBookAbilityDisplayData[] = [];

    // Go through each included progressionTrack's abilities and construct data for any that should be displayed.
    progressionTrackIDs.forEach((ptID) => {
      const progressionTrackDef = this.props.defs.progressionTracks[ptID];
      if (!progressionTrackDef) {
        return;
      }

      Object.entries(progressionTrackDef.abilityUnlocks).forEach((entry) => {
        const [abilityStringID, unlockedAtLevel] = entry;

        // Must have a displayDef or you can't display it.
        const displayDef = this.props.defs.abilityDisplayDefsByStringID[abilityStringID];
        // If no network, then this is a system ability and should be excluded.
        const nw = this.props.defs.abilityNetworks[displayDef?.networkID];
        if (!nw) {
          return;
        }

        const ability = getAbilityByDisplayDefID(
          displayDef.numericID,
          this.props.abilities,
          this.props.abilityIDsByDisplayDefID
        );

        // If we make it out here, then we have all necessary data to display this ability.
        const data: AbilityBookAbilityDisplayData = {
          ability,
          displayDef,
          progressionTrackID: ptID,
          unlockedAtLevel
        };
        abilities.push(data);
      });
    });

    abilities.sort((a, b) => {
      // TODO: Should these be stringIDs?
      const aName = a.displayDef.name;
      const bName = b.displayDef.name;

      // Sort by unlock level first, then name.
      if (a.unlockedAtLevel !== b.unlockedAtLevel) {
        return a.unlockedAtLevel - b.unlockedAtLevel;
      }

      return aName.localeCompare(bName);
    });

    return abilities;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { groups, abilities, abilityIDsByDisplayDefID } = state.abilities;

  return {
    ...ownProps,
    myClass: state.gameDefs.classesByNumericID[state.entities.self.classID],
    stringTable: state.stringTable.stringTable,
    defs: state.gameDefs,
    groups,
    abilities,
    abilityIDsByDisplayDefID,
    uiFactionID: state.hud.uiFactionID,
    self: state.entities.self
  };
};

export const AbilityPageClass = connect(mapStateToProps)(AAbilityPageClass);
