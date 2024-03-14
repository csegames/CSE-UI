/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { AbilityComponentDefRefData, AbilityNetworkDefData, AbilityDisplayData } from '../../redux/gameDefsSlice';
import { AbilityComponentCategoryDefRef } from '@csegames/library/dist/camelotunchained/graphql/schema';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import ArrowUp from '../../../images/abilitybook/arrow-up.png';
import ArrowDown from '../../../images/abilitybook/arrow-down.png';
import Check from '../../../images/abilitybook/check.png';

const Root = 'HUD-AbilityFilterDropdown-Root';
const Selected = 'HUD-AbilityFilterDropdown-Selected';
const SelectionText = 'HUD-AbilityFilterDropdown-SelectionText';
const Arrow = 'HUD-AbilityFilterDropdown-Arrow';
const ContentWrapper = 'HUD-AbilityFilterDropdown-ContentWrapper';
const SelectAllButton = 'HUD-AbilityFilterDropdown-SelectAllButton';
const SectionList = 'HUD-AbilityFilterDropdown-SectionList';
const SectionTitleRow = 'HUD-AbilityFilterDropdown-SectionTitleRow';
const AbilityComponentContainer = 'HUD-AbilityFilterDropdown-AbilityComponentContainer';
const AbilityComponentRow = 'HUD-AbilityFilterDropdown-AbilityComponentRow';
const AbilityComponentIcon = 'HUD-AbilityFilterDropdown-AbilityComponentIcon';
const AbilityComponentText = 'HUD-AbilityFilterDropdown-AbilityComponentText';
const AbilityComponentDivider = 'HUD-AbilityFilterDropdown-AbilityComponentDivider';
const CheckBox = 'HUD-AbilityFilterHeader-CheckBox';
const CheckImage = 'HUD-AbilityFilterHeader-CheckImage';

interface ComponentCategoryDisplayData {
  title: string;
  /** True if every component in the category is selected. */
  isSelected: boolean;
  components: AbilityComponentDefRefData[];
}

interface State {
  isOpen: boolean;
}

interface ReactProps {
  bookTab: string;
  selectedComponentNames: string[];
  onSelectionChanged?: (selectedComponentNames: string[]) => void;
}

