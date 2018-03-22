import * as React from 'react';
import { ql, events } from 'camelot-unchained';
import styled from 'react-emotion';

import ItemStack from '../../ItemStack';
import CraftingItem from './CraftingItem';
import { InventorySlotItemDef, CraftingSlotItemDef, SlotType } from './InventorySlot';
import { getContainerHeaderInfo } from './InventoryBase';
import dragAndDrop, { DragAndDropInjectedProps, DragEvent } from '../../../../../components/DragAndDrop/DragAndDrop';
import eventNames from '../../../lib/eventNames';

const StandardSlot = styled('img')`
  vertical-align: baseline;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

const SlotOverlay = styled('div')`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  cursor: pointer;
  background-color: ${(props: any) => props.backgroundColor};
  &:hover {
    box-shadow: inset 0 0 10px rgba(255,255,255,0.2);
  };
  &:active {
    box-shadow: inset 0 0 10px rgba(0,0,0,0.4);
  };
`;

export interface ItemComponentProps extends DragAndDropInjectedProps {
  item: InventorySlotItemDef & CraftingSlotItemDef;
  filtering: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: (dragItemData: ql.schema.Item, dropZoneData: ql.schema.Item | number) => void;
}

export interface ItemComponentState {
  opacity: number;
  backgroundColor: string;
}

class ItemComponent extends React.Component<ItemComponentProps, ItemComponentState> {
  constructor(props: ItemComponentProps) {
    super(props);
    this.state = {
      opacity: 1,
      backgroundColor: 'transparent',
    };
  }

  public data() {
    return this.props.item.item || this.props.item.stackedItems[0];
  }

  public onDragStart(e: DragEvent<ql.schema.Item, ItemComponentProps>) {
    const item = e.dataTransfer;
    const gearSlotSets = item && item.staticDefinition && item.staticDefinition.gearSlotSets;
    if (item && item.staticDefinition && item.staticDefinition.gearSlotSets) {
      let allGearSlots: ql.schema.GearSlotDefRef[] = [];
      gearSlotSets.forEach((gearSlotSet) => {
        allGearSlots = [...allGearSlots, ...gearSlotSet.gearSlots as any];
      });
      events.fire(eventNames.onHighlightSlots, allGearSlots);
    }
    this.setState({ opacity: 0.3 });
    this.props.onDragStart();
  }

  public onDragEnter(e: DragEvent<any, ItemComponentProps>) {
    this.setState(() => {
      if (e.dataTransfer && e.dataTransfer.gearSlots) {
        return {
          backgroundColor: 'rgba(186, 50, 50, 0.4)',
        };
      } else {
        return {
          backgroundColor: 'rgba(46, 213, 80, 0.4)',
        };
      }
    });
  }

  public onDragLeave() {
    this.setState({ backgroundColor: 'transparent' });
  }

  public onDragEnd() {
    this.setState({ opacity: 1 });
    events.fire(eventNames.onDehighlightSlots);
    this.props.onDragEnd();
  }

  public onDrop(e: DragEvent<any, ItemComponentProps>) {
    // FOR NOW, don't allow drop if drag item is an equipped item.
    if (!e.dataTransfer || !e.dataTransfer.gearSlots) {
      this.props.onDrop(e.dataTransfer, this.props.item.item as any);
    }
  }

  public render()  {
    const { item } = this.props;
    let itemComponent: JSX.Element;
    const placeholderIcon = 'images/unknown-item.jpg';
    switch (item.slotType) {
      case SlotType.Standard: {
        itemComponent = <StandardSlot src={item.icon || placeholderIcon} />;
        break;
      }
      case SlotType.Stack: {
        const count = item.stackedItems ? item.stackedItems.length : item.item.stats.item.unitCount;
        itemComponent = <ItemStack count={count} icon={item.icon} />;
        break;
      }
      case SlotType.CraftingContainer: {
        itemComponent = <ItemStack count={getContainerHeaderInfo(item.stackedItems).totalUnitCount} icon={item.icon} />;
        break;
      }
      case SlotType.CraftingItem: {
        // Items in a Crafting Container
        itemComponent =
          <CraftingItem
            count={item.itemCount}
            quality={item.quality}
            icon={item.icon}
          />;
      }
    }

    return (
      <div style={{ opacity: this.state.opacity }}>
        {itemComponent}
        <SlotOverlay backgroundColor={this.state.backgroundColor} />
      </div>
    );
  }
}

const DraggableItemComponent = dragAndDrop<ItemComponentProps>(
  (props: ItemComponentProps) => {
    const item = props.item;
    const id = item.stackedItems && item.stackedItems[0] ? item.stackedItems[0].id : item.itemID;
    return {
      id,
      dataKey: 'inventory-items',
      scrollBodyId: 'inventory-scroll-container',
      dropTarget: item.slotType !== SlotType.CraftingItem && (props.filtering ? false : true),
      disableDrag: props.filtering || item.slotType === SlotType.CraftingItem,
    };
  },
)(ItemComponent);

export default DraggableItemComponent;
