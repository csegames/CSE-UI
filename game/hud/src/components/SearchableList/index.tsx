/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { utils } from '@csegames/camelot-unchained';
import styled from 'react-emotion';

const Container = styled('div')`
  position: relative;
`;

const ListContainer = styled('div')`
  overflow: auto;
`;

const ListBody = styled('div')`
  height: ${(props: any) => props.height}px;
  width: 100%;
`;

const List = styled('div')`
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  left: 0;
  pointer-events: ${(props: any) => props.isScrolling ? 'none' : 'all'};

  div {
    pointer-events: ${(props: any) => props.isScrolling ? 'none' : 'all'};
  }
`;

export interface Props {
  searchValue: string;
  searchKey: string;
  listItemsData: any[];
  listItemHeight: number;
  renderListItem: (listItem: any, searchIncludes: boolean, isVisible: boolean, index: number) => JSX.Element;
  listHeight?: number;
  visible?: boolean;
  extraItemsRendered?: number;
  containerClass?: string;
  listItemsContainerClass?: string;
  getRef?: (r: HTMLDivElement) => void;
}

export interface State {
  listItemsData: any[];
  scrollTop: number;
  isScrolling: boolean;
}

class SearchableList extends React.Component<Props, State> {
  private scrollRef: HTMLDivElement;
  private listItemsContainerRef: HTMLDivElement;
  private scrollTimeout: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      listItemsData: props.listItemsData,
      scrollTop: 0,
      isScrolling: false,
    };
  }

  public render() {
    const visibleItems = this.getVisibleItems();
    return (
      <Container>
        <ListContainer innerRef={this.onRef} className={this.props.containerClass}>
          <ListBody height={this.props.listItemsData.length * this.props.listItemHeight} width={'100%'} />
        </ListContainer>
        <List
          isScrolling={this.state.isScrolling}
          innerRef={(r: HTMLDivElement) => this.listItemsContainerRef = r}
          className={this.props.listItemsContainerClass}>
            {visibleItems.map((listItemData, i) => {
              const searchIncludes = listItemData.searchIncludes || this.props.searchValue === '';
              return this.props.renderListItem(listItemData, searchIncludes, true, i);
            })}
        </List>
      </Container>
    );
  }

  public componentDidMount() {
    this.scrollRef.addEventListener('scroll', this.setScrollTop);
    this.listItemsContainerRef.addEventListener('wheel', this.onScrollStart);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.visible !== prevProps.visible) {
      this.setScrollTop();
    }

    if (this.props.searchValue !== prevProps.searchValue || !_.isEqual(this.props.listItemsData, prevProps.listItemsData) {
      this.handleDataChange();
    }
  }

  public componentWillUnmount() {
    this.scrollRef.removeEventListener('scroll', this.setScrollTop);
    this.listItemsContainerRef.removeEventListener('wheel', this.onScrollStart);
  }

  private onRef = (r: HTMLDivElement) => {
    this.scrollRef = r;

    if (this.props.getRef) {
      this.props.getRef(r);
    }
  }

  private onScrollStart = () => {
    if (!this.state.isScrolling) {
      this.setState({ isScrolling: true });
    }
  }

  private onScrollEnd = () => {
    if (this.state.isScrolling) {
      this.setState({ isScrolling: false });
    }
  }

  private setScrollTop = (e?: any) => {
    const scrollTop = e ? e.target.scrollTop : this.scrollRef.scrollTop;

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.setState({ scrollTop });

    this.scrollTimeout = setTimeout(() => {
      this.onScrollEnd();
    }, 5);
  }

  private handleDataChange = () => {
    if (this.props.searchValue === '') {
      this.setState({ listItemsData: this.props.listItemsData });
    }

    const listItemsData = [...this.props.listItemsData];
    const itemsThatMatchSearch: any[] = [];
    const filteredListItems = listItemsData.filter((listItem) => {
      const searchIncludes = utils.doesSearchInclude(this.props.searchValue, listItem[this.props.searchKey]);
      if (searchIncludes) {
        itemsThatMatchSearch.push({ ...listItem, searchIncludes });
        return false;
      } else {
        return true;
      }
    });

    this.setState({ listItemsData: [...itemsThatMatchSearch, ...filteredListItems] });
  }

  private getVisibleItems = () => {
    const { extraItemsRendered, listItemHeight, listHeight } = this.props;
    const howManyItemsFit =
      Math.ceil((listHeight || this.scrollRef ? this.scrollRef.clientHeight : 2160) / listItemHeight) +
      (extraItemsRendered || 0);
    const startingIndex = Math.floor(this.state.scrollTop / listItemHeight);

    const visibleItems = [];
    for (let i = startingIndex; i < startingIndex + howManyItemsFit; i++) {
      if (this.state.listItemsData[i]) {
        visibleItems.push(this.state.listItemsData[i]);
      }
    }

    return visibleItems;
  }
}

export default SearchableList;
