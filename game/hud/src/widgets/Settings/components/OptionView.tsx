/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { CheckBoxField, SliderField } from 'components/UI';
import { DropDownField } from 'components/UI/DropDownField';

interface Props {
  option: GameOption;
  onChange: (option: GameOption) => any;
}

// tslint:disable-next-line:function-name
export function OptionView(props: Props) {
  const { option, onChange } = props;
  switch (props.option.kind) {
    case OptionKind.Boolean:
      return <CheckBoxField
        key={option.name}
        label={option.name}
        on={option.value as boolean}
        onToggle={() => {
          option.value = !option.value;
          onChange(option);
        }}
      />;
    case OptionKind.IntRangeOption:
    case OptionKind.FloatRangeOption:
    case OptionKind.DoubleRangeOption:
      {
        const opt = option as IntRangeOption;
        return <SliderField
          key={opt.name}
          label={opt.name}
          current={opt.value}
          min={opt.minValue}
          max={opt.maxValue}
          step={opt.increment}
          logarithmic={opt.maxValue * opt.increment - opt.minValue * opt.increment > 1000}
          onChange={(value: number) => {
            opt.value = value;
            onChange(opt);
          }}
        />;
      }
    case OptionKind.Select:
      {
        const opt = option as SelectOption;
        const values = Object.values(opt.selectValues);
        return <DropDownField
                      key={opt.name}
                      label={opt.displayName}
                      selectedItem={opt.value}
                      items={values}
                      onSelectItem={(value: SelectValue) => {
                        opt.value = value;
                        onChange(opt);
                      }}
                    />;
      }
  }

  return (
    <div>Option</div>
  );
}
