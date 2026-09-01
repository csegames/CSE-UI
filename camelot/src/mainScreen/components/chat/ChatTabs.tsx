/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { ChatTab, isSystemChatTab } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralPlus,
  StringIDGeneralPlusPost
} from '../../helpers/stringTableHelpers';
import { StringTable } from '../../dataSources/manifest/stringTableManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { BorderBackground } from '../FactionBorder';
import { FactionBorderSelectable } from '../FactionBorderSelectable';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem, ContextMenuParams } from '../../redux/contextMenuSlice';
import { showModal } from '../../redux/modalsSlice';
import { ChatTabEditor } from './ChatTabEditor';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';

// CSS classes
const Navigation = 'HUD-Chat-Navigation';
const TabRoot = 'HUD-Chat-TabRoot';
const TabTransparency = 'HUD-Chat-TabTransparency';
const CurrentTab = 'HUD-Chat-CurrentTab';
const TabName = 'HUD-Chat-TabName';
const TabNameAdd = 'HUD-Chat-TabNameAdd';
const TabRootAdd = 'HUD-Chat-TabRootAdd';

// String IDs
const StringIDChatConfigureTab = 'ChatConfigureTab';
const StringIDChatDeleteTab = 'ChatDeleteTab';

const MAX_CHAT_TAB_COUNT = 9;

interface ReactProps {
  isActive: boolean;
  setActive: (active: boolean) => void;
  onTabChanged: (tab: ChatTab) => void;
}

interface InjectedProps {
  stringTable: StringTable;
}

type Props = ReactProps & InjectedProps & AddDispatch;

interface State {
  chatTabs: ChatTab[];
  currentTabIndex: number;
}

class AChatTabs extends React.Component<Props, State> {
  private tabsUpdatedHandler: ListenerHandle | null = null;

  constructor(props: Props) {
    super(props);
    const initialTabs = clientAPI.getChatTabs();
    this.state = {
      chatTabs: initialTabs,
      currentTabIndex: 0
    };
  }

  render(): React.ReactNode {
    return (
      <div className={Navigation}>
        {this.state.chatTabs.map(this.renderTabButton.bind(this))}
        {this.state.chatTabs.length <= MAX_CHAT_TAB_COUNT && this.renderCreateTab()}
      </div>
    );
  }

  componentDidMount(): void {
    this.tabsUpdatedHandler = clientAPI.bindTabsUpdatedListener((tabs) => {
      const prevTab = this.state.chatTabs[this.state.currentTabIndex];
      const newIndex = Math.max(
        tabs.findIndex((t) => t.name === prevTab.name),
        0
      );
      this.handleTabChange(tabs, newIndex);
    });
  }

  componentWillUnmount(): void {
    this.tabsUpdatedHandler?.close();
  }

  private renderTabButton(tab: ChatTab, index: number) {
    let tabName: string = isSystemChatTab(tab.name) ? getStringTableValue(tab.name, this.props.stringTable) : tab.name;

    // TODO : calculating unread messages -- keep a mapping of scopes to counters +
    // a last read id, when a new message appears increment the counter by 1 if the
    // current tab does not include that scope. The unread messages for each tab are
    // the sum of the unread messages for their scopes; when a new tab is selected
    // reset all of the counters inside its scope to zero with a last read id equal
    // to next message id regardless of its scope; when a message scrolls off the
    // buffer, decrement the scope counter only if its id is greater than the last
    // read id.  It may be easiest to make the mapping a react property pushed from
    // the Chat component down into ChatTabs.

    const unreadCount = 0;
    if (unreadCount > 0) {
      tabName += ` (${
        unreadCount > 99
          ? getTokenizedStringTableValue(StringIDGeneralPlusPost, this.props.stringTable, {
              VALUE: '99'
            })
          : unreadCount
      })`;
    }

    const isCurrentTab = index === this.state.currentTabIndex;

    return (
      <FactionBorderSelectable
        key={tab.name}
        className={`${TabRoot} ${isCurrentTab ? CurrentTab : ''}`}
        isSelected={isCurrentTab}
        onSelected={this.handleTabChange.bind(this, this.state.chatTabs, index)}
        background={BorderBackground.PatternSmall}
        includeBottom={false}
      >
        <ContextMenuSource className={TabTransparency} menuParams={this.getTabContextMenuParams(index)}>
          <span className={TabName}>{tabName}</span>
        </ContextMenuSource>
      </FactionBorderSelectable>
    );
  }

  private renderCreateTab(): React.ReactNode {
    return (
      <FactionBorderSelectable
        key={StringIDGeneralPlus}
        className={`${TabRoot} ${TabRootAdd}`}
        isSelected={false} // Never selected, but we want the rest of the appearance and behaviors.
        onSelected={() => {}}
        background={BorderBackground.PatternSmall}
        includeBottom={false}
        onClick={() => {
          // Blank tabName means create new tab!
          this.props.dispatch(
            showModal({ id: StringIDChatConfigureTab, content: () => <ChatTabEditor tabName={''} /> })
          );
        }}
      >
        <div className={TabTransparency}>
          <span className={TabNameAdd}>{getStringTableValue(StringIDGeneralPlus, this.props.stringTable)}</span>
        </div>
      </FactionBorderSelectable>
    );
  }

  private handleTabChange(chatTabs: ChatTab[], currentTabIndex: number) {
    this.props.onTabChanged(chatTabs[currentTabIndex]);
    this.setState({ chatTabs, currentTabIndex });
  }

  private getTabContextMenuParams(index: number): ContextMenuParams {
    const name = this.state.chatTabs[index].name;

    let content: ContextMenuItem[] = [
      {
        title: getStringTableValue(StringIDChatConfigureTab, this.props.stringTable),
        onClick: () =>
          this.props.dispatch(
            showModal({ id: StringIDChatConfigureTab, content: () => <ChatTabEditor tabName={name} /> })
          )
      }
    ];

    if (!isSystemChatTab(name)) {
      content.push({
        title: getStringTableValue(StringIDChatDeleteTab, this.props.stringTable),
        onClick: () => clientAPI.removeChatTab(name)
      });
    }

    return { id: StringIDGeneralPlus, content };
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable
  };
};

export const ChatTabs = connect(mapStateToProps)(AChatTabs);
