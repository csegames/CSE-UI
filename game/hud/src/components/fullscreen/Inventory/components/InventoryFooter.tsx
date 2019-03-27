/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { styled } from '@csegames/linaria/react';
import { Tooltip } from '@csegames/camelot-unchained';

import InventoryRowActionButton from './InventoryRowActionButton';
import { emptyStackHash, footerInfoIcons, rowActionIcons, HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';
import eventNames, { DropItemPayload } from 'fullscreen/lib/itemEvents';

// #region Container constants
const CONTAINER_HEIGHT = 72;
// #endregion
const Container = styled.div`
  display: flex;
  flex: 0 0 auto;
  height: ${CONTAINER_HEIGHT}px;
  justify-content: flex-end;
  align-items: center;
  background: url(../images/inventory/bag-bottom-bg.png);
  background-size: cover;
  z-index: 1;

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

// #region Section constants
const SECTION_FONT_SIZE = 28;
const SECTION_MARGIN_RIGHT = 10;
const SECTION_PADDING_VERTICAL = 4;
const SECTION_PADDING_HORIZONTAL = 20;
// #endregion
const Section = styled.div`
  cursor: default;
  display: flex;
  align-items: center;
  color: #ACAAA8;
  text-align: center;
  font-size: ${SECTION_FONT_SIZE}px;
  margin-right: ${SECTION_MARGIN_RIGHT}px;
  padding: ${SECTION_PADDING_VERTICAL}px ${SECTION_PADDING_HORIZONTAL}px;

  @media (max-width: 2560px) {
    font-size: ${SECTION_FONT_SIZE * MID_SCALE}px;
    margin-right: ${SECTION_MARGIN_RIGHT * MID_SCALE}px;
    padding: ${SECTION_PADDING_VERTICAL * MID_SCALE}px ${SECTION_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SECTION_FONT_SIZE * HD_SCALE}px;
    margin-right: ${SECTION_MARGIN_RIGHT * HD_SCALE}px;
    padding: ${SECTION_PADDING_VERTICAL * HD_SCALE}px ${SECTION_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region Icon constants
const ICON_FONT_SIZE = 28;
const ICON_MARGIN_RIGHT = 10;
// #endregion
const Icon = styled.span`
  font-size: ${ICON_FONT_SIZE}px;
  line-height: ${ICON_FONT_SIZE}px;
  margin-right: ${ICON_MARGIN_RIGHT}px;
  color: ${(props: any) => props.color};

  @media (max-width: 2560px) {
    font-size: ${ICON_FONT_SIZE * MID_SCALE}px;
    line-height: ${ICON_FONT_SIZE * MID_SCALE}px;
    margin-right: ${ICON_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ICON_FONT_SIZE * HD_SCALE}px;
    line-height: ${ICON_FONT_SIZE * HD_SCALE}px;
    margin-right: ${ICON_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

export interface InventoryFooterProps {
  onAddRowClick: () => void;
  onRemoveRowClick: () => void;
  onPruneRowsClick: () => void;
  addRowButtonDisabled: boolean;
  removeRowButtonDisabled: boolean;
  pruneRowsButtonDisabled: boolean;

  itemCount: number;
  totalMass: number;
}

export interface InventoryFooterState {
  itemCount: number;
  totalMass: number;
}

class InventoryFooter extends React.Component<InventoryFooterProps, InventoryFooterState> {
  private eventHandles: EventHandle[] = [];

  constructor(props: InventoryFooterProps) {
    super(props);
    this.state = {
      itemCount: 0,
      totalMass: 0,
    };
  }

  public render() {
    return (
      <Container>
        <InventoryRowActionButton
          tooltipContent={'Add Empty Row'}
          iconClass={rowActionIcons.addRow}
          onClick={this.props.onAddRowClick}
          disabled={this.props.addRowButtonDisabled}
        />
        <InventoryRowActionButton
          tooltipContent={'Remove Empty Row'}
          iconClass={rowActionIcons.removeRow}
          onClick={this.props.onRemoveRowClick}
          disabled={this.props.removeRowButtonDisabled}
        />
        <InventoryRowActionButton
          tooltipContent={'Prune Empty Rows'}
          iconClass={rowActionIcons.pruneRows}
          onClick={this.props.onPruneRowsClick}
          disabled={this.props.pruneRowsButtonDisabled}
        />
        <Tooltip content={'Item Count'}>
          <Section>
            <Icon className={footerInfoIcons.itemCount} color={'#998675'} />
            {this.state.itemCount.toString()}
          </Section>
        </Tooltip>

        <Tooltip content={`Weight: ${this.state.totalMass.toString()}kg`}>
          <Section>
            <Icon className={footerInfoIcons.weight} color={'#998675'} />
            {`${this.state.totalMass.toFixed(1)}kg`}
          </Section>
        </Tooltip>
      </Container>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.on(eventNames.onDropItem, this.onDropItem));
    this.setBottomInfo();
  }

  public componentWillReceiveProps(nextProps: InventoryFooterProps) {
    if (this.props.itemCount !== nextProps.itemCount ||
        this.props.totalMass !== nextProps.totalMass) {

      this.setBottomInfo();
    }
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private setBottomInfo = () => {
    this.setState((state, props) => {
      return {
        itemCount: props.itemCount,
        totalMass: props.totalMass,
      };
    });
  }

  private onDropItem = (payload: DropItemPayload) => {
    const item = payload.inventoryItem.item;
    this.setState((state, props) => {
      return {
        ...state,
        totalMass: state.totalMass - item.stats.item.totalMass,
        itemCount: item.staticDefinition && item.staticDefinition.itemType === 'Ammo' || item.stackHash !== emptyStackHash ?
          state.itemCount : state.itemCount - 1,
      };
    });
  }
}

export default InventoryFooter;
