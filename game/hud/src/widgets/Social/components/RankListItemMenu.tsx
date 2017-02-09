/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-22 19:12:59
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-23 11:18:47
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { webAPI, client, ql, FloatSpinner } from 'camelot-unchained';

export interface RankListItemMenuStyle extends StyleDeclaration {
  list: React.CSSProperties;
  listItem: React.CSSProperties;
}

export const defaultRankListItemMenuStyle: RankListItemMenuStyle = {
  list: {
    listStyle: 'none',
    margin: '0',
    userSelect: 'none',
  },

  listItem: {
    padding: '5px 10px',
    position: 'relative',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
};

export interface RankListItemMenuProps {
  groupId: string;
  rank: ql.CustomRank;
  close: () => void;
  refetch: () => void;
  styles?: Partial<RankListItemMenuStyle>;
}

export interface RankListItemMenuState {
  deleting: boolean;
  deleteError: string;
}

class RankListItemMenu<T> extends React.Component<RankListItemMenuProps, RankListItemMenuState> {
  constructor(props: RankListItemMenuProps) {
    super(props);
    this.state = {
      deleting: false,
      deleteError: null,
    };
  }

  doDelete = () => {
    this.setState({
      deleting: true,
      deleteError: null,
    });

    webAPI.GroupsAPI.removeRankV1(client.shardID, client.characterID, this.props.groupId, this.props.rank.name)
      .then(result => {
        if (result.ok) {
          this.setState({
            deleting: false,
          });
          this.props.refetch();
          this.props.close();
        }
        this.setState({
          deleting: false,
          deleteError: result.data,
        });
      });
  }

  render() {
    const ss = StyleSheet.create(defaultRankListItemMenuStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <ul className={css(ss.list, custom.list)}>
        <li className={css(ss.listItem, custom.listItem)}
            onClick={this.doDelete}>
            Delete {this.state.deleting ? <FloatSpinner styles={{spinner: { position: 'absolute' }}} /> : null}
        </li>
      </ul>
    )
  }
}

export default RankListItemMenu;
