/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { InputBox } from './InputBox';
import { CloseButton } from '../../../shared/components/CloseButton';

const Root = 'HUD-SearchInput-Root';
const Input = 'HUD-SearchInput-Input';
const CloseButtonPosition = `HUD-SearchInput-CloseButtonPosition`;

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  setValue: (value: string) => void;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ASearchInput extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    const { value, setValue, dispatch, className, ...otherProps } = this.props;
    return (
      <div {...otherProps} className={className ? ` ${Root} ${className}` : Root}>
        <InputBox>
          <input
            className={Input}
            type='text'
            placeholder='Search...'
            value={value}
            onChange={this.handleSearchChange.bind(this)}
          />
          {value.length > 0 && <CloseButton className={CloseButtonPosition} onClick={this.clearSearch.bind(this)} />}
        </InputBox>
      </div>
    );
  }

  handleSearchChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.props.setValue(target.value);
  }

  public clearSearch(): void {
    this.props.setValue('');
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const SearchInput = connect(mapStateToProps)(ASearchInput);
