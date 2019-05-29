/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { values } from 'lodash';
import moment from 'moment';
import { styled } from '@csegames/linaria/react';
import { VoxJobLog, InventoryItem, VoxJobOutputItemType } from 'gql/interfaces';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';
import Tooltip from 'shared/ItemTooltip';
import { getItemWithNewUnitCount, getItemUnitCount, getItemQuality, getIcon } from 'fullscreen/lib/utils';
import ItemImage from '../../../ItemImage';
import PageSelector from '../PageSelector';
import CraftingDefTooltip from '../../CraftingDefTooltip';
import { GroupLogData } from '../index';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region OutputResultContainer constants
const OUTPUT_RESULT_CONTAINER_HEIGHT = 320;
const OUTPUT_RESULT_CONTAINER_BORDER_HEIGHT = 600;
const OUTPUT_RESULT_CONTAINER_DIVIDER_BOTTOM = -8;
const OUTPUT_RESULT_CONTAINER_DIVIDER_HEIGHT = 26;
// #endregion
const OutputResultContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: ${OUTPUT_RESULT_CONTAINER_HEIGHT}px;
  box-shadow: inset 0 0 100px 20px rgba(155, 128, 88, 0.5);
  &:before {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: ${OUTPUT_RESULT_CONTAINER_BORDER_HEIGHT}px;
    background-image: url(../images/crafting/uhd/paper-history-border.png);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    pointer-events: none;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: ${OUTPUT_RESULT_CONTAINER_DIVIDER_BOTTOM}px;
    height: ${OUTPUT_RESULT_CONTAINER_DIVIDER_HEIGHT}px;
    width: 100%;
    background-image: url(../images/crafting/uhd/paper-history-divider.png);
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: cover;
  }

  @media (max-width: 2560px) {
    height: ${OUTPUT_RESULT_CONTAINER_HEIGHT * MID_SCALE}px;
    &:before {
      height: ${OUTPUT_RESULT_CONTAINER_BORDER_HEIGHT * MID_SCALE}px;
    }
    &:after {
      bottom: ${OUTPUT_RESULT_CONTAINER_DIVIDER_BOTTOM * MID_SCALE}px;
      height: ${OUTPUT_RESULT_CONTAINER_DIVIDER_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    height: ${OUTPUT_RESULT_CONTAINER_HEIGHT * HD_SCALE}px;
    &:before {
      height: ${OUTPUT_RESULT_CONTAINER_BORDER_HEIGHT * HD_SCALE}px;
      background-image: url(../images/crafting/hd/paper-history-border.png);
    }
    &:after {
      bottom: ${OUTPUT_RESULT_CONTAINER_DIVIDER_BOTTOM * HD_SCALE}px;
      height: ${OUTPUT_RESULT_CONTAINER_DIVIDER_HEIGHT * HD_SCALE}px;
      background-image: url(../images/crafting/hd/paper-history-divider.png);
    }
  }
`;

const OutputSlotsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

// #region OutputSlot constants
const OUTPUT_SLOT_DIMENSIONS = 140;
// #endregion
const OutputSlot = styled.div`
  position: relative;
  width: ${OUTPUT_SLOT_DIMENSIONS}px;
  height: ${OUTPUT_SLOT_DIMENSIONS}px;
  background-image: url(../images/crafting/uhd/paper-output-frame.png);
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  &.byproduct {
    background-image: url(../images/crafting/uhd/paper-output-bonus-frame.png);
    background-repeat: no-repeat;
    background-size: contain;
  }
  &.active {
    opacity: 1;
  }

  @media (max-width: 2560px) {
    width: ${OUTPUT_SLOT_DIMENSIONS * MID_SCALE}px;
    height: ${OUTPUT_SLOT_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${OUTPUT_SLOT_DIMENSIONS * HD_SCALE}px;
    height: ${OUTPUT_SLOT_DIMENSIONS * HD_SCALE}px;
  }
`;

const JobInfoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

// #region JobInfoSection constants
const JOB_INFO_SECTION_FONT_SIZE = 32;
const JOB_INFO_SECTION_MARGIN_HORIZONTAL = 10;
// #endregion
const JobInfoSection = styled.div`
  font-family: Caveat;
  color: #000000;
  font-size: ${JOB_INFO_SECTION_FONT_SIZE}px;
  margin: 0 ${JOB_INFO_SECTION_MARGIN_HORIZONTAL}px;

  @media (max-width: 2560px) {
    font-size: ${JOB_INFO_SECTION_FONT_SIZE * MID_SCALE}px;
    margin: 0 ${JOB_INFO_SECTION_MARGIN_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${JOB_INFO_SECTION_FONT_SIZE * HD_SCALE}px;
    margin: 0 ${JOB_INFO_SECTION_MARGIN_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region PageContainer constants
const PAGE_CONTAINER_PADDING_TOP = 20;
const PAGE_CONTAINER_PADDING_BOTTOM = 10;
// #endregion
const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${PAGE_CONTAINER_PADDING_TOP}px 0 ${PAGE_CONTAINER_PADDING_BOTTOM}px;

  @media (max-width: 2560px) {
    padding: 0 ${PAGE_CONTAINER_PADDING_TOP * MID_SCALE}px 0 ${PAGE_CONTAINER_PADDING_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${PAGE_CONTAINER_PADDING_TOP * HD_SCALE}px 0 ${PAGE_CONTAINER_PADDING_BOTTOM * HD_SCALE}px;
  }
`;

// #region ItemContainer constants
const ITEM_CONTAINER_DIMENSIONS = 80;
const ITEM_CONTAINER_BYPRODUCT_DIMENSIONS = 120;
const ITEM_CONTAINER_BYPRODUCT_TOP = -10;
const ITEM_CONTAINER_BYPRODUCT_LEFT = -12;
// #endregion
const ItemContainer = styled.div`
  position: relative;
  width: ${ITEM_CONTAINER_DIMENSIONS}px;
  height: ${ITEM_CONTAINER_DIMENSIONS}px;
  &.byproduct:after {
    content: '';
    position: absolute;
    width: ${ITEM_CONTAINER_BYPRODUCT_DIMENSIONS}px;
    height: ${ITEM_CONTAINER_BYPRODUCT_DIMENSIONS}px;
    top: ${ITEM_CONTAINER_BYPRODUCT_TOP}px;
    left: ${ITEM_CONTAINER_BYPRODUCT_LEFT}px;
    background-image: url(../images/crafting/uhd/bonus-frame.png);
    background-repeat: no-repeat;
    background-size: contain;
    pointer-events: none;
  }

  @media (max-width: 2560px) {
    width: ${ITEM_CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_CONTAINER_DIMENSIONS * MID_SCALE}px;
    &.byproduct:after {
      width: ${ITEM_CONTAINER_BYPRODUCT_DIMENSIONS * MID_SCALE}px;
      height: ${ITEM_CONTAINER_BYPRODUCT_DIMENSIONS * MID_SCALE}px;
      top: ${ITEM_CONTAINER_BYPRODUCT_TOP * MID_SCALE}px;
      left: ${ITEM_CONTAINER_BYPRODUCT_LEFT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    width: ${ITEM_CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_CONTAINER_DIMENSIONS * HD_SCALE}px;
    &.byproduct:after {
      background-image: url(../images/crafting/hd/bonus-frame.png);
      width: ${ITEM_CONTAINER_BYPRODUCT_DIMENSIONS * HD_SCALE}px;
      height: ${ITEM_CONTAINER_BYPRODUCT_DIMENSIONS * HD_SCALE}px;
      top: ${ITEM_CONTAINER_BYPRODUCT_TOP * HD_SCALE}px;
      left: ${ITEM_CONTAINER_BYPRODUCT_LEFT * HD_SCALE}px;
    }
  }
`;

export interface Props {
  voxJobLogs: VoxJobLog.Fragment[];
  groupLogData: GroupLogData;
}

export interface State {
  currentPage: number;
}

class OutputCraftHistory extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
    };
  }

  public render() {
    const voxJobLog = this.getCurrentVoxJobLog();
    const outputItems = this.getOutputItems(voxJobLog);
    return (
      <OutputResultContainer>
        <OutputSlotsContainer>
          {outputItems.map((outputItem, i) => {
            const isByproduct = outputItem.outputItemType === VoxJobOutputItemType.Byproduct;
            return (
              <OutputSlot
                key={i}
                className={`${outputItem ? 'active' : ''} ${isByproduct ? 'byproduct' : ''}`}>
                {outputItem &&
                  <ItemContainer className={isByproduct ? 'byproduct' : ''}>
                    <ItemImage
                      icon={getIcon(outputItem.item)}
                      count={getItemUnitCount(outputItem.item)}
                      quality={getItemQuality(outputItem.item)}
                      onMouseOver={e => this.showItemTooltip(e as any, outputItem.item)}
                      onMouseLeave={this.hideItemTooltip}
                    />
                  </ItemContainer>
                }
              </OutputSlot>
            );
          })}
        </OutputSlotsContainer>
        <JobInfoContainer>
          {voxJobLog &&
            <JobInfoSection>
              Crafting Time: {this.getJobDuration(voxJobLog)} hours
            </JobInfoSection>
          }
          /
          {voxJobLog &&
            <JobInfoSection>
              Vox Health Cost: {this.getJobVoxHealthCost(voxJobLog)}
            </JobInfoSection>
          }
        </JobInfoContainer>
        <PageContainer>
          <JobInfoSection>{voxJobLog ? this.getJobEnded(voxJobLog) : ''}</JobInfoSection>
          <PageSelector
            currentPage={this.state.currentPage}
            numberOfPages={this.props.voxJobLogs.length}
            onChangeCurrentPage={this.onChangeCurrentPage}
          />
        </PageContainer>
      </OutputResultContainer>
    );
  }

  public componentDidUpdate(nextProps: Props) {
    if (!this.isVoxJobLogsEqual(nextProps.voxJobLogs, this.props.voxJobLogs)) {
      this.setState({ currentPage: 1 });
    }
  }

  private isVoxJobLogsEqual = (a: VoxJobLog.Fragment[], b: VoxJobLog.Fragment[]) => {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i].itemHash !== b[i].itemHash) {
        return false;
      }
    }

    return true;
  }

  private getCurrentVoxJobLog = () => {
    return this.props.voxJobLogs[this.state.currentPage - 1];
  }

  private getJobEnded = (voxJobLog: VoxJobLog.Fragment) => {
    return moment(voxJobLog.dateEnded).format('MM/DD/YYYY');
  }

  private getJobDuration = (voxJobLog: VoxJobLog.Fragment) => {
    const started = moment(voxJobLog.dateStarted);
    const ended = moment(voxJobLog.dateEnded);
    return moment.duration(ended.diff(started)).hours();
  }

  private getJobVoxHealthCost = (voxJobLog: VoxJobLog.Fragment) => {
    return voxJobLog.voxHealthCost;
  }

  private getOutputItems = (voxJobLog: VoxJobLog.Fragment): VoxJobLog.OutputItems[] => {
    const outputItems: VoxJobLog.OutputItems[] = [];
    if (!voxJobLog) {
      outputItems[0] = {
        item: {
          staticDefinition: this.props.groupLogData.recipeItem,
        },
      } as VoxJobLog.OutputItems;
      return outputItems;
    }

    // Stack same item output
    const outputItemStacks: {[name: string]: VoxJobLog.OutputItems[]} = {};
    voxJobLog.outputItems.forEach((item) => {
      if (outputItemStacks[item.item.staticDefinition.name]) {
        outputItemStacks[item.item.staticDefinition.name].push(item);
      } else {
        outputItemStacks[item.item.staticDefinition.name] = [item];
      }
    });

    values(outputItemStacks).forEach((items) => {
      let totalUnitCount = 0;
      items.forEach(i => totalUnitCount += i.item.stats.item.unitCount);

      const outputItem = {
        ...items[0],
        item: getItemWithNewUnitCount(items[0].item, totalUnitCount),
      };
      outputItems.push(outputItem);
    });

    return outputItems;
  }

  private showItemTooltip = (event: MouseEvent, item: InventoryItem.Fragment) => {
    if (item.id) {
      const payload: ShowTooltipPayload = {
        event,
        content: <Tooltip item={item} instructions='' />,
        styles: 'item',
      };
      showTooltip(payload);
    } else {
      const payload: ShowTooltipPayload = {
        event,
        content: <CraftingDefTooltip recipeDef={item.staticDefinition} />,
      };
      showTooltip(payload);
    }
  }

  private hideItemTooltip = () => {
    hideTooltip();
  }

  private onChangeCurrentPage = (page: number) => {
    this.setState({ currentPage: page });
  }
}

export default OutputCraftHistory;
