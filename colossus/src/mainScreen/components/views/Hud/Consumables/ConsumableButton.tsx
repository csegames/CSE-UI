/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ConsumableItem } from '@csegames/library/dist/hordetest/game/types/Consumables';
import { Binding } from '@csegames/library/dist/_baseGame/types/Keybind';

const Container = 'Consumables-ConsumableButton-Container';
const Image = 'Consumables-ConsumableButton-Image';

const KeybindBox = 'Consumables-ConsumableButton-KeybindBox';

export interface Props {
  item: ConsumableItem;
  isActive: boolean;
  useKeybind: Binding;
}

export default class ConsumableButton extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    let containerClasses: string = `${Container}`;

    if (this.isTrulyActive()) {
      containerClasses = `${containerClasses} active`;
    }

    return (
      <button className={containerClasses}>
        {this.getButtonImage()}
        {this.getKeybind()}
      </button>
    );
  }

  private getButtonImage(): JSX.Element {
    if (!this.isPopulatedWithItem()) {
      return;
    }

    return <img className={Image} src={this.props.item.iconUrl} />;
  }

  private getKeybind(): JSX.Element {
    if (!this.isPopulatedWithItem() || !this.props.isActive) {
      return;
    }

    if (this.props.useKeybind) {
      if (this.props.useKeybind.iconClass) {
        return <p className={`${this.props.useKeybind.iconClass} ${KeybindBox}`} />;
      }

      return <p className={KeybindBox}>{this.props.useKeybind.name}</p>;
    }

    return <p className={KeybindBox} />;
  }

  private isPopulatedWithItem(): boolean {
    return !!this.props.item && !!this.props.item.name;
  }

  private isTrulyActive(): boolean {
    return this.isPopulatedWithItem() && !!this.props.isActive;
  }
}
