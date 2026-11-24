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
import { getStringTableValue, replaceStringTokens, StringIDGeneralBack } from '../../helpers/stringTableHelpers';
import { getFactionData } from '../../gameData/factionData';
import { FactionButton } from '../FactionButton';
import { MailMessage } from '@csegames/library/dist/camelotunchained/game/GameClientModels/MailSnapshot';
import { resolveSenderName } from '../../redux/mailSlice';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { MailTemplateDef } from '../../dataSources/manifest/mailTemplateManifest';
import { ParticipationEventDef } from '../../dataSources/manifest/participationEventManifest';
import { FactionScrollArea } from '../FactionScrollArea';
import { TooltipSource } from '../TooltipSource';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { ItemTooltip } from '../items/ItemTooltip';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

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
const FooterButtonsRow = 'HUD-MailMessageView-FooterButtonsRow';
const FooterButton = 'HUD-MailMessageView-FooterButton';

// String IDs
const StringIDMailCollect = 'MailCollect';
const StringIDMailFrom = 'MailFrom';
const StringIDMailSubject = 'MailSubject';
const StringIDMailForward = 'MailForward';
const StringIDMailReply = 'MailReply';
const StringIDParticipationSummaryPoints = 'ParticipationSummaryPoints';

// MailTemplate tag names
const TagNameParticipationPoints = 'ParticipationPoints';
const TagNameParticipationSummary = 'ParticipationSummary';

const ATTACHMENTS_PER_MESSAGE = 6;
const FOOTER_BUTTON_WIDTH_VMIN = 12.25;

interface State {
}

interface ReactProps {
  message: MailMessage;
  commonMessageStringTokens: Record<string, string>;
  onCloseRequested: () => void;
}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  itemsByNumericID: Record<number, ItemDef>;
  mailTemplatesByNumericID: Record<number, MailTemplateDef>;
  participationEventsByNumericID: Record<number, ParticipationEventDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AMailMessageView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }

  render(): JSX.Element {
    const m = this.props.message;
    const factionData = getFactionData(this.props.uiFactionID);
    const mailTemplateDef = this.props.mailTemplatesByNumericID[this.props.message.templateID];
    const messageStringTokens : Record<string, string> = {
      ...this.props.commonMessageStringTokens,
      ...m.resolvedStringTokens,
      ...this.resolveParticipationStringTokens(mailTemplateDef)
    };

    return (
      <div className={PageContainer}>
        <div className={MessageHeader}>
          <div className={MessageHeaderRow}>
            <div className={MessageHeaderLabel}>{getStringTableValue(StringIDMailFrom, this.props.stringTable)}</div>
            <div className={RowSenderName} style={{ color: factionData.mailSenderColor }}>
              {resolveSenderName(m, this.props.stringTable)}
            </div>
          </div>
          <div className={MessageHeaderRow}>
            <div className={MessageHeaderLabel}>{getStringTableValue(StringIDMailSubject, this.props.stringTable)}</div>
            <div className={RowMessageSubject}>{replaceStringTokens(mailTemplateDef.subject, messageStringTokens)}</div>
          </div>
        </div>
        <div className={MessageContainer}>
          <img className={MessageBackground} src={factionData.mailMessageBackgroundImage} />
          <FactionScrollArea className={MessageScrollArea} topFadeAmount={'10%'} bottomFadeAmount={'10%'}>
            <div className={MessageText}>{this.unescapeNewlines(replaceStringTokens(mailTemplateDef.body, messageStringTokens))}</div>
          </FactionScrollArea>
        </div>
        <div className={MessageFooter} style={{ borderTopColor: factionData.mailDividerColor }}>
          <div className={GoldContainer}>
            <img className={GoldBackground} src={factionData.goldBackgroundImage} />
            <div className={GoldText}>{m.wasCollected ? 0 : m.money}</div>
          </div>
          <div className={AttachmentsRow}>{this.renderAttachments()}</div>
          <div className={FooterButtonsRow}>
            <FactionButton
              className={FooterButton}
              widthOverrideVmin={FOOTER_BUTTON_WIDTH_VMIN}
              disabled={m.wasCollected || (m.money <= 0 && m.attachmentIDs.length == 0)}
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

  private unescapeNewlines(text: string): string {
    return text.replace(/\\n/g, '\n');
  }

  private resolveParticipationStringTokens(mailTemplateDef : MailTemplateDef): Record<string, string> {
    const resolvedStringTokens : Record<string, string> = {};

    if (!mailTemplateDef.tagNames.includes(TagNameParticipationSummary) && !mailTemplateDef.tagNames.includes(TagNameParticipationPoints)) {
      return resolvedStringTokens;
    }

    const pointsString = getStringTableValue(StringIDParticipationSummaryPoints, this.props.stringTable).toLowerCase();
    const summaryLines: string[] = [];
    let totalPoints : number = 0;
    Object.entries(this.props.message.participationEvents).forEach((eventCountEntry) => {
      const eventDef = this.props.participationEventsByNumericID[Number(eventCountEntry[0])];
      const eventDescription = getStringTableValue(eventDef.descriptionStringKey, this.props.stringTable);
      const eventCount = eventCountEntry[1];
      summaryLines.push(`${eventDescription}: ${eventCount} (x${eventDef.coefficient} ${pointsString})`);
      totalPoints += eventCount * eventDef.coefficient;
    });
    
    resolvedStringTokens[TagNameParticipationSummary] = summaryLines.join('\n');
    resolvedStringTokens[TagNameParticipationPoints] = totalPoints.toString();
    return resolvedStringTokens;
  }

  private onMessageCollectClicked(message: MailMessage): void {
    clientAPI.collectRewards([message.id]);
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

    if (this.props.message.wasCollected) {
      return <>{attachments}</>;
    }

    for (let i = 0; i < ATTACHMENTS_PER_MESSAGE; ++i) {
      const itemDef = this.props.itemsByNumericID[this.props.message.attachmentIDs?.[i]];

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
        >
          <img className={AttachmentBackground} src={factionData.squareBackgroundImage} />
          <img className={AttachmentIcon} src={itemDef?.iconUrl} />
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
    itemsByNumericID: state.gameDefs.itemsByNumericID,
    mailTemplatesByNumericID: state.gameDefs.mailTemplatesByNumericID,
    participationEventsByNumericID: state.gameDefs.participationEventsByNumericID
  };
};

export const MailMessageView = connect(mapStateToProps)(AMailMessageView);
