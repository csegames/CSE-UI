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
import TooltipSource from '../TooltipSource';
import { AbilityBuilderComponentTooltip } from './AbilityBuilderComponentTooltip';
import { checkNetworkRequirements } from './abilityBuilderUtils';

const Root = 'HUD-AbilityBuilderPreview-Root';
const Title = 'HUD-AbilityBuilderPreview-Title';
const IconWrapper = 'HUD-AbilityBuilderPreview-IconWrapper';
const Icon = 'HUD-AbilityBuilderPreview-Icon';
const EditMiniIconWrapper = 'HUD-AbilityBuilderPreview-EditMiniIconWrapper';
const EditMiniIcon = 'HUD-AbilityBuilderPreview-EditMiniIcon';
const ComponentWrapper = 'HUD-AbilityBuilderPreview-ComponentWrapper';
const ComponentImage = 'HUD-AbilityBuilderPreview-ComponentImage';
const ComponentOverlay = 'HUD-AbilityBuilderPreview-ComponentOverlay';
const Inputs = 'HUD-AbilityBuilderPreview-Inputs';
const NameInputWrapper = 'HUD-AbilityBuilderPreview-NameInputWrapper';
const NameInput = 'HUD-AbilityBuilderPreview-NameInput';
const NameInputSizer = 'HUD-AbilityBuilderPreview-NameInputSizer';
const DescriptionInputWrapper = 'HUD-AbilityBuilderPreview-DescriptionInputWrapper';
const DescriptionInput = 'HUD-AbilityBuilderPreview-DescriptionInput';
const DescriptionInputSizer = 'HUD-AbilityBuilderPreview-DescriptionInputSizer';
const EditNameIcon = 'HUD-AbilityBuilderPreview-EditNameIcon';

interface State {
  nameInputHeight: number;
  descriptionInputHeight: number;
  iconURLs: string[];
}

interface ReactProps {
  abilityName: string;
  abilityNetwork: AbilityNetworkDefData;
  selectedComponents: AbilityComponentDefRefData[];
  selectedIconURL: string;
  description: string;
  onNameChange: (name: string, isValid: boolean) => void;
  onDescriptionChange: (description: string) => void;
  onIconChange: (url: string) => void;
  onToggleIconPicker: (visible: boolean) => void;
}

interface InjectedProps {
  abilityComponents: Dictionary<AbilityComponentDefRefData>;
  abilityNameMaxLength: number;
  abilityNameMinLength: number;
  abilityDescriptionMaxLength: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBuilderPreview extends React.Component<Props, State> {
  private nameInputRef: HTMLTextAreaElement;
  private nameInputSizerRef: HTMLDivElement;
  private descriptionInputSizerRef: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = { nameInputHeight: 0, descriptionInputHeight: 0, iconURLs: [] };
  }

  render(): JSX.Element {
    const hueRotation = `hue-rotate(${this.props.abilityNetwork?.AbilityBuilderHueRotation ?? '0deg'})`;

    return (
      <div className={Root} style={{ filter: hueRotation }}>
        <div className={Title}>Preview</div>
        <div className={'row'}>
          <div className={IconWrapper} onClick={this.onOpenIconPicker.bind(this)} style={{ filter: hueRotation }}>
            <img className={Icon} src={this.props.selectedIconURL} />
            <div className={EditMiniIconWrapper} style={{ filter: hueRotation }}>
              <div className={`${EditMiniIcon} icon-edit`} />
            </div>
          </div>
          <div className={`${Inputs} column`}>
            <div className={NameInputWrapper}>
              <textarea
                className={NameInput}
                ref={(r) => {
                  this.nameInputRef = r;
                }}
                style={{ filter: hueRotation, height: `${this.state.nameInputHeight}px` }}
                onChange={(e) => {
                  const newName = this.cleanUpName(e.target.value);
                  const isValid = newName.trim().length > 0;
                  this.props.onNameChange(newName, isValid);
                }}
                value={this.props.abilityName}
                minLength={this.props.abilityNameMinLength}
                maxLength={this.props.abilityNameMaxLength}
              />
              <div
                className={NameInputSizer}
                ref={(r) => {
                  this.nameInputSizerRef = r;
                  this.adjustNameInputSize();
                }}
              >
                {this.props.abilityName}
              </div>
              <div className={`${EditNameIcon} icon-edit`} onClick={this.onNameEditClicked.bind(this)} />
            </div>

            <div className={DescriptionInputWrapper}>
              <textarea
                className={DescriptionInput}
                style={{ filter: hueRotation, height: `${this.state.descriptionInputHeight}px` }}
                onChange={(e) => {
                  this.props.onDescriptionChange(e.target.value);
                }}
                value={this.props.description}
                maxLength={this.props.abilityDescriptionMaxLength}
              />
              <div
                className={DescriptionInputSizer}
                ref={(r) => {
                  this.descriptionInputSizerRef = r;
                  this.adjustDescriptionInputSize();
                }}
              >
                {this.props.description}
              </div>
            </div>
            <div className={'row'}>
              {this.props.selectedComponents.map((component) => {
                const networkReqResults = checkNetworkRequirements(component, this.props.selectedComponents);
                return (
                  <TooltipSource
                    className={ComponentWrapper}
                    tooltipParams={{
                      id: `FinalComponent${component.id}`,
                      content: () => {
                        return <AbilityBuilderComponentTooltip component={component} reqs={networkReqResults} />;
                      }
                    }}
                  >
                    <img className={ComponentImage} src={component.display.iconURL} />
                    <div className={ComponentOverlay} style={{ filter: hueRotation }} />
                  </TooltipSource>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onNameEditClicked(): void {
    if (this.nameInputRef) {
      this.nameInputRef.focus();
      this.nameInputRef.setSelectionRange(0, this.nameInputRef.value.length);
    }
  }

  private cleanUpName(name: string): string {
    // Replaces all white space (tabs, newlines, etc.) with the normal space character.
    return name.replace(/\s/g, ' ');
  }

  private adjustNameInputSize(): void {
    if (!this.nameInputSizerRef) return;

    const inputHeight = Math.ceil(this.nameInputSizerRef.clientHeight);
    if (this.state.nameInputHeight !== inputHeight) {
      this.setState({ nameInputHeight: inputHeight });
    }
  }

  private adjustDescriptionInputSize(): void {
    if (!this.descriptionInputSizerRef) return;

    const inputHeight = Math.ceil(this.descriptionInputSizerRef.clientHeight);
    if (this.state.descriptionInputHeight !== inputHeight) {
      this.setState({ descriptionInputHeight: inputHeight });
    }
  }

  private onOpenIconPicker(): void {
    this.props.onToggleIconPicker(true);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityComponents } = state.gameDefs;
  const { abilityNameMaxLength, abilityNameMinLength, abilityDescriptionMaxLength } = state.gameDefs.settings;
  return {
    ...ownProps,
    abilityComponents,
    abilityNameMaxLength,
    abilityNameMinLength,
    abilityDescriptionMaxLength
  };
};

export const AbilityBuilderPreview = connect(mapStateToProps)(AAbilityBuilderPreview);
