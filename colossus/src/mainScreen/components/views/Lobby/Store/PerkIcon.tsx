/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { PerkDefGQL, PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';

const Root = 'StartScreen-Store-PerkIcon-Root';
const Image = 'StartScreen-Store-PerkIcon-Image';
const Text = 'StartScreen-Store-PerkIcon-Text';

interface ReactProps {
  perkID: string;
  className?: string;
  imageURLOverride?: string;
  colorOverride?: string;
}

interface InjectedProps {
  perksByID: Dictionary<PerkDefGQL>;
}

type Props = ReactProps & InjectedProps;

class APerkIcon extends React.Component<Props> {
  render(): React.ReactNode {
    // If there is an override, just use it, but styled our way.
    if (this.props.imageURLOverride) {
      return (
        <div className={`${Root} ${this.props.className}`}>
          <img className={Image} src={this.props.imageURLOverride} />
        </div>
      );
    }

    // If the perk doesn't exist, we can at least show something.
    const perk = this.props.perksByID[this.props.perkID];
    if (!perk) {
      return (
        <div className={`${Root} ${this.props.className}`}>
          <img className={Image} src={'images/MissingAsset.png'} />
        </div>
      );
    }

    const iconURL = perk.perkType === PerkType.Portrait ? perk.portraitThumbnailURL : perk.iconURL;
    const isTextIcon = perk.iconClass?.length > 0 && perk.iconClassColor?.length > 0;
    const hasBG = perk.backgroundURL?.length > 0;
    const hasFG = isTextIcon || iconURL?.length > 0;
    // When both BG and FG exist, BG is shown at reduced opacity.
    const darkClass = hasBG && hasFG ? 'Dark' : '';

    return (
      <div className={`${Root} ${this.props.className}`}>
        {hasBG && <img className={`${Image} ${darkClass}`} src={perk.backgroundURL} />}
        {isTextIcon ? (
          <div
            className={`${Text} ${perk.iconClass} ${this.props.className}`}
            style={{ color: this.props.colorOverride ?? `#${perk.iconClassColor}` }}
          />
        ) : (
          <img
            className={`${Image} ${this.props.className}`}
            src={(perk.iconURL?.length ?? 0) > 0 ? perk.iconURL : 'images/MissingAsset.png'}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID } = state.store;

  return {
    ...ownProps,
    perksByID
  };
}

export const PerkIcon = connect(mapStateToProps)(APerkIcon);
