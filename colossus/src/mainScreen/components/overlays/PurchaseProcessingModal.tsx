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
import { Overlay, hideAllOverlays, hideOverlay, hideRightPanel, showError } from '../../redux/navigationSlice';
import {
  PerkDefGQL,
  PerkGQL,
  PurchaseDefGQL,
  QuestDefGQL,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import {
  StringIDGeneralDone,
  StringIDGeneralProcessing,
  StringIDGeneralSuccess,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../helpers/stringTableHelpers';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { isChampionEquipmentPerk } from '../../helpers/perkUtils';
import { updateStoreAddUnseenEquipment } from '../../redux/storeSlice';
import { ItemGrid } from '../shared/ItemGrid';
import { webConf } from '../../dataSources/networkConfiguration';
import { refreshProfile } from '../../dataSources/profileNetworking';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Container = 'PurchaseProcessingModal-Container';
const Title = 'PurchaseProcessingModal-Title';
const Message = 'PurchaseProcessingModal-Message';
const ProcessingAnim = 'PurchaseProcessingModal-ProcessingAnim';
const ItemGridStyle = 'PurchaseProcessingModal-ItemGrid';
const DoneButton = 'PurchaseProcessingModal-DoneButton';

const StringIDPurchaseProcessingMessage = 'StorePurchaseProcessingMessage';
const StringIDYouPurchased = 'StorePurchaseYouPurchased';

interface State {
  isDelaying: boolean;
  isPurchaseComplete: boolean;
}

interface ReactProps {}

interface InjectedProps {
  perks: PerkGQL[];
  quests: QuestGQL[];
  battlePassQuests: QuestDefGQL[];
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDefGQL>;
  purchases: PurchaseDefGQL[];
  purchaseIdToProcess: string;
  suppressAlertStar: boolean;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class APurchaseProcessingModal extends React.Component<Props, State> {
  private delayTimeout: number;
  constructor(props: Props) {
    super(props);

    this.delayTimeout = window.setTimeout(() => {
      this.setState({ isDelaying: false });
      this.delayTimeout = null;
    }, 2000);
    this.state = { isDelaying: true, isPurchaseComplete: false };
  }

  public render() {
    return (
      // Unsetting the height lets the modal calculate its size based on content.
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride='unset'>
        <div className={Container}>
          {this.state.isDelaying || !this.state.isPurchaseComplete
            ? this.renderProcessingState()
            : this.renderSuccessState()}
        </div>
      </MiddleModalDisplay>
    );
  }

  private renderProcessingState(): React.ReactNode {
    return (
      <>
        <div className={Title}>{getStringTableValue(StringIDGeneralProcessing, this.props.stringTable)}</div>
        <div className={Message}>{getStringTableValue(StringIDPurchaseProcessingMessage, this.props.stringTable)}</div>
        <img className={ProcessingAnim} src='images/fullscreen/loadingscreen/loading-anim.gif' />
      </>
    );
  }

  private renderSuccessState(): React.ReactNode {
    const purchase = this.props.purchases.find((p) => {
      return p.id === this.props.purchaseIdToProcess;
    });

    return (
      <>
        <div className={Title}>{getStringTableValue(StringIDGeneralSuccess, this.props.stringTable)}</div>
        <div className={Message}>
          {getTokenizedStringTableValue(StringIDYouPurchased, this.props.stringTable, {
            ITEM_NAME: purchase.name
          })}
        </div>

        <ItemGrid className={ItemGridStyle} items={purchase.perks} />

        <Button
          type='blue'
          text={getStringTableValue(StringIDGeneralDone, this.props.stringTable)}
          styles={DoneButton}
          onClick={this.onClose.bind(this)}
        />
      </>
    );
  }

  componentDidMount(): void {
    const purchase = this.props.purchases.find((p) => {
      return p.id === this.props.purchaseIdToProcess;
    });
    if (purchase) {
      this.beginPurchaseProcess();
    } else {
      // Should be impossible, but we'll capture it just in case.
      console.error(
        `Attempted to process purchase with id ${this.props.purchaseIdToProcess}, which was not found in the database.`
      );
      this.props.dispatch?.(hideAllOverlays());
    }
  }

  componentWillUnmount(): void {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
      this.delayTimeout = null;
    }
  }

  private async beginPurchaseProcess(): Promise<void> {
    // Attempt to perform the transaction.
    const res = await ProfileAPI.Purchase(webConf, this.props.purchaseIdToProcess, 1);
    if (!res.ok) {
      this.props.dispatch(hideAllOverlays());
      this.props.dispatch(showError(res));
    } else {
      this.props.dispatch(hideRightPanel());
      refreshProfile();

      const purchase = this.props.purchases.find((p) => {
        return p.id === this.props.purchaseIdToProcess;
      });

      // Mark the acquired items as Unseen.
      if (this.props.suppressAlertStar !== true) {
        purchase.perks.forEach((perkReward) => {
          const perk = this.props.perksByID[perkReward.perkID];
          if (isChampionEquipmentPerk(perk.perkType)) {
            // Redux
            this.props.dispatch(updateStoreAddUnseenEquipment(perkReward.perkID));
            // Local Storage
            const allUnseenEquipment = clientAPI.getUnseenEquipment();
            allUnseenEquipment[perkReward.perkID] = true;
            clientAPI.setUnseenEquipment(allUnseenEquipment);
          }
        });
      }

      this.setState({ isPurchaseComplete: true });
    }
  }

  private async onClose(): Promise<void> {
    this.props.dispatch(hideOverlay(Overlay.PurchaseProcessing));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { quests, perks } = state.profile;
  const battlePassQuests = state.quests.quests?.BattlePass;
  const { stringTable } = state.stringTable;
  const { perksByID, purchases, purchaseIdToProcess, suppressAlertStarOnNextPurchase } = state.store;

  return {
    ...ownProps,
    perks,
    quests,
    battlePassQuests,
    stringTable,
    perksByID,
    purchases,
    purchaseIdToProcess,
    suppressAlertStar: suppressAlertStarOnNextPurchase
  };
}

export const PurchaseProcessingModal = connect(mapStateToProps)(APurchaseProcessingModal);
