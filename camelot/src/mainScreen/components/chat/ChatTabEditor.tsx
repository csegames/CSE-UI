/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { StringTable } from '../../dataSources/manifest/stringTableManifest';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import Escapable from '../Escapable';
import { hideModal } from '../../redux/modalsSlice';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { TextInput } from '../input/TextInput';
import { FactionButton } from '../FactionButton';
import { getStringTableValue, StringIDGeneralSubmit } from '../../helpers/stringTableHelpers';
import { ChatScope, isSystemChatTab } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { FactionCheckbox } from '../FactionCheckbox';
import {
  allChatScopeDisplayData,
  allScopes,
  allSystemScopes,
  optionalScopes,
  optionalSystemScopes,
  requiredScopes,
  requiredSystemScopes
} from './ChatScopes';

// CSS classes
const Root = 'HUD-ChatTabEditor-Root';
const ContentRoot = 'HUD-ChatTabEditor-ContentRoot';
const NameRow = 'HUD-ChatTabEditor-NameRow';
const NameInputBase = 'HUD-ChatTabEditor-NameInputBase';
const NameInput = 'HUD-ChatTabEditor-NameInput';
const NameInputButton = 'HUD-ChatTabEditor-NameInputButton';
const ScopeDescriptionLabel = 'HUD-ChatTabEditor-ScopeDescriptionLabel';
const ScopesRow = 'HUD-ChatTabEditor-ScopesRow';
const ScopesColumn = 'HUD-ChatTabEditor-ScopesColumn';
const ScopeRow = 'HUD-ChatTabEditor-ScopeRow';
const ScopeCheckbox = 'HUD-ChatTabEditor-ScopeCheckbox';
const ScopeNameLabel = 'HUD-ChatTabEditor-ScopeNameLabel';

// String IDs
const StringIDChatSelectAll = 'ChatSelectAll';
const StringIDChatChannelDescription = 'ChatChannelDescription';
const StringIDChatNameErrorEmpty = 'ChatNameErrorEmpty';
const StringIDChatNameErrorSystemTab = 'ChatNameErrorSystemTab';
const StringIDChatNameErrorNameInUse = 'ChatNameErrorNameInUse';

interface ReactProps {
  tabName: string;
}

interface InjectedProps {
  stringTable: StringTable;
}

type Props = ReactProps & InjectedProps & AddDispatch;

interface State {
  isNewTab: boolean;
  isSystemTab: boolean;
  nameText: string;
  selectedScopes: ChatScope[];
  hoveredScope: ChatScope | null;
}

class AChatTabEditor extends React.Component<Props, State> {
  private leftScopes: ChatScope[];
  private rightScopes: ChatScope[];

  constructor(props: Props) {
    super(props);

    // Pre-calculating these because they are expensive and shouldn't change at runtime.
    const isSystemTab = isSystemChatTab(props.tabName);
    const [l, r] = this.getScopeColumns(isSystemTab, props.stringTable);
    this.leftScopes = l;
    this.rightScopes = r;

    const tab = clientAPI.getChatTabs().find((t) => t.name === props.tabName);

    this.state = {
      isNewTab: !this.props.tabName,
      isSystemTab,
      nameText: isSystemTab ? getStringTableValue(props.tabName, this.props.stringTable) : props.tabName,
      selectedScopes: tab?.scopes?.slice() ?? [],
      hoveredScope: null
    };
  }

  render(): React.ReactNode {
    const nameErrorMessage = this.getNameErrorMessage();

    return (
      <FactionBorder
        className={Root}
        type={BorderType.Decorative}
        background={BorderBackground.Leather}
        cornerButtons={[<FactionCornerButton type={CornerButtonType.Close} onClick={this.closeSelf.bind(this)} />]}
      >
        <Escapable escapeID={'ChatTabEditor'} onEscape={this.closeSelf.bind(this)} />
        <div className={ContentRoot}>
          <div className={NameRow}>
            <TextInput
              className={NameInputBase}
              inputClassName={NameInput}
              value={this.state.nameText}
              disabled={this.state.isSystemTab}
              maxLength={15}
              setValue={(nameText: string) => this.setState({ nameText })}
            />

            <FactionButton
              className={NameInputButton}
              widthOverrideVmin={10.8}
              onClick={this.onRenameClicked.bind(this)}
              disabled={this.state.isSystemTab || nameErrorMessage.length > 0}
              disabledTooltip={nameErrorMessage}
            >
              {getStringTableValue(StringIDGeneralSubmit, this.props.stringTable)}
            </FactionButton>
          </div>
          {this.renderScopeDescription()}
          <div className={ScopesRow}>
            <div className={ScopesColumn}>
              {this.renderSelectAllCheckbox()}
              {this.leftScopes.map(this.renderScopeRow.bind(this))}
            </div>
            <div className={ScopesColumn}>{this.rightScopes.map(this.renderScopeRow.bind(this))}</div>
          </div>
        </div>
      </FactionBorder>
    );
  }

