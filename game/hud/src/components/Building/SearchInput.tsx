/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { debounce } from 'lodash';
import { css } from 'react-emotion';
import { TextInput } from 'UI/TextInput';
import { Box } from 'UI/Box';

const SearchWrapper = css`
  display: flex;
  flex: 1;
`;

const SearchBox = css`
  height: 25px;
  flex: 1;
  background-color: black;
  color: white;
  margin: 2px;
  border: 0;
  padding: 0 10px;
  outline: none;
  transition: all 0.30s ease-in-out;
  box-shadow: 0 0 2px rgba(0,0,0,0);
  &:focus {
    box-shadow: 0 0 2px rgba(239,190,152,1);
  }
`;

export interface Props {
  value: string;
  onChange: (text: string) => void;
}

export class SearchInput extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.onSearchValueChange = debounce(this.onSearchValueChange, 200);
  }

  public render() {
    return (
      <Box>
        <TextInput
          placeholder='Search'
          wrapperClassName={SearchWrapper}
          inputClassName={SearchBox}
          onChange={this.onChange}
        />
      </Box>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.onSearchValueChange(e.target.value);
  }

  private onSearchValueChange = (text: string) => {
    const searchValue = text.replace(new RegExp(/\s/g), '').toLowerCase();
    this.props.onChange(searchValue);
  }
}
