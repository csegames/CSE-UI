/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  height: 100%;
  -webkit-user-select: none;
  user-select: none;
  pointer-events: all;
  color: white;
`;


const Title = styled('span')`
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

export interface CollapsingListStyle {
  container: React.CSSProperties;
  title: React.CSSProperties;
  collapseButton: React.CSSProperties;
  body: React.CSSProperties;
  listContainer: React.CSSProperties;
  listFooter: React.CSSProperties;
  listItem: React.CSSProperties;
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
    const collapsed = typeof(this.props.collapsed) === 'boolean' ? this.props.collapsed : this.state.collapsed;
    const animationClass = this.props.animationClass && this.props.animationClass(collapsed);
    const customStyle = this.props.styles || {};
    return (
      <Container style={customStyle.container}>
        <div>
          {typeof this.props.title === 'string' ?
            <Title style={customStyle.title} onClick={this.onToggleCollapse}>
              <CollapseButton style={customStyle.collapseButton}>{collapsed ? '+' : '-'}</CollapseButton>
              {this.props.title}
            </Title> :
              <Title style={customStyle.title} onClick={this.onToggleCollapse}>
                {this.props.title(collapsed)}
              </Title>
          }
        </div>
        <div style={!animationClass ? (this.props.collapsed ? { display: 'none' } : {}) : {}}>
          {this.props.renderListHeader &&
            <div>{this.props.renderListHeader()}</div>
          }
          <div style={customStyle.listContainer}>
            {this.props.items.map((item, i) => {
              if (!this.props.renderListItem) {
                if (typeof item === 'string') {
                  return <ListItem key={i}>{item}</ListItem>;
                }

                return (
                  <ListItem key={i} style={customStyle.listItem}>
                    {Object.keys(item).map(key => <div key={key}>{item[key]}</div>)}
                  </ListItem>
                );
              }
              return this.props.renderListItem(item, i);
            })}
          </div>
          {this.props.renderListFooter &&
            <div style={customStyle.listFooter}>{this.props.renderListFooter()}</div>
          }
        </div>
      </Container>
    );
  }

  private onToggleCollapse = () => {
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

