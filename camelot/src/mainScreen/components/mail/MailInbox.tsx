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
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralSearch
} from '../../helpers/stringTableHelpers';
import { FactionBorder, BorderType } from '../FactionBorder';
import { getFactionData } from '../../gameData/factionData';
import { FactionButton } from '../FactionButton';
import { FactionPageSwitcher } from '../FactionPageSwitcher';
import { MailMessage } from '../../redux/mailSlice';
import { FactionCheckbox } from '../FactionCheckbox';
import { ItemDef } from '../../dataSources/manifest/itemManifest';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import SearchIconURL from '../../../images/search-icon.png';

// CSS classes
const PageContainer = 'HUD-Mail-PageContainer';
const Search = 'HUD-MailInbox-Search';
const SearchIconWrapper = 'HUD-MailInbox-SearchIconWrapper';
const SearchIcon = 'HUD-MailInbox-SearchIcon';
const SearchInputWrapper = 'HUD-MailInbox-SearchInputWrapper';
const SearchInput = 'HUD-MailInbox-SearchInput';
const SearchInputTopRightCorner = 'HUD-MailInbox-SearchInputTopRightCorner';
const SearchInputBottomRightCorner = 'HUD-MailInbox-SearchInputBottomRightCorner';
const HeaderSection = 'HUD-MailInbox-HeaderSection';
const RowSection = 'HUD-MailInbox-RowSection';
const FooterSection = 'HUD-MailInbox-FooterSection';
const Spacer = 'HUD-MailInbox-Spacer';
const Checkbox = 'HUD-MailInbox-Checkbox';
const RowBackground = 'HUD-MailInbox-RowBackground';
const RowItemContainer = 'HUD-MailInbox-RowItemContainer';
const RowItemBackground = 'HUD-MailInbox-RowItemBackground';
const RowItemBorder = 'HUD-MailInbox-RowItemBorder';
const RowItemIcon = 'HUD-MailInbox-RowItemIcon';
const RowPreviewContainer = 'HUD-MailInbox-RowPreviewContainer';
const RowSenderName = 'HUD-MailInbox-RowSenderName';
const RowMessageSubject = 'HUD-MailInbox-RowMessageSubject';
const RowDateLabel = 'HUD-MailInbox-RowDateLabel';
const RowButton = 'HUD-MailInbox-RowButton';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import CoinIconURL from '../../../images/icons/coin-gold.png';

// String IDs
const StringIDMailCollect = 'MailCollect';
const StringIDMailDelete = 'MailDelete';
const StringIDMailToday = 'MailToday';
const StringIDMailYesterday = 'MailYesterday';
const StringIDMailDaysAgo = 'MailDaysAgo';

const MESSAGES_PER_PAGE = 8;

interface State {
  searchValue: string;
  currentPage: number;
  selectedMessageIDs: number[];
}

