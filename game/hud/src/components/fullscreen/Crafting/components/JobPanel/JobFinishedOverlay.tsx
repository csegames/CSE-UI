/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { filter, findIndex } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { VoxJob, VoxJobOutputItemType, InventoryItem } from 'gql/interfaces';

import { getIcon, getItemUnitCount, getItemQuality } from 'fullscreen/lib/utils';
import { getJobContext } from '../../lib/utils';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';
import Tooltip, { defaultTooltipStyle } from 'shared/ItemTooltip';
import ItemImage from '../../ItemImage';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const Container = styled.div`
  position: absolute;
  top: -25px;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  top: -45px;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: auto;
  width: 230px;
  background: url(../images/crafting/1080/complete-modal-frame.png) no-repeat;
  background-size: 100% 100%;

  &.hasByproduct {
    background: url(../images/crafting/1080/complete-bonus-modal-frame.png) no-repeat;
    background-size: 100% 100%;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 600px;
    background: url(../images/crafting/4k/complete-modal-frame.png) no-repeat;
    background-size: 100% 100%;
    &.hasByproduct {
      background: url(../images/crafting/4k/complete-bonus-modal-frame.png) no-repeat;
      background-size: 100% 100%;
    }
  }
`;

const ModalBottom = styled.div`
  width: 100%;
  height: 62px;
  background: url(../images/crafting/1080/complete-modal-bottom-frame.png) no-repeat;
  background-size: cover;

  &.hasByproduct {
    background: url(../images/crafting/1080/complete-bonus-modal-bottom-frame.png) no-repeat;
    background-size: cover;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    height: 160px;
    background: url(../images/crafting/4k/complete-modal-bottom-frame.png) no-repeat;
    background-size: cover;

    &.hasByproduct {
      background: url(../images/crafting/4k/complete-bonus-modal-bottom-frame.png) no-repeat;
      background-size: cover;
    }
  }
`;

const ModalTitle = styled.div`
  position: absolute;
  top: -12px;
  right: 0;
  left: 0;
  margin: auto;
  text-align: center;
  color: #91FFBD;
  font-size: 20px;
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 5px;

  &.hasByproduct {
    color: #FFEA9E;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    top: 0;
    font-size: 40px;
  }
`;

const MainOutputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 147px;
  height: 146px;
  background: url(../images/crafting/1080/main-output-item.png) no-repeat;
  margin-top: 15px;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 358px;
    height: 358px;
    background: url(../images/crafting/4k/main-output-item.png) no-repeat;
    margin-top: 45px;
  }
`;

const MainOutputItem = styled.div`
  width: 60px;
  height: 60px;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 150px;
    height: 150px;
  }
`;

const ItemContainer = styled.div`
  position: relative;
  margin: 0 1.5px;
  width: 41px;
  height: 41px;
  border: 1px solid #1B2F31;
  &.byproduct:after {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    background: url(../images/crafting/1080/bonus-frame.png) no-repeat;
    background-size: contain;
    top: -3px;
    left: -5px;
    pointer-events: none;
  }
`;

const NormalItemsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20px 20px 10px 20px;
`;

const UnusedItemsContainer = styled.div`
  position: relative;
  align-self: center;
  justify-content: center;
  background: url(../images/crafting/1080/unused-frame.png) no-repeat;
  background-size: 100% 100%;
  width: 190px;
  height: auto;
  margin-bottom: 10px;
`;

const UnusedItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px 5px;
`;

const UnusedItemsTitle = styled.div`
  position: absolute;
  top: -8px;
  right: 0;
  left: 0;
  margin: auto;
  color: #91FFBD;
  font-size: 12px;
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 4px;
  text-align: center;

  &.hasByproduct {
    color: #FFE9A9;
  }
`;

const CollectButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 156px;
  height: 45px;
  background: url(../images/crafting/1080/vox-inventory-button-border.png) no-repeat;
  text-align: center;
  font-family: Caudex;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
  cursor: pointer;

  &.vox-inventory {
    background: url(../images/crafting/1080/vox-voxinventory-button-border.png) no-repeat;
  }

  &:hover {
    -webkit-filter: brightness(130%);
    filter: brightness(130%);
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 24px;
    width: 382px;
    height: 110px;
    background: url(../images/crafting/4k/vox-inventory-button-border.png) no-repeat;
  }
`;

export interface ComponentProps {
  jobNumber: number;
}

export interface InjectedProps {
  voxJob: VoxJob.Fragment;
  onCollectJob: (job: VoxJob.Fragment) => void;
}

