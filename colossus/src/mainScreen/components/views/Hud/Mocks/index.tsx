/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { mocks } from './data';

const Container = `Mocks-MocksContainer`;

const MockSection = `Mocks-MockSection`;

const Label = `Mocks-MocksLabel`;

const MockItem = `Mocks-MockItem`;

const Name = `Mocks-MocksName`;

const Description = `Mocks-MocksDescription`;

const Button = `Mocks-MocksButton`;

export interface State {
  isVisible: boolean;
  selectedMockId: string;
}

export class Mocks extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isVisible: false,
      selectedMockId: ''
    };
  }

  public render() {
    return this.state.isVisible ? (
      <div className={Container}>
        {Object.keys(mocks).map((sectionKey) => {
          return (
            <div className={MockSection}>
              <div className={Label}>{toTitleCase(sectionKey)}</div>
              {mocks[sectionKey].map((mock) => {
                const mockId = `${sectionKey}-${mock.name}`;
                const isSelected = mockId === this.state.selectedMockId;
                return (
                  <div
                    className={`${MockItem} ${isSelected ? 'selected' : ''}`}
                    onClick={this.onMockSelect.bind(this, mockId)}
                  >
                    <div className={Name}>
                      {mock.name} -
                      <button className={Button} onClick={mock.function}>
                        Run
                      </button>
                    </div>
                    <div className={Description}>{mock.expectedOutcomeDescription}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    ) : null;
  }

  public componentDidMount() {
    clientAPI.bindNavigateListener(this.handleNavigate.bind(this), 'mocks');
  }

  private handleNavigate() {
    this.setState({ isVisible: !this.state.isVisible });
  }

  private onMockSelect(mockId: string) {
    this.setState({ selectedMockId: mockId });
  }
}
