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
import Tooltip from 'shared/ItemTooltip';
import ItemImage from '../../ItemImage';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_TOP = -50;
const CONTAINER_FONT_SIZE = 48;
// #endregion
const Container = styled.div`
  position: absolute;
  top: ${CONTAINER_TOP}px;
  font-size: ${CONTAINER_FONT_SIZE}px;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;

  @media (max-width: 2560px) {
    top: ${CONTAINER_TOP * MID_SCALE}px;
    font-size: ${CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CONTAINER_TOP * HD_SCALE}px;
    font-size: ${CONTAINER_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ModalContainer constants
const MODAL_CONTAINER_TOP = -90;
// #endregion
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  top: ${MODAL_CONTAINER_TOP}px;
  right: 0;
  bottom: 0;
  left: 0;
`;

// #region Modal constants
const MODAL_WIDTH = 460;
// #endregion
const Modal = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: auto;
  width: ${MODAL_WIDTH}px;
  background-image: url(../images/crafting/uhd/complete-modal-frame.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;

  &.hasByproduct {
    background-image: url(../images/crafting/uhd/complete-bonus-modal-frame.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  @media (max-width: 2560px) {
    width: ${MODAL_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${MODAL_WIDTH * HD_SCALE}px;
    background-image: url(../images/crafting/hd/complete-modal-frame.png);
    &.hasByproduct {
      background-image: url(../images/crafting/hd/complete-bonus-modal-frame.png);
    }
  }
`;

// #region ModalBottom constants
const MODAL_BOTTOM_HEIGHT = 124;
// #endregion
const ModalBottom = styled.div`
  width: 100%;
  height: ${MODAL_BOTTOM_HEIGHT}px;
  background-image: url(../images/crafting/uhd/complete-modal-bottom-frame.png);
  background-size: cover;
  background-repeat: no-repeat;

  &.hasByproduct {
    background-image: url(../images/crafting/uhd/complete-bonus-modal-bottom-frame.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  @media (max-width: 2560px) {
    height: ${MODAL_BOTTOM_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${MODAL_BOTTOM_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/4k/complete-modal-bottom-frame.png);

    &.hasByproduct {
      background-image: url(../images/crafting/4k/complete-bonus-modal-bottom-frame.png);
    }
  }
`;

// #region ModalTitle constants
const MODAL_TITLE_TOP = -24;
const MODAL_TITLE_FONT_SIZE = 40;
const MODAL_TITLE_LETTER_SPACING = 10;
// #endregion
const ModalTitle = styled.div`
  position: absolute;
  top: ${MODAL_TITLE_TOP}px;
  font-size: ${MODAL_TITLE_FONT_SIZE}px;
  letter-spacing: ${MODAL_TITLE_LETTER_SPACING}px;
  right: 0;
  left: 0;
  margin: auto;
  text-align: center;
  color: #91FFBD;
  text-transform: uppercase;
  font-family: Caudex;

  &.hasByproduct {
    color: #FFEA9E;
  }

  @media (max-width: 2560px) {
    font-size: ${MODAL_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${MODAL_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region MainOutputContainer constants
const MAIN_OUTPUT_CONTAINER_DIMENSIONS = 294;
const MAIN_OUTPUT_CONTAINER_MARGIN_TOP = 30;
// #endregion
const MainOutputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: ${MAIN_OUTPUT_CONTAINER_DIMENSIONS}px;
  height: ${MAIN_OUTPUT_CONTAINER_DIMENSIONS}px;
  margin-top: ${MAIN_OUTPUT_CONTAINER_MARGIN_TOP}px;
  background-image: url(../images/crafting/uhd/main-output-item.png);
  background-repeat: no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    width: ${MAIN_OUTPUT_CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${MAIN_OUTPUT_CONTAINER_DIMENSIONS * MID_SCALE}px;
    margin-top: ${MAIN_OUTPUT_CONTAINER_MARGIN_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${MAIN_OUTPUT_CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${MAIN_OUTPUT_CONTAINER_DIMENSIONS * HD_SCALE}px;
    margin-top: ${MAIN_OUTPUT_CONTAINER_MARGIN_TOP * HD_SCALE}px;
    background-image: url(../images/crafting/hd/main-output-item.png);
  }
`;

// #region MainOutputItem constants
const MAIN_OUTPUT_ITEM_DIMENSIONS = 120;
// #endregion
const MainOutputItem = styled.div`
  width: ${MAIN_OUTPUT_ITEM_DIMENSIONS}px;
  height: ${MAIN_OUTPUT_ITEM_DIMENSIONS}px;

  @media (max-width: 2560px) {
    width: ${MAIN_OUTPUT_ITEM_DIMENSIONS * MID_SCALE}px;
    height: ${MAIN_OUTPUT_ITEM_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${MAIN_OUTPUT_ITEM_DIMENSIONS * HD_SCALE}px;
    height: ${MAIN_OUTPUT_ITEM_DIMENSIONS * HD_SCALE}px;
  }
`;

// #region ItemContainer constants
const ITEM_CONTAINER_MARGIN_HORIZONTAL = 3;
const ITEM_CONTAINER_DIMENSIONS = 82;
const ITEM_CONTAINER_BORDER_WIDTH = 2;
const ITEM_CONTAINER_BYPRODUCT_DIMENSIONS = 100;
const ITEM_CONTAINER_BYPRODUCT_TOP = -6;
const ITEM_CONTAINER_BYPRODUCT_LEFT = -10;
// #endregion
const ItemContainer = styled.div`
  position: relative;
  margin: 0 ${ITEM_CONTAINER_MARGIN_HORIZONTAL}px;
  width: ${ITEM_CONTAINER_DIMENSIONS}px;
  height: ${ITEM_CONTAINER_DIMENSIONS}px;
  border: ${ITEM_CONTAINER_BORDER_WIDTH}px solid #1B2F31;

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
    margin: 0 ${ITEM_CONTAINER_MARGIN_HORIZONTAL * MID_SCALE}px;
    width: ${ITEM_CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_CONTAINER_DIMENSIONS * MID_SCALE}px;
    border: ${ITEM_CONTAINER_BORDER_WIDTH * MID_SCALE}px solid #1B2F31;

    &.byproduct:after {
      width: ${ITEM_CONTAINER_BYPRODUCT_DIMENSIONS}px;
      height: ${ITEM_CONTAINER_BYPRODUCT_DIMENSIONS}px;
      top: ${ITEM_CONTAINER_BYPRODUCT_TOP}px;
      left: ${ITEM_CONTAINER_BYPRODUCT_LEFT}px;
    }
  }
`;

// #region NormalItemsContainer constants
const NORMAL_ITEMS_CONTAINER_PADDING = 40;
const NORMAL_ITEMS_CONTAINER_PADDING_BOTTOM = 20;
// #endregion
const NormalItemsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: ${NORMAL_ITEMS_CONTAINER_PADDING}px;
  padding-bottom: ${NORMAL_ITEMS_CONTAINER_PADDING_BOTTOM}px;

  @media (max-width: 2560px) {
    padding: ${NORMAL_ITEMS_CONTAINER_PADDING * MID_SCALE}px;
    padding-bottom: ${NORMAL_ITEMS_CONTAINER_PADDING_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${NORMAL_ITEMS_CONTAINER_PADDING * HD_SCALE}px;
    padding-bottom: ${NORMAL_ITEMS_CONTAINER_PADDING_BOTTOM * HD_SCALE}px;
  }
`;

// #region UnusedItemsContainer constants
const UNUSED_ITEMS_CONTAINER_WIDTH = 380;
const UNUSED_ITEMS_CONTAINER_MARGIN_BOTTOM = 20;
// #endregion
const UnusedItemsContainer = styled.div`
  position: relative;
  align-self: center;
  justify-content: center;
  background-image: url(../images/crafting/1080/unused-frame.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: ${UNUSED_ITEMS_CONTAINER_WIDTH}px;
  margin-bottom: ${UNUSED_ITEMS_CONTAINER_MARGIN_BOTTOM}px;
  height: auto;

  @media (max-width: 2560px) {
    width: ${UNUSED_ITEMS_CONTAINER_WIDTH * MID_SCALE}px;
    margin-bottom: ${UNUSED_ITEMS_CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${UNUSED_ITEMS_CONTAINER_WIDTH * HD_SCALE}px;
    margin-bottom: ${UNUSED_ITEMS_CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

// #region UnusedItems constants
const UNUSED_ITEMS_MARGIN_VERTICAL = 20;
const UNUSED_ITEMS_MARGIN_HORIZONTAL = 10;
// #endregion
const UnusedItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: ${UNUSED_ITEMS_MARGIN_VERTICAL}px ${UNUSED_ITEMS_MARGIN_HORIZONTAL}px;

  @media (max-width: 2560px) {
    margin: ${UNUSED_ITEMS_MARGIN_VERTICAL * MID_SCALE}px ${UNUSED_ITEMS_MARGIN_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin: ${UNUSED_ITEMS_MARGIN_VERTICAL * HD_SCALE}px ${UNUSED_ITEMS_MARGIN_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region UnusedItemsTitle constants
const UNUSED_ITEMS_TITLE_TOP = -16;
const UNUSED_ITEMS_TITLE_FONT_SIZE = 24;
const UNUSED_ITEMS_TITLE_LETTER_SPACING = 8;
// #endregion
const UnusedItemsTitle = styled.div`
  position: absolute;
  top: ${UNUSED_ITEMS_TITLE_TOP}px;
  font-size: ${UNUSED_ITEMS_TITLE_FONT_SIZE}px;
  letter-spacing: ${UNUSED_ITEMS_TITLE_LETTER_SPACING}px;
  right: 0;
  left: 0;
  margin: auto;
  color: #91FFBD;
  text-transform: uppercase;
  font-family: Caudex;
  text-align: center;

  &.hasByproduct {
    color: #FFE9A9;
  }

  @media (max-width: 2560px) {
    top: ${UNUSED_ITEMS_TITLE_TOP * MID_SCALE}px;
    font-size: ${UNUSED_ITEMS_TITLE_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${UNUSED_ITEMS_TITLE_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${UNUSED_ITEMS_TITLE_TOP * HD_SCALE}px;
    font-size: ${UNUSED_ITEMS_TITLE_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${UNUSED_ITEMS_TITLE_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region CollectButton constants
const COLLECT_BUTTON_WIDTH = 312;
const COLLECT_BUTTON_HEIGHT = 90;
const COLLECT_BUTTON_FONT_SIZE = 24;
const COLLECT_BUTTON_LETTER_SPACING = 4;
const COLLECT_BUTTON_MARGIN_BOTTOM = 20;
// #endregion
const CollectButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: ${COLLECT_BUTTON_WIDTH}px;
  height: ${COLLECT_BUTTON_HEIGHT}px;
  font-size: ${COLLECT_BUTTON_FONT_SIZE}px;
  letter-spacing: ${COLLECT_BUTTON_LETTER_SPACING}px;
  margin-bottom: ${COLLECT_BUTTON_MARGIN_BOTTOM}px;
  background-image: url(../images/crafting/uhd/vox-inventory-button-border.png);
  background-size: contain;
  background-repeat: no-repeat;
  text-align: center;
  font-family: Caudex;
  text-transform: uppercase;
  cursor: pointer;

  &.vox-inventory {
    background-image: url(../images/crafting/uhd/vox-voxinventory-button-border.png);
  }

  &:hover {
    -webkit-filter: brightness(130%);
    filter: brightness(130%);
  }

  @media (max-width: 2560px) {
    width: ${COLLECT_BUTTON_WIDTH * MID_SCALE}px;
    height: ${COLLECT_BUTTON_HEIGHT * MID_SCALE}px;
    font-size: ${COLLECT_BUTTON_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${COLLECT_BUTTON_LETTER_SPACING * MID_SCALE}px;
    margin-bottom: ${COLLECT_BUTTON_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-widht: 1920px) {
    width: ${COLLECT_BUTTON_WIDTH * HD_SCALE}px;
    height: ${COLLECT_BUTTON_HEIGHT * HD_SCALE}px;
    font-size: ${COLLECT_BUTTON_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${COLLECT_BUTTON_LETTER_SPACING * HD_SCALE}px;
    margin-bottom: ${COLLECT_BUTTON_MARGIN_BOTTOM * HD_SCALE}px;
    background-image: url(../images/crafting/hd/vox-inventory-button-border.png);
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
      styles: 'item',
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
