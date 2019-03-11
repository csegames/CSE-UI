/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { TextInput } from 'shared/TextInput';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const Container = styled.div`
  position: relative;
  top: 0px;
  left: 5px;
  right: 0;
  height: 31px;
  margin-bottom: 10px;
  padding: 0 0 5px 5px;
  background: url(../images/crafting/1080/search-line.png) no-repeat;
  background-position: left bottom;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    height: 77px;
    padding: 0 0 5px 15px;
    background: url(../images/crafting/4k/search-line.png) no-repeat;
    background-position: left bottom;
  }
`;

const WrapperStyle = css`
  width: 100%;
  height: 100%;
`;

const InputStyle = css`
  width: 100%;
  height: 100%;
  background: transparent !important;
  border: 0px !important;
  outline: none !important;
  font-family: Caveat !important;
  font-size: 20px !important;
  color: black !important;
  &::placeholder {
    color: black !important;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 40px !important;
  }
`;

export interface Props {
  searchValue: string;
  onSearchChange: (searchValue: string) => void;
}

class SearchInput extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <TextInput
          placeholder={'Search'}
          overrideInputStyles
          wrapperClassName={WrapperStyle}
          inputClassName={InputStyle}
          value={this.props.searchValue}
          onChange={this.onChange}
        />
      </Container>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSearchChange(e.target.value);
  }
}

export default SearchInput;
