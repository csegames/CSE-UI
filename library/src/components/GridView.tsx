/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { merge, clone, cloneDeep } from 'lodash';
import styled, { css } from 'react-emotion';

import Flyout from './Flyout';
import RaisedButton from './RaisedButton';
import { ql } from '..';

const Container = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const Header = styled('div')`
  display: flex;
  color: #777;
  font-weight: bold;
  min-height: 2em;
  padding: 5px;
`;

const HeaderItem = styled('div')`
  user-select: none;
  cursor: default;
  flex: 1;
  margin: 0 5px;
`;

const SortableHeaderItem = css`
  cursor: pointer;
`;

const Grid = styled('div')`
  display: flex;
  flex: 1;
  flex-direction: column;
  flex-wrap: nowrap;
  overfloy-y: auto;
  padding-top: 10px;
`;

const GridItem = styled('span')`
  flex: 1;
  margin: 0 5px;
  min-width: 0;
  display: flex;
`;

const Row = styled('div')`
  display: flex;
  flex: 0;
  padding: 5px;
  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const RowMenu = styled('span')`
  min-width: 10px;
  max-width: 10px;
  width: 10px;
  cursor: pointer;
  flex: 0;
`;

const Pagination = styled('div')`
  display: flex;
  align-self: center;
  flex: 0;
  align-content: center;
  justify-content: center;
`;

const PageButton = styled('div')`
  flex: 0;
  font-size: 0.8em;
