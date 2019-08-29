/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { Tooltip } from 'shared/Tooltip';
import { getJobContext } from '../../lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region ResetButton constants
const RESET_BUTTON_FONT_SIZE = 24;
// #endregion
const ResetButton = styled.div`
  color: #FFD899;
  font-size: ${RESET_BUTTON_FONT_SIZE}px;
  cursor: pointer;

  @media (max-width: 2560px) {
    font-size: ${RESET_BUTTON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${RESET_BUTTON_FONT_SIZE * HD_SCALE}px;
  }

  &:hover {
    -webkit-filter: brightness(120%);
    filter: brightness(120%);
  }
  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

// #region TooltipContent constants
const TOOLTIP_CONTENT_PADDING_VERTICAL = 4;
const TOOLTIP_CONTENT_PADDING_HORIZONTAL = 10;
const TOOLTIP_CONTENT_FONT_SIZE = 28;
// #endregion
const TooltipContent = styled.div`
  padding: ${TOOLTIP_CONTENT_PADDING_VERTICAL}px ${TOOLTIP_CONTENT_PADDING_HORIZONTAL}px;
  font-size: ${TOOLTIP_CONTENT_FONT_SIZE}px;
  color: #CCC;

  @media (max-width: 2560px) {
    padding: ${TOOLTIP_CONTENT_PADDING_VERTICAL * MID_SCALE}px ${TOOLTIP_CONTENT_PADDING_HORIZONTAL * MID_SCALE}px;
    font-size: ${TOOLTIP_CONTENT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${TOOLTIP_CONTENT_PADDING_VERTICAL * HD_SCALE}px ${TOOLTIP_CONTENT_PADDING_HORIZONTAL * HD_SCALE}px;
    font-size: ${TOOLTIP_CONTENT_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface Props {
  canClear: boolean;
  jobNumber: number;
}

class ClearJob extends React.PureComponent<Props> {
  public render() {
    const { jobNumber, canClear } = this.props;
    const JobContext = getJobContext(jobNumber);
    const className = `${canClear ? '' : 'disabled'}`;
    return (
      <JobContext.Consumer>
        {({ onClearJob }) => {
          return (
            <Tooltip content={<TooltipContent>Clear</TooltipContent>}>
              <ResetButton className={className} onClick={onClearJob}>
                <span className='fa fa-undo' />
              </ResetButton>
            </Tooltip>
          );
        }}
      </JobContext.Consumer>
    );
  }
}

export default ClearJob;
