/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';

export enum BuildPaneType {
  Blocks = 0,
  Recent = 1,
  Blueprints = 2,
  DropLight = 3
}

export interface BuildPaneProps {
  minimized: boolean
}

export interface BuildPane {
  type: BuildPaneType,
  title: string,
  minTitle: string,
  data: {},
  component: any
}
