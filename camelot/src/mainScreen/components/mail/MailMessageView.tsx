/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue, StringIDGeneralBack } from '../../helpers/stringTableHelpers';
import { getFactionData } from '../../gameData/factionData';
import { FactionButton } from '../FactionButton';
import { MailMessage } from '../../redux/mailSlice';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { FactionScrollArea } from '../FactionScrollArea';
import TooltipSource from '../TooltipSource';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { ItemTooltip } from '../items/ItemTooltip';

// CSS classes
const PageContainer = 'HUD-Mail-PageContainer';
const RowSenderName = 'HUD-MailMessageView-SenderName';
const RowMessageSubject = 'HUD-MailMessageView-Subject';
const MessageHeader = 'HUD-MailMessageView-MessageHeader';
const MessageHeaderRow = 'HUD-MailMessageView-MessageHeaderRow';
const MessageHeaderLabel = 'HUD-MailMessageView-MessageHeaderLabel';
const MessageContainer = 'HUD-MailMessageView-MessageContainer';
const MessageBackground = 'HUD-MailMessageView-MessageBackground';
const MessageFooter = 'HUD-MailMessageView-MessageFooter';
const MessageScrollArea = 'HUD-MailMessageView-MessageScrollArea';
const MessageText = 'HUD-MailMessageView-MessageText';
const GoldContainer = 'HUD-MailMessageView-GoldContainer';
const GoldBackground = 'HUD-MailMessageView-GoldBackground';
const GoldText = 'HUD-MailMessageView-GoldText';
const AttachmentsRow = 'HUD-MailMessageView-AttachmentsRow';
const AttachmentContainer = 'HUD-MailMessageView-AttachmentContainer';
const AttachmentBackground = 'HUD-MailMessageView-AttachmentBackground';
const AttachmentBorder = 'HUD-MailMessageView-AttachmentBorder';
const AttachmentIcon = 'HUD-MailMessageView-AttachmentIcon';
const AttachmentSelectionIndicator = 'HUD-MailMessageView-AttachmentSelectionIndicator';
const FooterButtonsRow = 'HUD-MailMessageView-FooterButtonsRow';
const FooterButton = 'HUD-MailMessageView-FooterButton';

// String IDs
const StringIDMailCollect = 'MailCollect';
const StringIDMailFrom = 'MailFrom';
const StringIDMailSubject = 'MailSubject';
const StringIDMailForward = 'MailForward';
const StringIDMailReply = 'MailReply';

const ATTACHMENTS_PER_MESSAGE = 6;
const FOOTER_BUTTON_WIDTH_VMIN = 12.25;

interface State {
  selectedAttachmentIndex: number;
}

interface ReactProps {
  message: MailMessage;
  onCloseRequested: () => void;
}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  itemsByNumericID: Record<number, ItemDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AMailMessageView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedAttachmentIndex: -1
    };
  }

  render(): JSX.Element {
    const m = this.props.message;
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={PageContainer}>
        <div className={MessageHeader}>
          <div className={MessageHeaderRow}>
            <div className={MessageHeaderLabel}>{getStringTableValue(StringIDMailFrom, this.props.stringTable)}</div>
            <div className={RowSenderName} style={{ color: factionData.mailSenderColor }}>
              {m.senderName}
            </div>
          </div>
          <div className={MessageHeaderRow}>
            <div className={MessageHeaderLabel}>{getStringTableValue(StringIDMailSubject, this.props.stringTable)}</div>
            <div className={RowMessageSubject}>{m.subject}</div>
          </div>
        </div>
        <div className={MessageContainer}>
          <img className={MessageBackground} src={factionData.mailMessageBackgroundImage} />
          <FactionScrollArea className={MessageScrollArea} topFadeAmount={'10%'} bottomFadeAmount={'10%'}>
            <div className={MessageText}>{m.text}</div>
          </FactionScrollArea>
        </div>
        <div className={MessageFooter} style={{ borderTopColor: factionData.mailDividerColor }}>
          <div className={GoldContainer}>
            <img className={GoldBackground} src={factionData.goldBackgroundImage} />
            <div className={GoldText}>{m.money}</div>
          </div>
          <div className={AttachmentsRow}>{this.renderAttachments()}</div>
          <div className={FooterButtonsRow}>
            <FactionButton
              className={FooterButton}
              widthOverrideVmin={FOOTER_BUTTON_WIDTH_VMIN}
              disabled={m.money <= 0 && this.state.selectedAttachmentIndex < 0}
              onClick={this.onMessageCollectClicked.bind(this, m)}
            >
              {getStringTableValue(StringIDMailCollect, this.props.stringTable)}
            </FactionButton>
            <FactionButton
              className={FooterButton}
              widthOverrideVmin={FOOTER_BUTTON_WIDTH_VMIN}
              disabled={true}
              onClick={this.onForwardClicked.bind(this, m)}
            >
              {getStringTableValue(StringIDMailForward, this.props.stringTable)}
            </FactionButton>
            <FactionButton
              className={FooterButton}
              widthOverrideVmin={FOOTER_BUTTON_WIDTH_VMIN}
              disabled={true}
              onClick={this.onReplyClicked.bind(this, m)}
            >
              {getStringTableValue(StringIDMailReply, this.props.stringTable)}
            </FactionButton>
            <FactionButton
              className={FooterButton}
              widthOverrideVmin={FOOTER_BUTTON_WIDTH_VMIN}
              onClick={this.props.onCloseRequested}
            >
              {getStringTableValue(StringIDGeneralBack, this.props.stringTable)}
            </FactionButton>
          </div>
        </div>
      </div>
    );
  }

  private onMessageCollectClicked(message: MailMessage): void {
    // TODO: Try to collect the selected item and/or money.
  }

  private onForwardClicked(message: MailMessage): void {
    // TODO: Try to collect the selected item and/or money.
  }

  private onReplyClicked(message: MailMessage): void {
    // TODO: Try to collect the selected item and/or money.
  }

  private renderAttachments(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const attachments: React.ReactNode[] = [];

    for (let i = 0; i < ATTACHMENTS_PER_MESSAGE; ++i) {
      const itemDef = this.props.itemsByNumericID[this.props.message.attachmentIDs?.[i]];
      const isSelectable = !!itemDef;
      const isSelected = isSelectable && this.state.selectedAttachmentIndex === i;

      // TODO: Once we have real data, get/make "Item"s for the tooltip display.
      const items: Item[] = [];

      attachments.push(
        <TooltipSource
          key={`Attachment-${i}`}
          tooltipID={`Attachment-${i}`}
          active={items.length > 0}
          content={() => <ItemTooltip items={items} />}
          positionType='mouse'
          className={AttachmentContainer}
          onClick={() => {
            if (i < this.props.message.attachmentIDs.length) {
              this.setState({ selectedAttachmentIndex: i });
            }
          }}
        >
          <img className={AttachmentBackground} src={factionData.squareBackgroundImage} />
          <img className={`${AttachmentIcon} ${isSelectable ? 'selectable' : ''}`} src={itemDef?.iconUrl} />
          {isSelected && (
            <div
              className={AttachmentSelectionIndicator}
              style={{ boxShadow: `inset 0 0 0.8vmin 0.5vmin ${factionData.selectionGlowColor}` }}
            />
          )}
          <img className={AttachmentBorder} src={factionData.borderImage} />
        </TooltipSource>
      );
    }

    return <>{attachments}</>;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable,
    itemsByNumericID: state.gameDefs.itemsByNumericID
  };
};

export const MailMessageView = connect(mapStateToProps)(AMailMessageView);
