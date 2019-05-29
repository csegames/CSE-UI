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
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_DIMENSIONS = 288;
const CONTAINER_MARGIN_TOP = -50;
// #endregion
const Container = styled.div`
  width: ${CONTAINER_DIMENSIONS}px;
  height: ${CONTAINER_DIMENSIONS}px;
  margin-top: ${CONTAINER_MARGIN_TOP}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(../images/crafting/uhd/output-input.png);
  background-repeat: no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    width: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
    margin-top: ${CONTAINER_MARGIN_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * HD_SCALE}px;
    margin-top: ${CONTAINER_MARGIN_TOP * HD_SCALE}px;
    background-image: url(../images/crafting/hd/output-input.png);
  }
`;

// #region InputStyle constants
const INPUT_STYLE_FONT_SIZE = 24;
const INPUT_STYLE_WIDTH = 180;
// #endregion
const InputStyle = css`
  color: #91FFFF !important;
  font-size: ${INPUT_STYLE_FONT_SIZE}px !important;
  width: ${INPUT_STYLE_WIDTH}px;
  font-family: Caudex !important;
  background-color: transparent;
  border: 0px;
  text-align: center;
  &::-webkit-input-placeholder {
    color: #91FFF !important;
    font-size: ${INPUT_STYLE_FONT_SIZE}px !important;
    font-family: Caudex !important;
  }

  @media (max-width: 2560px) {
    font-size: ${INPUT_STYLE_FONT_SIZE * MID_SCALE}px !important;
    width: ${INPUT_STYLE_WIDTH * MID_SCALE}px;
    &::-webkit-input-placeholder {
      font-size: ${INPUT_STYLE_FONT_SIZE * MID_SCALE}px !important;
    }
  }

  @media (max-width: 1920px) {
    font-size: ${INPUT_STYLE_FONT_SIZE * HD_SCALE}px !important;
    width: ${INPUT_STYLE_WIDTH * HD_SCALE}px;
    &::-webkit-input-placeholder {
      font-size: ${INPUT_STYLE_FONT_SIZE * HD_SCALE}px !important;
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
