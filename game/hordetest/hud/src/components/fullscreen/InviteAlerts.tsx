/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import gql from 'graphql-tag';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult  } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult } from '@csegames/library/lib/_baseGame/graphql/subscription';
import { IInteractiveAlert, GroupAlert, AlertCategory } from '@csegames/library/lib/hordetest/graphql/schema';
import { Button } from './Button';
import { webAPI } from '@csegames/library/lib/hordetest';
import { showActionAlert } from 'components/shared/ActionAlert';

// @ts-ignore
const query = gql`
  query InteractiveAlertsQuery {
    myInteractiveAlerts {
      category
      targetID

      ... on GroupAlert {
        kind
        fromName
        fromID
        forGroup
        forGroupName
        code
      }
    }
  }
`;

const interactiveAlertSubscription = gql`
  subscription InteractiveAlertsSubscription {
    interactiveAlerts {
      category
      targetID

      ... on GroupAlert {
        kind
        fromName
        fromID
        forGroup
        forGroupName
        code
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 100px;
`;

const AlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px 0;
  padding: 25px 0;
  width: 400px;
  background: linear-gradient(to right, rgba(42, 82, 185, 1), rgba(42, 82, 185, 0.2));
`;

const AlertText = styled.div`
  font-size: 22px;
  color: white;
`;

const UserText = styled.span`
  color: #3FC9FD;
`;

const ButtonContainer = styled.div`
  display: flex;
  font-size: 16px;
  margin-top: 10px;
`;

const ButtonSpacing = css`
  margin: 0 5px;
`;

export interface Props {
}

export function InviteAlerts(props: Props) {
  const [interactiveAlerts, setInteractiveAlerts] = useState<IInteractiveAlert[]>([]);

  function onDeclineClick(alert: IInteractiveAlert) {
    removeAlert(alert);
  }

  async function onAcceptClick(e: React.MouseEvent<HTMLButtonElement>, alert: IInteractiveAlert) {
    const groupAlert = alert as GroupAlert;
    const res = await webAPI.GroupsAPI.JoinV1(
      webAPI.defaultConfig,
      game.shardID,
      game.characterID,
      groupAlert.forGroup,
      groupAlert.code,
    );

    if (res.ok) {
      removeAlert(alert);
    } else {
      showActionAlert('Failed to Accept Invite', { clientX: e.clientX, clientY: e.clientY });
    }
  }

  function removeAlert(alert: IInteractiveAlert) {
    const alerts = [...interactiveAlerts];
    setInteractiveAlerts(alerts.filter(a => alert.when !== a.when));
  }

  // @ts-ignore
  function handleQuery(gql: GraphQLResult<{ myInteractiveAlerts: IInteractiveAlert[] }>) {
    if (!gql || !gql.data || !gql.data.myInteractiveAlerts) return gql;

    setInteractiveAlerts(gql.data.myInteractiveAlerts);
    return gql;
  }

  function handleSubscription(result: SubscriptionResult<{ interactiveAlerts: IInteractiveAlert }>, data: any) {
    if (!result.data && !result.data.interactiveAlerts) return data;
    if (result.data.interactiveAlerts.category !== AlertCategory.Group) return data;

    const newInteractiveAlert = result.data.interactiveAlerts;
    const myInteractiveAlerts = [...interactiveAlerts];
    myInteractiveAlerts.push(newInteractiveAlert);
    setInteractiveAlerts(myInteractiveAlerts);
    return data;
  }

  function renderAlert(alert: IInteractiveAlert) {
    switch (alert.category) {
      case AlertCategory.Group: {
        const groupAlert = alert as GroupAlert;
        return (
          <AlertContainer>
            <AlertText>Join <UserText>{groupAlert.fromName}'s</UserText> Party?</AlertText>

            <ButtonContainer>
              <Button type='gray' text='Decline' styles={ButtonSpacing} onClick={() => onDeclineClick(groupAlert)} />
              <Button type='blue' text='Accept' styles={ButtonSpacing} onClick={(e) => onAcceptClick(e, groupAlert)} />
            </ButtonContainer>
          </AlertContainer>
        );
      }

      default: return null;
    }
  }

  return (
    <Container>
      {true &&
        <GraphQL
          // query={query}
          // onQueryResult={handleQuery}
          subscription={{
            query: interactiveAlertSubscription,
            initPayload: {
              characterID: game.characterID,
              token: game.accessToken,
              shardID: game.shardID,
            }
          }}
          subscriptionHandler={handleSubscription}
        />
      }
      {interactiveAlerts.map(renderAlert)};
    </Container>
  );
}
