/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { AbilityComponentDefRefData, AbilityNetworkDefData } from '../../redux/gameDefsSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { AbilityComponentCategoryDefRef } from '@csegames/library/dist/camelotunchained/graphql/schema';
import TooltipSource from '../TooltipSource';
import { checkNetworkRequirements } from './abilityBuilderUtils';
import { AbilityBuilderComponentTooltip } from './AbilityBuilderComponentTooltip';

const Root = 'HUD-AbilityBuilderComponentSelector-Root';
const ClosedContainer = 'HUD-AbilityBuilderComponentSelector-ClosedContainer';
const OpenContainer = 'HUD-AbilityBuilderComponentSelector-OpenContainer';
const ContainerBackground = 'HUD-AbilityBuilderComponentSelector-ContainerBackground';
const TitleContainer = 'HUD-AbilityBuilderComponentSelector-TitleContainer';
const Title = 'HUD-AbilityBuilderComponentSelector-Title';
const OptionalButton = 'HUD-AbilityBuilderComponentSelector-OptionalButton';
const ComponentBackground = 'HUD-AbilityBuilderComponentSelector-ComponentBackground';
const DescriptionContainer = 'HUD-AbilityBuilderComponentSelector-DescriptionContainer';
const DescriptionTitle = 'HUD-AbilityBuilderComponentSelector-DescriptionTitle';
const DescriptionText = 'HUD-AbilityBuilderComponentSelector-DescriptionText';
const LeftArrowButton = 'HUD-AbilityBuilderComponentSelector-LeftArrowButton';
const RightArrowButton = 'HUD-AbilityBuilderComponentSelector-RightArrowButton';
const ComponentsWrapper = 'HUD-AbilityBuilderComponentSelector-ComponentsWrapper';
const ComponentButton = 'HUD-AbilityBuilderComponentSelector-ComponentButton';
const ComponentIcon = 'HUD-AbilityBuilderComponentSelector-ComponentIcon';

const MAX_COMPONENTS_IN_ROW = 8;

interface State {
  isClosed: boolean;
  listOffset: number;
}

interface ReactProps {
  abilityNetwork: AbilityNetworkDefData;
  category: AbilityComponentCategoryDefRef;
  selectedComponentId: string | undefined;
  allSelectedComponents: AbilityComponentDefRefData[];
  onSelectionChanged: (selectedComponentId: string) => void;
}

interface InjectedProps {
  abilityComponents: Dictionary<AbilityComponentDefRefData>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBuilderComponentSelector extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isClosed: !this.props.category.isRequired,
      listOffset: 0
    };
  }
  render(): JSX.Element {
    const components = Object.values(this.props.abilityComponents).filter((c) => {
      return c.abilityComponentCategory.id === this.props.category.id;
    });

    const isOptional = !this.props.category.isRequired;
    const titleText = `Select ${this.props.category.displayInfo.name}${isOptional ? ' (Optional)' : ''}`;
    const needArrows = components.length > MAX_COMPONENTS_IN_ROW;
    const canGoLeft = this.state.listOffset > 0;
    const canGoRight = this.state.listOffset < components.length - MAX_COMPONENTS_IN_ROW;

    return (
      <div className={Root}>
        <div className={this.state.isClosed ? ClosedContainer : OpenContainer}>
          {!this.state.isClosed && <div className={ContainerBackground} />}
          <div className={TitleContainer}>
            <div className={Title}>{titleText}</div>
            {this.renderOptionalButton(components.length > 0)}
          </div>
          {!this.state.isClosed && (
            <div className={ComponentBackground}>
              {needArrows && (
                <div
                  className={`${LeftArrowButton} ${canGoLeft ? '' : 'disabled'}`}
                  onClick={this.onLeftClicked.bind(this)}
                />
              )}
              <div className={ComponentsWrapper}>{components.map(this.renderComponentButton.bind(this))}</div>
              {needArrows && (
                <div
                  className={`${RightArrowButton} ${canGoRight ? '' : 'disabled'}`}
                  onClick={this.onRightClicked.bind(this)}
                />
              )}
            </div>
          )}
          {this.renderDescription()}
        </div>
      </div>
    );
  }

  private renderComponentButton(component: AbilityComponentDefRefData, index: number): React.ReactNode {
    if (index < this.state.listOffset) return null;
    if (index >= this.state.listOffset + MAX_COMPONENTS_IN_ROW) return null;

    const isSelected = component.id === this.props.selectedComponentId;

    // Check if using this component would produce a valid ability or not.  If not, also tells us why.
    const networkRequirementResults = checkNetworkRequirements(component, this.props.allSelectedComponents);

    return (
      <TooltipSource
        className={`${ComponentButton} ${isSelected ? 'selected' : ''} ${
          networkRequirementResults.isIncompatible ? 'incompatible' : ''
        }`}
        key={component.id}
        tooltipParams={{
          id: `Component${component.id}`,
          content: () => {
            return <AbilityBuilderComponentTooltip component={component} reqs={networkRequirementResults} />;
          }
        }}
        onClick={this.onComponentClicked.bind(this, component)}
      >
        <img className={ComponentIcon} src={component.display.iconURL} />
      </TooltipSource>
    );
  }

  private renderDescription = () => {
    if (!this.props.selectedComponentId) {
      return null;
    }

    const component = this.props.abilityComponents[this.props.selectedComponentId];
    if (!component) {
      return null;
    }

    return (
      <div
        className={DescriptionContainer}
        style={{ filter: `hue-rotate(${this.props.abilityNetwork.AbilityBuilderHueRotation})` }}
      >
        <div className={DescriptionTitle}>{component.display.name}</div>
        <div
          className={DescriptionText}
          style={{ filter: `hue-rotate(${this.props.abilityNetwork.AbilityBuilderHueRotation})` }}
        >
          {component.display.description || component.display.name}
        </div>
      </div>
    );
  };

  private renderOptionalButton(hasComponents: boolean): React.ReactNode {
    // Not optional?  No optional button!
    if (this.props.category.isRequired) return null;

    if (this.state.isClosed) {
      if (!hasComponents) {
        return (
          <TooltipSource
            className={`${OptionalButton} add disabled`}
            onClick={this.onOptionalOpen.bind(this)}
            tooltipParams={{
              id: 'NoComponentsAvailable',
              content: 'There are no components for this category at the moment.'
            }}
          >
            Add
          </TooltipSource>
        );
      } else {
        return (
          <div className={`${OptionalButton} add`} onClick={this.onOptionalOpen.bind(this)}>
            Add
          </div>
        );
      }
    } else {
      return (
        <div className={`${OptionalButton} remove`} onClick={this.onOptionalClose.bind(this)}>
          Remove
        </div>
      );
    }
  }

  private onLeftClicked(): void {
    this.setState({ listOffset: this.state.listOffset - 1 });
  }

  private onRightClicked(): void {
    this.setState({ listOffset: this.state.listOffset + 1 });
  }

  private onComponentClicked(component: AbilityComponentDefRefData): void {
    this.props.onSelectionChanged(component.id);
  }

  private onOptionalOpen(): void {
    this.setState({ isClosed: false });
  }

  private onOptionalClose(): void {
    this.setState({ isClosed: true });
    // If you close an optional category, that deselects any component FROM that category.
    this.props.onSelectionChanged(undefined);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityComponents } = state.gameDefs;
  return {
    ...ownProps,
    abilityComponents
  };
};

export const AbilityBuilderComponentSelector = connect(mapStateToProps)(AAbilityBuilderComponentSelector);
