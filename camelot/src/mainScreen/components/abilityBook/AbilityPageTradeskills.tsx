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
import { FactionTitle } from '../FactionTitle';
import { FactionBorderSelectable } from '../FactionBorderSelectable';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { ProgressionTrackDef } from '../../dataSources/manifest/progressionTrackManifest';
import { FactionDivider } from '../FactionDivider';
import { FactionScrollArea } from '../FactionScrollArea';
import { AbilityTooltip } from '../abilityBars/AbilityTooltip';
import { typedObjectEntries } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { AbilityBookAbilityDisplayData } from './AbilityBook';
import { getAbilityByDisplayDefID } from '../../helpers/abilityBookHelpers';

// CSS classes
const Root = 'HUD-AbilityPageTradeskills-Root';
const ProgressBarClipper = 'HUD-AbilityPageTradeskills-ProgressBarClipper';
const ProgressBarContent = 'HUD-AbilityPageTradeskills-ProgressBarContent';
const ProgressBar = 'HUD-AbilityPageTradeskills-ProgressBar';
const ProgressBarEnd = 'HUD-AbilityPageTradeskills-ProgressBarEnd';
const ProgressBarText = 'HUD-AbilityPageTradeskills-ProgressBarText';
const TotalLevelRow = 'HUD-AbilityPageTradeskills-TotalLevelRow';
const TotalLevelDecoration = 'HUD-AbilityPageTradeskills-TotalLevelDecoration';
const TotalLevelContainer = 'HUD-AbilityPageTradeskills-TotalLevelContainer';
const TotalLevelLabel = 'HUD-AbilityPageTradeskills-TotalLevelLabel';
const CategoryRow = 'HUD-AbilityPageTradeskills-CategoryRow';
const CategoryTabContainer = 'HUD-AbilityPageTradeskills-CategoryTabContainer';
const CategoryTabLevelContainer = 'HUD-AbilityPageTradeskills-CategoryTabLevelContainer';
const CategoryTabLevelLabel = 'HUD-AbilityPageTradeskills-CategoryTabLevelLabel';
const CategoryTabNameContainer = 'HUD-AbilityPageTradeskills-CategoryTabNameContainer';
const CategoryTabNameLabel = 'HUD-AbilityPageTradeskills-CategoryTabNameLabel';
const ListContainer = 'HUD-AbilityPageTradeskills-ListContainer';
const ListScrollArea = 'HUD-AbilityPageTradeskills-ListScrollArea';
const ListContent = 'HUD-AbilityPageTradeskills-ListContent';
const ListBorder = 'HUD-AbilityPageTradeskills-ListBorder';
const ProgressBarContainer = 'HUD-AbilityPageTradeskills-ProgressBarContainer';
const CellRoot = 'HUD-AbilityPageTradeskills-CellRoot';
const CellIconSection = 'HUD-AbilityPageTradeskills-CellIconSection';
const CellIconContainer = 'HUD-AbilityPageTradeskills-CellIconContainer';
const CellIcon = 'HUD-AbilityPageTradeskills-CellIcon';
const CellLevelContainer = 'HUD-AbilityPageTradeskills-CellLevelContainer';
const CellLevelLabel = 'HUD-AbilityPageTradeskills-CellLevelLabel';
const CellDetailsSection = 'HUD-AbilityPageTradeskills-CellDetailsSection';
const CellNameLabel = 'HUD-AbilityPageTradeskills-CellNameLabel';
const CellDivider = 'HUD-AbilityPageTradeskills-CellDivider';
const AbilitiesContainer = 'HUD-AbilityPageTradeskills-AbilitiesContainer';
const AbilitiesListEntry = 'HUD-AbilityPageTradeskills-AbilitiesListEntry';
const AbilityIconContainer = 'HUD-AbilityPageTradeskills-AbilityIconContainer';
const AbilitiesListEntryDraggable = 'HUD-AbilityPageTradeskills-AbilitiesListEntryDraggable';
const AbilitiesListEntryDraggableHandle = 'HUD-AbilityPageTradeskills-AbilitiesListEntryDraggableHandle';
const AbilitiesListEntryIcon = 'HUD-AbilityPageTradeskills-AbilitiesListEntryIcon';
const AbilitiesListEntryIconDraggable = 'HUD-AbilityPageTradeskills-AbilitiesListEntryIconDraggable';
const TooltipRoot = 'HUD-AbilityBook-TooltipRoot';
const TooltipHeader = 'HUD-AbilityBook-TooltipHeader';
const TooltipDescription = 'HUD-AbilityBook-TooltipDescription';

