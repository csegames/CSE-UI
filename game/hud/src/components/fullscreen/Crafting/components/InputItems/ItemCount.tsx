/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { debounce } from 'lodash';
import { InventoryItem, SubItemSlot } from 'gql/interfaces';
import { getJobContext } from '../../lib/utils';
import { getItemUnitCount } from 'fullscreen/lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_RIGHT = -10;
const CONTAINER_BOTTOM = -10;
// #endregion
const Container = styled.div`
  position: absolute;
  right: ${CONTAINER_RIGHT}px;
  bottom: ${CONTAINER_BOTTOM}px;
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  align-items: flex-end;

  @media (max-width: 2560px) {
    right: ${CONTAINER_RIGHT * MID_SCALE}px;
    bottom: ${CONTAINER_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    right: ${CONTAINER_RIGHT * HD_SCALE}px;
    bottom: ${CONTAINER_BOTTOM * HD_SCALE}px;
  }
`;

// #region Button constants
const BUTTON_WIDTH = 26;
const BUTTON_HEIGHT = 16;
// #endregion
const Button = styled.div`
  cursor: pointer;
  pointer-events: all;
  &:hover {
    -webkit-filter: brightness(150%);
    filter: brightness(150%);
  }
  &.up {
    background-image: url(../images/crafting/uhd/craft-slots-up-arrow.png);
    background-size: contain;
    width: ${BUTTON_WIDTH}px;
    height: ${BUTTON_HEIGHT}px;
  }
  &.down {
    background-image: url(../images/crafting/uhd/craft-slots-down-arrow.png);
    background-size: contain;
    width: ${BUTTON_WIDTH}px;
    height: ${BUTTON_HEIGHT}px;
  }
  &.disabled {
    filter: brightness(40%);
    opacity: 0.9;
  }

  @media (max-width: 2560px) {
    &.up {
      width: ${BUTTON_WIDTH * MID_SCALE}px;
      height: ${BUTTON_HEIGHT * MID_SCALE}px;
    }
    &.down {
      width: ${BUTTON_WIDTH * MID_SCALE}px;
      height: ${BUTTON_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    &.up {
      background-image: url(../images/crafting/hd/craft-slots-up-arrow.png);
      width: ${BUTTON_WIDTH * HD_SCALE}px;
      height: ${BUTTON_HEIGHT * HD_SCALE}px;
    }
    &.down {
      background-image: url(../images/crafting/hd/craft-slots-down-arrow.png);
      width: ${BUTTON_WIDTH * HD_SCALE}px;
      height: ${BUTTON_HEIGHT * HD_SCALE}px;
    }
  }
`;

// #region ItemCountContainer constants
const ITEM_COUNT_CONTAINER_WIDTH = 84;
const ITEM_COUNT_CONTAINER_HEIGHT = 36;
const ITEM_COUNT_CONTAINER_FONT_SIZE = 20;
// #endregion
const ItemCountContainer = styled.div`
  width: ${ITEM_COUNT_CONTAINER_WIDTH}px;
  height: ${ITEM_COUNT_CONTAINER_HEIGHT}px;
  font-size: ${ITEM_COUNT_CONTAINER_FONT_SIZE}px;
  background-image: url(../images/crafting/uhd/counter-clot.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  color: #F2CAAB;
  font-family: TitilliumWeb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1px;
  &.disabled {
    background-image: url(../images/crafting/uhd/counter-clot-empty.png);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right center;
    color: gray;
  }

  @media (max-width: 2560px) {
    width: ${ITEM_COUNT_CONTAINER_WIDTH * MID_SCALE}px;
    height: ${ITEM_COUNT_CONTAINER_HEIGHT * MID_SCALE}px;
    font-size: ${ITEM_COUNT_CONTAINER_FONT_SIZE * MID_SCALE}px;
    padding-right: 5px;
  }

  @media (max-width: 1920px) {
    width: ${ITEM_COUNT_CONTAINER_WIDTH * HD_SCALE}px;
    height: ${ITEM_COUNT_CONTAINER_HEIGHT * HD_SCALE}px;
    font-size: ${ITEM_COUNT_CONTAINER_FONT_SIZE * HD_SCALE}px;
    padding-right: 5px;
    background-image: url(../images/crafting/hd/counter-clot.png);

    &.disabled {
      background-image: url(../images/crafting/hd/counter-clot-empty.png);
    }
  }
`;

