/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../redux/store';
import { addConditionalWidgetExiting, HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { FactionTabButtonsVertical } from '../FactionTabButtonsVertical';
import { MailMessage } from '../../redux/mailSlice';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { MailInbox } from './MailInbox';
import { MailMessageView } from './MailMessageView';
import { MailOutbox } from './MailOutbox';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';

// CSS classes
const Root = 'HUD-Mail-Root';
const RootContent = 'HUD-Mail-RootContent';
const PageTabButtons = 'HUD-Mail-PageTabButtons';
const Handle = 'HUD-FancyBorder-HeaderHandle';

// String IDs
const StringIDMailTitle = 'MailTitle';
const StringIDMailInbox = 'MailInbox';
const StringIDMailOutbox = 'MailOutbox';

enum MailTab {
  Inbox = 0,
  Outbox
}

interface State {
  currentTab: MailTab;
  searchValue: string;
  currentPage: number;
  selectedMessageIDs: number[];
  messageToView: MailMessage | null;
  selectedAttachmentIndex: number;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  messages: MailMessage[];
  itemsByNumericID: Record<number, ItemDef>;
}

type Props = ReactProps & InjectedProps;

class AMail extends React.Component<Props & DispatchProp, State> {
  constructor(props: Props & DispatchProp) {
    super(props);

    this.state = {
      currentTab: MailTab.Inbox,
      searchValue: '',
      currentPage: 0,
      selectedMessageIDs: [],
      messageToView: null,
      selectedAttachmentIndex: -1
    };
  }

  render(): JSX.Element {
    return (
      <div className={Root}>
        {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_MAIL} onEscape={this.closeSelf.bind(this)} />}
        <FactionTabButtonsVertical
          className={PageTabButtons}
          labels={[
            getStringTableValue(StringIDMailInbox, this.props.stringTable),
            getStringTableValue(StringIDMailOutbox, this.props.stringTable)
          ]}
          selectedTabIndex={this.state.currentTab}
          onTabSelected={(tabIndex: number) => {
            this.setState({ currentTab: tabIndex, messageToView: null });
          }}
        />
        <FactionBorder
          className={RootContent}
          type={BorderType.FancyHeader}
          background={BorderBackground.Leather}
          titleText={getStringTableValue(StringIDMailTitle, this.props.stringTable)}
          cornerButtons={[
            <FactionCornerButton
              type={CornerButtonType.Close}
              onClick={() => {
                this.closeSelf();
              }}
            />
          ]}
        >
          {this.renderPageContent()}
        </FactionBorder>
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_MAIL} />
      </div>
    );
  }

  private renderPageContent(): React.ReactNode {
    if (this.state.messageToView) {
      return (
        <MailMessageView
          message={this.state.messageToView}
          onCloseRequested={() => {
            this.setState({ messageToView: null });
          }}
        />
      );
    }

    switch (this.state.currentTab) {
      case MailTab.Inbox: {
        return (
          <MailInbox
            onMessageSelected={(m: MailMessage) => {
              this.setState({ messageToView: m, selectedAttachmentIndex: -1 });
            }}
          />
        );
      }
      case MailTab.Outbox: {
        return <MailOutbox />;
      }
    }
  }

  private closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_MAIL));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    messages: state.mail.messages,
    itemsByNumericID: state.gameDefs.itemsByNumericID
  };
};

const Mail = connect(mapStateToProps)(AMail);

export const WIDGET_ID_MAIL = 'Mail';
export const mailRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_MAIL,
  nameStringID: 'HUDEditorWidgetNameMail',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: -7
  },
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Mail isDragCopy={isDragCopy} />;
  }
};
