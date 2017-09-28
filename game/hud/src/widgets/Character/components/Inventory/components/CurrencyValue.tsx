/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { colors } from '../../../lib/constants';

enum CurrencyValueType {
  Small,
  OneHundredKPlus,
  TenMPlus,
}

function getCurrencyValueType(value: number) {
  if (value < 100000) return CurrencyValueType.Small;
  if (value < 1000000) return CurrencyValueType.OneHundredKPlus;
  return CurrencyValueType.TenMPlus;
}

export const CurrencyValue = (props: {value: number}) => {
  const type = getCurrencyValueType(props.value);
  switch (type) {
    case CurrencyValueType.Small:
      // $
      return (
        <span style={{ color: colors.smallMoney }}>
          {props.value}
        </span>
      );
    case CurrencyValueType.OneHundredKPlus:
      // $$
      let mediumVal = props.value.toFixed(0);
      mediumVal = mediumVal.substring(0, mediumVal.length - 3);
      return (
        <span style={{ color: colors.OneHundredKMoney }}>
          {mediumVal}K
        </span>
      );
    case CurrencyValueType.TenMPlus:
      // $$$
      let richValue = props.value.toFixed(0);
      richValue = richValue.substring(0, richValue.length - 6);
      return (
        <span style={{ color: colors.TenMMoney }}>
          {richValue}M
        </span>
      );
  }
};

export default CurrencyValue;
