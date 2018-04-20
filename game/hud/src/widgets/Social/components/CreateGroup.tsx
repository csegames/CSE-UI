/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import {
  Input,
  RaisedButton,
  // webAPI,
  // client,
  Spinner,
} from '@csegames/camelot-unchained';

import GroupTitle from './GroupTitle';
import { SocialCategory } from '../services/session/nav/navTypes';
// import { selectLink } from '../services/session/navigation';

export interface CreateGroupStyle extends StyleDeclaration {
  container: React.CSSProperties;
  content: React.CSSProperties;
  message: React.CSSProperties;
  error: React.CSSProperties;
  create: React.CSSProperties;
}

export const defaultCreateGroupStyle: CreateGroupStyle = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },

  content: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },

  message: {
    fontSize: '2.5em',
    flex: '0 0 auto',
  },

  error: {
    flex: '0 0 auto',
    color: 'darkred',
  },

  create: {
    fontSize: '1.5em',
    flex: '0 0 auto',
  },
};

export interface CreateGroupProps {
  category: SocialCategory;
  refetch: () => void;
  dispatch: (action: any) => void;
  styles?: Partial<CreateGroupStyle>;
}

export interface CreateGroupState {
  creating: boolean;
  error: string;
}

export class CreateGroup extends React.Component<CreateGroupProps, CreateGroupState> {

  private inputRef: HTMLInputElement = null;

  constructor(props: CreateGroupProps) {
    super(props);
    this.state = {
      creating: false,
      error: null,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultCreateGroupStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.container, custom.container)}>
        <GroupTitle refetch={this.props.refetch}>
          Create Order
        </GroupTitle>
        <div className={css(ss.content, custom.content)}>
          <div className={css(ss.message, custom.message)}>Hey! You're not in an Order. Would you like to make one?</div>
          <div className={css(ss.create, custom.create)}>
            <div className={css(ss.error, custom.error)}>{this.state.error}</div>
            Enter a name:
            <Input type='text' inputRef={r => this.inputRef = r} />
            <RaisedButton onClick={this.create} disabled={this.state.creating}>
              { this.state.creating ? <Spinner /> :  <span>Create</span> }
            </RaisedButton>
          </div>
        </div>
      </div>
    );
  }

  private create = async () => {
    // if (this.inputRef == null) return;
    // await this.setState({ creating: true, error: null });

    // const name = this.inputRef.value;
    // const res = await webAPI.OrdersAPI.CreateV1(
    //   webAPI.defaultConfig,
    //   client.loginToken,
    //   client.shardID,
    //   client.characterID,
    //   name,
    // );
    // const data = JSON.parse(res.data);
    // if (res.ok) {
    //   this.setState({ creating: false, error: null });
    //   this.props.refetch();
    //   this.props.dispatch(selectLink({
    //     kind: 'Primary',
    //     category: SocialCategory.Order,
    //     id: 'overview',
    //   }));
    //   return;
    // }
    // this.setState({ creating: false, error: data.FieldCodes.map((fc: any) => fc.Message) });
  }
}

export default CreateGroup;
