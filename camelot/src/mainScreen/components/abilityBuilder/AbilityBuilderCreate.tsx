/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  AbilityComponentDefRefData,
  AbilityDisplayData,
  AbilityNetworkDefData,
  setShouldRefetchMyCharacterAbilities
} from '../../redux/gameDefsSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { AbilitiesAPI, CreateAbilityRequest } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { AbilityComponentCategoryDefRef } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { AbilityBuilderComponentSelector } from './AbilityBuilderComponentSelector';
import { AbilityBuilderPreview } from './AbilityBuilderPreview';
import { checkNetworkRequirements, selectRandomAdjective } from './abilityBuilderUtils';
import { showModal } from '../../redux/modalsSlice';
import { AbilityEditStatus, AbilityGroup } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { setNowEditingAbilityId } from '../../redux/abilitiesSlice';
import { webConf } from '../../redux/networkConfiguration';

const Root = 'HUD-AbilityBuilderCreate-Root';
const ListRoot = 'HUD-AbilityBuilderCreate-ListRoot';
const SaveButton = 'HUD-AbilityBuilderCreate-SaveButton';
const SaveButtonBackground = 'HUD-AbilityBuilderCreate-SaveButtonBackground';
const SaveButtonText = 'HUD-AbilityBuilderCreate-SaveButtonText';
const IconPickerRoot = 'HUD-AbilityBuilderCreate-IconPickerRoot';
const IconPickerBorder = 'HUD-AbilityBuilderCreate-IconPickerBorder';
const IconPickerContent = 'HUD-AbilityBuilderCreate-IconPickerContent';
const AbilityIcon = 'HUD-AbilityBuilderCreate-AbilityIcon';
const UnableToSaveContainer = 'HUD-AbilityBuilderCreate-UnableToSaveContainer';
const UnableToSaveText = 'HUD-AbilityBuilderCreate-UnableToSaveText';

interface State {
  displayedAbilityType: string;
  // Maps categoryId to componentId.
  selectedComponentIds: Dictionary<string>;
  selectedIconURL: string;
  abilityName: string;
  isNameValid: boolean;
  description: string;
  isShowingIconPicker: boolean;
  isWaitingForNewAbility: boolean;
}

interface ReactProps {
  selectedAbilityType: string;
  isSaving: boolean;
  onReset: () => void;
  onSaveBegun: () => void;
  onSaveEnded: (newAbilityId: number) => void;
}