  private getNameErrorMessage(): string {
    // System tabs cannot be renamed.
    if (this.state.isSystemTab) {
      return getStringTableValue(StringIDChatNameErrorSystemTab, this.props.stringTable);
    }

    // Name must not be empty.
    let name = this.state.nameText.trim();
    if (name.length === 0) {
      return getStringTableValue(StringIDChatNameErrorEmpty, this.props.stringTable);
    }

    // Names that match System tabs' translated names are forbidden.
    if (isSystemChatTab(name)) {
      return getStringTableValue(StringIDChatNameErrorNameInUse, this.props.stringTable);
    }

    const existingTab = clientAPI.getChatTabs().find((tab) => tab.name === name);

    // Name was changed, but matches another existing tab.
    if (name !== this.props.tabName && existingTab) {
      return getStringTableValue(StringIDChatNameErrorNameInUse, this.props.stringTable);
    }

    return '';
  }

  private renderScopeDescription(): React.ReactNode {
    let color: string = '#88888888';
    let description: string = '';
    if (this.state.hoveredScope) {
      const data = allChatScopeDisplayData[this.state.hoveredScope];
      color = data.color;
      description = getStringTableValue(data.descriptionStringID, this.props.stringTable);
    } else {
      description = getStringTableValue(StringIDChatChannelDescription, this.props.stringTable);
    }
    return (
      <div className={ScopeDescriptionLabel} style={{ color }}>
        {description}
      </div>
    );
  }

  private renderSelectAllCheckbox(): React.ReactNode {
    const { isSystemTab, isNewTab } = this.state;
    const options = isSystemTab ? optionalSystemScopes : optionalScopes;
    const isChecked = options.every((scope) => this.state.selectedScopes.includes(scope));
    return (
      <div className={ScopeRow}>
        <FactionCheckbox
          className={ScopeCheckbox}
          isChecked={isChecked}
          onCheckedChanged={(newIsChecked: boolean) => {
            const selectedScopes = newIsChecked
              ? (isSystemTab ? allSystemScopes : allScopes).slice()
              : (isSystemTab ? requiredSystemScopes : requiredScopes).slice();
            this.setState({ selectedScopes });
            if (!isNewTab) clientAPI.updateChatTab({ name: this.props.tabName, scopes: selectedScopes });
          }}
        />
        <div className={ScopeNameLabel}>{getStringTableValue(StringIDChatSelectAll, this.props.stringTable)}</div>
      </div>
    );
  }

  private getScopeColumns(isSystemTab: boolean, stringTable: StringTable): [ChatScope[], ChatScope[]] {
    const sortedScopes = (isSystemTab ? optionalSystemScopes : optionalScopes).slice();
    sortedScopes.sort((a, b) => {
      const aName = getStringTableValue(allChatScopeDisplayData[a].nameStringID, stringTable);
      const bName = getStringTableValue(allChatScopeDisplayData[b].nameStringID, stringTable);

      return aName.localeCompare(bName);
    });

    let half = Math.floor(sortedScopes.length / 2);
    let hasSpare = sortedScopes.length % 2 === 1;

    let left: ChatScope[] = sortedScopes.slice(0, half);
    let right: ChatScope[] = sortedScopes.slice(half, 2 * half);
    // If there is a spare, it goes in the right column.
    // The first entry in the left column is "Select All".
    if (hasSpare) {
      right.push(sortedScopes[sortedScopes.length - 1]);
    }

    return [left, right];
  }

  private renderScopeRow(scope: ChatScope): React.ReactNode {
    const data = allChatScopeDisplayData[scope];
    const isChecked = this.state.selectedScopes.includes(scope);

    return (
      <div
        key={scope}
        className={ScopeRow}
        onMouseEnter={() => this.setState({ hoveredScope: scope })}
        onMouseLeave={() => this.setState({ hoveredScope: null })} // TODO: Test that the sequence is reliable, with leave preceding the next enter always.
      >
        <FactionCheckbox
          className={ScopeCheckbox}
          isChecked={isChecked}
          onCheckedChanged={(newIsChecked: boolean) => {
            let selectedScopes = this.state.selectedScopes.slice();
            if (newIsChecked) {
              selectedScopes.push(scope);
            } else {
              selectedScopes = selectedScopes.filter((s) => s !== scope);
            }
            this.setState({ selectedScopes });

            if (!this.state.isNewTab) clientAPI.updateChatTab({ name: this.props.tabName, scopes: selectedScopes });
          }}
        />
        <div className={ScopeNameLabel} style={{ color: data.color }}>
          {getStringTableValue(data.nameStringID, this.props.stringTable)}
        </div>
      </div>
    );
  }

  private onRenameClicked(): void {
    const { nameText, selectedScopes, isNewTab } = this.state;
    const name = nameText.trim();
    const renamedFrom = !isNewTab && name !== this.props.tabName ? this.props.tabName : undefined;
    clientAPI.updateChatTab(
      {
        name,
        scopes: selectedScopes.slice()
      },
      renamedFrom
    );

    // After name changes are submitted (or a new tab is created), we close the ChatTabEditor.
    this.closeSelf();
  }

  private closeSelf(): void {
    this.props.dispatch(hideModal());
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable
  };
};

export const ChatTabEditor = connect(mapStateToProps)(AChatTabEditor);
