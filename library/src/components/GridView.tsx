/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-17 10:27:36
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-27 11:59:47
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { merge, clone, cloneDeep } from 'lodash';
import Flyout from './Flyout';
import RaisedButton from './RaisedButton';
import { ql } from '..';

export interface GridViewStyle extends StyleDeclaration {
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

export const defaultGridViewStyle: GridViewStyle = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  header: {
    display: 'flex',
    color: '#777',
    fontWeight: 'bold',
    minHeight: '2em',
    padding: '5px',
  },

  headerItem: {
    userSelect: 'none',
    cursor: 'default',
    flex: '1 1 auto',
    margin: '0 5px',
  },

  sortableHeaderItem: {
    cursor: 'pointer',
  },

  grid: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflowY: 'auto',
    paddingTop: '10px',
  },

  gridItem: {
    flex: '1 1 auto',
    margin: '0 5px',
    minWidth: '0',
    display: 'flex',
  },

  row: {
    display: 'flex',
    flex: '0 0 auto',
    padding: '5px',
    ':nth-child(even)': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    }
  },

  rowMenu: {
    minWidth: '10px',
    maxWidth: '10px',
    width: '10px',
    cursor: 'pointer',
    flex: '0 0 auto',
  },

  pagination: {
    display: 'flex',
    alignSelf: 'center',
    flex: '0 0 auto',
    alignContent: 'center',
    justifyContent: 'center',
  },

  pageButton: {
    flex: '0 0 auto',
    fontSize: '.8em',
  },
};

export interface ColumnDefinition {
  key: <T>(a: T) => any;
  title: string;
  style?: React.CSSProperties;
  sortable?: boolean;
  viewPermission?: string;
  editPermission?: string;
  sortFunction?: <T>(a: T, b: T) => number;
  renderItem?: <T>(item: T, renderData?: { [id: string]: any }) => JSX.Element;
}


export enum GridViewSort {
  None,
  Up,
  Down
}

export interface SortInfo {
  index: number;
  sorted: GridViewSort;
}

