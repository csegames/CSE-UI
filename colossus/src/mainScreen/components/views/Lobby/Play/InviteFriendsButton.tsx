/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../../../shared/Button';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const ActionButtonClass = 'StartScreen-Play-ActionButton';

const StringIDGroupsDoNotDisturb = 'GroupsDoNotDisturb';
const StringIDGroupsGroupFull = 'GroupsGroupFull';
const StringIDGroupsInvite = 'GroupsInvite';

interface ReactProps {
  onClick: () => void;
}

interface InjectedProps {
  doNotDisturb: boolean;
  isGroupFull: boolean;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

interface State {}

class AnInviteFriendsButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  private onClick() {
    this.props.onClick();
  }

  public render(): JSX.Element {
    return (
      <Button
        type='blue'
        styles={ActionButtonClass}
        disabled={this.props.doNotDisturb || this.props.isGroupFull}
        text={this.getLabelText()}
        onClick={this.onClick.bind(this)}
      />
    );
  }

  private getLabelText(): string {
    if (this.props.doNotDisturb) {
      return getStringTableValue(StringIDGroupsDoNotDisturb, this.props.stringTable);
    }
    if (this.props.isGroupFull) {
      return getStringTableValue(StringIDGroupsGroupFull, this.props.stringTable);
    }

    return getStringTableValue(StringIDGroupsInvite, this.props.stringTable);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { group, groupOfferPermissions } = state.teamJoin;
  const doNotDisturb = !groupOfferPermissions || !groupOfferPermissions.allowInvitations;
  const isGroupFull = group && group.size >= group.capacity;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    doNotDisturb,
    isGroupFull,
    stringTable
  };
}

export const InviteFriendsButton = connect(mapStateToProps)(AnInviteFriendsButton);
