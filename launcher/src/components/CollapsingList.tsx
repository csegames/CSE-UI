/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';

const Root = 'CollapsingList-Root';
const Title = 'CollapsingList-Title';
const CollapseButton = 'CollapsingList-CollapseButton';
const ListItem = 'CollapsingList-ListItem';
const Body = 'CollapsingList-Body';

export interface CollapsingListStyle {
  container: string;
  title: string;
  collapsedTitle: string;
  collapseButton: string;
  body: string;
  listContainer: string;
  listFooter: string;
  listItem: string;
}

interface ReactProps {
  // Defaults to false (Not collapsed)
  styles?: Partial<CollapsingListStyle>;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  renderListItem?: (listItem: any, index: number) => JSX.Element;
  renderListFooter?: () => JSX.Element;
  renderListHeader?: () => JSX.Element;
  animationStyle?: (collapsed: boolean) => React.CSSProperties;

  title: string | ((collapsed: boolean) => JSX.Element);
  items: any[];
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

interface State {
  collapsed: boolean;
}

class ACollapsingList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: props.defaultCollapsed || false
    };
  }

  public render() {
    const collapsed = typeof this.props.collapsed === 'boolean' ? this.props.collapsed : this.state.collapsed;
    const animationStyle = this.props.animationStyle && this.props.animationStyle(collapsed);
    const customStyle = this.props.styles || {};
    return (
      <div className={`${Root} ${customStyle.container}`}>
        <div>
          {typeof this.props.title === 'string' ? (
            <div
              className={`${Title} ${customStyle.title} ${collapsed ? customStyle.collapsedTitle : ''}`}
              onClick={this.onToggleCollapse.bind(this)}
            >
              <div className={`${CollapseButton} ${customStyle.collapseButton}`}>{collapsed ? '+' : '-'}</div>
              {this.props.title}
            </div>
          ) : (
            <div
              className={`${Title} ${customStyle.title} ${collapsed ? customStyle.collapsedTitle : ''}`}
              onClick={this.onToggleCollapse.bind(this)}
            >
              {this.props.title(collapsed)}
            </div>
          )}
        </div>
        <div
          className={`${Body} ${customStyle.body} ${collapsed && !animationStyle ? 'collapsed' : ''}`}
          style={animationStyle}
        >
          {this.props.renderListHeader && <div>{this.props.renderListHeader()}</div>}
          <div className={customStyle.listContainer}>
            {this.props.items.map((item, i) => {
              if (!this.props.renderListItem) {
                if (typeof item === 'string') {
                  return (
                    <div className={ListItem} key={i}>
                      {item}
                    </div>
                  );
                }

                return (
                  <div className={`${ListItem} ${customStyle.listItem}`} key={i}>
                    {Object.keys(item).map((key) => (
                      <div key={key}>{item[key]}</div>
                    ))}
                  </div>
                );
              }
              return this.props.renderListItem(item, i);
            })}
          </div>
          {this.props.renderListFooter && <div className={customStyle.listFooter}>{this.props.renderListFooter()}</div>}
        </div>
      </div>
    );
  }

  private onToggleCollapse() {
    if (typeof this.props.collapsed !== 'boolean') {
      this.setState((state, props) => {
        if (state.collapsed) {
          // Show
          if (this.props.onToggleCollapse) {
            this.props.onToggleCollapse(false);
          }
          return {
            collapsed: false
          };
        }
        // Hide
        if (this.props.onToggleCollapse) {
          this.props.onToggleCollapse(true);
        }
        return {
          collapsed: true
        };
      });
    } else if (this.props.onToggleCollapse) {
      this.props.onToggleCollapse(!this.props.collapsed);
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const CollapsingList = connect(mapStateToProps)(ACollapsingList);