export interface GridViewProps {
  items: any[];
  columnDefinitions: ColumnDefinition[];
  userPermissions?: ql.PermissionInfo[];
  itemsPerPage?: number;
  styles?: Partial<GridViewStyle>;
  rowMenu?: <T>(item: T, closeMenu: () => void) => JSX.Element;
  rowMenuStyle?: React.CSSProperties;
  renderData?: {
    [id: string]: any
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
      currentSort: { index: -1, sorted: GridViewSort.None },
      items,
      itemsPerPage: props.itemsPerPage || 25,
      sortedItems: items,
      page: 0,
    } as S;
  }

  componentWillReceiveProps = (nextProps: P) => {
    const items = cloneDeep(nextProps.items);
    this.setState({
      items,
      itemsPerPage: this.props.itemsPerPage || 25,
      sortedItems: items,
    } as S);
  }

  sortItems = (input: any[], column: ColumnDefinition, sorted: GridViewSort) => {
    if (sorted === GridViewSort.None) return input;
    if (column.sortFunction) {
      return input.sort((a, b) => sorted == GridViewSort.Down ? column.sortFunction(a, b) : (column.sortFunction(a, b) * -1))
    }
    return sorted == GridViewSort.Down ? input.sort() : input.sort().reverse();
  }

  setSort = (index: number, sortBy: GridViewSort) => {
    const currentSort = { index: index, sorted: sortBy };
    this.setState({
      currentSort: currentSort,
      sortedItems: this.sortItems(
        this.state.sortedItems,
        this.props.columnDefinitions[index],
        currentSort.sorted
      )
    } as S);
  }

  /*
   * PAGING interface
   */

  getItemCount = () : number => {
    return (this.state as S).items.length;
  }

  getItemsPerPage = () : number => {
    return (this.state as S).itemsPerPage;
  }

  getCurrentPage = () : number => {
    return (this.state as S).page;
  }

  goToPage = (page: number) => {
    this.setState({
      page,
    } as S);
  }

  /*
   * RENDERING
   */

  renderHeaderItems = (ss: GridViewStyle, custom: Partial<GridViewStyle>) => {
    const headerItems: JSX.Element[] = [];
    this.props.columnDefinitions.forEach((pdef, index) => {
      const def = this.props.columnDefinitions[index];
      const sorted = index === this.state.currentSort.index
                  ? this.state.currentSort.sorted : GridViewSort.None;

      if (def.viewPermission && ql.hasPermission(this.props.userPermissions, def.viewPermission) == false) return;

      headerItems.push((
        <div key={index}  className={def.sortable
                        ? css(ss.headerItem, custom.headerItem, ss.sortableHeaderItem, custom.sortableHeaderItem)
                        : css(ss.headerItem, custom.headerItem)}
             style={def.style}
             onClick={def.sortable ? () => {
               switch(sorted) {
                 case GridViewSort.None: case GridViewSort.Down:
                  this.setSort(index, GridViewSort.Up);
                  return;
                 case GridViewSort.Up:
                  this.setSort(index, GridViewSort.Down);
                  return;
               }
             }: null}>
          {def.title}&nbsp;
          {
            sorted === GridViewSort.None ? null :
            <i className={`fa fa-caret-${sorted == GridViewSort.Up ? 'up' : 'down'}`}></i>
          }
        </div>
      ));
    });
    return headerItems;
  }

  renderRow = (item: any, rowKey: number, ss: GridViewStyle, custom: Partial<GridViewStyle>) => {

    const items: JSX.Element[] = [];
    this.props.columnDefinitions.forEach((pdef, index) => {
      const def = this.props.columnDefinitions[index];

      if (def.viewPermission && ql.hasPermission(this.props.userPermissions, def.viewPermission) == false) return;

      if (def.renderItem) {
        items.push(
          (
            <span key={index}
                  className={css(ss.gridItem, custom.gridItem)}
                  style={def.style}>
              {def.renderItem(item, this.props.renderData)}
            </span>
          ));
        return;
      }

      items.push(
        (
          <span key={index}
                className={css(ss.gridItem, custom.gridItem)}
                style={def.style}>
            {def.key(item)}
          </span>
        ));
    });

    if (this.props.rowMenu) {
      items.push(
        (
          <span key={'menu'} className={css(ss.rowMenu, custom.rowMenu)}>
            <Flyout
              content={(props: any) => this.props.rowMenu(item, props.close)}
              style={this.props.rowMenuStyle}>
              <i className='fa fa-ellipsis-v click-effect'></i>
            </Flyout>
          </span>
        )
      );
    }


    return (
      <div key={rowKey} className={css(ss.row, custom.row)}>
        {items}
      </div>
    )
  }

  renderGrid = (ss: GridViewStyle, custom: Partial<GridViewStyle>) => {
    const state = this.state as S;
    const startIndex = state.page * state.itemsPerPage;
    const rows: JSX.Element[] = [];

    for (let index = startIndex;
         (index - startIndex) < state.itemsPerPage
         && index < state.sortedItems.length;
         ++index) {
      rows.push(this.renderRow(state.sortedItems[index], index, ss, custom));
    }

    return (
      <div className={css(ss.grid, custom.grid)}>
        {rows}
      </div>
    )
  }

  renderPagination = (ss: GridViewStyle, custom: Partial<GridViewStyle>) => {
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
          <div className={css(ss.pageButton, custom.pageButton)}>
            <i className='fa fa-backward'></i>
          </div>
        </RaisedButton>
      )
    );

    // back a single page button
    pages.push(
      (
        <RaisedButton key={'back-one'} disabled={page < 1}
                      onClick={() => this.goToPage(page-1)}
                      styles={{
                        button: {
                          margin: '5px',
                        },
                        buttonDisabled: {
                          margin: '5px',
                        },
                      }}>
          <div className={css(ss.pageButton, custom.pageButton)}>
            <i className='fa fa-step-backward'></i>
          </div>
        </RaisedButton>
      )
    );

    // insert page numbers
    let start = page - 2;
    if (start < 0) start = 0;
    let end = page + 3;
    if (end > pageCount) end = pageCount;

    for (let i = start; i < end; ++i) {
      // render current page as disabled
      if (i == page) {
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
              <div className={css(ss.pageButton, custom.pageButton)}>
                {i + 1}
              </div>
            </RaisedButton>
          )
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
            <div className={css(ss.pageButton, custom.pageButton)}>
              {i + 1}
            </div>
          </RaisedButton>
        )
      );
    }

    // forward one page button
    pages.push(
      (
        <RaisedButton key={'forward-one'} disabled={page > pageCount-2}
                      onClick={() => this.goToPage(page+1)}
                      styles={{
                        button: {
                          margin: '5px',
                        },
                        buttonDisabled: {
                          margin: '5px',
                        },
                      }}>
          <div className={css(ss.pageButton, custom.pageButton)}>
            <i className='fa fa-step-forward'></i>
          </div>
        </RaisedButton>
      )
    );

    // go to last page button
    pages.push(
      (
        <RaisedButton key={'forward-full'} disabled={page > pageCount-2}
                      onClick={() => this.goToPage(pageCount-1)}
                      styles={{
                        button: {
                          margin: '5px',
                        },
                        buttonDisabled: {
                          margin: '5px',
                        },
                      }}>
          <div className={css(ss.pageButton, custom.pageButton)}>
            <i className='fa fa-forward'></i>
          </div>
        </RaisedButton>
      )
    );

    return (
      <div className={css(ss.pagination, custom.pagination)}>
        {pages}
      </div>
    )
  }

  render() {
    const ss = StyleSheet.create(defaultGridViewStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.container, custom.container)}>
        <div className={css(ss.header, custom.header)}>
          {this.renderHeaderItems(ss, custom)}
        </div>
        {this.renderGrid(ss, custom)}
        {this.renderPagination(ss, custom)}
      </div>
    );
  }
}

export class GridView extends GridViewImpl<GridViewProps, GridViewState> {
};
export default GridView;
