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
import Tooltip, { defaultTooltipStyle } from 'shared/ItemTooltip';
import { getItemWithNewUnitCount, getItemUnitCount, getItemQuality, getIcon } from 'fullscreen/lib/utils';
import ItemImage from '../../../ItemImage';
import PageSelector from '../PageSelector';
import CraftingDefTooltip from '../../CraftingDefTooltip';
import { GroupLogData } from '../index';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const OutputResultContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 160px;
  box-shadow: inset 0 0 100px 20px rgba(155, 128, 88, 0.5);
  &:before {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 300px;
    background: url(../images/crafting/1080/paper-history-border.png) no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    pointer-events: none;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    width: 100%;
    height: 13px;
    background: url(../images/crafting/1080/paper-history-divider.png) no-repeat;
    background-position: center bottom;
    background-size: cover;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    height: 208px;
    &:before {
      background: url(../images/crafting/4k/paper-history-border.png) no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      height: 390px;
    }
    &:after {
      background: url(../images/crafting/4k/paper-history-divider.png) no-repeat;
      background-position: center bottom;
      background-size: cover;
      height: 17px;
    }
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    height: 320px;
    &:before {
      background: url(../images/crafting/4k/paper-history-border.png) no-repeat;
      background-position: center center;
      background-size: 100% 100%;
      height: 600px;
    }
    &:after {
      background: url(../images/crafting/4k/paper-history-divider.png) no-repeat;
      background-position: center bottom;
      background-size: cover;
      height: 33px;
    }
  }
`;

const OutputSlotsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const OutputSlot = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  background: url(../images/crafting/1080/paper-output-frame.png) no-repeat;
  background-size: contain;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  &.byproduct {
    background: url(../images/crafting/1080/paper-output-bonus-frame.png) no-repeat;
    background-size: contain;
  }
  &.active {
    opacity: 1;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 91px;
    height: 91px;
    background: url(../images/crafting/4k/paper-output-frame.png) no-repeat;
    background-size: contain;
    &.byproduct {
      background: url(../images/crafting/4k/paper-output-bonus-frame.png) no-repeat;
      background-size: contain;
    }
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 140px;
    height: 140px;
    background: url(../images/crafting/4k/paper-output-frame.png) no-repeat;
    background-size: contain;
    &.byproduct {
      background: url(../images/crafting/4k/paper-output-bonus-frame.png) no-repeat;
      background-size: contain;
    }
  }
`;

const JobInfoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const JobInfoSection = styled.div`
  font-family: Caveat;
  color: #000000;
  font-size: 16px;
  margin-left: 5px;
  margin-right: 5px;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 21px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 32px;
  }
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px 0 5px;
`;

const ItemContainer = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  &.byproduct:after {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    background: url(../images/crafting/1080/bonus-frame.png) no-repeat;
    background-size: contain;
    top: -5px;
    left: -6px;
    pointer-events: none;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 52px;
    height: 52px;
    &.byproduct:after {
      background: url(../images/crafting/4k/bonus-frame.png) no-repeat;
      background-size: contain;
      width: 78px;
      height: 78px;
    }
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 80px;
    height: 80px;
    &.byproduct:after {
      background: url(../images/crafting/4k/bonus-frame.png) no-repeat;
      background-size: contain;
      width: 120px;
      height: 120px;
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
        styles: defaultTooltipStyle,
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