// String IDs
const StringIDAbilityBookUnlockLevel = 'AbilityBookUnlockLevel';
const StringIDTradeskillTabName = 'TradeskillTabName';
const StringIDTradeskillCategoryNamePrefix = 'TradeskillCategoryName';

const MAX_LARGE_TRADESKILLS = 6;

enum TradeskillTab {
  // In display order.
  Gathering = 'Gathering',
  Refining = 'Refining',
  Crafting = 'Crafting'
}

interface State {
  tradeskillTab: TradeskillTab;
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

class AAbilityPageTradeskills extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tradeskillTab: TradeskillTab.Gathering
    };
  }

  render(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const classDef = this.props.myClass;

    const tracks: Record<TradeskillTab, ProgressionTrackDef[]> = {
      [TradeskillTab.Gathering]: [],
      [TradeskillTab.Refining]: [],
      [TradeskillTab.Crafting]: []
    };

    classDef.progressionTracks.forEach((ptID) => {
      const progressionTrack = this.props.defs.progressionTracks[ptID];
      const tag = progressionTrack.tags.find((tag) => tag.startsWith(`Tradeskill.Category.`));
      const tab = tag?.slice(20) as TradeskillTab;
      // Only track supported categories.
      if (tracks[tab]) {
        tracks[tab].push(progressionTrack);
      }
    });

    const totalLevel = Object.values(tracks).reduce<number>((soFar, categoryTracks) => {
      return (
        soFar +
        categoryTracks.reduce<number>((catSoFar, catTrack) => {
          const prog = this.props.self.progression[catTrack.id];
          return catSoFar + (prog?.level ?? 0);
        }, 0)
      );
    }, 0);

    const sizeClass = (tracks[this.state.tradeskillTab]?.length ?? 0) > MAX_LARGE_TRADESKILLS ? ' small' : '';

    return (
      <div className={Root}>
        <FactionTitle heightOverrideVmin={13.54}>
          {getStringTableValue(StringIDTradeskillTabName, this.props.stringTable)}
        </FactionTitle>
        <div className={TotalLevelRow}>
          <img
            className={TotalLevelDecoration}
            style={{ backgroundImage: `url(${factionData.dividerVerticalImage})` }}
          />
          <img
            className={`${TotalLevelDecoration} right`}
            style={{ backgroundImage: `url(${factionData.dividerVerticalImage})` }}
          />
          <FactionBorder
            className={TotalLevelContainer}
            type={BorderType.Decorative}
            background={BorderBackground.PatternSmall}
          >
            <div className={TotalLevelLabel}>{totalLevel}</div>
          </FactionBorder>
        </div>
        <div className={CategoryRow}>{typedObjectEntries(tracks).map(this.renderTradeskillCategoryTab.bind(this))}</div>
        <div className={ListContainer}>
          <FactionScrollArea className={ListScrollArea} hideTrack={true} key={this.state.tradeskillTab}>
            <div className={`${ListContent}${sizeClass}`}>
              {(tracks[this.state.tradeskillTab] ?? []).map(this.renderTradeskillCell.bind(this, sizeClass))}
            </div>
          </FactionScrollArea>
          <FactionBorder className={ListBorder} type={BorderType.Primary} />
        </div>
      </div>
    );
  }

  private renderTradeskillCell(
    sizeClass: string,
    def: ProgressionTrackDef,
    index: number,
    all: ProgressionTrackDef[]
  ): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const cellsPerRow = all.length <= MAX_LARGE_TRADESKILLS ? 1 : 2;
    const isLastRow = index >= all.length - cellsPerRow;

    const prog = this.props.self.progression[def.id];
    const current = prog?.progress ?? 0;
    const total = prog?.total ?? 1;

    const abilities = this.getFilteredAbilities([def.id]);

    return (
      <React.Fragment key={index}>
        <div className={`${CellRoot}${sizeClass}${isLastRow ? ' last' : ''}`}>
          <div className={CellIconSection}>
            <FactionBorder
              className={CellIconContainer}
              type={BorderType.Secondary}
              background={BorderBackground.PatternSmall}
            >
              <img className={CellIcon} src={def.iconURL} />
            </FactionBorder>
            <FactionBorder
              className={CellLevelContainer}
              type={BorderType.Secondary}
              background={BorderBackground.PatternSmall}
              includeTop={false}
            >
              <div className={CellLevelLabel}>{prog.level}</div>
            </FactionBorder>
          </div>
          <div className={CellDetailsSection}>
            <div className={`${CellNameLabel}${sizeClass}`}>
              {getStringTableValue(def.nameKey, this.props.stringTable)}
            </div>
            <FactionBorder
              className={`${ProgressBarContainer}${sizeClass}`}
              type={BorderType.Secondary}
              background={BorderBackground.ProgressBar}
            >
              <div className={ProgressBarClipper}>
                <div className={ProgressBarContent}>
                  <img
                    className={ProgressBar}
                    src={factionData.progressBarImage}
                    style={{ width: `${Math.min(1, current / total) * 100}%` }}
                  />
                  <div className={ProgressBarEnd} />
                  <div className={`${ProgressBarText}${sizeClass}`}>{`${current} / ${total}`}</div>
                </div>
              </div>
            </FactionBorder>
            {abilities.length > 0 && (
              <div className={AbilitiesContainer}>{abilities.map(this.renderTradeskillAbilityCell.bind(this))}</div>
            )}
          </div>
        </div>
        {!isLastRow && all.length <= MAX_LARGE_TRADESKILLS ? <FactionDivider className={CellDivider} /> : null}
      </React.Fragment>
    );
  }

  private renderTradeskillAbilityCell(data: AbilityBookAbilityDisplayData, index: number): React.ReactNode {
    const draggableId = `AbilityBook${data.ability?.id}`;

    const progress = this.props.self.progression[data.progressionTrackID];
    const trackLevel = progress?.level ?? 0;
    const isLocked = trackLevel < data.unlockedAtLevel;

    return (
      <TooltipSource
        className={`${AbilitiesListEntry}${isLocked ? ' locked' : ''}`}
        tooltipID={`abilityCell${data.displayDef.id}`}
        content={this.renderAbilityTooltip.bind(this, data)}
        positionType='mouse'
        key={data.displayDef.id}
      >
        <FactionBorder className={AbilityIconContainer} type={BorderType.Secondary}>
          <Draggable
            className={AbilitiesListEntryDraggable}
            draggableID={draggableId}
            draggingRender={() => <img className={AbilitiesListEntryIconDraggable} src={data.displayDef.iconURL} />}
          >
            <DraggableHandle
              className={`${AbilitiesListEntryDraggableHandle}${!data.ability ? ' disabled' : ''}`}
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
      </TooltipSource>
    );
  }

  private renderTradeskillCategoryTab(entry: [TradeskillTab, ProgressionTrackDef[]]): React.ReactNode {
    const tabID = entry[0];
    const trackDefs = entry[1];

    const isSelected = tabID === this.state.tradeskillTab;
    const totalLevel = trackDefs.reduce<number>((soFar, def) => {
      const prog = this.props.self.progression[def.id];
      return soFar + (prog?.level ?? 0);
    }, 0);

    return (
      <div className={CategoryTabContainer} onClick={() => this.setState({ tradeskillTab: tabID })}>
        <FactionBorder
          className={CategoryTabLevelContainer}
          type={BorderType.Secondary}
          background={BorderBackground.PatternSmall}
          includeBottom={false}
        >
          <div className={CategoryTabLevelLabel}>{totalLevel}</div>
        </FactionBorder>
        <FactionBorderSelectable
          className={CategoryTabNameContainer}
          isSelected={isSelected}
          onSelected={() => this.setState({ tradeskillTab: tabID })}
          background={BorderBackground.PatternSmall}
          includeBottom={false}
        >
          <div className={CategoryTabNameLabel}>
            {getStringTableValue(StringIDTradeskillCategoryNamePrefix + tabID, this.props.stringTable)}
          </div>
        </FactionBorderSelectable>
      </div>
    );
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
                LEVEL: `${data.unlockedAtLevel}`
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

export const AbilityPageTradeskills = connect(mapStateToProps)(AAbilityPageTradeskills);