`;

export interface GridViewStyle {
  container: React.CSSProperties;
  header: React.CSSProperties;
  headerItem: React.CSSProperties;
  sortableHeaderItem: React.CSSProperties;
  grid: React.CSSProperties;
  gridItem: React.CSSProperties;
  row: React.CSSProperties;
  rowMenu: React.CSSProperties;
  pagination: React.CSSProperties;
  pageButton: React.CSSProperties;
}

export interface SortFunc<T> {
  (a: T, b: T): number;
}

export interface ColumnDefinition {
  key: (item: any) => any;
  title: string;
  style?: React.CSSProperties;
  sortable?: boolean;
  viewPermission?: string;
  editPermission?: string;
  sortFunction?: SortFunc<any>;
  renderItem?: (item: any, renderData?: { [id: string]: any }) => JSX.Element;
}


export enum GridViewSort {
  None,
  Up,
  Down,
}

export interface SortInfo {
  index: number;
  sorted: GridViewSort;
}

export interface RowMenuFunc<T extends {}> {
  (item: T, closeMenu: () => void): JSX.Element;
}

export interface GridViewProps {
  items: any[];
  columnDefinitions: ColumnDefinition[];
  userPermissions?: ql.PermissionInfo[];
  itemsPerPage?: number;
  styles?: Partial<GridViewStyle>;
  rowMenu?: RowMenuFunc<any>;
  rowMenuStyle?: React.CSSProperties;
  renderData?: {
    [id: string]: any,
  };
}

export interface GridViewState {
  currentSort: SortInfo;
  items: any[];
  itemsPerPage: number;
  sortedItems: any[];
  page: number;
}

export class GridViewImpl<P extends GridViewProps, S extends GridViewState> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);

    const items = cloneDeep(props.items);
    this.state = {
      items,
      currentSort: { index: -1, sorted: GridViewSort.None },
      itemsPerPage: props.itemsPerPage || 25,
      sortedItems: items,
      page: 0,
    } as S;
  }

  public render() {
    const customStyles = this.props.styles || {};
    return (
      <Container style={customStyles.container}>
        <Header style={customStyles.header}>
          {this.renderHeaderItems(customStyles)}
        </Header>
        {this.renderGrid(customStyles)}
        {this.renderPagination(customStyles)}
      </Container>
    );
  }

  public sortItems = (input: any[], column: ColumnDefinition, sorted: GridViewSort) => {
    if (sorted === GridViewSort.None) return input;
    if (!column.sortFunction) {
      column.sortFunction = (a: any, b: any) => column.key(a) < column.key(b) ? 1 : -1;
    }
    return input.sort((a, b) => sorted === GridViewSort.Down ?
      column.sortFunction(a, b) : (column.sortFunction(a, b) * -1));
  }

  public setSort = (index: number, sortBy: GridViewSort) => {
    const currentSort = { index, sorted: sortBy };
    this.setState({
      currentSort,
      sortedItems: this.sortItems(
        this.state.sortedItems,
        this.props.columnDefinitions[index],
        currentSort.sorted,
      ),
    } as S);
  }

  /*
   * PAGING interface
   */

  public getItemCount = (): number => {
    return (this.state as S).items.length;
  }

  public getItemsPerPage = (): number => {
    return (this.state as S).itemsPerPage;
  }

  public getCurrentPage = (): number => {
    return (this.state as S).page;
  }

  public goToPage = (page: number) => {
    this.setState({
      page,
    } as S);
  }

  public componentWillReceiveProps(nextProps: P) {
    const items = cloneDeep(nextProps.items);
    const sortedItems = this.sortItems(
      items,
      this.props.columnDefinitions[this.state.currentSort.index],
      this.state.currentSort.sorted,
    );
    this.setState({
      items,
      sortedItems,
      itemsPerPage: this.props.itemsPerPage || 25,
    } as S);
  }

  /*
   * RENDERING
   */

  private renderHeaderItems = (customStyles: Partial<GridViewStyle>) => {
    const headerItems: JSX.Element[] = [];
    this.props.columnDefinitions.forEach((pdef, index) => {
      const def = this.props.columnDefinitions[index];
      const sorted = index === this.state.currentSort.index
        ? this.state.currentSort.sorted : GridViewSort.None;

      // if (def.viewPermission && ql.hasPermission(this.props.userPermissions, def.viewPermission) === false) return;

      headerItems.push((
        <HeaderItem
          key={index}
          className={def.sortable ? SortableHeaderItem : ''}
          style={def.style}
          onClick={def.sortable ? () => {
            switch (sorted) {
              case GridViewSort.None:
              case GridViewSort.Down:
                this.setSort(index, GridViewSort.Up);
                return;
              case GridViewSort.Up:
                this.setSort(index, GridViewSort.Down);
                return;
            }
          } : null}>
          {def.title}&nbsp;
          {
            sorted === GridViewSort.None ? null :
              <i className={`fa fa-caret-${sorted === GridViewSort.Up ? 'up' : 'down'}`}></i>
          }
        </HeaderItem>
      ));
    });
    return headerItems;
  }

  private renderRow = (item: any, rowKey: number, customStyles: Partial<GridViewStyle>) => {

    const items: JSX.Element[] = [];
    this.props.columnDefinitions.forEach((pdef, index) => {
      const def = this.props.columnDefinitions[index];

      // if (def.viewPermission && ql.hasPermission(this.props.userPermissions, def.viewPermission) === false) return;

      if (def.renderItem) {
        items.push(
          (
            <GridItem
              key={index}
              style={{ ...customStyles.gridItem,...def.style }}>
                {def.renderItem(item, this.props.renderData)}
            </GridItem>
          ));
        return;
      }

      items.push(
        (
          <GridItem
            key={index}
            style={{ ...customStyles.gridItem, ...def.style }}>
              {def.key(item)}
          </GridItem>
        ));
    });

    if (this.props.rowMenu) {
      items.push(
        (
          <RowMenu key={'menu'} style={customStyles.rowMenu}>
            <Flyout
              content={(props: any) => this.props.rowMenu(item, props.close)}
              style={this.props.rowMenuStyle}>
              <i className='fa fa-ellipsis-v click-effect'></i>
            </Flyout>
          </RowMenu>
        ),
      );
    }


    return (
      <Row key={rowKey} style={customStyles.row}>{items}</Row>
    );
  }

  private renderGrid = (customStyles: Partial<GridViewStyle>) => {
    const state = this.state as S;
    const startIndex = state.page * state.itemsPerPage;
    const rows: JSX.Element[] = [];

    for (let index = startIndex;
        (index - startIndex) < state.itemsPerPage && index < state.sortedItems.length;
        ++index) {
      rows.push(this.renderRow(state.sortedItems[index], index, customStyles));
    }

    return (
      <Grid style={customStyles.grid}>
        {rows}
      </Grid>
    );
  }

  private renderPagination = (customStyles: Partial<GridViewStyle>) => {
    const state = this.state as S;
    const itemCount = this.getItemCount();
    const itemsPerPage = this.getItemsPerPage();
    const page = this.getCurrentPage();
    const pageCount = Math.ceil(itemCount / itemsPerPage);

    if (pageCount <= 1) {
      return null;
    }

    const pages: JSX.Element[] = [];

    // back to 0 button
    pages.push(
      (
        <RaisedButton key={'back-full'} disabled={page < 1}
                      onClick={() => this.goToPage(0)}
                      styles={{
                        button: {
                          margin: '5px',
                        },
                        buttonDisabled: {
                          margin: '5px',
                        },
                      }}>
          <PageButton style={customStyles.pageButton}>
            <i className='fa fa-backward'></i>
          </PageButton>
        </RaisedButton>
      ),
    );

    // back a single page button
    pages.push(
      (
        <RaisedButton key={'back-one'} disabled={page < 1}
                      onClick={() => this.goToPage(page - 1)}
                      styles={{
                        button: {
                          margin: '5px',
                        },
                        buttonDisabled: {
                          margin: '5px',
                        },
                      }}>
          <PageButton style={customStyles.pageButton}>
            <i className='fa fa-step-backward'></i>
          </PageButton>
        </RaisedButton>
      ),
    );

    // insert page numbers
    let start = page - 2;
    if (start < 0) start = 0;
    let end = page + 3;
    if (end > pageCount) end = pageCount;

    for (let i = start; i < end; ++i) {
      // render current page as disabled
      if (i === page) {
        pages.push(
          (
            <RaisedButton key={i} disabled={true}
                          styles={{
                            button: {
                              margin: '5px',
                            },
                            buttonDisabled: {
                              margin: '5px',
                            },
                          }}>
              <PageButton style={customStyles.pageButton}>
                {i + 1}
              </PageButton>
            </RaisedButton>
          ),
        );
        continue;
      }
      pages.push(
        (
          <RaisedButton key={i} onClick={() => this.goToPage(i)}
                        styles={{
                          button: {
                            margin: '5px',
                          },
                          buttonDisabled: {
                            margin: '5px',
                          },
                        }}>
            <PageButton style={customStyles.pageButton}>
              {i + 1}
            </PageButton>
          </RaisedButton>
        ),
      );
    }

    // forward one page button
    pages.push(
      (
        <RaisedButton key={'forward-one'} disabled={page > pageCount - 2}
                      onClick={() => this.goToPage(page + 1)}
                      styles={{
                        button: {
                          margin: '5px',
                        },
                        buttonDisabled: {
                          margin: '5px',
                        },
                      }}>
          <PageButton style={customStyles.pageButton}>
            <i className='fa fa-step-forward'></i>
          </PageButton>
        </RaisedButton>
      ),
    );

    // go to last page button
    pages.push(
      (
        <RaisedButton key={'forward-full'} disabled={page > pageCount - 2}
                      onClick={() => this.goToPage(pageCount - 1)}
                      styles={{
                        button: {
                          margin: '5px',
                        },
                        buttonDisabled: {
                          margin: '5px',
                        },
                      }}>
          <PageButton style={customStyles.pageButton}>
            <i className='fa fa-forward'></i>
          </PageButton>
        </RaisedButton>
      ),
    );

    return (
      <Pagination style={customStyles.pagination}>{pages}</Pagination>
    );
  }
}

export class GridView extends GridViewImpl<GridViewProps, GridViewState> {
}

export default GridView;
