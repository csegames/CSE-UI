/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralAccept,
  StringIDGeneralCancel,
  StringIDGeneralReject
} from '../../helpers/stringTableHelpers';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { EntityID } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import { FactionButton } from '../FactionButton';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { TradeSnapshot, TradeState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/TradeSnapshot';

// CSS classes
const Root = 'HUD-TradeRequests-Root';
const RootContent = 'HUD-TradeRequests-RootContent';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const RequestRow = 'HUD-TradeRequests-RequestRow';
const RequesterNameLabel = 'HUD-TradeRequests-RequesterNameLabel';
const RequestButton = 'HUD-TradeRequests-RequestButton';

// String IDs
const StringIDTradeRequestsTitle = 'TradeRequestsTitle';
const StringIDTradeOutgoingRequest = 'TradeOutgoingRequest';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  tradeRequesters: Record<EntityID, string>;
  tradeSnapshot: TradeSnapshot;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class ATradeRequests extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <FactionBorder
        className={Root}
        type={BorderType.Primary}
        background={BorderBackground.Leather}
        titleText={getStringTableValue(StringIDTradeRequestsTitle, this.props.stringTable)}
      >
        <div className={RootContent}>
          {this.renderOutgoingInvite()}
          {Object.entries(this.props.tradeRequesters).map(this.renderRequestRow.bind(this))}
        </div>
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_TRADEREQUESTS} />
      </FactionBorder>
    );
  }

  private renderOutgoingInvite(): React.ReactNode {
    if (this.props.tradeSnapshot.tradeState !== TradeState.Invited) {
      return null;
    }

    return (
      <div className={RequestRow}>
        <div className={RequesterNameLabel}>
          {getTokenizedStringTableValue(StringIDTradeOutgoingRequest, this.props.stringTable, {
            INVITEE: this.props.tradeSnapshot.tradeTargetName
          })}
        </div>
        <FactionButton
          className={RequestButton}
          style={{ fontSize: '1.5rem' }}
          widthOverrideVmin={10}
          onClick={() => clientAPI.revokeTradeInvite(this.props.tradeSnapshot.tradeTargetEntityID)}
        >
          {getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
        </FactionButton>
      </div>
    );
  }

  private renderRequestRow(entry: [EntityID, string]): React.ReactNode {
    const [requesterEntityID, requesterName] = entry;

    return (
      <div className={RequestRow}>
        <div className={RequesterNameLabel}>{requesterName}</div>
        <FactionButton
          className={RequestButton}
          style={{ fontSize: '1.5rem' }}
          widthOverrideVmin={10}
          onClick={() => clientAPI.acceptTradeInvite(requesterEntityID)}
        >
          {getStringTableValue(StringIDGeneralAccept, this.props.stringTable)}
        </FactionButton>
        <FactionButton
          className={RequestButton}
          style={{ fontSize: '1.5rem' }}
          widthOverrideVmin={10}
          onClick={() => clientAPI.rejectTradeInvite(requesterEntityID)}
        >
          {getStringTableValue(StringIDGeneralReject, this.props.stringTable)}
        </FactionButton>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    tradeRequesters: state.trade.tradeRequesters,
    tradeSnapshot: state.trade.tradeSnapshot
  };
};

const TradeRequests = connect(mapStateToProps)(ATradeRequests);

export const WIDGET_ID_TRADEREQUESTS = 'TradeRequests';
export const tradeRequestsRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_TRADEREQUESTS,
  nameStringID: 'HUDEditorWidgetNameTradeRequests',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 5
  },
  initTopics: [],
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <TradeRequests isDragCopy={isDragCopy} />;
  }
};