interface ReactProps {
  onMessageSelected: (message: MailMessage) => void;
}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  messages: MailMessage[];
  itemsByNumericID: Record<number, ItemDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AMailInbox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchValue: '',
      currentPage: 0,
      selectedMessageIDs: []
    };
  }

  render(): JSX.Element {
    const factionData = getFactionData(this.props.uiFactionID);

    const canCollect = this.props.messages
      .filter((m) => this.state.selectedMessageIDs.includes(m.id))
      .some((m) => m.money > 0 || m.attachmentIDs.length > 0);

    return (
      <div className={PageContainer}>
        <div className={HeaderSection}>
          <FactionButton disabled={!canCollect} onClick={this.onCollectClicked.bind(this)}>
            {getStringTableValue(StringIDMailCollect, this.props.stringTable)}
          </FactionButton>
          <div className={Search} style={{ borderColor: factionData.borderColor }}>
            <FactionBorder className={SearchIconWrapper} type={BorderType.Secondary}>
              <img
                style={{ backgroundImage: `url(${factionData.squareBackgroundImage})` }}
                className={SearchIcon}
                src={SearchIconURL}
              />
            </FactionBorder>
            <div className={SearchInputWrapper}>
              <input
                style={{
                  backgroundColor: factionData.searchBackgroundColor,
                  borderRight: `.2vmin solid ${factionData.borderColor}`,
                  borderTop: `.2vmin solid ${factionData.borderColor}`,
                  borderBottom: `.2vmin solid ${factionData.borderColor}`
                }}
                className={SearchInput}
                placeholder={getStringTableValue(StringIDGeneralSearch, this.props.stringTable)}
                onChange={this.handleSearchChange.bind(this)}
              />
              <img className={SearchInputTopRightCorner} src={factionData.cornerSecondaryTopRightImage} />
              <img className={SearchInputBottomRightCorner} src={factionData.cornerSecondaryBottomRightImage} />
            </div>
          </div>
          <FactionButton disabled={this.state.selectedMessageIDs.length < 1} onClick={this.onDeleteClicked.bind(this)}>
            {getStringTableValue(StringIDMailDelete, this.props.stringTable)}
          </FactionButton>
        </div>
        {this.renderMessageRows()}
        <div className={FooterSection}>
          <FactionPageSwitcher
            currentPage={this.state.currentPage}
            pageCount={Math.max(1, Math.ceil(this.props.messages.length / MESSAGES_PER_PAGE))}
            onPageChanged={this.onPageChanged.bind(this)}
          />
        </div>
      </div>
    );
  }

  private renderMessageRows(): React.ReactNode {
    const messages = this.getSortedMessages(this.props.messages, this.state.searchValue);

    const firstMessageIndex = this.state.currentPage * MESSAGES_PER_PAGE;

    const rows: React.ReactNode[] = [];
    for (let i = firstMessageIndex; i < firstMessageIndex + MESSAGES_PER_PAGE; ++i) {
      rows.push(this.renderMessageRow(i, messages[i]));
      if (i !== firstMessageIndex + MESSAGES_PER_PAGE - 1) {
        rows.push(<div className={Spacer} />);
      }
    }

    return <>{rows}</>;
  }

  private renderMessageRow(index: number, message?: MailMessage): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    const firstItem = this.props.itemsByNumericID[message?.attachmentIDs?.[0]];
    const showGold = !firstItem && message?.money > 0;

    return (
      <div
        className={RowSection}
        key={`${index} ${message?.id}`}
        style={{
          borderTop: `1px solid ${factionData.borderColor}`,
          borderBottom: `1px solid ${factionData.borderColor}`
        }}
      >
        <img className={RowBackground} src={factionData.mailRowBackgroundImage} />
        {message && <img className={RowBackground} src={factionData.mailRowPaperImage} />}
        <FactionCheckbox
          className={Checkbox}
          isChecked={this.state.selectedMessageIDs.includes(message?.id)}
          onCheckedChanged={(isChecked) => {
            if (isChecked) {
              this.setState({ selectedMessageIDs: [...this.state.selectedMessageIDs, message.id] });
            } else {
              this.setState({ selectedMessageIDs: this.state.selectedMessageIDs.filter((mID) => mID !== message.id) });
            }
          }}
        />
        <div className={RowItemContainer}>
          <img className={RowItemBackground} src={factionData.squareBackgroundImage} />
          <img className={RowItemIcon} src={showGold ? CoinIconURL : firstItem?.iconUrl} />
          <img className={RowItemBorder} src={factionData.borderImage} />
        </div>
        {message && (
          <>
            <div className={RowPreviewContainer}>
              <div className={RowSenderName} style={{ color: factionData.mailSenderColor }}>
                {message.senderName}
              </div>
              <div className={RowMessageSubject}>{message.subject}</div>
            </div>
            <div className={RowDateLabel}>{this.getDateText(message)}</div>
            <div className={RowButton} onClick={this.onMessageRowClicked.bind(this, message)} />
          </>
        )}
      </div>
    );
  }

  private onMessageRowClicked(messageToView: MailMessage): void {
    this.props.onMessageSelected(messageToView);
  }

  private onCollectClicked(): void {
    // TODO: Asynchronously attempt to acquire items from the selected messages and add those items to the Inventory.
    // TODO: Note that there may not be enough room to claim all items, so we will need to handle that case!
    // TODO: Note that any asynchronous action can fail in multiple ways, and we'll need to handle those errors.
  }

  private onDeleteClicked(): void {
    // TODO: If the selected messages have unclaimed items (or money!), we definitely need to prompt for confirmation.
    // TODO: Asynchronously attempt to delete the selected messages.
    // TODO: Note that any asynchronous action can fail in multiple ways, and we'll need to handle those errors.
  }

  private getDateText(message: MailMessage): string {
    const now = new Date().getTime();
    const then = new Date(message.sentDate).getTime();

    const daysBetween = Math.min(99, Math.floor((now - then) / 86400000));

    switch (daysBetween) {
      case 0: {
        return getStringTableValue(StringIDMailToday, this.props.stringTable);
      }
      case 1: {
        return getStringTableValue(StringIDMailYesterday, this.props.stringTable);
      }
      default: {
        const tokens = {
          DAYS: daysBetween.toFixed(0)
        };
        return getTokenizedStringTableValue(StringIDMailDaysAgo, this.props.stringTable, tokens);
      }
    }
  }

  private onPageChanged(newPage: number) {
    // When changing the page, we also de-select anything from the page we just left.
    this.setState({ currentPage: newPage, selectedMessageIDs: [] });
  }

  private handleSearchChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.setState({ searchValue: target.value, selectedMessageIDs: [] });
  }

  private getSortedMessages(allMessages: MailMessage[], searchValue: string): MailMessage[] {
    // Apply any search filter.
    let filteredMessages: MailMessage[];
    const pattern = searchValue.trim();
    if (pattern && pattern.length > 0) {
      filteredMessages = allMessages.filter((m) => {
        return m.senderName.toLowerCase().includes(pattern) || m.text.toLowerCase().includes(pattern);
      });
    } else {
      filteredMessages = [...allMessages];
    }

    // Sort items by sentDate.
    const sortedMessages = filteredMessages.sort((a, b) => -a.sentDate.localeCompare(b.sentDate));

    return sortedMessages;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable,
    messages: state.mail.messages,
    itemsByNumericID: state.gameDefs.itemsByNumericID
  };
};

export const MailInbox = connect(mapStateToProps)(AMailInbox);