interface InjectedProps {
  abilityComponents: Dictionary<AbilityComponentDefRefData>;
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  abilityDisplayData: Dictionary<AbilityDisplayData>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityFilterDropdown extends React.Component<Props, State> {
  private sections: ComponentCategoryDisplayData[] = [];

  constructor(props: Props) {
    super(props);
    this.state = { isOpen: false };
    this.props.onSelectionChanged?.([]);
  }

  render(): JSX.Element {
    const openClass = this.state.isOpen ? 'open' : '';

    this.sections = this.buildSections();

    return (
      <div className={Root}>
        <div className={`${Selected} ${openClass}`} onClick={this.toggleOpenness.bind(this)}>
          <div className={SelectionText}>
            {this.props.selectedComponentNames.length === 0
              ? 'Filter by components'
              : this.props.selectedComponentNames.join(', ')}
          </div>
          <img className={Arrow} src={this.state.isOpen ? ArrowUp : ArrowDown} />
        </div>
        <div className={`${ContentWrapper} ${openClass}`}>
          <div className={SelectAllButton} onClick={this.onSelectAllClicked.bind(this)}>
            {this.props.selectedComponentNames.length > 0 ? 'Deselect All' : 'Select All'}
          </div>
          <div className={SectionList}>{this.sections.map(this.renderSection.bind(this))}</div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.bookTab !== prevProps.bookTab) {
      this.setState({ isOpen: false });
      this.props.onSelectionChanged([]);
    }
  }

  private renderSection(section: ComponentCategoryDisplayData): React.ReactNode {
    return (
      <>
        <div className={SectionTitleRow} onClick={this.onSectionFilterClicked.bind(this, section)}>
          {section.title}
          <div className={CheckBox}>{section.isSelected && <img className={CheckImage} src={Check} />}</div>
        </div>
        {section.components.map(this.renderAbilityComponentRow.bind(this))}
      </>
    );
  }

  private renderAbilityComponentRow(component: AbilityComponentDefRefData): React.ReactNode {
    const isSelected = this.props.selectedComponentNames.includes(component.display.name);

    return (
      <div className={AbilityComponentContainer} key={component.display.name}>
        <div className={AbilityComponentRow} onClick={this.onComponentFilterClicked.bind(this, component)}>
          <img className={AbilityComponentIcon} src={component.display.iconURL} />
          <div className={AbilityComponentText}>{component.display.name}</div>
          <div className={CheckBox}>{isSelected && <img className={CheckImage} src={Check} />}</div>
        </div>
        <div className={AbilityComponentDivider} />
      </div>
    );
  }

  private onComponentFilterClicked(component: AbilityComponentDefRefData): void {
    const isSelected = this.props.selectedComponentNames.includes(component.display.name);
    if (isSelected) {
      const selectedComponentNames = this.props.selectedComponentNames.filter((name) => {
        return name !== component.display.name;
      });
      this.props.onSelectionChanged(selectedComponentNames);
    } else {
      const selectedComponentNames = [...this.props.selectedComponentNames, component.display.name];
      this.props.onSelectionChanged(selectedComponentNames);
    }
  }

  private onSectionFilterClicked(section: ComponentCategoryDisplayData): void {
    const sectionComponentNames = section.components.map((c) => {
      return c.display.name;
    });
    if (section.isSelected) {
      const selectedComponentNames = this.props.selectedComponentNames.filter((name) => {
        return !sectionComponentNames.includes(name);
      });
      this.props.onSelectionChanged(selectedComponentNames);
    } else {
      const selectedComponentNames = [...this.props.selectedComponentNames];
      sectionComponentNames.forEach((name) => {
        if (!selectedComponentNames.includes(name)) {
          selectedComponentNames.push(name);
        }
      });
      this.props.onSelectionChanged(selectedComponentNames);
    }
  }

  private buildSections(): ComponentCategoryDisplayData[] {
    const sections: ComponentCategoryDisplayData[] = [];

    // Find all of the networks that should display on the currently selected bookTab.
    const networks = Object.values(this.props.abilityNetworks).filter((network) => {
      network.componentCategories;
      return network.AbilityBookTab === this.props.bookTab;
    });
    // From those networks, build a list of all included componentCategories.
    const categories: Dictionary<AbilityComponentCategoryDefRef> = {};
    networks.forEach((nw) => {
      nw.componentCategories.forEach((ccat) => {
        categories[ccat.id] = ccat;
      });
    });
    // From the list of componentCategories, build the sections.
    Object.values(categories).forEach((category) => {
      let allSelected: boolean = true;
      const componentsForCategory = Object.values(this.props.abilityComponents).filter((component) => {
        const matchesCategory = component.abilityComponentCategory.id === category.id;
        if (matchesCategory) {
          allSelected = allSelected && this.props.selectedComponentNames.includes(component.display.name);
        }
        return matchesCategory;
      });
      // Exclude empty categories.
      if (componentsForCategory.length > 0) {
        const section: ComponentCategoryDisplayData = {
          title: category.displayInfo.name,
          isSelected: allSelected,
          components: componentsForCategory
        };
        sections.push(section);
      }
    });

    return sections;
  }

  private onSelectAllClicked(): void {
    // Same button for Select/Deselect All.
    const isDeselect = this.props.selectedComponentNames.length > 0;
    if (isDeselect) {
      this.props.onSelectionChanged([]);
    } else {
      const selectedComponentNames: string[] = [];
      this.sections.forEach((section) => {
        section.components.forEach((component) => {
          selectedComponentNames.push(component.display.name);
        });
      });
      this.props.onSelectionChanged(selectedComponentNames);
    }
  }

  private toggleOpenness(): void {
    this.setState({ isOpen: !this.state.isOpen });
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityComponents, abilityNetworks, abilityDisplayData } = state.gameDefs;
  return {
    ...ownProps,
    abilityComponents,
    abilityNetworks,
    abilityDisplayData
  };
};

export const AbilityFilterDropdown = connect(mapStateToProps)(AAbilityFilterDropdown);
