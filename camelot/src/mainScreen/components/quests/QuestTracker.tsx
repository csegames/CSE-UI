/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import HealthBarFillURL from '../../../images/unit-frames/unit-frame-health.png';
import CheckURL from '../../../images/quests/Factionless-check-Icon.png';

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration, showConditionalWidget } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { QuestDisplayCategory, QuestStateEx, removeTrackedQuestID } from '../../redux/questSlice';
import { WIDGET_ID_QUESTLOG } from './QuestLog';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { getFactionData } from '../../gameData/factionData';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { QuestDef } from '../../dataSources/manifest/questDefManifest';
import { getItemCountForIngredient } from '../../helpers/itemHelpers';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { CollapsingDrawer } from '../CollapsingDrawer';
import { getItemCount } from '../../helpers/inventoryHelpers';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem } from '../../redux/contextMenuSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { isGenericQuestDisplay } from '../../helpers/questHelpers';

// CSS classes
const Root = 'HUD-QuestTracker-Root';
const QuestRoot = 'HUD-QuestTracker-QuestRoot';
const QuestRow = 'HUD-QuestTracker-QuestRow';
const QuestDrawer = 'HUD-QuestTracker-QuestDrawer';
const IngredientList = 'HUD-QuestTracker-IngredientList';
const IngredientRow = 'HUD-QuestTracker-IngredientRow';
const IngredientIconContainer = 'HUD-QuestTracker-IngredientIconContainer';
const IngredientIcon = 'HUD-QuestTracker-IngredientIcon';
const IngredientNameLabel = 'HUD-QuestTracker-IngredientNameLabel';
const IngredientCheck = 'HUD-QuestTracker-IngredientCheck';
const QuestDescriptionLabel = 'HUD-QuestTracker-QuestDescriptionLabel';
const ArrowColumn = 'HUD-QuestTracker-ArrowColumn';
const QuestArrow = 'HUD-QuestTracker-QuestArrow';
const QuestIconContainer = 'HUD-QuestTracker-QuestIconContainer';
const QuestIcon = 'HUD-QuestTracker-QuestIcon';
const QuestNameLabel = 'HUD-QuestTracker-QuestNameLabel';
const QuestProgressLabel = 'HUD-QuestTracker-QuestProgressLabel';
const QuestObjectiveRow = 'HUD-QuestTracker-QuestObjectiveRow';
const QuestObjectiveDash = 'HUD-QuestTracker-QuestObjectiveDash';
const QuestObjectiveLabel = 'HUD-QuestTracker-QuestObjectiveLabel';
const QuestObjectiveCheck = 'HUD-QuestTracker-QuestObjectiveCheck';
const QuestCheck = 'HUD-QuestTracker-QuestCheck';
const QuestProgressBarContainer = 'HUD-QuestTracker-QuestProgressBar-Container';
const QuestProgressBarClipper = 'HUD-QuestTracker-QuestProgressBar-Clipper';
const QuestProgressBarContent = 'HUD-QuestTracker-QuestProgressBar-Content';
const QuestProgressBarFill = 'HUD-QuestTracker-QuestProgressBar-Fill';
const QuestProgressBarEnd = 'HUD-QuestTracker-QuestProgressBar-End';
const QuestProgressBarLabel = 'HUD-QuestTracker-QuestProgressBar-Label';

// How long the slide-out animation takes before an untracked quest's row is actually removed.
const QUEST_ROW_EXIT_DURATION_MILLIS = 350;

const StringIDQuestLogKingsBountyDescriptionComplete = 'QuestLogKingsBountyDescriptionComplete';
const StringIDQuestLogKingsBountyDescriptionCurrent = 'QuestLogKingsBountyDescriptionCurrent';
const StringIDQuestLogQuestNameKingsBountyPrevious = 'QuestLogQuestNameKingsBountyPrevious';
const StringIDQuestLogQuestNameKingsBountyCurrent = 'QuestLogQuestNameKingsBountyCurrent';
// Reuse the vendor's existing untrack label — same action, same wording.
const StringIDVendorUntrack = 'VendorUntrack';
const StringIDQuestTrackerOpenInLog = 'QuestTrackerOpenInLog';

interface RowState {
  id: string;
  isExiting: boolean;
  // Snapshot of the quest/def captured the moment it drops out of trackedQuestIDs (e.g. turned
  // in), since props stops providing its data at that point; keeps the row rendering through the
  // slide-out animation.
  quest?: QuestStateEx;
  def?: QuestDef;
}

