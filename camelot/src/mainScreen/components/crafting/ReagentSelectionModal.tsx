/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { BorderBackground, FactionBorder, BorderType } from '../FactionBorder';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { RecipeIngredient } from '../../dataSources/manifest/itemRecipeManifest';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { SelectedIngredient } from '@csegames/library/dist/camelotunchained/clientFunctions/CraftingFunctions';
import { FactionTabButtonsHorizontal, TabParams } from '../FactionTabButtonsHorizontal';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralAccept,
  StringIDGeneralMax,
  StringIDGeneralParenthesis
} from '../../helpers/stringTableHelpers';
import { doesItemMatchIngredient, getItemStatValue } from '../../helpers/itemHelpers';
import { ItemStatID } from '../items/itemData';
import { StatDef } from '../../dataSources/manifest/statManifest';
import { getFactionData } from '../../gameData/factionData';
import { FactionScrollArea } from '../FactionScrollArea';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { hideModal } from '../../redux/modalsSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { FactionNumberSelector } from '../FactionNumberSelector';
import { FactionButton } from '../FactionButton';

const Root = 'HUD-ReagentSelectionModal-Root';
const Tabs = 'HUD-ReagentSelectionModal-Tabs';
const TabRoot = 'HUD-ReagentSelectionModal-TabRoot';
const NoMatchesLabel = 'HUD-ReagentSelectionModal-NoMatchesLabel';
const LegendRowRoot = 'HUD-ReagentSelectionModal-LegendRowRoot';
const CountCell = 'HUD-ReagentSelectionModal-CountCell';
const IconCell = 'HUD-ReagentSelectionModal-IconCell';
const IconContainer = 'HUD-ReagentSelectionModal-IconContainer';
const Icon = 'HUD-ReagentSelectionModal-Icon';
const NameCell = 'HUD-ReagentSelectionModal-NameCell';
const DataCell = 'HUD-ReagentSelectionModal-DataCell';
const ItemsList = 'HUD-ReagentSelectionModal-ItemsList';
const ItemRowRoot = 'HUD-ReagentSelectionModal-ItemRowRoot';
const TabButtonContent = 'HUD-ReagentSelectionModal-TabButtonContent';
const TabButtonTitle = 'HUD-ReagentSelectionModal-TabButtonTitle';
const TabButtonMatchCount = 'HUD-ReagentSelectionModal-TabButtonMatchCount';
const AcceptButton = 'HUD-ReagentSelectionModal-AcceptButton';
const MaxButton = 'HUD-ReagentSelectionModal-MaxButton';
const MaxButtonLabel = 'HUD-ReagentSelectionModal-MaxButtonLabel';

const StringIDPrefixReagentSelectionTabTitle = 'ReagentSelectionTabTitle';
const StringIDReagentSelectionNoMatches = 'ReagentSelectionNoMatches';
const StringIDReagentSelectionReagents = 'ReagentSelectionReagents';
const StringIDReagentSelectionQuality = 'ReagentSelectionQuality';
const StringIDReagentSelectionQuantity = 'ReagentSelectionQuantity';
const StringIDReagentSelectionNotEnoughIngredients = 'ReagentSelectionNotEnoughIngredients';

enum ReagentTab {
  All = 0,
  Inventory,
  Bank,
  GuildBank
}

interface State {
  selectedTab: ReagentTab;
  selections: SelectedIngredient[];
}

interface ReactProps {
  ingredient: RecipeIngredient;
  selections: SelectedIngredient[];
  onIngredientsSelected: (selections: SelectedIngredient[]) => void;
}

