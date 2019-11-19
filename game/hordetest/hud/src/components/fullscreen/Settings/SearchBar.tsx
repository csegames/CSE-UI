/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { ItemContainer } from './ItemContainer';
import { Input } from '../Input';

export interface Props {
  searchValue: string;
  onSearchValueChange: (searchValue: string) => void;
}

export function SearchBar(props: Props) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.onSearchValueChange(e.target.value);
  }

  return (
    <ItemContainer>
      <Input placeholder='Search' value={props.searchValue} onChange={onChange} />
    </ItemContainer>
  );
}
