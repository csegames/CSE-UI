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
import { ProgressionTrackDelta } from '@csegames/library/dist/_baseGame/clientFunctions/ProgressionFunctions';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  replaceStringTokens,
  StringIDGeneralLevelShort
} from '../../helpers/stringTableHelpers';
import { AbilityWithActivation } from '../../redux/abilitiesSlice';
import { AbilityGroup } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { TooltipSource } from '../TooltipSource';
import Draggable from '../Draggable';
import DraggableHandle, { DropHandlerDraggableData } from '../DraggableHandle';
import { DropTypeAbilityButton } from '../abilityBars/AbilityButtonShared';
import { AbilityBarSlotDropTargetData } from '../abilityBars/AbilityBarSlot';
import { getFactionData } from '../../gameData/factionData';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { FactionDivider } from '../FactionDivider';
import {
  PlayerEntityStateModel,
  ProgressState
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { AbilityTooltip } from '../abilityBars/AbilityTooltip';
import { AbilityBookAbilityDisplayData } from './AbilityBook';
import { AbilityBookHeader } from './AbilityBookHeader';
import { AbilityBookNameBanner } from './AbilityBookNameBanner';
import { AbilityBookTrainingBar } from './AbilityBookTrainingBar';
import { GameDefsState } from '../../redux/gameDefsSlice';
import {
  getAbilityByDisplayDefID,
  getAbilityIconBorderProps,
  getAvailableAbilityPoints,
  isArchetypeTrack,
  isSpecializationTrack,
  playStagedLevelChangeSound,
  StringIDAbilityBookClassProgression,
  TAG_PREFIX_PASSIVE
} from '../../helpers/abilityBookHelpers';
import { ProgressionTrackDef } from '../../dataSources/manifest/progressionTrackManifest';

const LEVEL_UP_ANIMATION_DURATION_MS = 1500;
const STAGED_GLOW_BOX_SHADOW = '0 0 1.2vmin 0.4vmin';
// Capstones are larger but keep the same corners as the other ability icons.
const ABILITY_ICON_SIZE_VMIN = 5;

// CSS classes
const Root = 'HUD-AbilityPageClass-Root';
const TracksRow = 'HUD-AbilityPageClass-TracksRow';
const TrackColumn = 'HUD-AbilityPageClass-TrackColumn';
const AbilityTrackColumn = 'HUD-AbilityPageClass-AbilityTrackColumn';
const AbilityContainer = 'HUD-AbilityPageClass-AbilityContainer';
const StagedGlow = 'HUD-AbilityPageClass-StagedGlow';
const AbilitiesListEntry = 'HUD-AbilityPageClass-AbilitiesListEntry';
const AbilityIconContainer = 'HUD-AbilityPageClass-AbilityIconContainer';
const AbilitiesListEntryDraggable = 'HUD-AbilityPageClass-AbilitiesListEntryDraggable';
const AbilitiesListEntryDraggableHandle = 'HUD-AbilityPageClass-AbilitiesListEntryDraggableHandle';
const AbilitiesListEntryIcon = 'HUD-AbilityPageClass-AbilitiesListEntryIcon';
const AbilitiesListEntryIconDraggable = 'HUD-AbilityPageClass-AbilitiesListEntryIconDraggable';
const LastAbilityDecoration = 'HUD-AbilityPageClass-LastAbilityDecoration';
const ConnectionLine = 'HUD-AbilityPageClass-ConnectionLine';
const PassiveDivider = 'HUD-AbilityPageClass-PassiveDivider';
const TooltipRoot = 'HUD-AbilityBook-TooltipRoot';
const TooltipHeader = 'HUD-AbilityBook-TooltipHeader';
const TooltipDescription = 'HUD-AbilityBook-TooltipDescription';

// String IDs
const StringIDAbilityBookUnlockLevel = 'AbilityBookUnlockLevel';
const StringIDAbilityBookAvailablePoints = 'AbilityBookAvailablePoints';
const StringIDAbilityBookCharacterLevel = 'AbilityBookCharacterLevel';

interface State {
  // This caches the previous state so we can compare it to detect level ups that need animation.
  progression: Record<string, ProgressState>;
  // Each track that just leveled up, mapped to its level before the level up.
  levelUpFromLevels: Record<string, number>;
  // Levels staged per spec track. Train sends them all in one allocation.
  stagedLevelsByTrackID: Record<string, number>;
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
  private levelUpTimeout: number = 0;

  constructor(props: Props) {
    super(props);

    this.state = { progression: {}, levelUpFromLevels: {}, stagedLevelsByTrackID: {} };
  }

  render(): React.ReactNode {
    // If a level up anim is pending, start it!
    this.animateLevelUps();

    const classDef = this.props.myClass;

    const archetypeTracks = classDef.progressionTracks.filter((ptID) => {
      return isArchetypeTrack(this.props.defs.progressionTracks[ptID]);
    });

    const specializationTracks = classDef.progressionTracks.filter((ptID) => {
      return isSpecializationTrack(this.props.defs.progressionTracks[ptID]);
    });

    return (
      <div className={Root}>
        <AbilityBookHeader title={getStringTableValue(StringIDAbilityBookClassProgression, this.props.stringTable)} />
        <div className={TracksRow}>
          {this.renderArchetypeColumn(archetypeTracks[0])}
          {specializationTracks.map(this.renderSpecColumn.bind(this))}
        </div>
        <AbilityBookTrainingBar
          availableTemplate={getStringTableValue(StringIDAbilityBookAvailablePoints, this.props.stringTable)}
          availablePoints={this.getAvailablePoints()}
          stagedPoints={this.getStagedPointsTotal()}
          onReset={this.onResetClicked.bind(this)}
          onTrain={this.onTrainClicked.bind(this)}
        />
      </div>
    );
  }

  private animateLevelUps(): void {
    // Because we detect level ups in a static function, we have to capture that in the widget instance
    // so we can mark the specific level ups as complete.

    if (Object.keys(this.state.levelUpFromLevels).length > 0 && this.levelUpTimeout === 0) {
      if (this.hasTrainedLevelUp()) {
        clientAPI.playGameSound(SoundEvents.PLAY_CP_ABILITY_TRAINING_COMPLETE);
      }

      // After the animation finishes, clear the level ups so the views can transition back to a non-anim state.
      this.levelUpTimeout = window.setTimeout(() => {
        this.levelUpTimeout = 0;
        this.setState({ levelUpFromLevels: {} });
      }, LEVEL_UP_ANIMATION_DURATION_MS);
    }
  }

  // Only spec tracks level up from training; the archetype track levels up from experience.
  private hasTrainedLevelUp(): boolean {
    return Object.keys(this.state.levelUpFromLevels).some((ptID) => {
      return isSpecializationTrack(this.props.defs.progressionTracks[ptID]);
    });
  }

  public static getDerivedStateFromProps(props: Props, state: State): State {
    // If there is no self, then there is no progression or progress to compare.
    if (!props.self) {
      return { progression: {}, levelUpFromLevels: {}, stagedLevelsByTrackID: {} };
    }

    if (props.self.progression !== state.progression) {
      // Progression changed, so at a minimum we will update the cached version.
      const levelUpFromLevels: Record<string, number> = {};
      // Empty progression would mean that this is the first login update for a character, and thus
      // wouldn't animate anything.
      if (Object.keys(state.progression).length > 0) {
        // Non-empty is an update that may contain level ups!  Check for those, and maybe queue animations.
        props.myClass.progressionTracks.forEach((ptID: string) => {
          const newProgress = props.self.progression[ptID];
          const oldProgress = state.progression[ptID];
          if (newProgress && oldProgress && newProgress.level > oldProgress.level) {
            levelUpFromLevels[ptID] = oldProgress.level;
          }
        });
      }
      // This is a static function, but the timeout for the animation has to be specific to the widget instance,
      // so we set it up in animateLevelUps() during render().
      return { ...state, progression: props.self.progression, levelUpFromLevels };
    }

    // If no level ups detected, pass along the state unaltered.
    return state;
  }

  private isUnlockAnimating(ptID: string, unlockedAtLevel: number, trackLevel: number): boolean {
    const levelBeforeLevelUp = this.state.levelUpFromLevels[ptID];
    return levelBeforeLevelUp !== undefined && unlockedAtLevel > levelBeforeLevelUp && unlockedAtLevel <= trackLevel;
  }

  private getStagedTrackLevel(ptID: string, trackLevel: number): number {
    return trackLevel + (this.state.stagedLevelsByTrackID[ptID] ?? 0);
  }

  private getStagedPointsTotal(): number {
    return Object.values(this.state.stagedLevelsByTrackID).reduce((total, levels) => total + levels, 0);
  }

  private getAvailablePoints(): number {
    return (
      getAvailableAbilityPoints(this.props.myClass, this.props.defs, this.props.self) - this.getStagedPointsTotal()
    );
  }

  private renderArchetypeColumn(ptID: string): React.ReactNode {
    const displayCharacterLevel = (this.props.self.characterLevel ?? 0) + 1;

    return (
      <FactionBorder className={TrackColumn} type={BorderType.Primary} background={BorderBackground.PatternLarge}>
        <AbilityBookNameBanner
          name={getStringTableValue(this.props.myClass.name, this.props.stringTable)}
          details={getTokenizedStringTableValue(StringIDAbilityBookCharacterLevel, this.props.stringTable, {
            LEVEL: displayCharacterLevel.toFixed()
          })}
        />
        {this.renderAbilityTrack(ptID, false, this.renderPassive())}
      </FactionBorder>
    );
  }

  private renderAbilityTrack(ptID: string, isSpec: boolean, leadingCells?: React.ReactNode): React.ReactNode {
    const abilityData = this.getFilteredAbilities([ptID]);
    if (abilityData.length <= 0) {
      return null;
    }

    return (
      <div className={AbilityTrackColumn}>
        {leadingCells}
        {abilityData.map(this.renderAbilityCell.bind(this, isSpec))}
      </div>
    );
  }

  private renderSpecColumn(ptID: string): React.ReactNode {
    const track = this.props.defs.progressionTracks[ptID];
    const displayLevel = (this.props.self.progression[ptID]?.level ?? 0) + 1;

    return (
      <FactionBorder
        key={ptID}
        className={TrackColumn}
        type={BorderType.Primary}
        background={BorderBackground.PatternLarge}
      >
        <AbilityBookNameBanner
          name={getStringTableValue(track.nameKey, this.props.stringTable)}
          details={getTokenizedStringTableValue(StringIDGeneralLevelShort, this.props.stringTable, {
            LEVEL: displayLevel.toFixed()
          })}
        />
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

    const progress = this.props.self.progression[data.progressionTrackID];
    const trackLevel = progress?.level ?? 0;
    const isLocked = trackLevel < data.unlockedAtLevel;
    const isStaged = isLocked && data.unlockedAtLevel <= this.getStagedTrackLevel(data.progressionTrackID, trackLevel);
    const isLast = index === all.length - 1;
    // Only spec tracks end in a capstone ability.
    const lastClass = isLast && isSpec ? ' last' : '';
    const hasConnectionLine = isSpec && !isLast;

    const shouldAnimateCell = this.isUnlockAnimating(data.progressionTrackID, data.unlockedAtLevel, trackLevel);
    // Lines are drawn after cells, so if the NEXT cell should animate, then this LINE should animate.
    const shouldAnimateLine =
      hasConnectionLine && this.isUnlockAnimating(data.progressionTrackID, all[index + 1].unlockedAtLevel, trackLevel);

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
          onMouseDown={isSpec && isLocked ? this.onLockedAbilityMouseDown.bind(this, data) : undefined}
        >
          {isLast && isSpec && <img className={LastAbilityDecoration} src={factionData.hudnavEndImage} />}
          {this.renderDraggableAbilityIcon(data, lastClass, isLocked)}
          {isLast && isSpec && <img className={`${LastAbilityDecoration} right`} src={factionData.hudnavEndImage} />}
        </TooltipSource>
        {isStaged && (
          <div
            className={`${StagedGlow}${lastClass}`}
            style={{ boxShadow: `${STAGED_GLOW_BOX_SHADOW} ${factionData.selectionGlowColor}` }}
          />
        )}
        {hasConnectionLine && this.renderConnectionLine(trackLevel, data, index, all, shouldAnimateLine)}
      </div>
    );
  }

  private renderDraggableAbilityIcon(
    data: AbilityBookAbilityDisplayData,
    lastClass: string,
    isLocked: boolean
  ): React.ReactNode {
    const draggableId = `AbilityBook${data.ability?.id}`;

    // Swaps change the ability's displayDefID in place, so derive the icon from the live ability
    // (same as AbilityButton), falling back to the track's base def.
    const liveDisplayDef = data.ability
      ? this.props.defs.abilityDisplayDefsByNumericID[data.ability.displayDefID] ?? data.displayDef
      : data.displayDef;

    return (
      <FactionBorder
        className={`${AbilityIconContainer}${lastClass}`}
        {...getAbilityIconBorderProps(!isLocked, ABILITY_ICON_SIZE_VMIN)}
      >
        <Draggable
          className={`${AbilitiesListEntryDraggable}${lastClass}`}
          draggableID={draggableId}
          draggingRender={() => (
            <img className={`${AbilitiesListEntryIconDraggable}${lastClass}`} src={liveDisplayDef.iconURL} />
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
            <img className={AbilitiesListEntryIcon} src={liveDisplayDef.iconURL} />
          </DraggableHandle>
        </Draggable>
      </FactionBorder>
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
          style={nextIsUnlocked && !shouldAnimate ? this.getUnlockedConnectionLineStyle() : {}}
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

  private getUnlockedConnectionLineStyle(): React.CSSProperties {
    return { borderColor: 'white', backgroundColor: getFactionData(this.props.uiFactionID).mailSenderColor };
  }

  private renderPassive(): React.ReactNode {
    const passiveTrackID = this.props.myClass.progressionTracks.find((ptID) => {
      return this.props.defs.progressionTracks[ptID]?.tags.some((tag) => tag.startsWith(TAG_PREFIX_PASSIVE));
    });
    if (!passiveTrackID) {
      return null;
    }

    const track = this.props.defs.progressionTracks[passiveTrackID];
    const grantedAbilities = this.getFilteredAbilities([passiveTrackID]);

    // Uses ability cells so the passive lines up with the spec rows.
    return (
      <>
        <div className={AbilityContainer}>
          <TooltipSource
            className={AbilitiesListEntry}
            tooltipID={`passive${track.id}`}
            content={this.renderPassiveTooltip.bind(this, track)}
            positionType='mouse'
          >
            <FactionBorder
              className={AbilityIconContainer}
              {...getAbilityIconBorderProps(true, ABILITY_ICON_SIZE_VMIN)}
            >
              <img className={AbilitiesListEntryIcon} src={track.iconURL} />
            </FactionBorder>
          </TooltipSource>
        </div>
        {grantedAbilities.map(this.renderAbilityCell.bind(this, false))}
        <FactionDivider simple className={PassiveDivider} />
      </>
    );
  }

  private renderPassiveTooltip(track: ProgressionTrackDef): JSX.Element {
    return (
      <div className={TooltipRoot}>
        <div className={TooltipHeader}>{getStringTableValue(track.nameKey, this.props.stringTable)}</div>
        <div className={TooltipDescription}>{getStringTableValue(track.descriptionKey, this.props.stringTable)}</div>
      </div>
    );
  }

  private onLockedAbilityMouseDown(data: AbilityBookAbilityDisplayData, e: React.MouseEvent): void {
    if (e.button !== 0) {
      return;
    }

    const ptID = data.progressionTrackID;
    const trackLevel = this.props.self.progression[ptID]?.level ?? 0;
    const stagedTrackLevel = this.getStagedTrackLevel(ptID, trackLevel);
    // Clicking a staged ability unstages it along with everything after it on the track.
    const newStagedTrackLevel =
      data.unlockedAtLevel <= stagedTrackLevel ? data.unlockedAtLevel - 1 : data.unlockedAtLevel;

    const stagedLevelChange = newStagedTrackLevel - stagedTrackLevel;
    if (stagedLevelChange > this.getAvailablePoints()) {
      return;
    }

    playStagedLevelChangeSound(stagedLevelChange);

    this.setState({
      stagedLevelsByTrackID: { ...this.state.stagedLevelsByTrackID, [ptID]: newStagedTrackLevel - trackLevel }
    });
  }

  private onTrainClicked(): void {
    const deltas: ProgressionTrackDelta[] = Object.entries(this.state.stagedLevelsByTrackID)
      .filter(([, levels]) => levels > 0)
      .map(([trackID, levels]) => ({ trackID, delta: levels }));
    clientAPI.playGameSound(SoundEvents.PLAY_CP_ABILITY_TRAIN);
    clientAPI.applySpecAllocation(deltas);
    this.setState({ stagedLevelsByTrackID: {} });
  }

  private onResetClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_CP_ABILITY_RESET);
    this.setState({ stagedLevelsByTrackID: {} });
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