interface InjectedProps {
  itemsByNumericID: Record<number, ItemDef>;
  itemsByStringID: Record<string, ItemDef>;
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
  accountBank: Item[];
  inventoryItems: Item[];
  statsByStringID: Record<string, StatDef>;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AReagentSelectionModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedTab: ReagentTab.All,
      selections: props.selections ?? []
    };
  }

  render(): React.ReactNode {
    const matchingItems = this.getMatchingItems(this.state.selectedTab);

    // Can only accept a selection if enough items are selected!
    const canAccept = this.getSelectedCount() === this.props.ingredient.quantity;

    return (
      <div className={Root}>
        <FactionTabButtonsHorizontal
          className={Tabs}
          tabs={this.getTabs()}
          minTabWidth={'10vmin'}
          selectedTabIndex={this.state.selectedTab}
          onTabSelected={(selectedTab) => {
            this.setState({ selectedTab });
            clientAPI.playGameSound(SoundEvents.PLAY_UI_CRAFTING_TAB_SELECT);
          }}
        />
        <FactionBorder
          className={TabRoot}
          type={BorderType.Secondary}
          background={BorderBackground.PatternLarge}
          cornerSize={'5vmin'}
          borderSize={'0.4vmin'}
          cornerButtons={[
            <FactionCornerButton type={CornerButtonType.Close} onClick={() => this.props.dispatch(hideModal())} />
          ]}
        >
          {matchingItems.length > 0 ? (
            <>
              {this.renderMatchingItems(matchingItems)}
              <FactionButton
                className={AcceptButton}
                disabled={!canAccept}
                disabledTooltip={getStringTableValue(
                  StringIDReagentSelectionNotEnoughIngredients,
                  this.props.stringTable
                )}
                onClick={() => {
                  this.props.onIngredientsSelected(this.state.selections.slice());
                  this.props.dispatch(hideModal());
                }}
              >
                {getStringTableValue(StringIDGeneralAccept, this.props.stringTable)}
              </FactionButton>
            </>
          ) : (
            <div className={NoMatchesLabel}>
              {getStringTableValue(StringIDReagentSelectionNoMatches, this.props.stringTable)}
            </div>
          )}
        </FactionBorder>
      </div>
    );
  }

  private getSelectedCount(): number {
    const selectedCount = this.state.selections.reduce<number>(
      (soFar: number, s: SelectedIngredient) => soFar + s.quantity,
      0
    );
    return selectedCount;
  }

  private renderMatchingItems(items: Item[]): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <>
        <div className={LegendRowRoot} style={{ borderBottomColor: factionData.borderColor }}>
          <div className={CountCell}>
            {getStringTableValue(StringIDReagentSelectionReagents, this.props.stringTable)}
            {`\xa0(${this.getSelectedCount()}/${this.props.ingredient.quantity})`}
          </div>
          <div className={IconCell} />
          <div className={NameCell}></div>
          <div className={DataCell} style={{ borderLeftColor: factionData.borderColor }}>
            {getStringTableValue(StringIDReagentSelectionQuality, this.props.stringTable)}
          </div>
          <div
            className={DataCell}
            style={{ borderLeftColor: factionData.borderColor, borderRightColor: factionData.borderColor }}
          >
            {getStringTableValue(StringIDReagentSelectionQuantity, this.props.stringTable)}
          </div>
        </div>
        <FactionScrollArea className={ItemsList}>{items.map(this.renderItemRow.bind(this))}</FactionScrollArea>
      </>
    );
  }

  private renderItemRow(item: Item, index: number): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const itemDef = this.props.itemsByNumericID[item.defID];

    const selection = this.state.selections.find((s) => s.itemInstanceID === item.instanceID);
    const countFromOtherItems = this.state.selections.reduce<number>((soFar: number, s: SelectedIngredient) => {
      return s.itemInstanceID === item.instanceID ? soFar : soFar + s.quantity;
    }, 0);
    const neededCount = this.props.ingredient.quantity;

    const maxValue = Math.min(neededCount - countFromOtherItems, item.unitCount);
    const onValueChanged = (newValue: number) => {
      let newSelections = [...this.state.selections];
      if (selection) {
        newSelections = newSelections.filter((s) => s.itemInstanceID !== item.instanceID);
      }
      if (newValue > 0) {
        const newSelection: SelectedIngredient = {
          itemInstanceID: item.instanceID,
          quantity: newValue,
          slot: this.props.ingredient.slot
        };
        newSelections.push(newSelection);
      }
      this.setState({ selections: newSelections });
    };

    return (
      <div className={`${ItemRowRoot}${index % 2 ? ' odd' : ''}`} key={`Reagent${index}`}>
        <div className={CountCell}>
          <FactionNumberSelector
            minValue={0}
            maxValue={maxValue}
            value={selection?.quantity ?? 0}
            onValueChanged={onValueChanged}
          />
          <div
            className={MaxButton}
            onClick={() => {
              onValueChanged(maxValue);
              clientAPI.playGameSound(SoundEvents.PLAY_UI_MAX_REAGENTS_SELECT);
            }}
          >
            <img src={factionData.buttonBackgroundSmallImage} />
            <div className={MaxButtonLabel}>{getStringTableValue(StringIDGeneralMax, this.props.stringTable)}</div>
          </div>
        </div>
        <div className={IconCell}>
          <FactionBorder
            className={IconContainer}
            type={BorderType.Secondary}
            background={BorderBackground.PatternSmall}
          >
            <img className={Icon} src={itemDef.iconUrl} />
          </FactionBorder>
        </div>
        <div className={NameCell}>{itemDef.name}</div>
        <div className={DataCell} style={{ borderLeftColor: factionData.borderColor }}>
          {getItemStatValue(item, this.props.statsByStringID[ItemStatID.Quality])}
        </div>
        <div
          className={DataCell}
          style={{ borderLeftColor: factionData.borderColor, borderRightColor: factionData.borderColor }}
        >
          {item.unitCount}
        </div>
      </div>
    );
  }

  private getMatchingItems(tab: ReagentTab): Item[] {
    let items: Item[] = [];

    switch (tab) {
      case ReagentTab.All: {
        items.push(...this.getMatchingInventoryItems());
        items.push(...this.getMatchingBankItems());
        items.push(...this.getMatchingGuildBankItems());
        break;
      }
      case ReagentTab.Inventory: {
        items.push(...this.getMatchingInventoryItems());
        break;
      }
      case ReagentTab.Bank: {
        items.push(...this.getMatchingBankItems());
        break;
      }
      case ReagentTab.GuildBank: {
        items.push(...this.getMatchingGuildBankItems());
        break;
      }
    }

    // Sorted items so the most likely to be used items are at the top.
    items.sort((a, b) => {
      const aQuality = getItemStatValue(a, this.props.statsByStringID[ItemStatID.Quality]);
      const bQuality = getItemStatValue(b, this.props.statsByStringID[ItemStatID.Quality]);
      // Highest quality items first.
      if (aQuality !== bQuality) {
        return bQuality - aQuality;
      }

      // Highest quantity items next.
      return b.unitCount - a.unitCount;
    });

    return items;
  }

  private getMatchingInventoryItems(): Item[] {
    return this.props.inventoryItems.filter((item) =>
      doesItemMatchIngredient(item, this.props.ingredient, this.props.itemsByStringID, this.props.statsByStringID)
    );
  }

  private getMatchingBankItems(): Item[] {
    return this.props.accountBank.filter((item) =>
      doesItemMatchIngredient(item, this.props.ingredient, this.props.itemsByStringID, this.props.statsByStringID)
    );
  }

  private getMatchingGuildBankItems(): Item[] {
    // TODO: Get guild bank items from wherever they live.
    return [];
  }

  private getTabs(): TabParams[] {
    const params: TabParams[] = [
      {
        id: ReagentTab[ReagentTab.All],
        content: this.renderTabButtonContent.bind(this, ReagentTab.All)
      },
      {
        id: ReagentTab[ReagentTab.Inventory],
        content: this.renderTabButtonContent.bind(this, ReagentTab.Inventory)
      },
      {
        id: ReagentTab[ReagentTab.Bank],
        content: this.renderTabButtonContent.bind(this, ReagentTab.Bank)
      },
      {
        id: ReagentTab[ReagentTab.GuildBank],
        content: this.renderTabButtonContent.bind(this, ReagentTab.GuildBank)
      }
    ];

    return params;
  }

  private renderTabButtonContent(tab: ReagentTab, isSelected: boolean): React.ReactNode {
    const matchingItems = this.getMatchingItems(tab);

    return (
      <div className={TabButtonContent}>
        <div className={`${TabButtonTitle}${isSelected ? ' selected' : ''}`}>
          {getStringTableValue(`${StringIDPrefixReagentSelectionTabTitle}${ReagentTab[tab]}`, this.props.stringTable)}
        </div>
        <div className={`${TabButtonMatchCount}${isSelected ? ' selected' : ''}`}>
          {getTokenizedStringTableValue(StringIDGeneralParenthesis, this.props.stringTable, {
            CONTENTS: ` ${matchingItems.length} `
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { primary: inventoryItems, accountBank } = state.inventory;
  const { itemsByNumericID, itemsByStringID, stats: statsByStringID } = state.gameDefs;
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    itemsByNumericID,
    itemsByStringID,
    uiFactionID: state.hud.uiFactionID,
    accountBank,
    inventoryItems,
    statsByStringID
  };
};

export const ReagentSelectionModal = connect(mapStateToProps)(AReagentSelectionModal);
