import * as React from 'react';
import styled from 'react-emotion';
import { ql } from 'camelot-unchained';
import EmptyItem, { EmptyItemProps } from '../../EmptyItem';
import dragAndDrop, { DragAndDropInjectedProps, DragEvent } from '../../../../../components/DragAndDrop/DragAndDrop';

const Container = styled('div')`
  position: relative;
`;

const SlotOverlay = styled('div')`
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  cursor: pointer;
  background-color: ${(props: any) => props.backgroundColor};
`;

export interface EmptyItemDropZoneProps extends DragAndDropInjectedProps {
  slotIndex: number;
  onDrop: (dragItemData: ql.schema.Item, dropZoneData: ql.schema.Item | number) => void;
}

class EmptyItemWrapper extends React.PureComponent<EmptyItemDropZoneProps> {
  public data() {
    return this.props.slotIndex;
  }

  public onDrop(e: DragEvent<ql.schema.Item, EmptyItemProps & EmptyItemDropZoneProps>) {
    this.props.onDrop(e.dataTransfer, this.props.slotIndex);
  }

  public render() {
    return (
      <Container>
        <EmptyItem width={60} height={60} index={this.props.slotIndex} />
        <SlotOverlay backgroundColor={this.props.dragItemIsOver ? 'rgba(46, 213, 80, 0.4)' : 'transparent'} />
      </Container>
    );
  }
}

const EmptyItemDropZone = dragAndDrop<EmptyItemProps & EmptyItemDropZoneProps>(
  (props: EmptyItemProps & EmptyItemDropZoneProps) => ({
    id: 'emptyDropZone',
    dataKey: 'inventory-items',
    scrollBodyId: 'inventory-scroll-container',
    dropTarget: true,
    disableDrag: true,
  }),
)(EmptyItemWrapper);

export default EmptyItemDropZone;
