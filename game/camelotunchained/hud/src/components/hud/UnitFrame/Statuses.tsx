/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';
import { StatusUIVisiblity } from '@csegames/library/lib/camelotunchained/graphql/schema';
import { StatusDef } from 'gql/interfaces';
import { Tooltip } from 'shared/Tooltip';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_MIN_WIDTH = 180;
// #endregion
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: ${CONTAINER_MIN_WIDTH}px;

  @media (max-width: 2560px) {
    min-width: ${CONTAINER_MIN_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    min-width: ${CONTAINER_MIN_WIDTH * HD_SCALE}px;
  }
`;

const StatusSection = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  min-width: ${CONTAINER_MIN_WIDTH}px;

  @media (max-width: 2560px) {
    min-width: ${CONTAINER_MIN_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    min-width: ${CONTAINER_MIN_WIDTH * HD_SCALE}px;
  }
`;

// #region Status constants
const STATUS_DIMENSIONS = 32;
const STATUS_MARGIN = 4;
// #endregion
const Status = styled.div`
  position: relative;
  overflow: hidden;
  border: 1px solid black;
  border-radius: 50%;
  width: ${STATUS_DIMENSIONS}px;
  height: ${STATUS_DIMENSIONS}px;
  margin: ${STATUS_MARGIN}px;

  @media (max-width: 2560px) {
    width: ${STATUS_DIMENSIONS * MID_SCALE}px;
    height: ${STATUS_DIMENSIONS * MID_SCALE}px;
    margin: ${STATUS_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${STATUS_DIMENSIONS * HD_SCALE}px;
    height: ${STATUS_DIMENSIONS * HD_SCALE}px;
    margin: ${STATUS_MARGIN * HD_SCALE}px;
  }
`;

// #region StatusTooltip constants
const STATUS_TOOLTIP_PADDING = 10;
const STATUS_TOOLTIP_MIN_WIDTH = 400;
const STATUS_TOOLTIP_MAX_WIDTH = 600;
const STATUS_TOOLTIP_MAX_HEIGHT = 1500;
// #endregion
const StatusTooltip = styled.div`
  padding: ${STATUS_TOOLTIP_PADDING}px;
  min-width: ${STATUS_TOOLTIP_MIN_WIDTH}px;
  max-width: ${STATUS_TOOLTIP_MAX_WIDTH}px;
  max-height: ${STATUS_TOOLTIP_MAX_HEIGHT}px;

  @media (max-width: 2560px) {
    padding: ${STATUS_TOOLTIP_PADDING * MID_SCALE}px;
    min-width: ${STATUS_TOOLTIP_MIN_WIDTH * MID_SCALE}px;
    max-width: ${STATUS_TOOLTIP_MAX_WIDTH * MID_SCALE}px;
    max-height: ${STATUS_TOOLTIP_MAX_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${STATUS_TOOLTIP_PADDING * HD_SCALE}px;
    min-width: ${STATUS_TOOLTIP_MIN_WIDTH * HD_SCALE}px;
    max-width: ${STATUS_TOOLTIP_MAX_WIDTH * HD_SCALE}px;
    max-height: ${STATUS_TOOLTIP_MAX_HEIGHT * HD_SCALE}px;
  }
`;

// #region StatusTooltipName constants
const STATUS_TOOLTIP_NAME_FONT_SIZE = 40;
// #endregion
const StatusTooltipName = styled.div`
  font-size: ${STATUS_TOOLTIP_NAME_FONT_SIZE}px;
  margin: 0;

  @media (max-width: 2560px) {
    font-size: ${STATUS_TOOLTIP_NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${STATUS_TOOLTIP_NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region StatusTooltipDescription constants
const STATUS_TOOLTIP_DESCRIPTION_FONT_SIZE = 32;
// #endregion
const StatusTooltipDescription = styled.div`
  margin: 0;
  padding: 0;
  font-size: ${STATUS_TOOLTIP_DESCRIPTION_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${STATUS_TOOLTIP_DESCRIPTION_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${STATUS_TOOLTIP_DESCRIPTION_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region StatusText constants
const STATUS_TEXT_FONT_SIZE = 32;
// #endregion
const StatusText = styled.div`
  font-size: ${STATUS_TEXT_FONT_SIZE}px;
  margin: 0;
  padding: 0;

  &.friendly {
    color: #14EB6F;
  }

  &.hostile {
    color: red;
  }

  &.warning {
    color: yellow;
  }

  @media (max-width: 2560px) {
    font-size: ${STATUS_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${STATUS_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export interface Props {
  realmPrefix: string;
  statuses: (({id: any } & Timing) | StatusInfo)[];
}

export interface StatusInfo extends StatusDef, Timing {
  warning?: string;
}

// tslint:disable-next-line:function-name
export function Statuses(props: Props) {
  const [friendlyStatuses, setFriendlyStatuses] = useState<StatusInfo[]>([]);
  const [hostileStatuses, setHostileStatuses] = useState<StatusInfo[]>([]);

  useEffect(() => {
    setStatuses();
  }, [props.statuses]);

  return (
    <Container>
      <StatusSection>{friendlyStatuses.map(renderStatus)}</StatusSection>
      <StatusSection>{hostileStatuses.map(renderStatus)}</StatusSection>
    </Container>
  );

  function renderStatus(status: StatusInfo) {
    const statusRelationToPlayer = getStatusRelationToPlayer(status);
    return (
      <Tooltip content={(
        <StatusTooltip>
          <StatusTooltipName>{status.name}</StatusTooltipName>
          <StatusText className={statusRelationToPlayer}>
            {statusRelationToPlayer === 'friendly' ? 'Positive' : 'Negative'}
          </StatusText>
          <StatusTooltipDescription>{status.description}</StatusTooltipDescription>
          {status.warning && <StatusText className='warning'>WARNING: {status.warning}</StatusText>}
        </StatusTooltip>
      )}>
        <Status key={status.id}>
          <Image src={status.iconURL} />;
        </Status>
      </Tooltip>
    );
  }

  function getStatusRelationToPlayer(statusDef: StatusDef) {
    if (statusDef && statusDef.statusTags && statusDef.statusTags.includes('friendly')) {
      return 'friendly';
    }

    return 'hostile';
  }

  function setStatuses() {
    const friendlyStatuses: StatusInfo[] = [];
    const hostileStatuses: StatusInfo[] = [];
    props.statuses.forEach((status) => {
      const statusDef: StatusDef = getStatusDef(status.id);
      if (statusDef && statusDef.uIVisiblity === StatusUIVisiblity.Hidden) {
        return;
      }

      if (!statusDef) {
        if ((status as StatusInfo).iconURL) {
          // TODO: sort these somehow properly into friendly/hostile
          friendlyStatuses.push({...status});
          return;
        }
        hostileStatuses.push({
          ...status,
          name: 'unknown',
          description: 'unknown',
          iconURL: 'images/unit-frames/4k/' + props.realmPrefix + 'propic.png',
          warning: `Could not find API information for status with id: ${status.id}.`,
        });
        return;
      }

      if (statusDef.statusTags.includes('friendly')) {
        friendlyStatuses.push({ ...status, ...statusDef });
        return;
      }

      if (statusDef.statusTags.includes('hostile')) {
        hostileStatuses.push({ ...status, ...statusDef });
        return;
      }

      hostileStatuses.push({
        ...status,
        ...statusDef,
        warning: 'This status does not have a \'friendly\' or \'hostile\' tag. Defaulting to \'hostile\'.',
      });
    });

    setFriendlyStatuses(friendlyStatuses);
    setHostileStatuses(hostileStatuses);
  }

  function getStatusDef(statusID: number) {
    const info = camelotunchained.game.store.getStatusInfo(statusID);
    return info;
  }
}
