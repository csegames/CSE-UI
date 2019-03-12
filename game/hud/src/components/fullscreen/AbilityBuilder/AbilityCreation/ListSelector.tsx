/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ListContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: auto;

  &.center {
    justify-content: center;
  }

  &::-webkit-scrollbar {
    height: 0px;
    width: 0px;
    background: transparent;
  }
`;

const ButtonWrapper = styled.div`
  &.disabled {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
`;

export interface ListItem<T> {
  id: string;
  data: T;
}

export interface Props {
  itemDimensions: { width: number, height: number, margin: number };
  listItems: ListItem<any>[];
  renderListItem: (item: ListItem<any>) => JSX.Element;
  renderNextButton: () => JSX.Element;
  renderPrevButton: () => JSX.Element;

  listContainerStyles?: string;
  itemContainerStyles?: string;
}

export interface State {
  listItems: ListItem<any>[];
}

const MOUSE_DOWN_TIMEOUT = 200;
const SCROLL_SPEED = 60;

class ListSelector extends React.PureComponent<Props, State> {
  private listRef: HTMLDivElement;

  private nextTimeout: number;
  private nextInterval: number;
  private prevTimeout: number;
  private prevInterval: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      listItems: props.listItems,
    };
  }

  public render() {
    const centerContent = this.shouldCenterContent();
    return (
      <Container>
        <ButtonWrapper
          className={centerContent ? 'disabled' : ''}
          onMouseDown={this.onPrevMouseDown}
          onMouseUp={this.onPrevMouseUp}>
          {this.props.renderPrevButton()}
        </ButtonWrapper>
        <ListContainer
          ref={r => this.listRef = r}
          className={`${this.props.listContainerStyles} ${centerContent ? 'center' : ''}`}>
          {this.state.listItems.map((item, i) => {
            return <div key={i}>{this.props.renderListItem(item)}</div>;
          })}
        </ListContainer>
        <ButtonWrapper
          className={centerContent ? 'disabled' : ''}
          onMouseDown={this.onNextMouseDown}
          onMouseUp={this.onNextMouseUp}>
          {this.props.renderNextButton()}
        </ButtonWrapper>
      </Container>
    );
  }

  public componentDidMount() {
    window.setTimeout(this.initializeList, 10);
  }

  private initializeList = () => {
    this.updateInfiniteList();
  }

  private shouldCenterContent = () => {
    if (this.listRef) {
      return this.listRef.scrollWidth === this.listRef.clientWidth;
    }

    return true;
  }

  /* Next */
  private onNextMouseDown = () => {
    this.onNextClick();
    this.nextTimeout = window.setTimeout(this.intervalNext, MOUSE_DOWN_TIMEOUT);
  }

  private onNextMouseUp = () => {
    window.clearTimeout(this.nextTimeout);
    this.nextTimeout = null;

    window.clearInterval(this.nextInterval);
    this.nextInterval = null;

    window.removeEventListener('mouseup', this.onNextMouseUp);
  }

  private intervalNext = () => {
    this.nextInterval = window.setInterval(this.onNextClick, SCROLL_SPEED);
    window.addEventListener('mouseup', this.onNextMouseUp);
  }

  private onNextClick = () => {
    this.listRef.scrollLeft += this.getItemScrollWidth();
    this.updateInfiniteList();
  }

  /* Prev */
  private onPrevMouseDown = () => {
    this.onPrevClick();
    this.prevTimeout = window.setTimeout(this.intervalPrev, MOUSE_DOWN_TIMEOUT);
  }

  private onPrevMouseUp = () => {
    window.clearTimeout(this.prevTimeout);
    this.prevTimeout = null;

    window.clearInterval(this.prevInterval);
    this.prevInterval = null;

    window.removeEventListener('mouseup', this.onPrevMouseUp);
  }

  private intervalPrev = () => {
    this.prevInterval = window.setInterval(this.onPrevClick, SCROLL_SPEED);
    window.addEventListener('mouseup', this.onPrevMouseUp);
  }

  private onPrevClick = () => {
    this.listRef.scrollLeft -= this.getItemScrollWidth();
    this.updateInfiniteList();
  }

  private getItemScrollWidth = () => {
    const { itemDimensions } = this.props;
    return itemDimensions.width + itemDimensions.margin;
  }

  private updateInfiniteList = () => {
    let listItems = [...this.state.listItems];

    const scrolledAmount = this.listRef.scrollLeft / (this.listRef.scrollWidth - this.listRef.clientWidth);
    if (scrolledAmount < 0.2) {
      const itemToMove = listItems.pop();
      listItems = [itemToMove, ...listItems];
      this.listRef.scrollLeft += this.getItemScrollWidth();
      this.setState({ listItems });
      return;
    } else if (scrolledAmount > 0.8) {
      const itemToMove = listItems.shift();
      listItems = [...listItems, itemToMove];
      this.listRef.scrollLeft -= this.getItemScrollWidth();
      this.setState({ listItems });
      return;
    }
  }
}

export default ListSelector;
