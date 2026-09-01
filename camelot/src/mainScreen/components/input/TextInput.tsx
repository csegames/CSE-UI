/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { InputBox } from './InputBox';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';

const Root = 'HUD-TextInput-Root';
const Input = 'HUD-TextInput-Input';
const CharacterCount = 'HUD-TextInput-CharacterCount';
const RulesText = 'HUD-TextInput-RulesText';

// String IDs
const StringIDCharacterManagementNameCharacterRules = 'CharacterManagementNameCharacterRules';

export enum TextInputType {
  General,
  CharacterName,
  GroupName
}

interface ReactProps {
  className?: string;
  inputClassName?: string;
  text?: string;
  value: string;
  setValue: (value: string) => void;
  type?: TextInputType;
  minLength?: number;
  maxLength?: number;
  showLength?: boolean;
  showRules?: boolean;
  multiline?: boolean;
  disabled?: boolean;
}

interface InjectedProps {
  minCharacterNameLength: number;
  maxCharacterNameLength: number;
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class ATextInput extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    const length = this.props.value.length;
    const minLength = this.getMinLength();
    const maxLength = this.getMaxLength();
    return (
      <label className={`${Root} ${this.props.className ?? ''}`}>
        {this.props.text !== undefined && <span>{this.props.text}</span>}
        <InputBox>
          {this.props.multiline ? (
            <textarea
              className={this.props.inputClassName ? `${Input} ${this.props.inputClassName}` : Input}
              value={this.props.value}
              onChange={this.handleTextChange.bind(this)}
              minLength={minLength}
              maxLength={maxLength}
              disabled={this.props.disabled}
            />
          ) : (
            <input
              className={this.props.inputClassName ? `${Input} ${this.props.inputClassName}` : Input}
              type='text'
              value={this.props.value}
              onChange={this.handleTextChange.bind(this)}
              minLength={minLength}
              maxLength={maxLength}
              disabled={this.props.disabled}
            />
          )}
          {this.props.showLength && (
            <div className={`${CharacterCount} ${length < minLength ? 'error' : ''}`}>{`${length}${
              maxLength ? `/${maxLength}` : ''
            }`}</div>
          )}
          {this.props.showRules && <div className={RulesText}>{this.getRulesText()}</div>}
        </InputBox>
      </label>
    );
  }

  handleTextChange(e: React.ChangeEvent): void {
    const target = e.target as HTMLInputElement;

    let text = target.value;

    switch (this.getType()) {
      case TextInputType.CharacterName: {
        text = this.applyCharacterNamingRules(this.props.value, text);
      }
      case TextInputType.GroupName: {
        text = this.applyGroupNamingRules(this.props.value, text);
      }
      case TextInputType.General:
      default: {
        // No special processing.
      }
    }

    this.props.setValue(text);
  }

  private getType(): TextInputType {
    return this.props.type ?? TextInputType.General;
  }

  private getMinLength(): number {
    switch (this.getType()) {
      case TextInputType.CharacterName: {
        return this.props.minCharacterNameLength;
      }
      case TextInputType.GroupName: {
        return 3;
      }
      case TextInputType.General:
      default: {
        return this.props.minLength ?? 0;
      }
    }
  }

  private getMaxLength(): number {
    switch (this.getType()) {
      case TextInputType.CharacterName: {
        return this.props.maxCharacterNameLength;
      }
      case TextInputType.GroupName: {
        return 30;
      }
      case TextInputType.General:
      default: {
        return this.props.maxLength ?? Number.MAX_SAFE_INTEGER;
      }
    }
  }

  private getRulesText(): string {
    switch (this.getType()) {
      case TextInputType.CharacterName:
      case TextInputType.GroupName: {
        return getStringTableValue(StringIDCharacterManagementNameCharacterRules, this.props.stringTable);
      }
      case TextInputType.General:
      default: {
        return '';
      }
    }
  }

  private applyCharacterNamingRules(prevText: string, newText: string): string {
    // Can include letters, dashes, and apostrophes, but must start with a letter.
    // Also, not allowed to have more than one dash or apostrophe in a row.

    // Must start with a letter.
    if (newText.length > 0 && !newText[0]?.match(/[a-z]/i)) {
      return prevText;
    }

    // The server regex says {1,20}, but we use {0,20} because otherwise the minimum length
    // is two characters, and the pattern would fail when entering the first character.
    // Similarly, I added {0,1} to handle the case where you want to delete the FIRST character.

    const pattern: RegExp = /(?!.*([-' ])\1)(^[A-Za-z]{0,1}[A-Za-z-']{0,20})/g;
    const results = newText.match(pattern);

    // If the pattern doesn't match, then the user input an invalid character.
    if (!results || results.length !== 1 || results[0].length !== newText.length) {
      // The pattern didn't match, so retain the previous text value.
      return prevText;
    }

    // The pattern matched, so return the newText.
    return newText;
  }

  private applyGroupNamingRules(prevText: string, newText: string): string {
    // Can include letters, dashes, and apostrophes, but must start with a letter.
    // Also, not allowed to have more than one dash or apostrophe in a row.

    // Must start with a letter.
    if (newText.length > 0 && !newText[0]?.match(/[a-z]/i)) {
      return prevText;
    }

    // The server regex says {1,30}, but we use {0,30} because otherwise the minimum length
    // is two characters, and the pattern would fail when entering the first character.
    // Similarly, I added {0,1} to handle the case where you want to delete the FIRST character.

    const pattern: RegExp = /(?!.*([-' ])\1)(^[A-Za-z]{0,1}[A-Za-z-' ]{0,30})/g;
    const results = newText.match(pattern);

    // If the pattern doesn't match, then the user input an invalid character.
    if (!results || results.length !== 1 || results[0].length !== newText.length) {
      // The pattern didn't match, so retain the previous text value.
      return prevText;
    }

    // The pattern matched, so return the newText.
    return newText;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    minCharacterNameLength: state.gameDefs.settings?.minCharacterNameLength ?? 3,
    maxCharacterNameLength: state.gameDefs.settings?.maxCharacterNameLength ?? 15,
    stringTable: state.stringTable.stringTable
  };
};

export const TextInput = connect(mapStateToProps)(ATextInput);
