/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface CollapsingListStyle extends StyleDeclaration {
  CollapsingList: React.CSSProperties;
  title: React.CSSProperties;
  collapseButton: React.CSSProperties;
  body: React.CSSProperties;
  listContainer: React.CSSProperties;
  listFooter: React.CSSProperties;
  listItem: React.CSSProperties;
}

export const defaultCollapsingListStyle: CollapsingListStyle = {
  CollapsingList: {
    height: '100%',
    webkitUserSelect: 'none',
    userSelect: 'none',
    pointerEvents: 'all',
    color: 'white',
  },

  title: {
    cursor: 'pointer',
  },

  collapseButton: {
    display: 'inline-block',
    color: 'white',
    width: '15px',
  },
  
  body: {

  },

  listContainer: {
    
  },

  listFooter: {

  },

  listItem: {
    display: 'flex',
    alignItems: 'center',    
    marginLeft: '10px',
  },
};

export interface CollapsingListProps {
  styles?: Partial<CollapsingListStyle>;

  // Defaults to false (Not collapsed)
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  renderListItem?: (listItem: any, index: number) => JSX.Element;
  renderListFooter?: () => JSX.Element;
  renderListHeader?: () => JSX.Element;

  animationClass?: (collapsed: boolean) => { anim: {[id: string]: any}};
  
  title: string | ((collapsed: boolean) => JSX.Element);
  items: any[];
}

export interface CollapsingListState {
  collapsed: boolean;
}

export class CollapsingList extends React.Component<CollapsingListProps, CollapsingListState> {
  constructor(props: CollapsingListProps) {
    super(props);
    this.state = {
      collapsed: props.defaultCollapsed || false,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultCollapsingListStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const animationClass = this.props.animationClass && StyleSheet.create(this.props.animationClass(this.props.collapsed));
    const collapsed = typeof(this.props.collapsed) === 'boolean' ? this.props.collapsed : this.state.collapsed;
    return (
      <div className={css(ss.CollapsingList, custom.CollapsingList)}>
        <div className={css(ss.titleContainer, custom.titleContainer)}>
          {typeof this.props.title === 'string' ?
            <span className={css(ss.title, custom.title)} onClick={this.onToggleCollapse}>
              <div className={css(ss.collapseButton, custom.collapseButton)}>{this.props.collapsed ? '+' : '-'}</div>
              {this.props.title}
            </span> :
              <span className={css(ss.title, custom.title)} onClick={this.onToggleCollapse}>
                {this.props.title(this.props.collapsed)}
              </span>
          }
        </div>
        <div className={css(ss.body, custom.body, animationClass && animationClass.anim)}
          style={!animationClass ? (this.props.collapsed ? { display: 'none' } : {}) : {}}>
          {this.props.renderListHeader &&
            <div className={css(ss.listHeader, custom.listHeader)}>{this.props.renderListHeader()}</div>
          }
          <div className={css(ss.listContainer, custom.listContainer)}>
            {this.props.items.map((item, i) => {
              if (!this.props.renderListItem) {
                if (typeof item === 'string') {
                  return <div key={i} className={css(ss.listItem, custom.listItem)}>{item}</div>;
                }

                return (
                  <div key={i} className={css(ss.listItem, custom.listItem)}>
                    {Object.keys(item).map(key => <div key={key}>{item[key]}</div>)}
                  </div>
                );
              }
              return this.props.renderListItem(item, i);
            })}
          </div>
          {this.props.renderListFooter &&
            <div className={css(ss.listFooter, custom.listFooter)}>{this.props.renderListFooter()}</div>
          }
        </div>
      </div>
    );
  }

  private onToggleCollapse = () => {
    console.log(typeof(this.props.collapsed));
    if (typeof(this.props.collapsed) !== "boolean") {
      this.setState((state, props) => {
        if (state.collapsed) {
          // Show
          if (this.props.onToggleCollapse) this.props.onToggleCollapse(false);
          return {
            collapsed: false,
          };
        }
        // Hide
        if (this.props.onToggleCollapse) this.props.onToggleCollapse(true);
        return {
          collapsed: true,
        };
      });
    } else if (this.props.onToggleCollapse) {
      this.props.onToggleCollapse(!this.props.collapsed);
    }
  }
}

export default CollapsingList;

