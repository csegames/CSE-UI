/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { TabHeader } from './TabHeader';
import { connect } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { ChatPaneState, TabState } from '../../../../../redux/chatSlice';
// import { TabBody } from './TabBody';

const Container = 'Chat-Views-TabbedPane-Container';
const TabHeaders = 'Chat-Views-TabbedPane-TabHeaders';
const Menu = 'Chat-Views-TabbedPane-Menu';

const AddTab = 'Chat-Views-TabbedPane-AddTab';

interface ReactProps {
  paneID: string;
}

interface InjectedProps {
  paneState: ChatPaneState;
  tabs: { [id: string]: TabState };
}

type Props = ReactProps & InjectedProps;

class ATabbedPane extends React.Component<Props> {
  render() {
    const pane = this.props.paneState;
    const containerPos = {
      left: `${pane.position.left} px`,
      width: `${pane.position.width} px`,
      height: `${pane.position.height} px`
    };

    return (
      <div className={Container} id={'chat-pane-' + this.props.paneID} style={containerPos}>
        <div className={TabHeaders}>
          <div className={Menu} onClick={(e) => console.log('menu')}>
            <i className='fs-icon-misc-bars' />
          </div>
          {pane.tabs.map((id) => {
            const tab = this.props.tabs[id];
            if (!tab) return null;
            return (
              <TabHeader id={id} key={id} name={tab.name} icon={''} active={id === pane.activeTab} editMode={false} />
            );
          })}
          <div className={AddTab} onClick={(e) => console.log('add tab')}>
            <i className='fs-icon-misc-plus' />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { panes, tabs } = state.chat;
  const paneState = panes[ownProps.paneID];

  return {
    ...ownProps,
    paneState,
    tabs
  };
}

export const TabbedPane = connect(mapStateToProps)(ATabbedPane);