interface State {
  openQuests: string[];
  rows: RowState[];
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  isSelectedWidget: boolean;
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
  trackedQuestIDs: string[];
  quests: Record<string, QuestStateEx>;
  defs: GameDefsState;
  inventory: Item[];
}

type Props = ReactProps & InjectedProps;

class AQuestTracker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      openQuests: [],
      rows: props.trackedQuestIDs.map((id) => ({ id, isExiting: false }))
    };
  }

  render(): React.ReactNode {
    const hasTrackedQuests = this.state.rows.length > 0;
    return (
      <div className={`${Root}${hasTrackedQuests ? ' filled' : ''}`}>
        {this.state.rows.map(this.renderQuestCell.bind(this))}
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (this.props.trackedQuestIDs === prevProps.trackedQuestIDs) {
      return;
    }

    const removedIDs = prevProps.trackedQuestIDs.filter((id) => !this.props.trackedQuestIDs.includes(id));
    const addedIDs = this.props.trackedQuestIDs.filter((id) => !prevProps.trackedQuestIDs.includes(id));

    if (removedIDs.length > 0 || addedIDs.length > 0) {
      this.setState((state) => {
        const rows = state.rows.map((row) => {
          if (!removedIDs.includes(row.id) || row.isExiting) {
            return row;
          }
          const quest = prevProps.quests[row.id];
          return {
            ...row,
            isExiting: true,
            quest,
            def: prevProps.defs.questDefs[quest?.questDataID ?? '']
          };
        });
        addedIDs.forEach((id) => {
          if (!rows.find((row) => row.id === id)) {
            rows.push({ id, isExiting: false });
          }
        });
        return { rows };
      });
    }

    if (removedIDs.length > 0) {
      window.setTimeout(() => {
        this.setState((state) => ({
          rows: state.rows.filter((row) => !removedIDs.includes(row.id))
        }));
      }, QUEST_ROW_EXIT_DURATION_MILLIS);
    }
  }

  private renderQuestCell(row: RowState): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const quest = this.props.quests[row.id] ?? row.quest;
    const def = this.props.defs.questDefs[quest?.questDataID ?? ''] ?? row.def;

    if (!quest || !def) {
      return null;
    }

    const drawerContent = this.renderQuestDrawerContent(quest, def);

    return (
      <div className={`${QuestRoot}${row.isExiting ? ' exiting' : ''}`} key={row.id}>
        <ContextMenuSource
          className={QuestRow}
          menuParams={{ id: `${WIDGET_ID_QUESTTRACKER}_${quest.instanceID}`, content: this.getQuestContextMenu(quest) }}
        >
          <div className={ArrowColumn}>
            {!!drawerContent && (
              <img
                className={`${QuestArrow}${!this.isDrawerExpanded(quest, def) ? ' closed' : ''}`}
                src={factionData.arrowPointerImage}
                onClick={this.toggleQuestDetails.bind(this, quest.instanceID)}
              />
            )}
          </div>
          {this.renderIconContent(quest, def)}
          {this.renderNameContent(quest, def)}
          {this.renderProgressContent(quest, def)}
          {this.isQuestComplete(quest, def) && <img className={QuestCheck} src={CheckURL} />}
        </ContextMenuSource>
        {!!drawerContent && (
          <CollapsingDrawer className={QuestDrawer} isOpen={this.isDrawerExpanded(quest, def)}>
            {drawerContent}
          </CollapsingDrawer>
        )}
      </div>
    );
  }

  private isDrawerExpanded(quest: QuestStateEx, def: QuestDef): boolean {
    const toggled = this.state.openQuests.includes(quest.instanceID);
    return isGenericQuestDisplay(def) ? !toggled : toggled;
  }

  private renderQuestDrawerContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    if (def.tags.includes(QuestDisplayCategory.KingsTask)) {
      if (!quest.isRewarded) {
        return (
          <div className={QuestDescriptionLabel}>
            {getStringTableValue(
              quest.isCollectible
                ? StringIDQuestLogKingsBountyDescriptionComplete
                : StringIDQuestLogKingsBountyDescriptionCurrent,
              this.props.stringTable
            )}
          </div>
        );
      }
    } else if (
      def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
      def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
      def.tags.includes(QuestDisplayCategory.TurnInWeapons)
    ) {
      // If the item can be crafted, show the reagent list for a recipe that produces it.
      const target = def?.targets?.find(({ id }) => id.startsWith('Sell.'));
      const itemID = target?.id?.slice(5) ?? '';
      // There might be more than one recipe.  For now, we just use the first one we find.
      const recipe = Object.values(this.props.defs.itemRecipes).find((r) => r.outputItemDefID === itemID);
      if (recipe) {
        return (
          <div className={IngredientList}>
            {recipe.ingredients.map((ingredient) => {
              const ingredientDef = this.props.defs.itemsByStringID[ingredient.itemDefID];
              const numOwned = getItemCountForIngredient(ingredient, this.props.inventory, this.props.defs);
              const hasEnough = numOwned >= ingredient.quantity;

              if (ingredientDef) {
                return (
                  <div className={IngredientRow} key={ingredientDef.id}>
                    <FactionBorder
                      className={IngredientIconContainer}
                      type={BorderType.Secondary}
                      background={BorderBackground.PatternSmall}
                    >
                      <img className={IngredientIcon} src={ingredientDef.iconUrl} />
                    </FactionBorder>
                    <div
                      className={IngredientNameLabel}
                    >{`${numOwned}/${ingredient.quantity} ${ingredientDef.name}`}</div>
                    {hasEnough && <img className={IngredientCheck} src={CheckURL} />}
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        );
      }
    } else if (isGenericQuestDisplay(def)) {
      return this.renderObjectiveProgress(quest, def);
    }

    return null;
  }

  private renderIconContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    // If the quest has item turnins, use the first item's icon. Tutorial quests use the training icon.
    // Otherwise use the generic quest icon.
    const target = def.targets.find(({ id }) => id.startsWith('Sell.'));
    const itemID = target?.id?.slice(5) ?? '';
    const itemDef = this.props.defs.itemsByStringID[itemID];
    const isTutorial = def.tags.includes(QuestDisplayCategory.Tutorial);

    // The crown icon is specific to King's Task quests; generic-display quests other than Tutorial
    // have no turn-in item, so render no icon
    if (!itemDef && isGenericQuestDisplay(def) && !isTutorial) {
      return null;
    }

    const url = itemDef?.iconUrl ?? (isTutorial ? factionData.iconTutorialImage : factionData.iconCrownImage);

    return (
      <FactionBorder
        className={QuestIconContainer}
        type={BorderType.Secondary}
        background={BorderBackground.PatternSmall}
      >
        <img className={QuestIcon} src={url} />
      </FactionBorder>
    );
  }

  private renderNameContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    // Default behavior is to use the name assigned in the quest def.
    let name: string = getStringTableValue(def.name, this.props.stringTable);

    if (def.tags.includes(QuestDisplayCategory.KingsTask)) {
      if (!quest.isRewarded) {
        if (quest.isCollectible) {
          // Previous bounty, waiting to be collected.
          name = getStringTableValue(StringIDQuestLogQuestNameKingsBountyPrevious, this.props.stringTable);
        } else {
          // Current bounty, in progress.
          name = getStringTableValue(StringIDQuestLogQuestNameKingsBountyCurrent, this.props.stringTable);
        }
      }
    } else if (
      def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
      def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
      def.tags.includes(QuestDisplayCategory.TurnInWeapons)
    ) {
      // Work Order quests use the name of the first item to be turned in.
      const target = def.targets.find(({ id }) => id.startsWith('Sell.'));
      const itemID = target?.id?.slice(5) ?? '';
      const itemDef = this.props.defs.itemsByStringID[itemID];
      if (itemDef) {
        name = itemDef.name;
      }
    }

    return <div className={QuestNameLabel}>{name}</div>;
  }

  private getQuestContextMenu(quest: QuestStateEx): ContextMenuItem[] {
    return [
      {
        title: getStringTableValue(StringIDQuestTrackerOpenInLog, this.props.stringTable),
        onClick: (dispatch) => {
          dispatch(showConditionalWidget(WIDGET_ID_QUESTLOG));
        }
      },
      {
        title: getStringTableValue(StringIDVendorUntrack, this.props.stringTable),
        onClick: (dispatch) => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_TRACK_SELECT);
          clientAPI.removeTrackedQuestID(quest.instanceID);
          dispatch(removeTrackedQuestID(quest.instanceID));
        }
      }
    ];
  }

  private renderProgressContent(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    if (def.tags.includes(QuestDisplayCategory.KingsTask)) {
      return this.renderQuestProgressBar(quest, def);
    } else if (
      def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
      def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
      def.tags.includes(QuestDisplayCategory.TurnInWeapons)
    ) {
      const target = def?.targets?.find(({ id }) => id.startsWith('Sell.'));
      if ((target?.amount ?? 0) > 0) {
        const itemID = target?.id?.slice(5) ?? '';
        const item = this.props.defs.itemsByStringID[itemID];
        if (item) {
          const count = getItemCount(item.numericID, this.props.inventory);
          return <div className={QuestProgressLabel}>{`${count} / ${target!.amount}`}</div>;
        }
      }
    }

    // Generic-display quests show their per-objective progress in the drawer, not on the name
    // line (there may be multiple objectives), so nothing is rendered here.
    return null;
  }

  // Matches the cases where renderIconContent() renders an icon, so drawer content can align
  // with the name column.
  private questHasIcon(def: QuestDef): boolean {
    if (!isGenericQuestDisplay(def) || def.tags.includes(QuestDisplayCategory.Tutorial)) {
      return true;
    }
    const target = def.targets.find(({ id }) => id.startsWith('Sell.'));
    const itemID = target?.id?.slice(5) ?? '';
    return !!this.props.defs.itemsByStringID[itemID];
  }

  private renderObjectiveProgress(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    if (!def.targets || def.targets.length === 0) {
      return null;
    }

    const factionData = getFactionData(this.props.uiFactionID);
    const rowClassName = `${QuestObjectiveRow}${this.questHasIcon(def) ? ' hasIcon' : ''}`;

    return (
      <>
        {def.targets.map((target, index) => {
          const label = getStringTableValue(target.id, this.props.stringTable);
          const progress = quest.progress[target.id] ?? 0;
          const isObjectiveComplete = progress >= target.amount;
          return (
            <div className={rowClassName} key={target.id ?? index}>
              <div className={QuestObjectiveDash} style={{ color: factionData.mailSenderColor }}>
                -
              </div>
              <div className={QuestObjectiveLabel}>
                {`${label}: ${progress}/${target.amount}`}
                {isObjectiveComplete && <img className={QuestObjectiveCheck} src={CheckURL} />}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  private isQuestComplete(quest: QuestStateEx, def: QuestDef): boolean {
    if (
      def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
      def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
      def.tags.includes(QuestDisplayCategory.TurnInWeapons)
    ) {
      const target = def?.targets?.find(({ id }) => id.startsWith('Sell.'));
      const targetAmount = target?.amount ?? 0;
      if (targetAmount > 0) {
        const itemID = target?.id?.slice(5) ?? '';
        const item = this.props.defs.itemsByStringID[itemID];
        if (item) {
          return getItemCount(item.numericID, this.props.inventory) >= targetAmount;
        }
      }
    } else if (isGenericQuestDisplay(def)) {
      return quest.isCompleted;
    }

    return false;
  }

  private renderQuestProgressBar(quest: QuestStateEx, def: QuestDef): React.ReactNode {
    const targetValue = def.targets[0].amount;
    const curValue = quest.progress[def.targets[0].id] ?? 0;
    const progressPercent = curValue / targetValue;

    return (
      <FactionBorder
        className={QuestProgressBarContainer}
        type={BorderType.Secondary}
        background={BorderBackground.ProgressBar}
      >
        <div className={QuestProgressBarClipper}>
          <div className={QuestProgressBarContent}>
            <img
              className={QuestProgressBarFill}
              src={HealthBarFillURL}
              style={{ width: `${Math.min(1, progressPercent) * 100}%` }}
            />
            <div className={QuestProgressBarEnd} />
          </div>
        </div>
        <div className={QuestProgressBarLabel}>{`${curValue.toFixed(0)}/${targetValue.toFixed(0)}`}</div>
      </FactionBorder>
    );
  }

  private toggleQuestDetails(id: string): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUEST_DROPDOWN_ARROW);
    if (this.state.openQuests.includes(id)) {
      this.setState({ openQuests: this.state.openQuests.filter((sid) => sid !== id) });
    } else {
      this.setState({ openQuests: [...this.state.openQuests, id] });
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    isSelectedWidget: state.hud.editor.selectedWidgetID === WIDGET_ID_QUESTTRACKER,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID,
    trackedQuestIDs: state.quests.trackedQuestIDs,
    quests: state.quests.quests,
    defs: state.gameDefs,
    inventory: state.inventory.primary
  };
};

const QuestTracker = connect(mapStateToProps)(AQuestTracker);

export const WIDGET_ID_QUESTTRACKER = 'Quest Tracker';
export const questTrackerRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_QUESTTRACKER,
  nameStringID: 'HUDEditorWidgetNameQuestTracker',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 5,
    yOffset: 35
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <QuestTracker isDragCopy={isDragCopy} />;
  }
};
