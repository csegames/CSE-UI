/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Overlay, hideOverlay } from '../../redux/navigationSlice';
import { ChampionInfo, PerkDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { StringIDGeneralClose, getStringTableValue } from '../../helpers/stringTableHelpers';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Root = 'RuneModsTutorialModal-Root';
const Title = 'RuneModsTutorialModal-Title';
const Message = 'RuneModsTutorialModal-Message';
const KeyImage = 'RuneModsTutorialModal-KeyImage';
const DoneButton = 'RuneModsTutorialModal-DoneButton';

const StringIDRuneModsTutorialTitle = 'RuneModsTutorialTitle';
const StringIDRuneModsTutorialMessage1 = 'RuneModsTutorialMessage1';
const StringIDRuneModsTutorialMessage2 = 'RuneModsTutorialMessage2';
const StringIDRuneModsTutorialMessage3 = 'RuneModsTutorialMessage3';

interface ReactProps {}

interface InjectedProps {
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  selectedChampion: ChampionInfo;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ARuneModsTutorialModal extends React.Component<Props> {
  public render() {
    const keyPerk = this.props.perksByID[this.props.selectedChampion?.runeModUnlockCurrencyID];

    return (
      // Unsetting the height lets the modal calculate its size based on content.
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride='unset'>
        <div className={Root}>
          <div className={Title}>{getStringTableValue(StringIDRuneModsTutorialTitle, this.props.stringTable)}</div>
          <div className={Message}>{getStringTableValue(StringIDRuneModsTutorialMessage1, this.props.stringTable)}</div>
          <img className={KeyImage} src={keyPerk?.iconURL} />
          <div className={Message}>{getStringTableValue(StringIDRuneModsTutorialMessage2, this.props.stringTable)}</div>
          <div className={Message}>{getStringTableValue(StringIDRuneModsTutorialMessage3, this.props.stringTable)}</div>
          <Button
            type='blue'
            text={getStringTableValue(StringIDGeneralClose, this.props.stringTable)}
            styles={DoneButton}
            onClick={this.onClose.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }

  private async onClose(): Promise<void> {
    clientAPI.setHasSeenRuneModsTutorial(true);
    this.props.dispatch(hideOverlay(Overlay.RuneModsTutorial));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;
  const { selectedChampion } = state.championInfo;

  return {
    ...ownProps,
    stringTable,
    perksByID,
    selectedChampion
  };
}

export const RuneModsTutorialModal = connect(mapStateToProps)(ARuneModsTutorialModal);
