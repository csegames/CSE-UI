/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { Button } from '../../shared/Button';
import { ReportAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { Overlay, hideOverlay } from '../../../redux/navigationSlice';
import { VoiceChatReport, clearPlayerToReport, updateReport } from '../../../redux/voiceChatSlice';
import { PlayerEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { IDLookupTable } from '../../../redux/gameSlice';
import { CharacterClassDef, CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { webConf } from '../../../dataSources/networkConfiguration';

const Container = 'MenuModal-RightOptions-ReportPlayer-Container';
const CloseButton = 'MenuModal-RightOptions-ReportPlayer-CloseButton';
const MarginContainer = 'MenuModal-RightOptions-ReportPlayer-MarginContainer';
const Title = 'MenuModal-RightOptions-ReportPlayer-Title';
const PlayerContainer = 'MenuModal-RightOptions-ReportPlayer-PlayerContainer';
const PlayerIcon = 'MenuModal-RightOptions-ReportPlayer-PlayerIcon';
const NameContainer = 'MenuModal-RightOptions-ReportPlayer-NameContainer';
const PlayerName = 'MenuModal-RightOptions-ReportPlayer-PlayerName';
const ChampName = 'MenuModal-RightOptions-ReportPlayer-ChampName';
const DropdownContainer = 'MenuModal-RightOptions-ReportPlayer-DropdownContainer';
const DropdownSelectedContainer = 'MenuModal-RightOptions-ReportPlayer-DropdownSelectedContainer';
const DropdownSelected = 'MenuModal-RightOptions-ReportPlayer-DropdownSelected';
const DropdownSelectedIcon = 'MenuModal-RightOptions-ReportPlayer-DropdownSelectedIcon';
const DropdownList = 'MenuModal-RightOptions-ReportPlayer-DropdownList';
const DropdownItem = 'MenuModal-RightOptions-ReportPlayer-DropdownItem';
const MessageBody = 'MenuModal-RightOptions-ReportPlayer-MessageBody';
const EmailMessage = 'MenuModal-RightOptions-ReportPlayer-EmailMessage';
const SendReport = 'MenuModal-RightOptions-ReportPlayer-SendReport';
const RequiredText = 'MenuModal-RightOptions-ReportPlayer-RequiredText';

const StringIDMainMenuReportPlayerTitle = 'MainMenuReportPlayerTitle';
const StringIDMainMenuReportPlayerDefaultMessageText = 'MainMenuReportPlayerDefaultMessageText';
const StringIDMainMenuReportPlayerDefaultEmailString = 'MainMenuReportPlayerDefaultEmailString';
const StringIDMainMenuReportPlayerReportPlayer = 'MainMenuReportPlayerReportPlayer';
const StringIDMainMenuReportPlayerRequiredText = 'MainMenuReportPlayerRequiredText';
const StringIDMainMenuReportPlayerListOfReasons = 'MenuReportPlayerListOfReasons';
const StringIDMainMenuReportPlayerDefaultReason = 'MainMenuReportPlayerDefaultReason';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  playerToReport: PlayerEntityStateModel;
  raceDefs: IDLookupTable<CharacterRaceDef>;
  classDefs: IDLookupTable<CharacterClassDef>;
  report: VoiceChatReport;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isRealReasonSelected: boolean;
  isDropdownOpen: boolean;
}

class AReportPlayer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isRealReasonSelected: false,
      isDropdownOpen: false
    };
  }

  render(): JSX.Element {
    const isOpen = this.state.isDropdownOpen ? 'Open' : '';

    const raceDef = this.props.raceDefs[this.props.playerToReport?.race];
    const backupThumbnail = raceDef?.thumbnailURL ?? '';
    const portraitURL =
      this.props.playerToReport.portraitURL?.length > 0 ? this.props.playerToReport.portraitURL : backupThumbnail;
    const champName = this.props.classDefs[this.props.playerToReport.classID]?.name ?? '';

    const report = this.getReport();

    return (
      <div className={Container}>
        <span className={`${CloseButton} fs-icon-misc-fail`} onClick={this.onCloseClicked.bind(this)}></span>
        <div className={MarginContainer}>
          <span className={Title}>
            {getStringTableValue(StringIDMainMenuReportPlayerTitle, this.props.stringTable)}
          </span>
          <div className={PlayerContainer}>
            <img className={PlayerIcon} src={portraitURL} />
            <div className={NameContainer}>
              <span className={PlayerName}>{this.props.playerToReport.name}</span>
              <span className={ChampName}>{champName}</span>
            </div>
          </div>
          <div className={DropdownContainer}>
            <div className={DropdownSelectedContainer} onClick={this.toggleDropdown.bind(this)}>
              <span className={DropdownSelected}>{report.reason}</span>
              <span className={`${DropdownSelectedIcon} ${this.getSelectedIcon()}`} />
            </div>
            <div className={`${DropdownList} ${isOpen}`}>
              {this.getReasons().map((reason, index) => {
                return (
                  <span className={DropdownItem} key={index} onClick={this.onDropdownItemClicked.bind(this, reason)}>
                    {reason}
                  </span>
                );
              })}
            </div>
          </div>
          <span className={RequiredText}>
            {getStringTableValue(StringIDMainMenuReportPlayerRequiredText, this.props.stringTable)}
          </span>
          <textarea
            rows={7}
            onChange={this.onMessageChange.bind(this)}
            className={MessageBody}
            placeholder={getStringTableValue(StringIDMainMenuReportPlayerDefaultMessageText, this.props.stringTable)}
            maxLength={2000}
            value={report.message}
          />
          <span className={RequiredText}>
            {getStringTableValue(StringIDMainMenuReportPlayerRequiredText, this.props.stringTable)}
          </span>
          <textarea
            rows={1}
            onChange={this.onEmailChange.bind(this)}
            className={EmailMessage}
            placeholder={getStringTableValue(StringIDMainMenuReportPlayerDefaultEmailString, this.props.stringTable)}
            maxLength={320}
            value={report.email}
          />
          <Button
            styles={SendReport}
            type={'blue'}
            disabled={report.message.length === 0 || !this.state.isRealReasonSelected}
            text={getStringTableValue(StringIDMainMenuReportPlayerReportPlayer, this.props.stringTable)}
            onClick={this.onReportClick.bind(this)}
          ></Button>
        </div>
      </div>
    );
  }

  private onCloseClicked() {
    this.props.dispatch(clearPlayerToReport());
    this.props.dispatch(hideOverlay(Overlay.ReportPlayer));
    this.setState({ isDropdownOpen: false, isRealReasonSelected: false });
  }

  private onReportClick() {
    const report = this.getReport();
    if (report.email) {
      ReportAPI.Report(webConf, report.reason, this.props.playerToReport.accountID, report.message, report.email);
    } else {
      ReportAPI.Report(webConf, report.reason, this.props.playerToReport.accountID, report.message);
    }
    this.props.dispatch(clearPlayerToReport());
    this.props.dispatch(hideOverlay(Overlay.ReportPlayer));
  }

  private onDropdownItemClicked(reason: string) {
    this.setState({ isRealReasonSelected: true, isDropdownOpen: false });
    this.updateReport({ reason });
  }

  private onMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.updateReport({ message: e.target.value });
  }
  private onEmailChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.updateReport({ email: e.target.value });
  }

  private toggleDropdown() {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  }

  private updateReport(report: Partial<VoiceChatReport>) {
    const { accountID } = this.props.playerToReport;
    this.props.dispatch(
      updateReport({
        accountID,
        report: {
          ...this.getReport(),
          ...report
        }
      })
    );
  }

  private getReport(): VoiceChatReport {
    const report = {
      reason: getStringTableValue(StringIDMainMenuReportPlayerDefaultReason, this.props.stringTable),
      message: '',
      email: ''
    };
    if (this.props.report) {
      return {
        ...report,
        ...this.props.report
      };
    }
    return report;
  }

  private getReasons(): string[] {
    const unsplitReasonsList = getStringTableValue(StringIDMainMenuReportPlayerListOfReasons, this.props.stringTable);
    const splitList: string[] = unsplitReasonsList.split(',');
    return splitList;
  }

  private getSelectedIcon(): string {
    return this.state.isDropdownOpen ? 'fs-icon-misc-caret-up' : 'fs-icon-misc-caret-down';
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { characterClassDefs, characterRaceDefs } = state.game;
  const { playerToReport } = state.voiceChat;
  const report = state.voiceChat.reports[playerToReport?.accountID];
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    playerToReport,
    raceDefs: characterRaceDefs,
    classDefs: characterClassDefs,
    report
  };
}

export const ReportPlayer = connect(mapStateToProps)(AReportPlayer);
