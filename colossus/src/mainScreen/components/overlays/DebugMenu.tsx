/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Button } from '../shared/Button';
import { battlePassLocalStore } from '../../localStorage/battlePassLocalStorage';
import { game } from '@csegames/library/dist/_baseGame';
import { GenericToaster } from '../GenericToaster';
import { storeLocalStore } from '../../localStorage/storeLocalStorage';
import { currentFormatVersion } from '../../redux/localStorageSlice';

// Styles.
const Root = 'DebugMenu-Root';
const Column = 'DebugMenu-Column';
const SectionHeader = 'DebugMenu-SectionHeader';
const ButtonStyle = 'DebugMenu-Button';

interface ReactProps {}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ADebugMenu extends React.Component<Props> {
  public render(): React.ReactNode {
    return (
      <div className={Root}>
        <div className={Column}>
          <div className={SectionHeader}>{'Local Storage'}</div>
          <Button
            styles={ButtonStyle}
            type={'blue'}
            text={'Erase BattlePass Data'}
            onClick={this.onEraseBattlePassDataClicked.bind(this)}
          />
          <Button
            styles={ButtonStyle}
            type={'blue'}
            text={'Erase Store Data'}
            onClick={this.onEraseStoreDataClicked.bind(this)}
          />
          <Button
            styles={ButtonStyle}
            type={'blue'}
            text={'Erase mute data'}
            onClick={this.onEraseMuteDataClicked.bind(this)}
          />
        </div>
      </div>
    );
  }

  private showGenericToaster(title: string, description: string): void {
    game.trigger('show-bottom-toaster', <GenericToaster title={title} description={description} />);
  }

  private onEraseBattlePassDataClicked(): void {
    battlePassLocalStore.setLastSeenBattlePassID('');
    battlePassLocalStore.setLastSeenFreeBattlePassID('');
    battlePassLocalStore.setLastSplashedBattlePassID('');
    battlePassLocalStore.setLastEndedBattlePassID('');

    this.showGenericToaster('', 'Battle Pass Local Storage data has been erased.');
  }

  private onEraseStoreDataClicked(): void {
    storeLocalStore.setSeenPurchases({});
    storeLocalStore.setUnseenEquipment({});

    this.showGenericToaster('', 'Store Local Storage data has been erased.');
  }

  private onEraseMuteDataClicked(): void {
    storeLocalStore.setTextChatBlocks({ base64AccountIDs: [], formatVersion: currentFormatVersion });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export const DebugMenu = connect(mapStateToProps)(ADebugMenu);
