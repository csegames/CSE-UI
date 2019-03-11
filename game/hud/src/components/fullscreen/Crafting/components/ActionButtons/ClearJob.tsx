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
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const ResetButton = styled.div`
  color: #FFD899;
  font-size: 12px;
  cursor: pointer;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 16px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 24px;
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

const TooltipContent = styled.div`
  padding: 2px 5px;
  font-size: 14px;
  color: #CCC;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    padding: 3px 10px;
    font-size: 18px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    padding: 6px 15px;
    font-size: 28px;
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