interface InjectedProps {
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  abilityComponents: Dictionary<AbilityComponentDefRefData>;
  abilityDisplayData: Dictionary<AbilityDisplayData>;
  abilityIconURLs: string[];
  shouldRefetchMyCharacterAbilities: boolean;
  editStatus: AbilityEditStatus;
  groups: Dictionary<AbilityGroup>;
  nowEditingAbilityId: number;
  abilityDescriptionMaxLength: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBuilderCreate extends React.Component<Props, State> {
  private isMouseOverIconPicker: boolean = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      displayedAbilityType: '',
      selectedComponentIds: {},
      selectedIconURL: '',
      abilityName: '',
      isNameValid: false,
      description: '',
      isShowingIconPicker: false,
      isWaitingForNewAbility: false
    };
  }

  render(): React.ReactNode {
    // If there's no ability type selected, then there's nothing to build.
    if (this.state.displayedAbilityType?.length === 0) {
      return null;
    }

    const abilityNetwork = this.props.abilityNetworks[this.state.displayedAbilityType];
    const selectedComponents = this.getAllSelectedComponents();
    const hueRotation = `hue-rotate(${abilityNetwork?.AbilityBuilderHueRotation ?? '0deg'})`;
    const areComponentsCompatible = !checkNetworkRequirements(selectedComponents[0], selectedComponents).isIncompatible;
    const canSave: boolean = areComponentsCompatible && this.state.isNameValid;
    const modifyingAbility: boolean = this.props.nowEditingAbilityId !== null;

    return (
      <div className={Root}>
        <div className={ListRoot}>
          {this.getSortedCategories().map((category) => {
            return (
              <AbilityBuilderComponentSelector
                abilityNetwork={abilityNetwork}
                category={category}
                key={category.id}
                onSelectionChanged={this.onSelectionChanged.bind(this, category)}
                selectedComponentId={this.state.selectedComponentIds[category.id]}
                allSelectedComponents={selectedComponents}
              />
            );
          })}
        </div>
        <AbilityBuilderPreview
          selectedComponents={selectedComponents}
          selectedIconURL={this.state.selectedIconURL}
          abilityNetwork={abilityNetwork}
          abilityName={this.state.abilityName}
          description={this.state.description}
          onNameChange={(abilityName, isNameValid) => {
            this.setState({ abilityName, isNameValid });
          }}
          onDescriptionChange={(description) => {
            this.setState({ description });
          }}
          onIconChange={(selectedIconURL) => {
            this.setState({ selectedIconURL });
          }}
          onToggleIconPicker={(visible) => {
            this.setState({ isShowingIconPicker: visible });
            // If the player clicks off the icon picker, we'll need to close it.
            window.addEventListener('mousedown', this.handleMouseDownBound);
          }}
        />
        {!canSave && (
          <div className={UnableToSaveContainer}>
            <div className={UnableToSaveText}>
              {areComponentsCompatible
                ? 'Unable to save.  Ability name is invalid.'
                : 'Unable to save.  Conflicting components detected.'}
            </div>
          </div>
        )}
        <div
          className={`${SaveButton} ${canSave ? '' : 'disabled'}`}
          onClick={canSave ? this.onSaveClicked.bind(this) : null}
        >
          <div className={SaveButtonBackground} style={{ filter: hueRotation }} />
          <div className={SaveButtonText} style={{ filter: hueRotation }}>
            {modifyingAbility ? 'Modify Ability' : 'Create Ability'}
          </div>
        </div>
        {this.state.isShowingIconPicker && (
          <div className={IconPickerRoot}>
            <div
              className={IconPickerContent}
              onMouseOver={this.handleMouseOverIconPicker.bind(this)}
              onMouseLeave={this.handleMouseLeaveIconPicker.bind(this)}
            >
              {this.getSortedAbilityIconURLs().map((url) => {
                return (
                  <img
                    className={AbilityIcon}
                    src={url}
                    onClick={() => {
                      this.setState({ isShowingIconPicker: false, selectedIconURL: url });
                    }}
                  />
                );
              })}
            </div>
            <div className={IconPickerBorder} style={{ filter: hueRotation }} />
          </div>
        )}
      </div>
    );
  }

  private async onSaveClicked(): Promise<void> {
    if (this.props.isSaving) return;

    const abilityNetwork = this.props.abilityNetworks[this.state.displayedAbilityType];
    const createAbilityRequest: CreateAbilityRequest = {
      NetworkID: abilityNetwork.id,
      Name: this.state.abilityName.trim(),
      Description: this.state.description,
      IconURL: this.state.selectedIconURL,
      Components: Object.values(this.state.selectedComponentIds)
    };

    this.props.onSaveBegun();

    if (this.props.nowEditingAbilityId !== null) {
      // Modify?
      const res = await AbilitiesAPI.ModifyAbility(webConf, this.props.nowEditingAbilityId, createAbilityRequest);
      if (res.ok) {
        this.setState({ isWaitingForNewAbility: true });
        this.props.dispatch(setShouldRefetchMyCharacterAbilities(true));
      } else {
        if (res.data) {
          let errorMessage: string = 'We are experiencing technical difficulties. Please try again later.';
          try {
            errorMessage = JSON.parse(res.data).FieldCodes[0].AbilityResult.Details;
          } catch (e) {}
          this.props.dispatch(
            showModal({ id: 'AbilityCreateError', content: { title: 'Error', message: errorMessage } })
          );
        }
        this.props.onSaveEnded(null);
      }
    } else {
      // Create?
      const res = await AbilitiesAPI.CreateAbility(webConf, createAbilityRequest);
      if (res.ok) {
        this.setState({ isWaitingForNewAbility: true });
        this.props.dispatch(setShouldRefetchMyCharacterAbilities(true));
      } else {
        if (res.data) {
          let errorMessage: string = 'We are experiencing technical difficulties. Please try again later.';
          try {
            errorMessage = JSON.parse(res.data).FieldCodes[0].AbilityResult.Details;
          } catch (e) {}
          this.props.dispatch(
            showModal({ id: 'AbilityCreateError', content: { title: 'Error', message: errorMessage } })
          );
        }
        this.props.onSaveEnded(null);
      }
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('mousedown', this.handleMouseDownBound);
  }

  private getSortedAbilityIconURLs(): string[] {
    const selectedComponents = this.getAllSelectedComponents();
    let iconURLs: string[] = [
      // We put the icons used by this ability's components at the front, in order.
      ...selectedComponents.map((component) => {
        return component.display.iconURL;
      }),
      // And remove all URLs that match our selected components from the back so we don't get duplicates.
      ...this.props.abilityIconURLs.filter((url) => {
        return (
          selectedComponents.find((component) => {
            return component.display.iconURL === url;
          }) === undefined
        );
      })
    ];
    return iconURLs;
  }

  private handleMouseDownBound = this.handleMouseDown.bind(this);
  private handleMouseDown(): void {
    if (!this.isMouseOverIconPicker) {
      this.setState({ isShowingIconPicker: false });
      window.removeEventListener('mousedown', this.handleMouseDownBound);
    }
  }

  private handleMouseOverIconPicker(): void {
    this.isMouseOverIconPicker = true;
  }
  private handleMouseLeaveIconPicker(): void {
    this.isMouseOverIconPicker = false;
  }

  private getAllSelectedComponents(): AbilityComponentDefRefData[] {
    return Object.values(this.state.selectedComponentIds)
      .filter((cid) => {
        return !!cid;
      })
      .map((cid) => {
        return this.props.abilityComponents[cid];
      });
  }

  private initializeState(): void {
    // State depends heavily on selectedAbilityType, so if we don't have one, there's nothing to initialize!
    if ((this.props.selectedAbilityType?.length ?? 0) === 0) {
      return;
    }

    if (this.props.nowEditingAbilityId !== null) {
      // Editing, so set state to match the ability.
      this.setStateForEditing();
    } else {
      // Creating new, so, pick the first item from each required category as a default.
      const abilityNetwork = this.props.abilityNetworks[this.props.selectedAbilityType];
      const selectedComponentIds: Dictionary<string> = {};
      let selectedIconURL: string = '';
      Object.values(abilityNetwork.componentCategories).forEach((category) => {
        if (category.isRequired) {
          const firstComponent = Object.values(this.props.abilityComponents).find((component) => {
            return component.abilityComponentCategory.id === category.id;
          });
          // May be undefined, and that's okay!  Means we didn't select anything.
          selectedComponentIds[category.id] = firstComponent?.id;

          if (firstComponent && selectedIconURL.length === 0) {
            selectedIconURL = firstComponent.display.iconURL;
          }
        }
      });

      // Set an initial ability name.
      const abilityName = this.getRandomAbilityName(selectedComponentIds);
      const description = this.buildDescription(selectedComponentIds);

      this.setState({
        displayedAbilityType: this.props.selectedAbilityType,
        selectedComponentIds,
        selectedIconURL,
        abilityName,
        isNameValid: true,
        description
      });
    }
  }

  componentDidMount(): void {
    this.initializeState();
  }

  private setStateForEditing(): void {
    const ability = this.props.abilityDisplayData[this.props.nowEditingAbilityId];

    const abilityName = ability.name;
    const description = ability.description;
    const selectedIconURL = ability.icon;

    const selectedComponentIds: Dictionary<string> = {};
    ability.abilityComponentIds.forEach((componentId) => {
      const abilityComponent = this.props.abilityComponents[componentId];
      if (abilityComponent) {
        const categoryId = abilityComponent.abilityComponentCategory.id;
        selectedComponentIds[categoryId] = componentId;
      }
    });

    this.setState({
      displayedAbilityType: this.props.selectedAbilityType,
      selectedComponentIds,
      selectedIconURL,
      abilityName,
      description,
      // If we were in the middle of creating an ability, we no longer care about its status, so all of these can go away.
      isShowingIconPicker: false,
      isWaitingForNewAbility: false
    });
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if ((this.props.selectedAbilityType?.length ?? 0) === 0) {
      // No selected ability type, so nothing needs doing just now.
      return;
    }

    if (
      (this.props.selectedAbilityType?.length ?? 0) > 0 &&
      this.props.selectedAbilityType !== prevProps.selectedAbilityType
    ) {
      // Just selected an ability type, so set things up.
      this.initializeState();
    }

    if (this.props.nowEditingAbilityId !== null && this.props.nowEditingAbilityId !== prevProps.nowEditingAbilityId) {
      // We are switching from creating an ability to editing an ability or switching which ability we're modifying,
      // so we have to replace the current state.
      this.setStateForEditing();
    }

    if (this.state.isWaitingForNewAbility) {
      // If we successfully retrieved a new ability, mark it so we can switch to the Created screen.
      if (this.props.abilityDisplayData !== prevProps.abilityDisplayData) {
        let newAbilityId: number = undefined;
        let editedAbility: AbilityDisplayData = null;
        Object.keys(this.props.abilityDisplayData).forEach((abilityId) => {
          const numericID: number = +abilityId;
          if (numericID === this.props.nowEditingAbilityId) {
            editedAbility = this.props.abilityDisplayData[abilityId];
          } else if (newAbilityId === undefined && prevProps.abilityDisplayData[abilityId] === undefined) {
            newAbilityId = numericID;
          }
        });
        if (newAbilityId || (editedAbility && this.doesAbilityMatchState(editedAbility))) {
          this.setState({ isWaitingForNewAbility: false });
          this.props.onSaveEnded(newAbilityId);
          // If we were editing an ability, we are done now, so this reverts us to ability creation again.
          this.props.dispatch?.(setNowEditingAbilityId(null));
        }
      }
      // If we created but failed to retrieve an ability, tell the user!
      else if (prevProps.shouldRefetchMyCharacterAbilities && !this.props.shouldRefetchMyCharacterAbilities) {
        this.showFailedToRetrieveAbilitiesModal();
        this.setState({ isWaitingForNewAbility: false });
        // This means it WAS saved, but we don't have any valid id to report.
        this.props.onSaveEnded(null);
      }
    }
  }

  private doesAbilityMatchState(ability: AbilityDisplayData): boolean {
    if (ability.name !== this.state.abilityName) return false;
    if (ability.description !== this.state.description) return false;
    if (ability.icon !== this.state.selectedIconURL) return false;

    const stateComponentIds = Object.values(this.state.selectedComponentIds);
    if (stateComponentIds.length !== ability.abilityComponentIds.length) return false;
    const mismatch = stateComponentIds.find((abilityId) => {
      return !ability.abilityComponentIds.includes(abilityId);
    });
    if (mismatch) return false;

    return true;
  }

  private showFailedToRetrieveAbilitiesModal(): void {
    this.props.dispatch(
      showModal({
        id: 'CreatedAbility???',
        content: {
          title: 'Warning!',
          message:
            'Your ability was successfully created, but we were unable to retrieve it from the server.  Reload the UI or relaunch the game to try again.'
        }
      })
    );
  }

  private getRandomAbilityName(selectedComponentIds: Dictionary<string>) {
    // Get the sorted list of selectedComponents.
    const selectedComponents = this.getSortedCategories()
      .map((category) => {
        // For every category, get the selectedComponentId.
        return selectedComponentIds[category.id];
      })
      .filter((componentId) => {
        // Exclude any optional categories that have no component selected.
        return !!componentId;
      })
      .map((componentId) => {
        // And turn those ids into components.
        return this.props.abilityComponents[componentId];
      });
    let primary: AbilityComponentDefRefData = selectedComponents[0] ?? null;
    let secondary: AbilityComponentDefRefData = selectedComponents[1] ?? null;

    if (!primary) {
      return '';
    }
    const s1 = '';
    let s3 = primary.display.name;
    if (primary.display.name.indexOf('ness', primary.display.name.length - 4) !== -1) {
      s3 = primary.display.name.slice(0, -4);
    }
    const s4 = selectRandomAdjective();

    let whole = s1.concat(' of ').concat(s4).concat(' ').concat(s3).concat('ness');

    if (!secondary) {
      whole = selectRandomAdjective().concat(' ').concat(whole);
    } else {
      const s2 = secondary.display.name;
      whole = s2.concat(whole);
    }

    if (whole.length > 100) {
      return 'New ability';
    }

    return whole;
  }

  private onSelectionChanged(category: AbilityComponentCategoryDefRef, selectedComponentId: string): void {
    const selectedComponentIds = { ...this.state.selectedComponentIds, [category.id]: selectedComponentId };

    let abilityName = this.state.abilityName;
    // Don't randomly change the name when editing an existing ability.
    if (this.props.nowEditingAbilityId === null) {
      // Otherwise, we update the default name when the component selection changes, since the name is based on those components.
      abilityName = this.getRandomAbilityName(selectedComponentIds);
    }
    const description = this.buildDescription(selectedComponentIds);

    this.setState({ selectedComponentIds, abilityName, description });
  }

  private buildDescription(selectedComponentIds: Dictionary<string>): string {
    const selectedComponents = Object.values(selectedComponentIds)
      .filter((cid) => {
        return !!cid;
      })
      .map((cid) => {
        return this.props.abilityComponents[cid];
      });
    const description = selectedComponents
      .map((component) => {
        let text: string = component.display.description;
        // Make sure each individual description ends with a period.
        if (!text.endsWith('.')) {
          text += '.';
        }
        return text;
      })
      .join(' ');

    const pieces = description.split(' ');

    while (pieces.join(' ').length > this.props.abilityDescriptionMaxLength) {
      pieces.pop();
    }

    return pieces.join(' ');
  }

  private getSortedCategories(): AbilityComponentCategoryDefRef[] {
    // We will almost always go with displayedAbilityType here, but on mount the initial value can't be used for indexing.
    const abilityType =
      this.state.displayedAbilityType.length > 0 ? this.state.displayedAbilityType : this.props.selectedAbilityType;
    const abilityNetwork = this.props.abilityNetworks[abilityType];
    const categories = Object.values(abilityNetwork.componentCategories).sort((catA, catB) => {
      // Primary goes first.
      if (catA.isPrimary) return -1;
      if (catB.isPrimary) return 1;

      // Required before optional.
      const requiredA = catA.isRequired ? 1 : 0;
      const requiredB = catB.isRequired ? 1 : 0;
      if (requiredA !== requiredB) {
        return requiredB - requiredA;
      }

      // After that, just retain whatever order was defined in the data sheets.
      return 0;
    });

    return categories;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityNetworks, abilityComponents, abilityDisplayData, abilityIconURLs, shouldRefetchMyCharacterAbilities } =
    state.gameDefs;
  const { editStatus, groups, nowEditingAbilityId } = state.abilities;
  const { abilityDescriptionMaxLength } = state.gameDefs.settings;

  return {
    ...ownProps,
    abilityNetworks,
    abilityComponents,
    abilityDisplayData,
    abilityIconURLs,
    shouldRefetchMyCharacterAbilities,
    editStatus,
    groups,
    nowEditingAbilityId,
    abilityDescriptionMaxLength
  };
};

export const AbilityBuilderCreate = connect(mapStateToProps)(AAbilityBuilderCreate);
