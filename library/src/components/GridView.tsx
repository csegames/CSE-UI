/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-17 10:27:36
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-17 17:31:22
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { merge, clone, cloneDeep } from 'lodash';
import Flyout from './Flyout';
import RaisedButton from './RaisedButton';

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
  key: string;
  title: string;
  style?: React.CSSProperties;
  sortable?: boolean;
  sortFunction?: <T>(a: T, b: T) => number;
  renderItem?: <T>(item: T) => JSX.Element;
}


export enum GridViewSort {
  None,
  Up,
  Down
}

export interface ExtendedColumnDefinition extends ColumnDefinition {
  sorted: GridViewSort;
}

export interface GridViewProps {
  items: any[];
  columnDefinitions: ColumnDefinition[],
  itemsPerPage?: number;
  styles?: Partial<GridViewStyle>;
  rowMenu?: () => JSX.Element;
  rowMenuStyle?: React.CSSProperties;
}

export interface GridViewState {
  columnDefinitions: {
    [id: string]: ExtendedColumnDefinition
  }
  items: any[];
  itemsPerPage: number;
  sortedItems: any[];
  page: number;
}

export class GridView extends React.Component<GridViewProps, GridViewState> {
  constructor(props: GridViewProps) {
    super(props);
    
    const items = cloneDeep(props.items);
    const columnDefinitions = this.mapColumnDefinitions(props.columnDefinitions);
    this.state = {
      columnDefinitions,
      items,
      itemsPerPage: props.itemsPerPage || 25,
      sortedItems: items,
      page: 0,
    };
  }

  componentWillReceiveProps = (nextProps: GridViewProps) => {
    let items = cloneDeep(nextProps.items);
    const columnDefinitions = this.mapColumnDefinitions(nextProps.columnDefinitions);

    nextProps.columnDefinitions.forEach(def => {
      items = GridView.sortItems(items, columnDefinitions[def.key]);
    });

    this.setState({
      columnDefinitions,
      items,
      itemsPerPage: this.props.itemsPerPage || 25,
      sortedItems: items,
    });
  }

  mapColumnDefinitions = (input: ColumnDefinition[]) => {
    const map: any = {};
    input.forEach(def => map[def.key] = {...def, sorted: this.state ? this.state.columnDefinitions[def.key].sorted || GridViewSort.None : GridViewSort.None});
    return map;
  }

  static sortItems(input: any[], sortBy: ExtendedColumnDefinition) {
    if (sortBy.sorted === GridViewSort.None) return input;
    if (sortBy.sortFunction) {
      return input.sort((a, b) => sortBy.sorted == GridViewSort.Down ? sortBy.sortFunction(a, b) : (sortBy.sortFunction(a, b) * -1))
    }
    return sortBy.sorted == GridViewSort.Down ? input.sort() : input.sort().reverse();
  }

  setSort = (key: string, sortBy: GridViewSort) => {
    const def = clone(this.state.columnDefinitions[key]);
    def.sorted = sortBy;
    const sortedItems = GridView.sortItems(this.state.sortedItems, def);
    this.setState({
      columnDefinitions: {...this.state.columnDefinitions, [key]: def},
      sortedItems,
    });
  }

  goToPage = (page: number) => {
    this.setState({
      page,
    });
  }

  /*
   * RENDERING
   */

  renderHeaderItems = (ss: GridViewStyle, custom: Partial<GridViewStyle>) => {
    return this.props.columnDefinitions.map(pdef => {
      const def = this.state.columnDefinitions[pdef.key];
      return (
        <div key={def.key}  className={def.sortable
                        ? css(ss.headerItem, custom.headerItem, ss.sortableHeaderItem, custom.sortableHeaderItem)
                        : css(ss.headerItem, custom.headerItem)}
             style={def.style}
             onClick={def.sortable ? () => {
               switch(def.sorted) {
                 case GridViewSort.None: this.setSort(def.key, GridViewSort.Up); return;
                 case GridViewSort.Down: this.setSort(def.key, GridViewSort.Up); return;
                 case GridViewSort.Up: this.setSort(def.key, GridViewSort.Down); return;
               }
             }: null}>
          {def.title}&nbsp;
          { 
            def.sorted === GridViewSort.None ? null :
            <i className={`fa fa-caret-${def.sorted == GridViewSort.Up ? 'up' : 'down'}`}></i>
          }
        </div>
      )
    });
  }

  renderRow = (item: any, rowKey: number, ss: GridViewStyle, custom: Partial<GridViewStyle>) => {

    const items: JSX.Element[] = [];
    this.props.columnDefinitions.forEach(pdef => {
      const def = this.state.columnDefinitions[pdef.key];

      if (def.renderItem) {
        items.push(
          (
            <span key={def.key}
                  className={css(ss.gridItem, custom.gridItem)}
                  style={def.style}>
              {def.renderItem(item)}
            </span>
          ));
        return;
      }

      items.push(
        (
          <span key={def.key}
                className={css(ss.gridItem, custom.gridItem)}
                style={def.style}>
            {item[def.key]}
          </span>
        ));
    });

    if (this.props.rowMenu) {
      items.push(
        (
          <span key={'menu'} className={css(ss.rowMenu, custom.rowMenu)}>
            <Flyout
              content={this.props.rowMenu}
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
    var startIndex = this.state.page * this.state.itemsPerPage;
    const rows: JSX.Element[] = [];

    for (let index = startIndex;
         (index - startIndex) < this.state.itemsPerPage
         && index < this.state.sortedItems.length;
         ++index) {
      rows.push(this.renderRow(this.state.sortedItems[index], index, ss, custom));
    }

    return (
      <div className={css(ss.grid, custom.grid)}>
        {rows}
      </div>
    )
  }

  renderPagination = (ss: GridViewStyle, custom: Partial<GridViewStyle>) => {
    var pageCount = Math.ceil(this.state.items.length / this.state.itemsPerPage);
    if (pageCount <= 1) {
      return null;
    }

    const pages: JSX.Element[] = [];

    // back to 0 button
    pages.push(
      (
        <RaisedButton key={'back-full'} disabled={this.state.page < 1}
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
        <RaisedButton key={'back-one'} disabled={this.state.page < 1}
                      onClick={() => this.goToPage(this.state.page-1)}
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
    let start = this.state.page - 2;
    if (start < 0) start = 0;
    let end = this.state.page + 3;
    if (end > pageCount) end = pageCount;

    for (let i = start; i < end; ++i) {
      // render current page as disabled
      if (i == this.state.page) {
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
        <RaisedButton key={'forward-one'} disabled={this.state.page > pageCount-2}
                      onClick={() => this.goToPage(this.state.page+1)}
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
        <RaisedButton key={'forward-full'} disabled={this.state.page > pageCount-2}
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

export default GridView;
