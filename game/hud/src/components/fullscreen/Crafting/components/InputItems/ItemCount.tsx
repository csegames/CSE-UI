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
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const Container = styled.div`
  position: absolute;
  right: -5px;
  bottom: -5px;
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  align-items: flex-end;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    right: -15px;
    bottom: 0;
  }
`;

const Button = styled.div`
  cursor: pointer;
  pointer-events: all;
  &:hover {
    -webkit-filter: brightness(150%);
    filter: brightness(150%);
  }
  &.up {
    background: url(../images/crafting/1080/craft-slots-up-arrow.png);
    width: 13px;
    height: 8px;
  }
  &.down {
    background: url(../images/crafting/1080/craft-slots-down-arrow.png);
    width: 13px;
    height: 8px;
  }
  &.disabled {
    filter: brightness(40%);
    opacity: 0.9;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    &.up {
      background: url(../images/crafting/4k/craft-slots-up-arrow.png);
      width: 31px;
      height: 19px;
    }
    &.down {
      background: url(../images/crafting/4k/craft-slots-down-arrow.png);
      width: 31px;
      height: 19px;
    }
  }
`;

const ItemCountContainer = styled.div`
  width: 42px;
  height: 18px;
  font-size: 10px;
  background: url(../images/crafting/1080/counter-clot.png) no-repeat;
  background-size: contain;
  background-position: right center;
  color: #F2CAAB;
  font-family: TitilliumWeb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1px;
  &.disabled {
    background: url(../images/crafting/1080/counter-clot-empty.png) no-repeat;
    background-size: contain;
    background-position: right center;
    color: gray;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 100px;
    height: 49px;
    font-size: 20px;
    padding-right: 5px;
    background: url(../images/crafting/4k/counter-clot.png) no-repeat;
    background-size: contain;
    background-position: right center;

    &.disabled {
      background: url(../images/crafting/4k/counter-clot-empty.png) no-repeat;
      background-size: contain;
      background-position: right center;
      color: gray;
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
