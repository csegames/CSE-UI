/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import ConsumableButton from './ConsumableButton';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { KeybindIDs, getActiveBindForKey } from '../../../../redux/keybindsSlice';
import { ConsumableItem } from '@csegames/library/dist/hordetest/game/types/Consumables';
import { Binding, Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { ItemGameplayType } from '@csegames/library/dist/hordetest/game/types/ItemGameplayType';
import { ConsumableItemsState } from '@csegames/library/dist/hordetest/game/GameClientModels/ConsumableItemsState';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { game } from '@csegames/library/dist/_baseGame';

const DESCRIPTION_VISIBILITY_TIME_SECONDS = 4.0;
const OuterContainer = 'Consumables-OuterContainer';
const InnerContainer = 'Consumables-InnerContainer';
const ConsumableButtons = 'Consumables-ConsumableButtons';
const SelectedItemDescriptionContainer = 'Consumables-SelectedItemDescriptionContainer';
const SelectedItemDescription = 'Consumables-SelectedItemDescription';
const ItemDescText = 'Consumables-ItemDescText';
const KeybindBox = 'Consumables-KeybindBox';
const NextKeybind = 'Consumables-NextKeybind';
const NextArrow = 'Consumables-NextArrow';
const PrevKeybind = 'Consumables-PrevKeybind';

const PrevArrow = 'Consumables-PrevArrow';

export interface Props {
  activeIndex: number;
  items: ArrayMap<ConsumableItem>;
  keybindForNext: Keybind;
  keybindForPrior: Keybind;
  keybindToUse: Keybind;
  usingGamepad: boolean;
  lastUpdatedTimestamp: number;
}

interface State {
  descriptionVisible: boolean;
}

class AConsumables extends React.Component<Props, State> {
  private lastViewedItemType: ItemGameplayType;
  private timeoutHandle: any;

  constructor(props: Props) {
    super(props);

    // if there's an item currently activated and we had a recent inventory change
    // then we'll show the item's description again.
    const haveValidItemIndex: boolean = this.props.activeIndex >= 0 && this.props.activeIndex in this.props.items;
    const timeSinceLastUpdate: number = game.worldTime - this.props.lastUpdatedTimestamp;
    const descriptionVisible: boolean = haveValidItemIndex && timeSinceLastUpdate < DESCRIPTION_VISIBILITY_TIME_SECONDS;

    this.state = {
      descriptionVisible: descriptionVisible
    };

    this.lastViewedItemType = ItemGameplayType.None;
    let activeItem = this.getActiveItem();
    if (activeItem != null) {
      this.lastViewedItemType = activeItem.gameplayType;
    }

    if (this.state.descriptionVisible) {
      this.setDescriptionTimeout();
    } else {
      this.timeoutHandle = null;
    }
  }

  private getKeybind(
    isRight: boolean,
    keybind: Keybind,
    elementID: string,
    elementClass: string,
    arrowClass: string
  ): JSX.Element {
    const bind = getActiveBindForKey(this.props.usingGamepad, keybind);
    if (bind && bind.iconClass) {
      return <div id={elementID} className={`${KeybindBox} ${bind.iconClass} ${elementClass}`} />;
    }

    if (isRight) {
      return (
        <div id={elementID} className={`${KeybindBox} ${elementClass}`}>
          <span>{bind ? bind.name : ''}</span>
          <span className={arrowClass} />
        </div>
      );
    } else {
      return (
        <div id={elementID} className={`${KeybindBox} ${elementClass}`}>
          <span className={arrowClass} />
          <span>{bind ? bind.name : ''}</span>
        </div>
      );
    }
  }

  private getConsumableButtons(item: ConsumableItem, itemIndex: number): JSX.Element {
    const binding: Binding = getActiveBindForKey(this.props.usingGamepad, this.props.keybindToUse);
    return (
      <ConsumableButton
        key={`consumableKey_${item.name}_index_${itemIndex}`}
        item={item}
        isActive={itemIndex === this.props.activeIndex}
        useKeybind={binding}
      />
    );
  }

  private getItemDescriptionName(item: ConsumableItem): JSX.Element {
    if (item != null) {
      return <div className={`${ItemDescText} item-name`}>{item.name}</div>;
    }
    return null;
  }

  private getItemDescriptionText(item: ConsumableItem): JSX.Element {
    if (item != null) {
      return <div className={`${ItemDescText} item-description`}>{item.description}</div>;
    }
    return null;
  }

  private getItemDescription(item: ConsumableItem): JSX.Element {
    // This container should always exit so that it's size doesn't change, item or no item.
    // The whole consumables block is aligned to the bottom of the screen, so changing the
    // height of the bottom-most element would move the consumable buttons around vertically.
    const visibilityClass = item != null && this.state.descriptionVisible ? 'desc-visible' : 'desc-hidden';
    const itemTypeClass =
      item != null ? ItemGameplayType[item.gameplayType] : ItemGameplayType[this.lastViewedItemType];
    return (
      <div className={`${SelectedItemDescriptionContainer} ${visibilityClass}`}>
        <div className={`${SelectedItemDescription} ${itemTypeClass}`}>
          {this.getItemDescriptionName(item)}
          {this.getItemDescriptionText(item)}
        </div>
      </div>
    );
  }

  private getActiveItem(props: Props = null): ConsumableItem {
    if (props === null) {
      props = this.props;
    }
    return props.activeIndex in props.items ? props.items[props.activeIndex] : null;
  }

  // returns the number of actual items in an item arraymap (as opposed to the number of item _slots_)
  private getItemCount(items: ArrayMap<ConsumableItem> = null): number {
    if (items === null) {
      items = this.props.items;
    }

    let numItems = 0;
    Object.values(items).map((item: ConsumableItem) => {
      if (item.name) {
        numItems++;
      }
    });
    return numItems;
  }

  public componentDidUpdate(prevProps: Props) {
    const newActiveItem: ConsumableItem = this.getActiveItem(this.props);
    const prevActiveItem: ConsumableItem = this.getActiveItem(prevProps);

    // item changed, or timestamp changed and we have exactly one item in the inventory
    if (
      this.props.activeIndex != prevProps.activeIndex ||
      newActiveItem != prevActiveItem ||
      (prevProps.lastUpdatedTimestamp != this.props.lastUpdatedTimestamp && this.getItemCount() == 1)
    ) {
      if (newActiveItem != null) {
        this.lastViewedItemType = newActiveItem.gameplayType;
      }

      this.clearDescriptionTimeout();

      // description not currently visible
      if (!this.state.descriptionVisible) {
        this.setState({ descriptionVisible: true });
      }

      this.setDescriptionTimeout();
    }
  }

  public componentWillUnmount() {
    this.clearDescriptionTimeout();
  }

  private clearDescriptionTimeout() {
    if (this.timeoutHandle != null) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }

  private setDescriptionTimeout() {
    this.timeoutHandle = setTimeout(() => {
      this.setState({ descriptionVisible: false });
      this.timeoutHandle = null;
    }, DESCRIPTION_VISIBILITY_TIME_SECONDS * 1000);
  }

  public render(): JSX.Element {
    let itemElements: JSX.Element[] = [];
    Object.values(this.props.items).map((item: ConsumableItem, index: number) => {
      itemElements.push(this.getConsumableButtons(item, index));
    });

    return (
      <div id='ConsumablesContainer_HUD' className={OuterContainer}>
        {this.getKeybind(
          false,
          this.props.keybindForPrior,
          'KeybindBox_Prior',
          PrevKeybind,
          `${PrevArrow} fs-icon-misc-chevron-left`
        )}
        <div className={InnerContainer}>
          {this.getItemDescription(this.getActiveItem())}
          <div className={ConsumableButtons}>{itemElements}</div>
        </div>
        {this.getKeybind(
          true,
          this.props.keybindForNext,
          'KeybindBox_Next',
          NextKeybind,
          `${NextArrow} fs-icon-misc-chevron-right`
        )}
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  const consumableItemsState: ConsumableItemsState = state.game.consumableItemsState;
  const keybindsState = state.keybinds;

  const keybindToUse = keybindsState[KeybindIDs.UseConsumable];
  const keybindForNext = keybindsState[KeybindIDs.NextConsumable];
  const keybindForPrior = keybindsState[KeybindIDs.PriorConsumable];
  const items = consumableItemsState.items;
  const activeIndex = consumableItemsState.activeIndex;
  const usingGamepad = state.baseGame.usingGamepad;
  const lastUpdatedTimestamp = consumableItemsState.timestamp;

  return {
    keybindForNext,
    keybindForPrior,
    keybindToUse,
    items,
    activeIndex,
    usingGamepad,
    lastUpdatedTimestamp
  };
}

export const Consumables = connect(mapStateToProps)(AConsumables);
