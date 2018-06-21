/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

import * as actions from '../services/actions/contextMenu';

const Container = styled('div')`
  background: rgba(0, 0, 0, 0.01);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Menu = styled('ol')`
  background: #444;
  list-style: none;
  position: fixed;
  margin: 0;
  padding: 0;
`;

const Item = styled('li')`
  padding: 5px 10px;
  margin: 0;
  color: #ececec;
  :hover {
    background: #777;
    cursor: pointer;
  }
`;

export type MenuItem = {
  title: string;
  onSelected: () => void;
};

export type StylePosition = {
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
};

export type Props = {
};

export type State = {
  show: boolean;
  styledPosition: StylePosition;
  items: MenuItem[];
};

function getViewportWidth() {
  if (window.innerWidth) {
    return window.innerWidth;
  } else if (document.body && document.body.offsetWidth) {
    return document.body.offsetWidth;
  } else {
    return 0;
  }
}

function getViewportHeight() {
  if (window.innerHeight) {
    return window.innerHeight;
  } else if (document.body && document.body.offsetHeight) {
    return document.body.offsetHeight;
  } else {
    return 0;
  }
}

export class ContextMenu extends React.Component<Props, State> {

  private mouseOffset = {
    x: 10,
    y: 0,
  };

  private showEventHandle: number;
  private hideEventHandle: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
      items: [],
      styledPosition: {
        right: '-1000px',
        bottom: '-1000px',
      },
    };
    this.showEventHandle = actions.onShowContextMenu(this.onShowContextMenu);
    this.hideEventHandle = actions.onHideContextMenu(this.hide);
  }

  public componentWillUnmount() {
    actions.offShowContextMenu(this.showEventHandle);
    actions.offHideContextMenu(this.hideEventHandle);
  }

  public render() {
    if (this.state.show === false) return null;

    return (
      <Container onClick={this.hide} onKeyDown={this.hide}>
        <Menu style={this.state.styledPosition}>
          {
            this.state.items &&
              this.state.items.map(item => <Item key={item.title}
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  this.hide();
                  item.onSelected();
                }}>{item.title}</Item>)
          }
        </Menu>
      </Container>
    );
  }

  private hide = () => {
    if (this.state.show === false) return;

    this.setState({
      show: false,
      styledPosition: {
        right: '-1000px',
        bottom: '-1000px',
      },
      items: [],
    });
  }

  private onShowContextMenu = (items: MenuItem[], event: MouseEvent) => {

    let styledPosition: StylePosition = {};

    // using props initialEvent figure out position
    if (event.clientX + event.clientX < getViewportWidth()) {
      // left side
      if (event.clientY + event.clientY < getViewportHeight()) {
        // top
        styledPosition = {
          left: event.clientX + this.mouseOffset.x + 'px',
          top: event.clientY + this.mouseOffset.y + 'px',
        };
      } else {
        // bottom
        styledPosition = {
          left: event.clientX + this.mouseOffset.x + 'px',
          bottom: getViewportHeight() - event.clientY + this.mouseOffset.y + 'px',
        };
      }
    } else {
      // right side
      if (event.clientY + event.clientY < getViewportHeight()) {
        // top
        styledPosition = {
          right: getViewportWidth() - event.clientX + this.mouseOffset.x + 'px',
          top: event.clientY + this.mouseOffset.y + 'px',
        };
      } else {
        // bottom
        styledPosition = {
          right: getViewportWidth() - event.clientX + this.mouseOffset.x + 'px',
          bottom: getViewportHeight() - event.clientY + this.mouseOffset.y + 'px',
        };
      }
    }

    this.setState({
      show: true,
      styledPosition,
      items,
    });
  }
}
