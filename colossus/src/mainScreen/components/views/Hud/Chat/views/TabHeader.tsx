/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { ChatPaneState, ImageSrc, TabState, updateActiveTab } from '../../../../../redux/chatSlice';
import { Dispatch } from 'redux';

const Container = 'Chat-Views-TabHeader-Container';
const ActiveContainer = 'Chat-Views-TabHeader-ActiveContainer';
const ActiveOrnament = 'Chat-Views-TabHeader-ActiveOrnament';
const Icon = 'Chat-Views-TabHeader-Icon';
const Title = 'Chat-Views-TabHeader-Title';
const ConfigBtn = 'Chat-Views-TabHeader-ConfigBtn';

const CloseBtn = 'Chat-Views-TabHeader-CloseBtn';

interface ReactProps {
  name: string;
  icon: string;
  id: string;
  active: boolean;
  editMode: boolean;
}

interface InjectedProps {
  activeOrnament: ImageSrc;
  fontFamily: string;
  panes: { [id: string]: ChatPaneState };
  tabs: { [id: string]: TabState };
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ATabHeader extends React.Component<Props> {
  private onClick() {
    this.props.dispatch(updateActiveTab({ paneID: 'default', tabID: this.props.id }));
  }

  render() {
    const wrapperCls = this.props.active ? ActiveContainer : Container;

    return (
      <div className={wrapperCls} onClick={this.onClick.bind(this)}>
        <img className={Icon} src={this.props.icon} />
        <span className={Title} style={{ fontFamily: this.props.fontFamily }}>
          {this.props.name}
        </span>
        <i className={`${ConfigBtn} fs-icon-misc-cog`} />
        <i className={CloseBtn}>X</i>
        {this.props.active && <img className={ActiveOrnament} src={this.props.activeOrnament.hd} />}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { theme, panes, tabs } = state.chat;
  const { tab } = theme;
  const { activeOrnament, fontFamily } = tab;
  return {
    ...ownProps,
    activeOrnament,
    fontFamily,
    panes,
    tabs
  };
}

export const TabHeader = connect(mapStateToProps)(ATabHeader);
