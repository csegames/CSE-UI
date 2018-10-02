import * as React from 'react';
import * as _ from 'lodash';

import styled, { css } from 'react-emotion';

import eventNames, { EquipItemPayload, InventoryDataTransfer, EquippedItemDataTransfer } from '../../../lib/eventNames';
import { defaultSlotIcons, placeholderIcon } from '../../../lib/constants';
import { getEquippedDataTransfer, hasEquipmentPermissions } from '../../../lib/utils';
import withDragAndDrop, { DragAndDropInjectedProps, DragEvent } from '../../../../../components/DragAndDrop/DragAndDrop';
import {
  InventoryItem,
  EquippedItem,
  GearSlotDefRef,
} from 'gql/interfaces';

declare const toastr: any;

const Container = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  opacity: ${(props: any) => props.opacity};
`;

const ItemIcon = styled('img')`
  width: 100%;
  height: 100%;
`;

const SlotOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${(props: any) => props.backgroundColor};
  box-shadow: ${(props: any) => props.boxShadow};
  border: 1px solid transparent;
  &:hover {
    box-shadow: inset 0 0 10px rgba(255,255,255,0.2);
  }
  &:active {
    box-shadow: inset 0 0 10px rgba(0,0,0,0.4);
  }
  &.highlight-slot {
    box-shadow: inset 0 0 10px 2px rgba(255, 218, 148, 0.7);
    border: 1px solid rgba(255, 218, 148, 1);
  }
  &.item-menu-visible {
    border: 1px solid #e1b96d;
    box-shadow: inset 0 0 10px rgba(255,255,255,0.2);
  }
`;

const defaultIconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.15;
  width: 100%;
  height: 100%;
  color: #CFD0CB;
  font-size: 35px;
`;

export interface DraggableEquippedItemProps extends DragAndDropInjectedProps {
  slotName: string;
  disableDrag: boolean;
  itemMenuVisible: boolean;
  equippedItem: EquippedItem.Fragment;
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
  private eventHandles: EventHandle[] = [];

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
    const { ok, reason } = this.canEquip(item);
    if (ok && item.location.inventory) {
      item.location.inventory = null;
      this.equipItem(e.dataTransfer, this.props.equippedItem);
    } else if (ok && !item.location.inventory) {
      this.equipItem(e.dataTransfer, this.props.equippedItem);
    } else if (!ok) {
      if (reason) {
        toastr.error(reason, 'Oh No!', { timeout: 3000 });
      } else {
        toastr.error('You cannot equip this item', 'Oh No!', { timeout: 3000 });
      }
    }
  }

  public onDragOver(e: DragEvent<InventoryDataTransfer, DraggableEquippedItemProps>) {
    if (this.state.backgroundColor === 'transparent') {
      const { ok } = this.canEquip(e.dataTransfer.item as any);
      if (ok) {
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
    const { equippedItem, slotName, itemMenuVisible } = this.props;
    const iconUrl = (equippedItem && equippedItem.item.staticDefinition && equippedItem.item.staticDefinition.iconUrl) ||
      `${defaultSlotIcons[slotName]} \ ${defaultIconStyle}`;
    const isRightSlot = _.includes(slotName.toLowerCase(), 'right');
    const flipIcon = isRightSlot ? { transform: 'scaleX(-1)', WebkitTransform: 'scaleX(-1)' } : {};
    return (
      <Container opacity={this.state.opacity}>
        {this.props.equippedItem ? <ItemIcon style={flipIcon} src={iconUrl || placeholderIcon} /> :
          <div style={flipIcon} className={`${iconUrl}`} />}
        <SlotOverlay
          className={`${itemMenuVisible ? 'item-menu-visible' : ''} ${this.state.highlightSlot ? 'highlight-slot' : ''}`}
          backgroundColor={this.state.backgroundColor}
        />
      </Container>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.on(eventNames.onHighlightSlots, this.onHighlightSlots));
    this.eventHandles.push(game.on(eventNames.onDehighlightSlots, this.onDehighlightSlots));
  }

  public componentDidUpdate(prevProps: DraggableEquippedItemProps) {
    const prevEquippedItem = prevProps.equippedItem && prevProps.equippedItem.item;
    const equippedItem = this.props.equippedItem && this.props.equippedItem.item;
    if ((!prevEquippedItem && equippedItem && this.state.backgroundColor !== 'transparent') ||
        (prevEquippedItem && equippedItem && prevEquippedItem.id !== equippedItem.id &&
          this.state.backgroundColor !== 'transparent')) {
      this.setState({ backgroundColor: 'transparent' });
    }
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private onHighlightSlots = (gearSlots: GearSlotDefRef[]) => {
    if (_.find(gearSlots, (gearSlot: GearSlotDefRef) => this.props.slotName === gearSlot.id)) {
      this.setState({ highlightSlot: true });
    }
  }

  private onDehighlightSlots = () => {
    if (this.state.highlightSlot) this.setState({ highlightSlot: false });
  }

  private canEquip = (dragItem: InventoryItem.Fragment) => {
    // Check permissions and gearSlots
    if (dragItem && hasEquipmentPermissions(dragItem) && dragItem.staticDefinition && !dragItem.location.inContainer) {
      const { equippedItem } = this.props;
      const gearSlotSets = dragItem.staticDefinition.gearSlotSets;

      if (equippedItem && equippedItem.item && dragItem.location && dragItem.location.equipped) {
        // Trying to swap. Make sure that we can actually swap items
        if (!_.isEqual(gearSlotSets, equippedItem.item.staticDefinition.gearSlotSets)) {
          return {
            reason: 'Cannot swap these items',
            ok: false,
          };
        }
      }

      if (!dragItem) {
        return {
          reason: 'This item cannot be equipped here.',
          ok: false,
        };
      }

      if (!hasEquipmentPermissions(dragItem)) {
        return {
          reason: (dragItem.equiprequirement && dragItem.equiprequirement.requirementDescription) ||
            'Does not meet equip requirements.',
          ok: false,
        };
      }

      if (dragItem.staticDefinition && !dragItem.location.inContainer) {
        const gearSlotSets = dragItem.staticDefinition.gearSlotSets;
        let canEquip = {
          reason: 'This item cannot be equipped here.',
          ok: false,
        };

        gearSlotSets.forEach((set) => {
          if (canEquip.ok) return;
          if (_.find(set.gearSlots, slot => slot.id === this.props.slotName)) {
            canEquip = {
              reason: '',
              ok: true,
            };
            return;
          }
        });

        return canEquip;
      }
    }
  }

  private equipItem = (newItem: InventoryDataTransfer | EquippedItemDataTransfer, equippedItem: EquippedItem.Fragment) => {
    const gearSlotSet = _.find(newItem.item.staticDefinition.gearSlotSets, (set) => {
      return _.findIndex(set.gearSlots, (slot) => {
        return _.lowerCase(slot.id) === _.lowerCase(this.props.slotName);
      }) !== -1;
    });

    const willEquipTo = gearSlotSet && gearSlotSet.gearSlots;
    const payload: EquipItemPayload = {
      newItem,
      prevEquippedItem: equippedItem,
      willEquipTo,
    };

    if (willEquipTo) {
      game.trigger(eventNames.onEquipItem, payload);
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
