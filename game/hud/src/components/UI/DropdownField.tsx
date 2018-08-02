/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { CollapsingList } from '@csegames/camelot-unchained';

import { Box } from './Box';
import { Field } from './Field';

export interface DropDownFieldProps {
  label: string;
  selectedDropdownItem: string;
  dropDownItems: string[];
  onSelectDropdownItem: (itemInfo: { configKey: string, item: string }) => void;
}

export interface DropDownFieldState {

}

const DropdownItem = styled('div')`
  padding: 2px 5px;
  color: white;
  background-color: rgba(31, 31, 31, 1);

  &:hover {
    background-color: rgba(31, 31, 31, 0.6);
  }
`;

const TitleContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  height: 33px;
  padding: 0 5px;
`;

const CollapsingListStyles = {
  container: css`
    background: black;
  `,
  body: css`
    background: black;
  `,
  collapseButton: css`
    float: right;
  `,
};

const BoxInnerContainer = css`
`;

export class DropDownField extends React.Component<DropDownFieldProps, DropDownFieldState> {
  public render() {
    const { label, dropDownItems, selectedDropdownItem, onSelectDropdownItem } = this.props;
    return (
      <Box innerClassName={BoxInnerContainer}>
        <Field style={{ width: '85%' }}>{label}</Field>
        <Field style={{ width: '15%' }}>
          <CollapsingList
            defaultCollapsed={true}
            styles={CollapsingListStyles}
            items={dropDownItems}
            title={(collapsed) => {
              return (
                <TitleContainer>
                  <span>{selectedDropdownItem}</span>
                  <span className={collapsed ? 'fa fa-caret-down' : 'fa fa-caret-up'}></span>
                </TitleContainer>
              );
            }}
            renderListItem={(item) => {
              return <DropdownItem onClick={() => onSelectDropdownItem({ configKey: label, item })}>{item}</DropdownItem>;
            }}
          />
        </Field>
      </Box>
    );
  }
}
