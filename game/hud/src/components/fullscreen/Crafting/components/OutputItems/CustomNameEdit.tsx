/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { debounce } from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { VoxJob } from 'gql/interfaces';
import { getJobContext } from 'fullscreen/Crafting/lib/utils';
import { TextInput } from 'shared/TextInput';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const Container = styled.div`
  width: 144px;
  height: 144px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(../images/crafting/1080/output-input.png) no-repeat;
  background-size: contain;
  margin-top: -25px;
  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    width: 120px;
    height: 120px;
  }
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 345px;
    height: 345px;
    background: url(../images/crafting/4k/output-input.png) no-repeat;
    background-size: contain;
  }
`;

const InputStyle = css`
  color: #91FFFF !important;
  font-size: 12px !important;
  font-family: Caudex !important;
  background-color: transparent;
  border: 0px;
  width: 90px;
  text-align: center;
  &::-webkit-input-placeholder {
    color: #91FFF !important;
    font-size: 12px !important;
    font-family: Caudex !important;
  }
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 24px !important;
    width: 200px;
    &::-webkit-input-placeholder {
      font-size: 24px !important;
    }
  }
`;

export interface InjectedProps {
  voxJob: VoxJob.Fragment;
  onCustomNameChange: (customName: string) => void;
}

export interface ComponentProps {
  jobNumber: number;
}

export type Props = InjectedProps & ComponentProps;

export interface State {
  value: string;
}

class CustomName extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.voxJob && props.voxJob.givenName ? props.voxJob.givenName : '',
    };

    this.onCustomNameChange = debounce(this.onCustomNameChange, 500);
  }

  public render() {
    return (
      <Container>
        <TextInput
          placeholder='Name of item'
          overrideInputStyles
          inputClassName={InputStyle}
          value={this.state.value}
          onChange={this.onInputChange}
        />
      </Container>
    );
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
    this.onCustomNameChange(e.target.value);
  }

  private onCustomNameChange = (customName: string) => {
    this.props.onCustomNameChange(customName);
  }
}

class CustomNameWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ voxJob, onCustomNameChange }) => (
          <CustomName {...this.props} voxJob={voxJob} onCustomNameChange={onCustomNameChange} />
        )}
      </JobContext.Consumer>
    );
  }
}

export default CustomNameWithInjectedContext;
