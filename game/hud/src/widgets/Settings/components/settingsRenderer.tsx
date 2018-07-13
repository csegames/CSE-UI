/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { CheckBoxField } from 'UI/CheckBoxField';
import { SliderField } from 'UI/SliderField';
import { SubHeading } from 'UI/SubHeading';
import { DropDownField, DropDownItem } from 'UI/DropDownField';

interface Setting {
  type: React.Component | Function;
  min?: number;
  max?: number;
  step?: number;
  logrithmic?: boolean;
}

export interface Settings {
  [key: string]: Setting;
}

interface RenderSettingsProps {
  config?: any;
  settings?: Settings;
  onToggle?: (id: string) => void;
  onChange?: (id: string, value: number) => void;
  dropDownItemsDictionary?: { [configKey: string]: string[] };
  selectedDropDownItemDictionary?: { [configKey: string]: string };
  onSelectDropdownItem?: (item: DropDownItem) => void;
}

export function settingsRenderer(props: RenderSettingsProps) {
  const { config, settings, onToggle, onChange } = props;
  let headingKey: number = 0;
  return config && (
    <div>
      { Object.keys(settings).map((key) => {
        const setting = settings[key];
        switch (setting.type) {
          case SubHeading:
            return <SubHeading key={headingKey++}>{key}</SubHeading>;
          default:
            if (config[key]) {    // ignore options that don't exist
              switch (setting.type) {
                case CheckBoxField:
                  return (
                    <CheckBoxField
                      key={key}
                      label={key}
                      id={key}
                      on={config[key] === 'true'}
                      onToggle={onToggle}
                    />
                  );
                case SliderField:
                  return (
                    <SliderField
                      key={key}
                      label={key}
                      id={key}
                      current={config[key] | 0}
                      min={setting.min}
                      max={setting.max}
                      step={setting.step}
                      logrithmic={setting.logrithmic}
                      onChange={onChange}
                    />
                  );
                case DropDownField:
                  return (
                    <DropDownField
                      key={key}
                      id={key}
                      label={key}
                      selectedItem={props.selectedDropDownItemDictionary[key]}
                      items={props.dropDownItemsDictionary[key]}
                      onSelectItem={props.onSelectDropdownItem}
                    />
                  );
              }
            }
            break;
        }
      })}
    </div>
  );
}
