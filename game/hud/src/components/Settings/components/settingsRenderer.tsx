/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { CheckBoxField } from '../components/CheckBoxField';
import { SliderField } from '../components/SliderField';
import { SettingsHeading } from '../components/SettingsHeading';

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
}

export function settingsRenderer(props: RenderSettingsProps) {
  const { config, settings, onToggle, onChange } = props;
  let headingKey: number = 0;
  return config && (
    <div>
      { Object.keys(settings).map((key) => {
        const setting = settings[key];
        switch (setting.type) {
          case SettingsHeading:
            return <SettingsHeading key={headingKey++} text={key}/>;
          default:
            if (config[key]) {    // ignore options that don't exist
              switch (setting.type) {
                case CheckBoxField:
                  return <CheckBoxField key={key} label={key} id={key} on={config[key] === 'true'}
                      onToggle={onToggle}
                      />;
                case SliderField:
                  return <SliderField key={key} label={key} id={key}
                      current={config[key] | 0}
                      min={setting.min}
                      max={setting.max}
                      step={setting.step}
                      logrithmic={setting.logrithmic}
                      onChange={onChange}
                      />;
              }
            }
            break;
        }
      })}
    </div>
  );
}
