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
import { webConf } from '../../../dataSources/networkConfiguration';
import { Overlay, hideOverlay } from '../../../redux/navigationSlice';
import { clearPlayerToReport } from '../../../redux/voiceChatSlice';
import { PlayerEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { IDLookupTable } from '../../../redux/gameSlice';
import { CharacterClassDef, CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';

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
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isMessageEmpty: boolean;
  isRealReasonSelected: boolean;
  isDropdownOpen: boolean;
  selectedReason: string;
}

class AReportPlayer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMessageEmpty: true,
      isRealReasonSelected: false,
      isDropdownOpen: false,
      selectedReason: getStringTableValue(StringIDMainMenuReportPlayerDefaultReason, this.props.stringTable)
    };
  }

  private messageInputRef = React.createRef<HTMLTextAreaElement>();
  private emailInputRef = React.createRef<HTMLTextAreaElement>();

  render(): JSX.Element {
    const isOpen = this.state.isDropdownOpen ? 'Open' : '';

    const raceDef = this.props.raceDefs[this.props.playerToReport?.race];
    const backupThumbnail = raceDef?.thumbnailURL ?? '';
    const portraitURL =
      this.props.playerToReport.portraitURL?.length > 0 ? this.props.playerToReport.portraitURL : backupThumbnail;
    const champName = this.props.classDefs[this.props.playerToReport.classID]?.name ?? '';

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
              <span className={DropdownSelected}>{this.state.selectedReason}</span>
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
            ref={this.messageInputRef}
            rows={7}
            onChange={this.isMessageBoxEmpty.bind(this)}
            onKeyDown={this.isMessageBoxEmpty.bind(this)}
            className={MessageBody}
            placeholder={getStringTableValue(StringIDMainMenuReportPlayerDefaultMessageText, this.props.stringTable)}
            maxLength={2000}
          />
          <span className={RequiredText}>
            {getStringTableValue(StringIDMainMenuReportPlayerRequiredText, this.props.stringTable)}
          </span>
          <textarea
            ref={this.emailInputRef}
            rows={1}
            className={EmailMessage}
            placeholder={getStringTableValue(StringIDMainMenuReportPlayerDefaultEmailString, this.props.stringTable)}
            maxLength={320}
          />
          <Button
            styles={SendReport}
            type={'blue'}
            disabled={this.state.isMessageEmpty || !this.state.isRealReasonSelected}
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
    this.setState({ isDropdownOpen: false, isMessageEmpty: true, isRealReasonSelected: false });
  }

  private onReportClick() {
    const email: string = this.emailInputRef.current?.value ?? null;
    const message: string = this.messageInputRef.current?.value ?? '';
    if (email) {
      ReportAPI.Report(webConf, this.state.selectedReason, this.props.playerToReport.accountID, message, email);
    } else {
      ReportAPI.Report(webConf, this.state.selectedReason, this.props.playerToReport.accountID, message);
    }
    this.props.dispatch(clearPlayerToReport());
    this.props.dispatch(hideOverlay(Overlay.ReportPlayer));
  }

  private onDropdownItemClicked(reason: string) {
    this.setState({ selectedReason: reason, isRealReasonSelected: true, isDropdownOpen: false });
  }

  private toggleDropdown() {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  }

  private isMessageBoxEmpty() {
    if (this.messageInputRef.current?.value.length > 0) {
      this.setState({ isMessageEmpty: false });
    } else {
      this.setState({ isMessageEmpty: true });
    }
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
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    playerToReport: state.voiceChat.playerToReport,
    raceDefs: characterRaceDefs,
    classDefs: characterClassDefs
  };
}

export const ReportPlayer = connect(mapStateToProps)(AReportPlayer);
