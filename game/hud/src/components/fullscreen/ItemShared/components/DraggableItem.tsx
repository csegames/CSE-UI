/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InventoryItem } from 'gql/interfaces';
import { showContextMenuContent } from 'actions/contextMenu';
import SplitStackMenu from 'fullscreen/Inventory/components/ContextMenu/SplitStackMenu';
import dragAndDrop, {
  DraggableOptions,
  DragEvent,
  StartDragOptions,
  DragAndDropInjectedProps,
} from 'utils/DragAndDrop/DragAndDrop';
import ItemStack from './ItemStack';
import { getInventoryDataTransfer } from 'fullscreen/lib/utils';
import { InventoryDataTransfer } from 'fullscreen/lib/itemEvents';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export interface Props extends DragAndDropInjectedProps {
  initializeDragAndDrop: () => DraggableOptions;
  item: InventoryItem.Fragment;
  dragItemID: string;
  data: () => InventoryDataTransfer;

  style?: React.CSSProperties;
  renderWidth?: number;
  renderHeight?: number;
  disabled?: boolean;
  disableDrag?: boolean;
  onContextMenu?: (e: MouseEvent) => void;

  onDrag?: (e: DragEvent<InventoryDataTransfer, Props>) => void;
  onDragEnd?: (e: DragEvent<InventoryDataTransfer, Props>) => void;
  onDragEnter?: (e: DragEvent<InventoryDataTransfer, Props>) => void;
  onDragLeave?: (e: DragEvent<InventoryDataTransfer, Props>) => void;
  onDragOver?: (e: DragEvent<InventoryDataTransfer, Props>) => void;
  onDragStart?: (e: DragEvent<InventoryDataTransfer, Props>) => void;
  onDrop?: (e: DragEvent<InventoryDataTransfer, Props>) => void;
}

export interface State {
  splitStackValue: number;
}

class Item extends React.Component<Props, State> {
  private isDragging: boolean;
  private dragBoundaries: { top: number, left: number, right: number, bottom: number };

  public data() {
    return this.props.data();
  }

  public onDrag(e: DragEvent<InventoryDataTransfer, Props>) {
    if (this.props.onDrag) {
      this.props.onDrag(e);
    }
  }

  public onDragEnd(e: DragEvent<InventoryDataTransfer, Props>) {
    this.resetDraggingInfo();

    if (this.props.onDragEnd) {
      this.props.onDragEnd(e);
    }
  }

  public onDragEnter(e: DragEvent<InventoryDataTransfer, Props>) {
    if (this.props.onDragEnter) {
      this.props.onDragEnter(e);
    }
  }

  public onDragLeave(e: DragEvent<InventoryDataTransfer, Props>) {
    if (this.props.onDragLeave) {
      this.props.onDragLeave(e);
    }
  }

  public onDragOver(e: DragEvent<InventoryDataTransfer, Props>) {
    if (this.props.onDragOver) {
      this.props.onDragOver(e);
    }
  }

  public onDragStart(e: DragEvent<InventoryDataTransfer, Props>) {
    this.isDragging = true;

    if (this.props.onDragStart) {
      this.props.onDragStart(e);
    }
  }

  public onDrop(e: DragEvent<InventoryDataTransfer, Props>) {
    if (this.props.onDrop) {
      this.props.onDrop(e);
    }
  }

  public render() {
    return (
      <Container
        style={this.props.style}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        onContextMenu={this.onContextMenu}>
        {this.props.children}
      </Container>
    );
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this.startDraggingHalfStack);
  }

  private onMouseDown = (e: React.MouseEvent) => {
    const { disabled, disableDrag } = this.props;
    if (!disabled && !disableDrag && e.shiftKey && e.button === 0) {
      e.stopPropagation();
      // If they shift + start to drag their mouse, then move half the stack
      window.addEventListener('mousemove', this.startDraggingHalfStack);

      // Player has 500 milliseconds to start dragging
      setTimeout(() => {
        window.removeEventListener('mousemove', this.startDraggingHalfStack);
        this.resetDraggingInfo();
      }, 500);
    }

    if (!disabled && !disableDrag && e.ctrlKey && e.button === 0) {
      e.stopPropagation();
      this.startDraggingStack(e as any, 1);
    }
  }

  private onClick = (e: React.MouseEvent) => {
    const { disabled, disableDrag } = this.props;
    if (!disabled && !disableDrag && e.shiftKey && e.type === 'click' && !this.isDragging) {
      e.stopPropagation();
      window.removeEventListener('mousemove', this.startDraggingHalfStack);
      this.resetDraggingInfo();

      // If they just shift + click, show the stack menu so they can choose the amount to move
      this.showStackMenu(e as any);
    }
  }

  private onContextMenu = (e: React.MouseEvent) => {
    this.props.onContextMenu(e as any);
  }

  private showStackMenu = (e: MouseEvent) => {
    showContextMenuContent(
      <SplitStackMenu
        min={1}
        max={this.props.item.stats.item.unitCount}
        onSplit={this.startDraggingStack}
      />
    , e as any,
    true);

  }

  private startDraggingHalfStack = (e: MouseEvent) => {
    if (!this.dragBoundaries) {
      this.dragBoundaries = {
        top: e.clientY + 5,
        bottom: e.clientY - 5,
        right: e.clientX + 5,
        left: e.clientX - 5,
      };
    }
    const { item } = this.props;
    const count = Math.floor(item.stats.item.unitCount / 2) || 1;
    this.startDraggingStack(e, count);
  }

  private startDraggingStack = (e: MouseEvent, amount: number) => {
    const { item, renderWidth, renderHeight } = this.props;
    window.removeEventListener('mousemove', this.startDraggingHalfStack);
    const dragRender =
      <ItemStack
        width={renderWidth}
        height={renderHeight}
        count={amount}
        icon={item.staticDefinition.iconUrl}
      />;

    if (amount === this.props.data().item.stats.item.unitCount) {
      // User is trying to move whole stack, just move the whole item
      this.startDrag(e, this.props.data(), dragRender);
      return;
    }

    const dataTransfer = getInventoryDataTransfer({
      ...this.props.data(),
      fullStack: false,
      unitCount: amount,
    });
    this.startDrag(e, dataTransfer, dragRender);
  }

  private startDrag = (e: MouseEvent, dataTransfer?: InventoryDataTransfer, dragRender?: JSX.Element) => {
    if (!this.isDragging) {
      if (typeof (e as any).persist === 'function') {
        (e as any).persist();
      }
      const startDragOptions: StartDragOptions = {
        e: e as any,
        draggableData: dataTransfer,
        dragRender,
      };
      game.trigger('start-drag', this.props.dragItemID, startDragOptions);
      this.isDragging = true;
    }
  }

  private resetDraggingInfo = () => {
    this.isDragging = false;
    this.dragBoundaries = null;
  }
}

const DraggableItem = dragAndDrop<Props>(
  (props: Props) => {
    return props.initializeDragAndDrop();
  },
)(Item);

export default DraggableItem;
