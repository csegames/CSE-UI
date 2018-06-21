import * as React from 'react';
import * as _ from 'lodash';
import * as events from '@csegames/camelot-unchained/lib/events';
import { ql } from '@csegames/camelot-unchained';

import styled, { css } from 'react-emotion';
import eventNames, { EquipItemPayload, InventoryDataTransfer } from '../../../lib/eventNames';
import { defaultSlotIcons, placeholderIcon } from '../../../lib/constants';
import { getEquippedDataTransfer, hasEquipmentPermissions } from '../../../lib/utils';
import withDragAndDrop, { DragAndDropInjectedProps, DragEvent } from '../../../../../components/DragAndDrop/DragAndDrop';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../../gqlInterfaces';

declare const toastr: any;

const Container = styled('div')`
  position: relative;
  overflow: hidden;
  width: 70px;
  height: 70px;
  opacity: ${(props: any) => props.opacity};
`;

const ItemIcon = styled('img')`
  overflow: hidden;
  width: 69px;
  height: 70px;
`;

const SlotOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${(props: any) => props.backgroundColor};
  box-shadow: ${(props: any) => props.boxShadow};
`;

const defaultIconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  width: 100%;
  height: 100%;
`;

export interface DraggableEquippedItemProps extends DragAndDropInjectedProps {
  slotName: string;
  equippedItem: EquippedItemFragment;
  disableDrag: boolean;
}

export interface DraggableEquippedItemState {
  opacity: number;
  backgroundColor: string;
  highlightSlot: boolean;
}

const colors = {
  canEquip: 'rgba(46, 213, 80, 0.4)',
  cannotEquip: 'rgba(186, 50, 50, 0.4)',
};

class EquippedItemComponent extends React.Component<DraggableEquippedItemProps, DraggableEquippedItemState> {
  private onHighlightListener: number;
  private onDehighlightListener: number;

  constructor(props: DraggableEquippedItemProps) {
    super(props);
    this.state = {
      opacity: 1,
      backgroundColor: 'transparent',
      highlightSlot: false,
    };
  }

  public data() {
    const equippedItem = this.props.equippedItem;
    return getEquippedDataTransfer({
      item: equippedItem.item,
      location: 'equipped',
      position: -1,
      gearSlots: equippedItem.gearSlots,
    });
  }

  public onDragStart() {
    this.setState({ opacity: 0.3 });
  }

  public onDrop(e: DragEvent<InventoryDataTransfer, DraggableEquippedItemProps>) {
    const item = { ...e.dataTransfer.item };
    if (this.canEquip(item) && item.location.inventory) {
      item.location.inventory = null;
      this.equipItem(e.dataTransfer, this.props.equippedItem);
    } else if (!item.location.inventory) {
      this.equipItem(e.dataTransfer, this.props.equippedItem);
    } else if (!this.canEquip(item)) {
      if (item.equiprequirement && item.equiprequirement.requirementDescription) {
        toastr.error(item.equiprequirement.requirementDescription, 'Oh No!', { timeout: 3000 });
      } else {
        toastr.error('You cannot equip this item', 'Oh No!', { timeout: 3000 });
      }
    }
  }

  public onDragOver(e: DragEvent<InventoryDataTransfer, DraggableEquippedItemProps>) {
    if (this.state.backgroundColor === 'transparent') {
      if (this.canEquip(e.dataTransfer.item as any)) {
        this.setState({ backgroundColor: colors.canEquip });
      } else {
        this.setState({ backgroundColor: colors.cannotEquip });
      }
    }
  }

  public onDragLeave() {
    this.setState({ backgroundColor: 'transparent' });
  }

  public onDragEnd() {
    this.setState({ opacity: 1 });
  }

  public render() {
    const { equippedItem, slotName } = this.props;
    const iconUrl = (equippedItem && equippedItem.item.staticDefinition && equippedItem.item.staticDefinition.iconUrl) ||
      `${defaultSlotIcons[slotName]} \ ${defaultIconStyle}`;
    const isRightSlot = _.includes(slotName.toLowerCase(), 'right');
    const flipIcon = isRightSlot ? { transform: 'scaleX(-1)', WebkitTransform: 'scaleX(-1)' } : {};
    return (
      <Container opacity={this.state.opacity}>
        {this.props.equippedItem ? <ItemIcon style={flipIcon} src={iconUrl || placeholderIcon} /> :
          <div style={flipIcon} className={`${iconUrl}`} />}
        <SlotOverlay
          backgroundColor={this.state.backgroundColor}
          boxShadow={this.state.highlightSlot ? 'inset 0 0 15px 5px yellow' : 'none'}
        />
      </Container>
    );
  }

  public componentDidMount() {
    this.onHighlightListener = events.on(eventNames.onHighlightSlots, this.onHighlightSlots);
    this.onDehighlightListener = events.on(eventNames.onDehighlightSlots, this.onDehighlightSlots);
  }

  public componentWillUnmount() {
    events.off(this.onHighlightListener);
    events.off(this.onDehighlightListener);
  }

  private onHighlightSlots = (gearSlots: ql.schema.GearSlotDefRef[]) => {
    if (_.find(gearSlots, (gearSlot: ql.schema.GearSlotDefRef) => this.props.slotName === gearSlot.id)) {
      this.setState({ highlightSlot: true });
    }
  }

  private onDehighlightSlots = () => {
    if (this.state.highlightSlot) this.setState({ highlightSlot: false });
  }

  private canEquip = (dragItem: InventoryItemFragment) => {
    // Check permissions and gearSlots
    if (dragItem && hasEquipmentPermissions(dragItem) && dragItem.staticDefinition && !dragItem.location.inContainer) {
      const gearSlotSets = dragItem.staticDefinition.gearSlotSets;
      let canEquip = false;
      gearSlotSets.forEach((set) => {
        if (canEquip) return;
        if (_.find(set.gearSlots, slot => slot.id === this.props.slotName)) {
          canEquip = true;
          return;
        }
      });

      return canEquip;
    }

    return false;
  }

  private equipItem = (inventoryItem: InventoryDataTransfer, equippedItem: EquippedItemFragment) => {
    const gearSlotSet = _.find(inventoryItem.item.staticDefinition.gearSlotSets, (set) => {
      return _.findIndex(set.gearSlots, (slot) => {
        return _.lowerCase(slot.id) === _.lowerCase(this.props.slotName);
      }) !== -1;
    });

    const willEquipTo = gearSlotSet && gearSlotSet.gearSlots;
    const payload: EquipItemPayload = {
      inventoryItem,
      prevEquippedItem: equippedItem,
      willEquipTo,
    };

    if (willEquipTo) {
      events.fire(eventNames.onEquipItem, payload);
    }
  }
}

const DraggableEquippedItem = withDragAndDrop<DraggableEquippedItemProps>(
  (props: DraggableEquippedItemProps) => ({
    id: props.equippedItem && props.equippedItem.item.id,
    dataKey: 'inventory-items',
    scrollBodyId: 'inventory-scroll-container',
    dropTarget: true,
    disableDrag: !props.equippedItem || props.disableDrag,
  }),
)(EquippedItemComponent);

export default DraggableEquippedItem;
