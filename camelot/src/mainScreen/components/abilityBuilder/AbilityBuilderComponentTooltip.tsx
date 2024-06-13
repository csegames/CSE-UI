/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { AbilityComponentDefRefData, AbilityNetworkRequirementsGQLData } from '../../redux/gameDefsSlice';
import { NetworkRequirementResult } from './abilityBuilderUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

const Root = 'HUD-AbilityBuilderComponentTooltip-Root';
const Name = 'HUD-AbilityBuilderComponentTooltip-Name';
const Description = 'HUD-AbilityBuilderComponentTooltip-Description';
const TagsContainer = 'HUD-AbilityBuilderComponentTooltip-TagsContainer';
const RequirementsSection = 'HUD-AbilityBuilderComponentTooltip-RequirementsSection';
const Requirement = 'HUD-AbilityBuilderComponentTooltip-Requirement';
const CheckIcon = 'HUD-AbilityBuilderComponentTooltip-CheckIcon';
const CrossIcon = 'HUD-AbilityBuilderComponentTooltip-CrossIcon';

interface ReactProps {
  component: AbilityComponentDefRefData;
  reqs: NetworkRequirementResult;
}

interface InjectedProps {
  abilityComponents: Dictionary<AbilityComponentDefRefData>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBuilderComponentTooltip extends React.Component<Props> {
  render(): JSX.Element {
    const { component, reqs } = this.props;
    return (
      <div className={Root}>
        <div className={Name}>{component.display.name}</div>
        <div className={TagsContainer}>{component.abilityTags.join(', ')}</div>
        <div className={Description}>{component.display.description}</div>
        {component.networkRequirements.map((req) => {
          return (
            <div className={RequirementsSection}>{Object.keys(req).map(this.renderRequirement.bind(this, req))}</div>
          );
        })}
        {reqs.isAnExcludeTag.result && (
          <div className={`${Requirement} disabled`}>
            The component {reqs.isAnExcludeTag.component.display.name} excludes &nbsp;
            {reqs.isAnExcludeTag.reason} components when selected.
          </div>
        )}
        {reqs.isAnExcludeComponent.result && (
          <div className={`${Requirement} disabled`}>
            The component {reqs.isAnExcludeComponent.component.display.name} excludes &nbsp;this component when
            selected.
          </div>
        )}
      </div>
    );
  }

  private renderRequirement(
    req: AbilityNetworkRequirementsGQLData,
    key: keyof AbilityNetworkRequirementsGQLData
  ): React.ReactNode {
    if (!req[key]) return null;

    switch (key) {
      case 'requireTag': {
        const value = req[key];
        return (
          <div className={`${Requirement} ${!this.props.reqs.meetsRequireTagReq ? 'disabled' : ''}`}>
            {'Requires Tag: ' + value.tag}
            <div className={this.props.reqs.meetsRequireTagReq ? CheckIcon : CrossIcon} />
          </div>
        );
      }
      case 'excludeTag': {
        const value = req[key];
        return (
          <div className={`${Requirement} ${!this.props.reqs.meetsExcludeTagReq ? 'disabled' : ''}`}>
            {'Exclude Tag: ' + value.tag}
            <div className={this.props.reqs.meetsExcludeTagReq ? CheckIcon : CrossIcon} />
          </div>
        );
      }
      case 'requireComponentId': {
        const value = req[key];
        const requiredComponent = this.props.abilityComponents[value];
        return (
          <div className={`${Requirement} ${!this.props.reqs.meetsRequireComponentReq ? 'disabled' : ''}`}>
            {`Requires Component: ${requiredComponent.display.name} (${requiredComponent.abilityComponentCategory.displayInfo.name})`}
            <div className={this.props.reqs.meetsRequireComponentReq ? CheckIcon : CrossIcon} />
          </div>
        );
      }
      case 'excludeComponentId': {
        const value = req[key];
        const excludedComponent = this.props.abilityComponents[value];
        return (
          <div className={`${Requirement} ${!this.props.reqs.meetsExcludeComponentReq ? 'disabled' : ''}`}>
            {`Exclude Component: ${excludedComponent.display.name} (${excludedComponent.abilityComponentCategory.displayInfo.name})`}
            <div className={this.props.reqs.meetsExcludeComponentReq ? CheckIcon : CrossIcon} />
          </div>
        );
      }
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityComponents } = state.gameDefs;
  return {
    ...ownProps,
    abilityComponents
  };
};

export const AbilityBuilderComponentTooltip = connect(mapStateToProps)(AAbilityBuilderComponentTooltip);
