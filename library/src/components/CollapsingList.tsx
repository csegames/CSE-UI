/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { cx, css } from 'react-emotion';

const Container = styled('div')`
  height: 100%;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: all;
  color: white;
`;

const Title = styled('div')`
  cursor: pointer;
`;

const CollapseButton = styled('div')`
  display: inline-block;
  color: white;
  width: 15px;
`;

const ListItem = styled('div')`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const Collapsed = css`
  display: none;
`;

export interface CollapsingListStyle {
  container: string;
  title: string;
  collapseButton: string;
  body: string;
  listContainer: string;
  listFooter: string;
  listItem: string;
}


export interface CollapsingListProps {
  // Defaults to false (Not collapsed)
  styles?: Partial<CollapsingListStyle>;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  renderListItem?: (listItem: any, index: number) => JSX.Element;
  renderListFooter?: () => JSX.Element;
  renderListHeader?: () => JSX.Element;

  animationClass?: (collapsed: boolean) => { anim: string};
  
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
    const collapsed = typeof this.props.collapsed === 'boolean' ? this.props.collapsed : this.state.collapsed;
    const animationClass = this.props.animationClass && this.props.animationClass(collapsed);
    const customStyle = this.props.styles || {};
    return (
      <Container className={customStyle.container}>
        <div>
          {typeof this.props.title === 'string' ?
            <Title className={customStyle.title} onClick={this.onToggleCollapse}>
              <CollapseButton className={customStyle.collapseButton}>{collapsed ? '+' : '-'}</CollapseButton>
              {this.props.title}
            </Title> :
              <Title className={customStyle.title} onClick={this.onToggleCollapse}>
                {this.props.title(collapsed)}
              </Title>
          }
        </div>
        <div className={!animationClass ? (collapsed ? cx(customStyle.body, Collapsed) : customStyle.body) :
            cx(customStyle.body, animationClass.anim)}>
          {this.props.renderListHeader &&
            <div>{this.props.renderListHeader()}</div>
          }
          <div className={customStyle.listContainer}>
            {this.props.items.map((item, i) => {
              if (!this.props.renderListItem) {
                if (typeof item === 'string') {
                  return <ListItem key={i}>{item}</ListItem>;
                }

                return (
                  <ListItem key={i} className={customStyle.listItem}>
                    {Object.keys(item).map(key => <div key={key}>{item[key]}</div>)}
                  </ListItem>
                );
              }
              return this.props.renderListItem(item, i);
            })}
          </div>
          {this.props.renderListFooter &&
            <div className={customStyle.listFooter}>{this.props.renderListFooter()}</div>
          }
        </div>
      </Container>
    );
  }

  private onToggleCollapse = () => {
    if (typeof(this.props.collapsed) !== 'boolean') {
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