export interface InjectedProps {
  shapeJobRunCount: number;
  onChangeInputItemCount: (item: InventoryItem.Fragment, slot: SubItemSlot, newAmount: number) => Promise<{ ok: boolean }>;
}

export interface ComponentProps {
  item: InventoryItem.Fragment;
  minUnitCount: number;
  maxUnitCount: number;
  slot: SubItemSlot;
  jobNumber: number;
}

export type Props = InjectedProps & ComponentProps;

export interface State {
  ratioItemCount: number;
}

class ItemCount extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ratioItemCount: props.shapeJobRunCount ? getItemUnitCount(props.item) / props.shapeJobRunCount : 0,
    };

    this.onItemCountChange = debounce(this.onItemCountChange, 300);
  }

  public render() {
    const { ratioItemCount } = this.state;
    const { item, minUnitCount, maxUnitCount } = this.props;
    const lessThanMinCount = item && item.stats.item.unitCount < minUnitCount && ratioItemCount < minUnitCount;
    return (
      <Container>
        <Button className={!item || ratioItemCount + 1 > maxUnitCount ? 'up disabled' : 'up'} onClick={this.onAddClick} />
        {item ?
          <ItemCountContainer className={lessThanMinCount ? 'disabled' : ''}>
            {lessThanMinCount ? `${ratioItemCount}/${minUnitCount}` : ratioItemCount}
          </ItemCountContainer> :
          <ItemCountContainer className={'disabled'}>{minUnitCount}</ItemCountContainer>
        }
        <Button
          className={!item || ratioItemCount - 1 < minUnitCount ? 'down disabled' : 'down'}
          onClick={this.onSubtractClick}
        />
      </Container>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.item && !this.props.item) {
      // Item was removed
      this.setState({ ratioItemCount: this.props.minUnitCount });
    }

    if (!prevProps.item && this.props.item) {
      // Item was added
      this.setState({ ratioItemCount: this.props.item.stats.item.unitCount });
    }

    if (prevProps.item && this.props.item &&
        prevProps.item.stats.item.unitCount !== this.props.item.stats.item.unitCount) {
      // Item count of input has been changed
      this.setState({ ratioItemCount: this.props.item.stats.item.unitCount });
    }

    if (prevProps.shapeJobRunCount !== this.props.shapeJobRunCount) {
      // Shape Job run count was changed, update job item count based off of this item's ratio.
      this.onItemCountChange(this.state.ratioItemCount * this.props.shapeJobRunCount);
    }
  }

  private onAddClick = () => {
    const { ratioItemCount } = this.state;
    if (ratioItemCount + 1 <= this.props.maxUnitCount) {
      const newRatio = ratioItemCount + 1;
      this.setState({ ratioItemCount: newRatio });
      this.onItemCountChange(newRatio * this.props.shapeJobRunCount);
    }
  }

  private onSubtractClick = () => {
    const { ratioItemCount } = this.state;
    if (ratioItemCount > 0 && ratioItemCount - 1 >= this.props.minUnitCount) {
      const newRatio = ratioItemCount - 1;
      this.setState({ ratioItemCount: newRatio });
      this.onItemCountChange(newRatio * this.props.shapeJobRunCount);
    }
  }

  private onItemCountChange = (newItemCount: number) => {
    const { onChangeInputItemCount, item, slot } = this.props;
    if (item && newItemCount > 0) {
      onChangeInputItemCount(item, slot, newItemCount);
    }
  }
}

class ItemCountWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ shapeJobRunCount, onChangeInputItemCount }) => (
          <ItemCount
            {...this.props}
            shapeJobRunCount={shapeJobRunCount}
            onChangeInputItemCount={onChangeInputItemCount}
          />
        )}
      </JobContext.Consumer>
    );
  }
}

export default ItemCountWithInjectedContext;
