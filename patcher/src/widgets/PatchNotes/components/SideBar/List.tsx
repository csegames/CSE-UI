/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import * as moment from 'moment';
import styled, { css } from 'react-emotion';
import { utils, ql } from '@csegames/camelot-unchained';

const colors = {
  evenListItem: '#575757',
  oddListItem: utils.darkenColor('#464646', 15),
  selected: '#3fd0b0',
};

const selectedListItem = css`
border-right: 3px inset ${colors.selected};
padding-right: 2px;
color: ${colors.selected}
`;

const SideBarListContainer = styled('div')`
  flex: 1;
  overflow: auto;
  background-color: #222222;
`;

const NoPatchNotes = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const SideBarListItem = styled('div')`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 5px;
  color: white;
  user-select: none;
  -webkit-user-select: none;
  box-shadow: inset 0 0 2px rgba(0,0,0,0.4);

  &.included {
    &.odd {
      background-color: ${colors.oddListItem};
      &:hover {
        background-color: ${utils.lightenColor(colors.oddListItem, 20)}
        ${selectedListItem}
      }
    }

    &.even {
      background-color: ${colors.evenListItem}
      &:hover {
        background-color: ${utils.lightenColor(colors.evenListItem, 20)}
        ${selectedListItem}
      }
    }
  }

  &.included.selected, &.not-included.selected {
    ${selectedListItem}
  }

  &.not-included {
    opacity: 0.5;
    &:hover {
      opacity: 0.7;
      ${selectedListItem}
    }
  }
`;

export interface SideBarListProps {
  searchValue: string;
  patchNotes: ql.schema.PatchNote[];
  selectedPatchNote: string;
  onSelectPatchNote: (id: string) => void;
}

class SideBarList extends React.Component<SideBarListProps> {
  public render() {
    return (
      <SideBarListContainer>
        {!_.isEmpty(this.props.patchNotes) ? this.props.patchNotes.map((patchNote, i) => {
          const doesSearchInclude = this.doesSearchInclude(this.props.searchValue, patchNote);
          const selected = this.props.selectedPatchNote && this.props.selectedPatchNote === patchNote.id;
          const isEven = i % 2 === 0;
          return (
            <SideBarListItem
              className={
                `side-bar-list-item
                ${doesSearchInclude ? 'included' : 'not-included'} 
                ${isEven ? 'even' : 'odd'} 
                ${selected ? 'selected' : ''}
              `}
              onClick={() => this.props.onSelectPatchNote(patchNote.id)}
            >
              <div>{patchNote.patchNumber} - "{patchNote.title}"</div>
              <div>{moment(patchNote.utcDisplayStart).toDate().toLocaleString()}</div>
            </SideBarListItem>
          );
        }) : <NoPatchNotes>There are currently no patch notes on this channel.</NoPatchNotes>}
      </SideBarListContainer>
    );
  }

  private doesSearchInclude = (searchValue: string, patchNote: ql.schema.PatchNote) => {
    return utils.doesSearchInclude(searchValue, `${patchNote.patchNumber} ${patchNote.title}`);
  }
}

export default SideBarList;
