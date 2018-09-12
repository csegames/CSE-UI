/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import SelectorWheelItem from './SelectorWheelItem';

export const PRIMARY_COLOR = 'rgba(117, 255, 204, 1)';

const Container = styled.div`
  position: relative;
  border: 1px solid ${PRIMARY_COLOR};
  border-radius: 50%;
`;

export interface Props {
  data: any[][];
  renderItem: (data: any, index: number) => JSX.Element;
  ringDimensions: number;
  selectedPageIndex: number;

  disableNavArrows?: boolean;
  onMouseOverItem?: (e: MouseEvent, index: number) => void;
  onMouseLeaveItem?: (index: number) => void;

  disableTopArrow?: boolean;
  disableBotArrow?: boolean;
  disableLeftArrow?: boolean;
  disableRightArrow?: boolean;
  onTopClick?: (index: number) => void;
  onRightClick?: (index: number) => void;
  onLeftClick?: (index: number) =>  void;
  onBotClick?: (index: number) => void;
}

class SelectorWheel extends React.Component<Props> {
  public render() {
    const { data, ringDimensions } = this.props;
    const selectedDataPage = data[this.props.selectedPageIndex];
    return (
      <Container style={{ width: ringDimensions, height: ringDimensions }}>
        {selectedDataPage && selectedDataPage.map((data, i) => {
          return (
            <SelectorWheelItem
              key={i}
              index={i}
              totalNumberIndexes={selectedDataPage.length}
              wheelRadius={ringDimensions / 2}
              disableNavArrows={this.props.disableNavArrows || data == null}
              onMouseOver={this.onMouseOver}
              onMouseLeave={this.onMouseLeave}
              disableTopArrow={this.props.disableTopArrow}
              disableBotArrow={this.props.disableBotArrow}
              disableLeftArrow={this.props.disableLeftArrow}
              disableRightArrow={this.props.disableRightArrow}
              onTopArrowClick={this.props.onTopClick}
              onBotArrowClick={this.props.onBotClick}
              onLeftArrowClick={this.props.onLeftClick}
              onRightArrowClick={this.props.onRightClick}>
              {this.props.renderItem(data, i)}
            </SelectorWheelItem>
          );
        })}
      </Container>
    );
  }

  private onMouseOver = (e: MouseEvent, index: number) => {
    if (typeof this.props.onMouseOverItem === 'function') {
      this.props.onMouseOverItem(e, index);
    }
  }

  private onMouseLeave = (index: number) => {
    if (typeof this.props.onMouseLeaveItem === 'function') {
      this.props.onMouseLeaveItem(index);
    }
  }
}

export default SelectorWheel;
