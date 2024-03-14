/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { ChampionInfo } from '@csegames/library/dist/hordetest/graphql/schema';
import * as React from 'react';
import { AbilityType, getKeybindInfoForAbility } from '../../../helpers/abilityhelpers';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';

const Container = 'ChampionSelect-ChampionInfo-Container';
const ChampionName = 'ChampionSelect-ChampionInfo-ChampionName';
const AbilitiesContainer = 'ChampionSelect-ChampionInfo-AbilitiesContainer';
const AbilityContainer = 'ChampionSelect-ChampionInfo-AbilityContainer';

const AbilityIcon = 'ChampionSelect-ChampionInfo-AbilityIcon';
const AbilityName = 'ChampionSelect-ChampionInfo-AbilityName';
const AbilityDescription = 'ChampionSelect-ChampionInfo-AbilityDescription';
const KeyBindIcon = 'ChampionSelect-ChampionInfo-KeyBindIcon';

interface ReactProps {
  selected: ChampionInfo;
}

interface InjectedProps {
  usingGamepadInMainMenu: boolean;
}

type Props = ReactProps & InjectedProps;

class AChampionPanel extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render(): React.ReactNode {
    return (
      <div className={Container}>
        <div className={ChampionName}>{this.props.selected.name}</div>
        <div className={AbilitiesContainer}>
          {this.props.selected.abilities.slice(0, 5).map((ability, i) => {
            const abilityType: AbilityType = Object.keys(AbilityType)[i] as AbilityType;
            const keybindInfo = getKeybindInfoForAbility(abilityType, this.props.usingGamepadInMainMenu);

            return (
              <div className={AbilityContainer} key={i}>
                <div className={`${AbilityIcon} ${ability.iconClass}`} />
                {keybindInfo.iconClass ? (
                  <span className={`${KeyBindIcon} ${keybindInfo.iconClass}`} />
                ) : (
                  <span className={KeyBindIcon}>{keybindInfo.name}</span>
                )}
                <div>
                  <div className={AbilityName}>{ability.name}</div>
                  <div className={AbilityDescription}>{ability.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepadInMainMenu } = state.baseGame;

  return {
    ...ownProps,
    usingGamepadInMainMenu
  };
}

export const ChampionPanel = connect(mapStateToProps)(AChampionPanel);
