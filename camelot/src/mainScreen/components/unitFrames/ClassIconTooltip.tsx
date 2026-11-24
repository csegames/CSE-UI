/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { UnitFrameTextTooltip } from './UnitFrameTextTooltip';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../../helpers/stringTableHelpers';

interface Props {
  className: string;
  tooltipID: string;
  classDef: ClassDef;
  stringTable: Record<string, StringTableEntryDef>;
}

// PureComponent so the frame's resource ticks skip the string table lookup.
export class ClassIconTooltip extends React.PureComponent<Props> {
  render(): JSX.Element {
    return (
      <UnitFrameTextTooltip
        className={this.props.className}
        tooltipID={this.props.tooltipID}
        text={getStringTableValue(this.props.classDef.name, this.props.stringTable)}
      />
    );
  }
}