export type Props = ComponentProps & InjectedProps;

class JobFinishedOverlay extends React.Component<Props> {
  public render() {
    const hasByproductClass = this.hasByproductItems() ? 'hasByproduct' : '';
    const craftedOutputItems = this.getCraftedOutputItems();
    const unusedOutputItems = this.getUnusedOutputItems();
    const mainOutputItem = craftedOutputItems[0];
    const otherOutputItems = craftedOutputItems.slice(1, craftedOutputItems.length);
    return (
      <Container>
        <ModalContainer>
          <Modal className={hasByproductClass}>
            <ModalTitle className={hasByproductClass}>Collect</ModalTitle>
            <MainOutputContainer>
              <MainOutputItem
                className={mainOutputItem.outputItemType === VoxJobOutputItemType.Byproduct ? 'byproduct' : ''}
                onMouseOver={(e: React.MouseEvent) => this.onMouseOver(e as any, mainOutputItem.item)}
                onMouseLeave={this.onMouseLeave}>
                <ItemImage
                  icon={getIcon(mainOutputItem.item)}
                  count={getItemUnitCount(mainOutputItem.item)}
                  quality={getItemQuality(mainOutputItem.item)}
                />
              </MainOutputItem>
            </MainOutputContainer>
            {otherOutputItems.length > 0 &&
              <NormalItemsContainer>
                {otherOutputItems.map(output => (
                  <ItemContainer
                    className={output.outputItemType === VoxJobOutputItemType.Byproduct ? 'byproduct' : ''}
                    onMouseOver={(e: React.MouseEvent) => this.onMouseOver(e as any, output.item)}
                    onMouseLeave={this.onMouseLeave}>
                    <ItemImage
                      icon={getIcon(output.item)}
                      count={getItemUnitCount(output.item)}
                      quality={getItemQuality(output.item)}
                    />
                  </ItemContainer>
                ))}
              </NormalItemsContainer>
            }
            {unusedOutputItems.length > 0 &&
              <UnusedItemsContainer>
                <UnusedItemsTitle className={hasByproductClass}>Unused</UnusedItemsTitle>
                <UnusedItems>
                  {unusedOutputItems.map(output => (
                    <ItemContainer
                      onMouseOver={(e: React.MouseEvent) => this.onMouseOver(e as any, output.item)}
                      onMouseLeave={this.onMouseLeave}>
                      <ItemImage
                        icon={getIcon(output.item)}
                        count={getItemUnitCount(output.item)}
                        quality={getItemQuality(output.item)}
                      />
                    </ItemContainer>
                  ))}
                </UnusedItems>
              </UnusedItemsContainer>
            }

            <CollectButton onClick={this.onInventoryCollectClick}>
              Inventory
            </CollectButton>
            {/* <CollectButton className='vox-inventory' onClick={this.onVoxInventoryCollectClick}>
              Vox Inventory
            </CollectButton> */}
          </Modal>
          <ModalBottom className={hasByproductClass} />
        </ModalContainer>
      </Container>
    );
  }

  private onInventoryCollectClick = () => {
    this.props.onCollectJob(this.props.voxJob);
  }

  // private onVoxInventoryCollectClick = () => {
  //   this.props.onCollectJob(this.props.voxJob);
  // }

  private onMouseOver = (e: MouseEvent, item: InventoryItem.Fragment) => {
    const payload: ShowTooltipPayload = {
      content: <Tooltip item={item} instructions={''} />,
      event: e,
      styles: defaultTooltipStyle,
    };
    showTooltip(payload);
  }

  private onMouseLeave = () => {
    hideTooltip();
  }

  private hasByproductItems = () => {
    const { voxJob } = this.props;
    return findIndex(voxJob.outputItems, output => output.outputItemType === VoxJobOutputItemType.Byproduct) !== -1;
  }

  private getCraftedOutputItems = () => {
    const { voxJob } = this.props;
    return filter(voxJob.outputItems, output => (
      output.outputItemType === VoxJobOutputItemType.Normal || output.outputItemType === VoxJobOutputItemType.Byproduct
    ));
  }

  private getUnusedOutputItems = () => {
    const { voxJob } = this.props;
    return filter(voxJob.outputItems, output => output.outputItemType === VoxJobOutputItemType.Unused);
  }
}

class JobFinishedOverlayWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ voxJob, onCollectJob }) => (
          <JobFinishedOverlay {...this.props} voxJob={voxJob} onCollectJob={onCollectJob} />
        )}
      </JobContext.Consumer>
    );
  }
}

export default JobFinishedOverlayWithInjectedContext;
